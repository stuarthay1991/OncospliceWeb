<?php
//This script retrieves values from the database responsible for populating the UI on the "Build Query" page of the application. 
include 'config.php';
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$selected_cancer_type = $_POST["cancer_type"];
$TABLE_DICT = array();

//TO DO: Make a gereralized function to get the cancer type as the parameter, standardize calls to the database.
if($selected_cancer_type == "AML_Leucegene")
{
	$TABLE_DICT[$selected_cancer_type]["META"]["COLUMNS"] = $selected_cancer_type . "/Columns";
	$TABLE_DICT[$selected_cancer_type]["META"]["RANGE"] = $selected_cancer_type . "/Range";
	$TABLE_DICT[$selected_cancer_type]["META"]["QUERY"] = "SELECT * FROM " . $selected_cancer_type . "_META";
	$TABLE_DICT[$selected_cancer_type]["SIG"]["QUERY"] = "SELECT * FROM " . $selected_cancer_type . "_SIGNATURE";
	$TABLE_DICT[$selected_cancer_type]["SIG"]["COLUMNS"] = $selected_cancer_type . "/oncofields.txt";
	$TABLE_DICT[$selected_cancer_type]["SIG"]["TRANSLATE"] = $selected_cancer_type . "/OncoSplice-translation.txt";
	$TABLE_DICT[$selected_cancer_type]["SPLC"]["QUERY"] = "SELECT * FROM " . $selected_cancer_type . "_SPLICE";
}
else
{
	//Columns and range specify supplementary information directories, NOT database calls.
	$TABLE_DICT[$selected_cancer_type]["META"]["COLUMNS"] = $selected_cancer_type . "/Columns";
	$TABLE_DICT[$selected_cancer_type]["META"]["RANGE"] = $selected_cancer_type . "/Range";
	$TABLE_DICT[$selected_cancer_type]["META"]["QUERY"] = "SELECT * FROM " . $selected_cancer_type . "_TCGA_META";
	$TABLE_DICT[$selected_cancer_type]["SIG"]["QUERY"] = "SELECT * FROM " . $selected_cancer_type . "_TCGA_SIGNATURE";
	$TABLE_DICT[$selected_cancer_type]["SIG"]["COLUMNS"] = $selected_cancer_type . "/oncofields.txt";
	$TABLE_DICT[$selected_cancer_type]["SIG"]["TRANSLATE"] = $selected_cancer_type . "/OncoSplice-translation.txt";
	$TABLE_DICT[$selected_cancer_type]["SPLC"]["QUERY"] = "SELECT * FROM " . $selected_cancer_type . "_TCGA_SPLICE";
	$TABLE_DICT[$selected_cancer_type]["SPLC"]["ROWNUM"] = 1506;
	$TABLE_DICT[$selected_cancer_type]["SPLC"]["COLNUM"] = 999;
}

//TO DO: Get rid of hardcoded row/cols, automate the procedure.
$TABLE_DICT["LGG"]["SPLC"]["ROWNUM"] = 106894;
$TABLE_DICT["LGG"]["SPLC"]["COLNUM"] = 530;

$TABLE_DICT["LUAD"]["SPLC"]["ROWNUM"] = 162393;
$TABLE_DICT["LUAD"]["SPLC"]["COLNUM"] = 605;

$TABLE_DICT["BRCA"]["SPLC"]["ROWNUM"] = 143571;
$TABLE_DICT["BRCA"]["SPLC"]["COLNUM"] = 1234;

$TABLE_DICT["BLCA"]["SPLC"]["COLNUM"] = 441;
$TABLE_DICT["BLCA"]["SPLC"]["ROWNUM"] = 111541;

$TABLE_DICT["COAD"]["SPLC"]["COLNUM"] = 525;
$TABLE_DICT["COAD"]["SPLC"]["ROWNUM"] = 106177;

$TABLE_DICT["SKCM"]["SPLC"]["COLNUM"] = 483;
$TABLE_DICT["SKCM"]["SPLC"]["ROWNUM"] = 101973;

$TABLE_DICT["HNSCC"]["SPLC"]["COLNUM"] = 557;
$TABLE_DICT["HNSCC"]["SPLC"]["ROWNUM"] = 99316;

$TABLE_DICT["AML_Leucegene"]["SPLC"]["COLNUM"] = 448;
$TABLE_DICT["AML_Leucegene"]["SPLC"]["ROWNUM"] = 138754;

$TABLE_DICT["GBM"]["SPLC"]["COLNUM"] = 185;
$TABLE_DICT["GBM"]["SPLC"]["ROWNUM"] = 80369;

//PDO is PHP Data Object
$conn = makePDO();

$metaresult = $conn->query($TABLE_DICT[$selected_cancer_type]["META"]["QUERY"]);
$i = $metaresult->columnCount();

$output_arr = array();
for ($j = 1; $j < $i; $j++) {
	$fieldname = $metaresult->getColumnMeta($j)['name'];
	$fieldname = str_replace("_", " ", $fieldname);
	$fieldname = preg_replace("/\r|\n/", "", $fieldname);
	$output_arr["meta"][$fieldname] = "";
}

//Code for building UI

$pok = scandir($TABLE_DICT[$selected_cancer_type]["META"]["COLUMNS"]);
$file_arr = $pok;

for($i = 2; $i < count($file_arr); $i++)
{
	$cur_file = $TABLE_DICT[$selected_cancer_type]["META"]["COLUMNS"] . "/" . $file_arr[$i];
	$cur_file_open = fopen($cur_file, "r");
	$line = fgets($cur_file_open);
	$line = explode("#", $line);
	$refname = substr($cur_file, (strlen($TABLE_DICT[$selected_cancer_type]["META"]["COLUMNS"])+1), -4);
	$str_edit = str_replace(".", "_", $refname);
	$str_edit = str_replace("-", "_", $str_edit);
	$str_edit = str_replace("_", " ", $str_edit);
	$str_edit = strtolower($str_edit);
	$str_edit = preg_replace("/\r|\n/", "", $str_edit);
	$output_arr["meta"][$str_edit] = $line;
	fclose($cur_file_open);
}

$rangefiles = scandir($TABLE_DICT[$selected_cancer_type]["META"]["RANGE"]);
for($i = 0; $i < count($rangefiles); $i++)
{
	$cur_file = $TABLE_DICT[$selected_cancer_type]["META"]["RANGE"] . "/" . $rangefiles[$i];
	$cur_file_open = fopen($cur_file, "r");
	$line = fgets($cur_file_open);
	$line = explode("#", $line);
	$refname = substr($cur_file, (strlen($TABLE_DICT[$selected_cancer_type]["META"]["RANGE"])+1), -4);
	$str_edit = str_replace(".", "_", $refname);
	$str_edit = str_replace("-", "_", $str_edit);
	$str_edit = preg_replace("/\r|\n/", "", $str_edit);
	$output_arr["range"][$str_edit] = $line;
	fclose($cur_file_open);
}

$sigtranslater = array();
//$strnum = array();
$strnum = array();
if($selected_cancer_type != "LAML")
{
	$sigtranslatefile = $TABLE_DICT[$selected_cancer_type]["SIG"]["TRANSLATE"];
	$sigtranslatefile_open = fopen($sigtranslatefile, "r");
	$sigtcount = 0;
	while(($line = fgets($sigtranslatefile_open)) !== false)
	{
		if($sigtcount > 0)
		{
			$line = preg_replace("/\r|\n/", "", $line);
			$line = explode("\t", $line);
			$psi_get = $line[1];
			$to_simple = $line[2];
			$psi_get = str_replace(".", "_", $psi_get);
			$psi_get = str_replace("-", "_", $psi_get);
			$psi_get = str_replace("(", "_", $psi_get);
			$psi_get = str_replace(")", "_", $psi_get);
			$psi_get = str_replace("\r", "", $psi_get);
			$psi_get = str_replace("\n", "", $psi_get);
			$psi_get = str_replace("_txt", "", $psi_get);
			//$psi_get = strtolower($psi_get);
			$sigtranslater[$psi_get] = $to_simple;
			$sigtranslater[$to_simple] = $psi_get;
			$strnum[($sigtcount-1)] = $psi_get;
		}
		$sigtcount = $sigtcount + 1;
	}
	fclose($sigtranslatefile_open);
}

//$sigresult = pg_query($conn, $TABLE_DICT[$selected_cancer_type]["SIG"]["QUERY"]);
//$i = pg_num_fields($sigresult);
//$strnum = array();
//$strnum = array();
//for ($j = 1; $j < $i; $j++) {
//	$fieldname = pg_field_name($sigresult, $j);
//	$fieldname = str_replace("_", " ", $fieldname);
//	$fieldname = preg_replace("/\r|\n/", "", $fieldname);
//	$strnum[($j-1)] = $fieldname;
//}

//$output_arr["sig"] = $strnum;
$sig_file = $TABLE_DICT[$selected_cancer_type]["SIG"]["COLUMNS"];
$sig_file_open = fopen($sig_file, "r");
$line = fgets($sig_file_open);
$line = str_replace(".", "_", $line);
$line = str_replace("-", "_", $line);
$line = str_replace("(", "_", $line);
$line = str_replace(") ", "__", $line);
$line = str_replace(")", "_", $line);
//$line = strtolower($line);
$line = explode("#", $line);
$line = array_slice($line, 1);
$sig_fields = $line;

$startcount = $sigtcount-1;

$nonmatchers = array();
for($i = 0; $i < count($sig_fields); $i++)
{
	$found = false;
	for($j = 0; $j < count($strnum); $j++)
	{
		if($sig_fields[$i] == $strnum[$j])
		{
			$found = true;
			break;
		}
	}
	if($found)
	{
		continue;
	}
	else
	{
		$n_amt = count($nonmatchers);
		$nonmatchers[$n_amt] = $sig_fields[$i]; 
	}
}

for($i = 0; $i < count($nonmatchers); $i++)
{
	$strstrcount = count($strnum);
	$strnum[$strstrcount] = $nonmatchers[$i];
}

$output_arr["sig"] = $strnum;

//Get rows and columns
//$metaresult = pg_query($conn, $TABLE_DICT[$selected_cancer_type]["SPLC"]["QUERY"]);
$numrows = $TABLE_DICT[$selected_cancer_type]["SPLC"]["ROWNUM"];
$numsamples = $TABLE_DICT[$selected_cancer_type]["SPLC"]["COLNUM"];

$output_arr["sigtranslate"] = $sigtranslater;
$output_arr["qbox"]["columns"] = $numsamples;
$output_arr["qbox"]["rows"] = $numrows;

echo json_encode($output_arr);
?>