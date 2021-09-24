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
$cancer_type = $_POST["CANCER"];

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

if($cancer_type != "LAML" && $cancer_type != "LGG")
{
	$TABLE_DICT[$cancer_type]["META"]["COLUMNS"] = $cancer_type . "/Columns";
	$TABLE_DICT[$cancer_type]["META"]["RANGE"] = $cancer_type . "/Range";
	$TABLE_DICT[$cancer_type]["META"]["QUERY"] = "SELECT * FROM " . $cancer_type . "_TCGA_META";
	$TABLE_DICT[$cancer_type]["SPLC"]["QUERY"] = "SELECT * FROM " . $cancer_type . "_TCGA_SPLICE";
	$TABLE_DICT[$cancer_type]["SPLC"]["ROWNUM"] = 999;
	$TABLE_DICT[$cancer_type]["SPLC"]["COLNUM"] = 999;
}

$single_base_query = $TABLE_DICT[$cancer_type]["META"]["QUERY"] . " WHERE";
$single_base_flag = 0;
$meta_base_query = $TABLE_DICT[$cancer_type]["META"]["QUERY"] . " WHERE";
$meta_base_count = 0;
foreach ($_POST as $key => $value) {
	if($key != "CANCER")
	{
		if("SEL" == substr($key, 0, 3))
		{
			$single_base_flag = 1;
			$key = substr($key, 3);
			if(strpos($value, "-") != false)
			{
				$numberstosearch = explode("-", $value);
				$single_base_query = $single_base_query." ".$key." >= '".$numberstosearch[0]."'";
				$single_base_query = $single_base_query." AND ".$key." <= '".$numberstosearch[1]."'";
			}
			else
			{
				$single_base_query = $single_base_query." ".$key." = '".$value."'";
			}
		}
		else
		{
			if(strpos($value, "-") != false)
			{
				$numberstosearch = explode("-", $value);
				if($meta_base_count != 0)
				{
			    	$meta_base_query = $meta_base_query." AND ".$key." >= '".$numberstosearch[0]."'";
				}
				else
				{
					$meta_base_query = $meta_base_query." ".$key." >= '".$numberstosearch[0]."'";
				}
				$meta_base_count = $meta_base_count + 1;
				$meta_base_query = $meta_base_query." AND ".$key." <= '".$numberstosearch[1]."'";
				$meta_base_count = $meta_base_count + 1;
			}
			else
			{
				if($meta_base_count != 0)
				{
			    	$meta_base_query = $meta_base_query." AND ".$key." = '".$value."'";
				}
				else
				{
					$meta_base_query = $meta_base_query." ".$key." = '".$value."'";
				}
			    $meta_base_count = $meta_base_count + 1;
			}
		}
	}
}

//echo $meta_base_query;

//First query for sample ids. Will need to be changed to be contructed in depth.
$metaresult = pg_query($conn, $meta_base_query);
if (!$metaresult) {
    echo "An error occurred1.\n";
    exit;
}

$metanumrows = pg_num_rows($metaresult);

if($single_base_flag != 0)
{
	$singleresult = pg_query($conn, $single_base_query);
	if (!$singleresult) {
	    echo "An error occurred2.\n";
	    exit;
	}


$singlenumrows = pg_num_rows($singleresult);
}
else
{
	$singlenumrows = 0;
}
$tumrows = array();
$tumrows["single"] = $singlenumrows;
$tumrows["singlequery"] = $single_base_query;
$tumrows["meta"] = $metanumrows;
$tumrows["metaquery"] = $meta_base_query;

echo json_encode($tumrows);
?>
