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
$postuid = $_POST["UID"];

$TABLE_DICT = array();

$TABLE_DICT["LAML"]["META"]["COLUMNS"] = "LAML/Columns";
$TABLE_DICT["LAML"]["META"]["RANGE"] = "LAML/Range";
$TABLE_DICT["LAML"]["META"]["QUERY"] = "SELECT * FROM TCGA_LAML_META";
$TABLE_DICT["LAML"]["SIG"]["QUERY"] = "SELECT * FROM TCGA_LAML_SIGNATURE";
$TABLE_DICT["LAML"]["SIG"]["COLUMNS"] = "LAML/oncofields.txt";
$TABLE_DICT["LAML"]["SPLC"]["QUERY"] = " FROM TCGA_LAML_SPLICE ";
$TABLE_DICT["LAML"]["META"]["SPC"] = "submitter_id_samples";

/*$TABLE_DICT["LGG"]["META"]["COLUMNS"] = "LGG/Columns";
$TABLE_DICT["LGG"]["META"]["RANGE"] = "LGG/Range";
$TABLE_DICT["LGG"]["META"]["QUERY"] = "SELECT * FROM meta";
$TABLE_DICT["LGG"]["SIG"]["QUERY"] = "SELECT * FROM signature";
$TABLE_DICT["LGG"]["SIG"]["COLUMNS"] = "LGG/oncofields.txt";
$TABLE_DICT["LGG"]["SPLC"]["QUERY"] = " FROM gasm ";
$TABLE_DICT["LGG"]["META"]["SPC"] = "submitter_id_samples";*/
if($cancertype == "AML_Leucegene")
{
  $TABLE_DICT[$cancertype]["META"]["COLUMNS"] = $cancertype . "/Columns";
  $TABLE_DICT[$cancertype]["META"]["RANGE"] = $cancertype . "/Range";
  $TABLE_DICT[$cancertype]["META"]["QUERY"] = "SELECT * FROM " . $cancertype . "_META";
  $TABLE_DICT[$cancertype]["SIG"]["QUERY"] = "SELECT * FROM " . $cancertype . "_SIGNATURE";
  $TABLE_DICT[$cancertype]["SIG"]["COLUMNS"] = $cancertype . "/oncofields.txt";
  $TABLE_DICT[$cancertype]["SPLC"]["QUERY"] = " FROM " . $cancertype . "_SPLICE " . "WHERE uid = '" . $postuid . "'";
  $TABLE_DICT[$cancertype]["SPLC"]["ROWNUM"] = 999;
  $TABLE_DICT[$cancertype]["SPLC"]["COLNUM"] = 999;
  $TABLE_DICT[$cancertype]["META"]["SPC"] = "uid";
}
else if($cancertype != "LAML")
{
  $TABLE_DICT[$cancertype]["META"]["COLUMNS"] = $cancertype . "/Columns";
  $TABLE_DICT[$cancertype]["META"]["RANGE"] = $cancertype . "/Range";
  $TABLE_DICT[$cancertype]["META"]["QUERY"] = "SELECT * FROM " . $cancertype . "_TCGA_META";
  $TABLE_DICT[$cancertype]["SIG"]["QUERY"] = "SELECT * FROM " . $cancertype . "_TCGA_SIGNATURE";
  $TABLE_DICT[$cancertype]["SIG"]["COLUMNS"] = $cancertype . "/oncofields.txt";
  $TABLE_DICT[$cancertype]["SPLC"]["QUERY"] = " FROM " . $cancertype . "_TCGA_SPLICE " . "WHERE uid = '" . $postuid . "'";
  $TABLE_DICT[$cancertype]["SPLC"]["ROWNUM"] = 999;
  $TABLE_DICT[$cancertype]["SPLC"]["COLNUM"] = 999;
  $TABLE_DICT[$cancertype]["META"]["SPC"] = "uid";
}
//USF2:ENSG00000105698:E3.4-E3.6|ENSG00000105698:E3.4-E3.11
$TABLE_DICT["BLCA"]["META"]["SPC"] = "uid";
$splicequery = "SELECT *" . $TABLE_DICT[$cancertype]["SPLC"]["QUERY"];
$spliceresult = pg_query($conn, $splicequery);
if (!$spliceresult) {
    echo "An error occurred1.\n";
    exit;
}

$m_arr_count = 0;
$m_arr = array();

while ($mrow = pg_fetch_assoc($spliceresult)) {
    $m_arr[$m_arr_count] = $mrow;
    $m_arr_count = $m_arr_count + 1;
}

$output = array();
$output["postuid"] = $postuid;
$output["splicequery"] = $splicequery;
$output["result"] = $m_arr;

echo json_encode($output);