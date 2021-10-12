<?php
//ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);
//error_reporting(E_ALL);
//Connect to postgres db
$conn = pg_pconnect("dbname=oncocasen");
if (!$conn) {
    echo "An error occurred1.\n";
    exit;
}
$cancertype = $_POST["CANCER"];

$TABLE_DICT = array();

$TABLE_DICT["LAML"]["META"]["COLUMNS"] = "LAML/Columns";
$TABLE_DICT["LAML"]["META"]["RANGE"] = "LAML/Range";
$TABLE_DICT["LAML"]["META"]["QUERY"] = "SELECT * FROM TCGA_LAML_META";
$TABLE_DICT["LAML"]["SIG"]["QUERY"] = "SELECT * FROM TCGA_LAML_SIGNATURE";
$TABLE_DICT["LAML"]["SIG"]["COLUMNS"] = "LAML/oncofields.txt";
$TABLE_DICT["LAML"]["SPLC"]["QUERY"] = " FROM TCGA_LAML_SPLICE ";
$TABLE_DICT["LAML"]["META"]["SPC"] = "submitter_id_samples";

$TABLE_DICT["LGG"]["META"]["COLUMNS"] = "LGG/Columns";
$TABLE_DICT["LGG"]["META"]["RANGE"] = "LGG/Range";
$TABLE_DICT["LGG"]["META"]["QUERY"] = "SELECT * FROM meta";
$TABLE_DICT["LGG"]["SIG"]["QUERY"] = "SELECT * FROM signature";
$TABLE_DICT["LGG"]["SIG"]["COLUMNS"] = "LGG/oncofields.txt";
$TABLE_DICT["LGG"]["SPLC"]["QUERY"] = " FROM gasm ";
$TABLE_DICT["LGG"]["META"]["SPC"] = "submitter_id_samples";

if($cancertype != "LAML" && $cancertype != "LGG")
{
  $TABLE_DICT[$cancertype]["META"]["COLUMNS"] = $cancertype . "/Columns";
  $TABLE_DICT[$cancertype]["META"]["RANGE"] = $cancertype . "/Range";
  $TABLE_DICT[$cancertype]["META"]["QUERY"] = "SELECT * FROM " . $cancertype . "_TCGA_META";
  $TABLE_DICT[$cancertype]["SIG"]["QUERY"] = "SELECT * FROM " . $cancertype . "_TCGA_SIGNATURE";
  $TABLE_DICT[$cancertype]["SIG"]["COLUMNS"] = $cancertype . "/oncofields.txt";
  $TABLE_DICT[$cancertype]["SPLC"]["QUERY"] = " FROM " . $cancertype . "_TCGA_SPLICE ";
  $TABLE_DICT[$cancertype]["SPLC"]["ROWNUM"] = 999;
  $TABLE_DICT[$cancertype]["SPLC"]["COLNUM"] = 999;
  $TABLE_DICT[$cancertype]["META"]["SPC"] = "uid";
}

$TABLE_DICT["BLCA"]["META"]["SPC"] = "uid";

$metaresult = pg_query($conn, $TABLE_DICT[$cancertype]["META"]["QUERY"]);
if (!$metaresult) {
    echo "An error occurred1.\n";
    exit;
}

$NAME = $_POST["NAME"];
if($NAME == "age range")
{
  $NAME = str_replace(" ", "_", $NAME);
}

$set = array();
$color_push = array();
$range_on = false;
$range_of = array();
$rangefiles = scandir($TABLE_DICT[$cancertype]["META"]["RANGE"]);
$exmp = array();
for($i = 2; $i < count($rangefiles); $i++)
{
  $lookattitle = $rangefiles[$i];
  $lookattitle = str_replace(".txt", "", $lookattitle);
  $lookattitle = str_replace(".", "_", $lookattitle);
  $exmp[$i] = $lookattitle;
  $goodname = str_replace("_", " ", $NAME);
  if((strtolower($goodname)) == (strtolower($lookattitle)))
  {
      $cur_file = $TABLE_DICT[$cancertype]["META"]["RANGE"] . "/" . $rangefiles[$i];
      $cur_file_open = fopen($cur_file, "r");
      $line = fgets($cur_file_open);
      $line = explode("#", $line);
      for($k = 0; $k < count($line); $k++)
      {
        $range_of[$k] = $line[$k];
      }
      fclose($cur_file_open);
      $range_on = true;
  }
  
}


$returned_result = array();
$i_set = 0;
if($range_on == false)
{
  while ($row = pg_fetch_assoc($metaresult)) {
    $str_edit = str_replace(".", "_", $row[$TABLE_DICT[$cancertype]["META"]["SPC"]]);
    $str_edit = str_replace("-", "_", $str_edit);
    $str_edit = strtolower($str_edit);
    $returned_result[$str_edit] = $row[strtolower($NAME)];
    $found_flag = 0;
    for($k = 0; $k < count($set); $k++)
    {
    	if($set[$k] ==  $row[strtolower($NAME)])
    	{
    		$found_flag = 1;
    	}
    }
    if($found_flag == 0)
    {
    	$set[$i_set] = $row[strtolower($NAME)];
    	$i_set = $i_set + 1;
    }
  }
}
else
{
    while ($row = pg_fetch_assoc($metaresult)) {
      $str_edit = str_replace(".", "_", $row[$TABLE_DICT[$cancertype]["META"]["SPC"]]);
      $str_edit = str_replace("-", "_", $str_edit);
      $str_edit = strtolower($str_edit);
      $curval = $row[strtolower($NAME)];
      $newval = "NONE";
      for($j = 0; $j < count($range_of); $j++)
      {
        $possible_val = explode("-", $range_of[$j]);
        if($curval >= $possible_val[0] && $curval <= $possible_val[1])
        {
          $newval = $range_of[$j];
          break;
        }
      }
      $returned_result[$str_edit] = $newval;
    }
    $set = $range_of;
}

for($k = 0; $k < count($set); $k++)
{
	$color_push[$set[$k]] = $k;
}

$output = array();
$output["range"]["1"] = $NAME;
$output["range"]["2"] = $rangefiles;
$output["range"]["3"] = $range_on;
$output["range"]["4"] = $exmp;
$output["set"] = $set;
$output["out"] = $returned_result;
$output["color"] = $color_push;
echo json_encode($output);
?>
