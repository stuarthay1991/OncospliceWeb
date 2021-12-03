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
$TABLE_DICT["LAML"]["META"]["QUERY"] = "SELECT * FROM TCGA_LAML_META";
$TABLE_DICT["LAML"]["SIG"]["QUERY"] = "SELECT * FROM TCGA_LAML_SIGNATURE";
$TABLE_DICT["LAML"]["SIG"]["COLUMNS"] = "LAML/oncofields.txt";
$TABLE_DICT["LAML"]["SPLC"]["QUERY"] = " FROM TCGA_LAML_SPLICE ";

$TABLE_DICT["LGG"]["META"]["COLUMNS"] = "LGG/Columns";
$TABLE_DICT["LGG"]["META"]["QUERY"] = "SELECT * FROM meta";
$TABLE_DICT["LGG"]["SIG"]["QUERY"] = "SELECT * FROM signature";
$TABLE_DICT["LGG"]["SIG"]["COLUMNS"] = "LGG/oncofields.txt";
$TABLE_DICT["LGG"]["SPLC"]["QUERY"] = " FROM gasm ";

if($cancertype != "LAML" && $cancertype != "LGG")
{
	$TABLE_DICT[$cancertype]["META"]["COLUMNS"] = $cancertype . "/Columns";
	$TABLE_DICT[$cancertype]["META"]["RANGE"] = $cancertype . "/Range";
	$TABLE_DICT[$cancertype]["SIG"]["QUERY"] = "SELECT * FROM " . $cancertype . "_TCGA_SIGNATURE";
	$TABLE_DICT[$cancertype]["SIG"]["COLUMNS"] = $cancertype . "/oncofields.txt";
	$TABLE_DICT[$cancertype]["SPLC"]["QUERY"] = "SELECT * FROM " . $cancertype . "_TCGA_SPLICE";
	$TABLE_DICT[$cancertype]["SPLC"]["ROWNUM"] = 999;
	$TABLE_DICT[$cancertype]["SPLC"]["COLNUM"] = 999;
	$TABLE_DICT[$cancertype]["SPLC"]["EXT"] = "";
}

$single_base_query = $TABLE_DICT[$cancertype]["SIG"]["QUERY"] . " WHERE";
$meta_base_query = $TABLE_DICT[$cancertype]["SIG"]["QUERY"] . " WHERE";
$meta_base_count = 0;
foreach ($_POST as $key => $value) {
	if($key != "CANCER")
	{
		if("SEL" == substr($key, 0, 3))
		{
			$key = substr($key, 3);
			$key = str_replace("+", "_", $key);
			$single_base_query = $single_base_query." ".$key." = '1'";
		}
		else
		{
			if($meta_base_count != 0)
			{
				$key = str_replace("+", "_", $key);
		    	$meta_base_query = $meta_base_query." OR ".$key." = '1'";
			}
			else
			{
				$key = str_replace("+", "_", $key);
				$meta_base_query = $meta_base_query." ".$key." = '1'";
			}
		    $meta_base_count = $meta_base_count + 1;
		}
	}
}
//First query for sample ids. Will need to be changed to be contructed in depth.
$metaresult = pg_query($conn, $meta_base_query);
if (!$metaresult) {
    echo $meta_base_query;
    exit;
}

$metanumrows = pg_num_rows($metaresult);
if($metanumrows != 0 && $metanumrows != undefined)
{
	$metanumrows = $metanumrows - 1;
}

$singleresult = pg_query($conn, $single_base_query);
if (!$singleresult) {
    echo "An error occurred2.\n";
    exit;
}

$singlenumrows = pg_num_rows($singleresult);
if($singlenumrows != 0 && $singlenumrows != undefined)
{
	$singlenumrows = $singlenumrows - 1;
}
$tumrows = array();

$tumrows["single"] = $singlenumrows;
$tumrows["singlequery"] = $single_base_query;
$tumrows["meta"] = $metanumrows;
$tumrows["metaquery"] = $meta_base_query;

echo json_encode($tumrows);
?>