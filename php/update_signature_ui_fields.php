<?php
$selected_cancer_type = $_POST["cancer_type"];
$TABLE_DICT = array();
$TABLE_DICT["LAML"]["SIG"]["QUERY"] = "SELECT * FROM TCGA_LAML_SIGNATURE";
$TABLE_DICT["LAML"]["SIG"]["COLUMNS"] = "LAML/oncofields.txt";
if($selected_cancer_type == "AML_Leucegene")
{
	$TABLE_DICT[$selected_cancer_type]["SIG"]["QUERY"] = "SELECT * FROM " . $selected_cancer_type . "_SIGNATURE";
	$TABLE_DICT[$selected_cancer_type]["SIG"]["COLUMNS"] = $selected_cancer_type . "/oncofields.txt";
	$TABLE_DICT[$selected_cancer_type]["SIG"]["TRANSLATE"] = $selected_cancer_type . "/OncoSplice-translation.txt";
}
else if($selected_cancer_type != "LAML")
{
	$TABLE_DICT[$selected_cancer_type]["SIG"]["QUERY"] = "SELECT * FROM " . $selected_cancer_type . "_TCGA_SIGNATURE";
	$TABLE_DICT[$selected_cancer_type]["SIG"]["COLUMNS"] = $selected_cancer_type . "/oncofields.txt";
	$TABLE_DICT[$selected_cancer_type]["SIG"]["TRANSLATE"] = $selected_cancer_type . "/OncoSplice-translation.txt";
}

$conn = pg_pconnect("dbname=oncocasen");
if (!$conn) {
    echo "An error occurred1.\n";
    exit;
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

$output_arr["qbox"]["rows"] = $numrows;
$output_arr["sig"] = $strnum;
$output_arr["sigtranslate"] = $sigtranslater;
echo json_encode($output_arr);