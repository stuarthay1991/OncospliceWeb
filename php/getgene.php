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

$meta_gene_query = $TABLE_DICT[$cancertype]["SPLC"]["QUERY"] . " WHERE";
$meta_gene_count = 0;
foreach ($_POST as $key => $value) {
	if($key != "CANCER")
	{
		if("GENE" == substr($key, 0, 4))
		{
			$key = substr($key, 4);
			if($meta_gene_count != 0)
			{
		    	$meta_gene_query = $meta_gene_query." OR symbol = '".$key."'";
			}
			else
			{
				$meta_gene_query = $meta_gene_query." symbol = '".$key."'";
			}
		    $meta_gene_count = $meta_gene_count + 1;
		}
	}
}

$singleresult = pg_query($conn, $meta_gene_query);
if (!$singleresult) {
    echo "An error occurred2.\n";
    exit;
}

$singlenumrows = pg_num_rows($singleresult);

$tumrows = array();

$tumrows["single"] = $singlenumrows;

echo json_encode($tumrows);
?>