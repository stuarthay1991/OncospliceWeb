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
$TABLE_DICT["LAML"]["SPLC"]["QUERY"] = "SELECT * FROM TCGA_LAML_SPLICE ";

$TABLE_DICT["LGG"]["META"]["COLUMNS"] = "LGG/Columns";
$TABLE_DICT["LGG"]["META"]["QUERY"] = "SELECT * FROM meta";
$TABLE_DICT["LGG"]["SIG"]["QUERY"] = "SELECT * FROM signature";
$TABLE_DICT["LGG"]["SIG"]["COLUMNS"] = "LGG/oncofields.txt";
$TABLE_DICT["LGG"]["SPLC"]["QUERY"] = "SELECT * FROM gasm ";

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

$meta_coord_query = $TABLE_DICT[$cancertype]["SPLC"]["QUERY"] . " WHERE";
$meta_coord_count = 0;
foreach ($_POST as $key => $value) {
	if($key != "CANCER")
	{
		if("COORD" == substr($key, 0, 5))
		{
			$key = substr($key, 5);
			$key = preg_replace("/\r|\n/", "", $key);
			//$coord_split = explode("|", $key);
			//$coord1 = $coord_split[0];
			//$coord2 = $coord_split[1];

			$coord1_chrm_split = explode(":", $key);
			$coord1_chrm = $coord1_chrm_split[0];

			$coord1_pos_split = explode("-", $coord1_chrm_split[1]);
			$coord1_start = $coord1_pos_split[0];
			$coord1_end = $coord1_pos_split[1];

			//$coord2_chrm_split = explode(":", $coord2);
			//$coord2_chrm = $coord2_chrm_split[0];

			//$coord2_pos_split = explode("-", $coord2_chrm_split[1]);
			//$coord2_start = $coord2_pos_split[0];
			//$coord2_end = $coord2_pos_split[1];
            //$coord1_start_int = intval($coord1_start);
            //$coord1_end_int = intval($coord1_end);
            //$coord1_start_one_more = strval(($coord1_start_int + 1));
            //$coord1_start_one_less = strval(($coord1_start_int - 1));

            //$coord1_end_one_more = strval(($coord1_end_int + 1));
            //$coord1_end_one_less = strval(($coord1_end_int - 1));

			//$pre_coord_query = " (coordinates LIKE " . "'" . $coord1_chrm . "%'" . " AND coordinates LIKE " . "'%" . $coord1_start . "%'" . " AND coordinates LIKE " . "'%" . $coord1_end . "%')";

			$pre_coord_query = " ((chromosome = " . "'" . $coord1_chrm . "'" . ") AND ((coord1 = " . "'" . $coord1_start . "'" . " OR coord2 = " . "'" . $coord1_start . "'" . " OR coord3 = " . "'" . $coord1_start . "'" . " OR coord4 = " . "'" . $coord1_start . "'" . ") OR (coord1 = " . "'" . $coord1_end . "'" . " OR coord2 = " . "'" . $coord1_end . "'" . " OR coord3 = " . "'" . $coord1_end . "'" . " OR coord4 = " . "'" . $coord1_end . "'" . ")))";

            //$pre_coord_query = $pre_coord_query . " OR (coordinates LIKE " . "'" . $coord1_chrm . "%'" . " AND coordinates LIKE " . "'%" . $coord1_start_one_more . "%'" . " AND coordinates LIKE " . "'%" . $coord1_end_one_more . "%')";

            //$pre_coord_query = $pre_coord_query . " OR (coordinates LIKE " . "'" . $coord1_chrm . "%'" . " AND coordinates LIKE " . "'%" . $coord1_start_one_less . "%'" . " AND coordinates LIKE " . "'%" . $coord1_end_one_less . "%')";

			if($meta_coord_count != 0)
			{
		    	$meta_coord_query = $meta_coord_query." OR" . $pre_coord_query;
			}
			else
			{
				$meta_coord_query = $meta_coord_query . $pre_coord_query;
			}
		    $meta_coord_count = $meta_coord_count + 1;
		}
	}
}

$singleresult = pg_query($conn, $meta_coord_query);
if (!$singleresult) {
    echo "An error occurred2.\n";
    exit;
}

$singlenumrows = pg_num_rows($singleresult);

$tumrows = array();

$tumrows["single"] = $singlenumrows;
$tumrows["q"] = $meta_coord_query;

echo json_encode($tumrows);
?>