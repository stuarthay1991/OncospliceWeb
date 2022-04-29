<?php
//Survival plot generatation preprocessing 
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
$postuid = $_POST["UID"];
$postexp = $_POST["EXP"];
$cancertype = $_POST["CANC"];

$TABLE_DICT[$cancertype]["META"]["COLUMNS"] = $cancertype . "/Columns";
$TABLE_DICT[$cancertype]["META"]["RANGE"] = $cancertype . "/Range";
$TABLE_DICT[$cancertype]["META"]["QUERY"] = "SELECT * FROM " . $cancertype . "_TCGA_META";
$TABLE_DICT[$cancertype]["SPLC"]["QUERY"] = "SELECT *  FROM " . $cancertype . "_TCGA_SPLICE WHERE uid = '" . $postuid . "'";

$conn = pg_pconnect("dbname=oncocasen");
if (!$conn) {
    echo "An error occurred1.\n";
    exit;
}

$funkysplc = array();

$spliceresult = pg_query($conn, $TABLE_DICT[$cancertype]["SPLC"]["QUERY"]);
if (!$spliceresult) {
    echo "An error occurred3.\n";
    exit;
}

while ($pow = pg_fetch_assoc($spliceresult)) {
	$funkysplc = $pow;
}



$outputformat = array();

$newexp = array();
$uidlist = array();
$ucount = 0;

$ik = pg_num_fields($spliceresult);
for ($j = 0; $j < $ik; $j++) 
{
      $fieldname = pg_field_name($spliceresult, $j);
	  if(substr($fieldname, -4) == "_bed")
	  {
	  $uidlist[$ucount] = $fieldname;
	  $ucount = $ucount + 1;
	  $newexp[$fieldname]["expressionval"] = str_replace("\r", "", $funkysplc[$fieldname]);
	  }
}

$metaresult = pg_query($conn, $TABLE_DICT[$cancertype]["META"]["QUERY"]);
if (!$metaresult) {
    echo "An error occurred2.\n";
    exit;
}

while ($row = pg_fetch_assoc($metaresult)) {
	$curuid = $row["uid"];
	$curuid = strtolower($curuid);
	$curuid = str_replace("-", "_", $curuid);
	$curuid = str_replace(".", "_", $curuid);
	$newexp[$curuid]["days_to_birth"] = str_replace("\n", "", $row["days_to_birth"]);
	$newexp[$curuid]["days_to_death"] = str_replace("\n", "", $row["days_to_death"]);
	if($row["vital_status"] == "Alive")
	{
		$newexp[$curuid]["vital_status"] = 0;
	}
	else
	{
		$newexp[$curuid]["vital_status"] = 1;
	}

}


$handle = fopen("inputfiles/inputdata.txt", "w");
fwrite($handle, "UID\tEXP\tdays_to_birth\tdays_to_death\tvital_status\n");
for($i = 0; $i < $ucount; $i++)
{
	if(strlen($newexp[$uidlist[$i]]["days_to_birth"]) > 0 and strlen($newexp[$uidlist[$i]]["expressionval"]) > 0)
	{
	fwrite($handle, $uidlist[$i]);
	fwrite($handle, "\t");
	fwrite($handle, $newexp[$uidlist[$i]]["expressionval"]);
	fwrite($handle, "\t");
	fwrite($handle, $newexp[$uidlist[$i]]["days_to_birth"]);
	fwrite($handle, "\t");
	fwrite($handle, $newexp[$uidlist[$i]]["days_to_death"]);
	fwrite($handle, "\t");
	fwrite($handle, $newexp[$uidlist[$i]]["vital_status"]);
	fwrite($handle, "\n");
	}
}

fclose($handle);

$outputformat["uid"] = $postuid;
$outputformat["exp"] = $newexp;
$outputformat["cancer"] = $postcancer;
$ruts = shell_exec("cwltool --no-match-user --no-read-only oncorsurvplot.cwl input.json");



echo json_encode($ruts);
?>