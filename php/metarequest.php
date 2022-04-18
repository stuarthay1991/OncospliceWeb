<?php
//ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);
//error_reporting(E_ALL);
include 'postdata.php';
//Connect to postgres db
//include 'queryhistoryaccess.php'; 

//ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);
//error_reporting(E_ALL);
$conn = pg_pconnect("dbname=oncocasen");
if (!$conn) {
    echo "An error occurred1.\n";
    exit;
}
$cancertype = $_POST["CANCER"];
$compcancertype = $_POST["COMPCANCER"];
date_default_timezone_set('UTC');
$TABLE_DICT = array();

//initial declarations (will need something better later)
$TABLE_DICT["LAML"]["META"]["COLUMNS"] = "LAML/Columns";
$TABLE_DICT["LAML"]["META"]["QUERY"] = "SELECT * FROM TCGA_LAML_META";
$TABLE_DICT["LAML"]["SIG"]["QUERY"] = "SELECT * FROM TCGA_LAML_SIGNATURE";
$TABLE_DICT["LAML"]["SIG"]["COLUMNS"] = "LAML/oncofields.txt";
$TABLE_DICT["LAML"]["SPLC"]["QUERY"] = " FROM TCGA_LAML_SPLICE ";
$TABLE_DICT["LAML"]["SPLC"]["EXT"] = "";
$TABLE_DICT["LAML"]["META"]["SPC"] = "submitter_id_samples";

//$TABLE_DICT["LGG"]["META"]["COLUMNS"] = "LGG/Columns";
//$TABLE_DICT["LGG"]["META"]["QUERY"] = "SELECT * FROM meta";
//$TABLE_DICT["LGG"]["SIG"]["QUERY"] = "SELECT * FROM signature";
//$TABLE_DICT["LGG"]["SIG"]["COLUMNS"] = "LGG/oncofields.txt";
//$TABLE_DICT["LGG"]["SPLC"]["QUERY"] = " FROM gasm ";
//$TABLE_DICT["LGG"]["SPLC"]["EXT"] = "_bed";
//$TABLE_DICT["LGG"]["META"]["SPC"] = "submitter_id_samples";
if($cancertype == "AML_Leucegene")
{
	$TABLE_DICT[$cancertype]["RPSI"] = $cancertype . "/MergedResult.txt";
	$TABLE_DICT[$cancertype]["META"]["COLUMNS"] = $cancertype . "/Columns";
	$TABLE_DICT[$cancertype]["META"]["RANGE"] = $cancertype . "/Range";
	$TABLE_DICT[$cancertype]["META"]["QUERY"] = "SELECT * FROM " . $cancertype . "_META";
	$TABLE_DICT[$cancertype]["SPLC"]["QUERY"] = " FROM " . $cancertype . "_SPLICE ";
	$TABLE_DICT[$cancertype]["SPLC"]["ROWNUM"] = 999;
	$TABLE_DICT[$cancertype]["SPLC"]["COLNUM"] = 999;
	$TABLE_DICT[$cancertype]["SPLC"]["EXT"] = "";
	$TABLE_DICT[$cancertype]["META"]["SPC"] = "uid";	
}
else if($cancertype != "LAML")
{
	$TABLE_DICT[$cancertype]["RPSI"] = $cancertype . "/MergedResult.txt";
	$TABLE_DICT[$cancertype]["META"]["COLUMNS"] = $cancertype . "/Columns";
	$TABLE_DICT[$cancertype]["META"]["RANGE"] = $cancertype . "/Range";
	$TABLE_DICT[$cancertype]["META"]["QUERY"] = "SELECT * FROM " . $cancertype . "_TCGA_META";
	$TABLE_DICT[$cancertype]["SPLC"]["QUERY"] = " FROM " . $cancertype . "_TCGA_SPLICE ";
	$TABLE_DICT[$cancertype]["SPLC"]["ROWNUM"] = 999;
	$TABLE_DICT[$cancertype]["SPLC"]["COLNUM"] = 999;
	$TABLE_DICT[$cancertype]["SPLC"]["EXT"] = "";
	$TABLE_DICT[$cancertype]["META"]["SPC"] = "uid";
}

if($compcancertype == "AML_Leucegene")
{
	$TABLE_DICT[$cancertype]["SIG"]["QUERY"] = "SELECT * FROM " . $compcancertype . "_SIGNATURE";
	$TABLE_DICT[$cancertype]["SIG"]["COLUMNS"] = $compcancertype . "/oncofields.txt";
}
else if($compcancertype != "LAML")
{
	$TABLE_DICT[$compcancertype]["SIG"]["QUERY"] = "SELECT * FROM " . $compcancertype . "_TCGA_SIGNATURE";
	$TABLE_DICT[$compcancertype]["SIG"]["COLUMNS"] = $compcancertype . "/oncofields.txt";
}

$TABLE_DICT["BLCA"]["META"]["SPC"] = "uid";

//NEW post data iterate
$posted = new PostData($_POST);

//Data retrieval and formatting from user input
$onco_merged_result_key = $posted->MergedResults->getKey();
$history_added = $posted->Histories->getKey();

$meta_base_query = $posted->SplicingQueries->getQuery();
$oncosig_base_query = $posted->Signatures->getQuery();
$cligene_base_query = $posted->Genes->getQuery();
$cligene_base_query = $cligene_base_query . ")";
$coord_base_query = $posted->Coords->getQuery();

$meta_base_count = $posted->SplicingQueries->getCounter();
$oncosig_base_count = $posted->Signatures->getCounter();
$cligene_base_count = $posted->Genes->getCounter();
$coord_base_count = $posted->Coords->getCounter();

//$querydata = new QueryData($posted, $conn);

//Find file for cluster positions (if exists) and write corresponding dictionary
$rpsi_dict = array();
if(file_exists($TABLE_DICT[$cancertype]["RPSI"]))
{
	$rpsi_index = "NA";
	$rpsi_handle = fopen($TABLE_DICT[$cancertype]["RPSI"], "r");
	$rpsi_header = fgets($rpsi_handle);
	$rpsi_header = explode("\t", $rpsi_header);
	for($i = 0; $i < count($rpsi_header); $i++)
	{
		$current_r_h = $rpsi_header[$i];
		if($current_r_h == $onco_merged_result_key)
		{
			$rpsi_index = $i;
			break;
		}
	}
	if($rpsi_index == "NA")
	{
		$newkey = str_replace("_", " ", $onco_merged_result_key);
		for($i = 0; $i < count($rpsi_header); $i++)
		{
			$current_r_h = $rpsi_header[$i];
			if($current_r_h == $newkey)
			{
				$rpsi_index = $i;
				break;
			}
		}		
	}
	if($rpsi_index != "NA")
	{
		while(! feof($rpsi_handle))
		{
			$rpsi_line = fgets($rpsi_handle);
			$rpsi_line = explode("\t", $rpsi_line);
			$row_label = $rpsi_line[0];
			$row_label = str_replace(".", "_", $row_label);
			$row_label = str_replace("-", "_", $row_label);
			$row_label = strtolower($row_label);
			$rpsi_dict[$row_label] = $rpsi_line[$rpsi_index];
		}
	}
}

//Check for user tag to incorporate into the history
if(isset($_POST["USER"]))
{
	$userpath = $_POST["USER"];

	$obj_tofile = json_decode($history_added);
	$date_tofile = date('l jS \of F Y h:i:s A');
	$arr_tofile = array();

	$arr_tofile["obj"] = $obj_tofile;
	$arr_tofile["date"] = $date_tofile;
	$arr_tofile["atom"] = date(DATE_ATOM);
	$arr_tofile = json_encode($arr_tofile);
	$datefilestring = "QueryHistory/" . $userpath . "/" . date(DATE_ATOM) . ".json";
	$handle = fopen($datefilestring, "w");
	fwrite($handle, $arr_tofile);
	fclose($handle);
}

//First query for sample UIDS.
if($oncosig_base_count > 0)
{
	$oncosig_base_query = str_replace("-", "_", $oncosig_base_query);
	$oncosig_base_query = str_replace("(", "_", $oncosig_base_query);
	$oncosig_base_query = str_replace(")", "_", $oncosig_base_query);
	$oncosigresult = pg_query($conn, $oncosig_base_query);
	if (!$oncosigresult) {
	    //echo "error occurred1";
	    echo $oncosig_base_query;
	    exit;
	}

	$pgarr = pg_fetch_all_columns($oncosigresult, 0);
	$pgarr_size = count($pgarr);

	$uidsub_makequery = " WHERE (";
	for($i = 0; $i < $pgarr_size; $i++)
	{
		//$pizza  = "piece1 piece2 piece3 piece4 piece5 piece6";
		//$pieces = explode("|", $pgarr[$i]);
		if($i != ($pgarr_size - 1))
		{
			$uidsub_makequery = $uidsub_makequery . "pancanceruid = " . "'" . $pgarr[$i] . "' OR ";
		}
		else
		{
			$uidsub_makequery = $uidsub_makequery . "pancanceruid = " . "'" . $pgarr[$i] . "')";
		}
	}
}
//Set up metaresult
$m_arr = array();
$m_arr_count = 0;

//First query for sample ids. Will need to be changed to be contructed in depth.
if($meta_base_count > 0)
{
	$metaresult = pg_query($conn, $meta_base_query);
	if (!$metaresult) {
	    echo "An error occurred2.\n";
	    exit;
	}

	while ($mrow = pg_fetch_assoc($metaresult)) {
	  $m_arr[$m_arr_count] = $mrow[$TABLE_DICT[$cancertype]["META"]["SPC"]];
	  $m_arr_count = $m_arr_count + 1;
	}
}

//Hardcoded query for annotations for signatures
if($cancertype != "LAML")
{
	$makequery = "SELECT symbol, description, examined_Junction, background_major_junction, altexons, proteinpredictions, dpsi, clusterid, uid, pancanceruid, chromosome, coord1, coord2, coord3, coord4, eventannotation, ";
}
else
{
	$makequery = "SELECT symbol, description, examined_Junction, background_major_junction, altexons, proteinpredictions, dpsi, clusterid, uid, coordinates, eventannotation, ";
}

//Only sample ids matched by the metadata query are retrieved
if(count($m_arr) > 0)
{
	for($i = 0; $i < count($m_arr); $i++)
	{
		//Strings have to be edited in order to be matched
		$str_edit = str_replace(".", "_", $m_arr[$i]);
		$str_edit = str_replace("-", "_", $str_edit);
		$str_edit = $str_edit . $TABLE_DICT[$cancertype]["SPLC"]["EXT"];
		$str_edit = strtolower($str_edit);

		//Add to query string
		if($str_edit != 'na' && $str_edit != '')
		{
			$makequery = $makequery . $str_edit;
		}
		if($i != (count($m_arr) - 1))
		{
			if($str_edit != 'na' && $str_edit != '')
			{
			$makequery = $makequery . ", ";
			}
		}
		else
		{
			if($meta_base_count == 0)
			{
				$makequery = "SELECT *" . $TABLE_DICT[$cancertype]["SPLC"]["QUERY"];
			}
			else
			{	
				$secondtolast = substr($makequery, -1);
				if($secondtolast == " ")
				{
					$makequery = substr($makequery, 0, -1);
					$makequery = substr($makequery, 0, -1);
				}

				$makequery = $makequery . $TABLE_DICT[$cancertype]["SPLC"]["QUERY"];
			}
			if($oncosig_base_count > 0)//Check for normal signature filter
			{
				$makequery = $makequery . $uidsub_makequery;
			}
			else if($cligene_base_count > 0)//Check for 
			{
				$makequery = $makequery . $cligene_base_query;
			}
			else if($coord_base_count > 0)//
			{
				$makequery = $makequery . $coord_base_query;
			}
		}
		

	}
}
else
{
	if($meta_base_count == 0)
	{
		$makequery = "SELECT *" . $TABLE_DICT[$cancertype]["SPLC"]["QUERY"];
	}
	else
	{	
		$secondtolast = substr($makequery, -1);
		if($secondtolast == " ")
		{
			$makequery = substr($makequery, 0, -1);
			$makequery = substr($makequery, 0, -1);
		}

		$makequery = $makequery . $TABLE_DICT[$cancertype]["SPLC"]["QUERY"];
	}
	if($oncosig_base_count > 0)
	{
		$makequery = $makequery . $uidsub_makequery;
	}
	else if($cligene_base_count > 0)
	{
		$makequery = $makequery . $cligene_base_query;
	}
	else if($coord_base_count > 0)
	{
		$makequery = $makequery . $coord_base_query;
	}
}

//just in case last was a na

//Remove newline characters (if any) from result
$makequery = str_replace("\n", "", $makequery);
$makequery = str_replace("\r", "", $makequery);

//Connect and send the query
//echo $makequery;

$result = pg_query($conn, $makequery);
if (!$result) {
	//echo "error3";
    //echo $uidsub_makequery;
    echo $makequery;
    exit;
}

//Set up result
$rr = "";
$enum = 50;
$returned_result = array();
$col_beds = array();
$col_beds_i = 0;
//This line takes the number of columns
$total_cols = pg_num_fields($result);

$resultboxfile = fopen("resultboxfile.txt", "w");
fwrite($resultboxfile, "uid");
fwrite($resultboxfile, "\t");
for($i = 0; $i < $total_cols; $i++)
{
	$cur_name = pg_field_name($result, $i);
	$first_4_chars = substr($cur_name, 0, 4);
	$last_4_chars = substr($cur_name, -4);
	if($first_4_chars == "tcga")
	{
		$col_beds[$col_beds_i] = $cur_name;
		$col_beds_i = $col_beds_i + 1;
	}
	else if($last_4_chars == "_bed")
	{
		$col_beds[$col_beds_i] = $cur_name;
		$col_beds_i = $col_beds_i + 1;
	}
}

for($i = 0; $i < count($col_beds); $i++)
{
	fwrite($resultboxfile, $col_beds[$i]);
	if($i != (count($col_beds) - 1))
	{
		fwrite($resultboxfile, "\t");
	}
}
fwrite($resultboxfile, "\n");


$ic = 0;
//Get data
while ($row = pg_fetch_assoc($result)) {
  if($ic > 5000)
  {
  	break;
  }
  $returned_result[$row["uid"]] = $row;
  fwrite($resultboxfile, $row["uid"]);
  fwrite($resultboxfile, "\t");
  for($k = 0; $k < count($col_beds); $k++)
  {
	fwrite($resultboxfile, $row[$col_beds[$k]]);
	if($k != (count($col_beds) - 1))
	{
		fwrite($resultboxfile, "\t");
	}
  }
  fwrite($resultboxfile, "\n");
  $ic = $ic + 1;
}

$ruts = shell_exec("python HC_only_circa_v1.py --i resultboxfile.txt --row_method ward --column_method ward --row_metric cosine --column_metric cosine --normalize True 2>&1 &");
$file = fopen("resultboxfile-clustered.txt", "r");
$line = fgets($file);
$line = str_replace("\n","",$line);
$column_names_initial = explode("\t", $line);

$line = fgets($file);
$line = str_replace("\n","",$line);
$column_cluster_index = explode("\t", $line);
$column_cluster_returned = array_shift($column_cluster_index);

$column_names_first_returned = array_shift($column_names_initial);
$output = array();
$index_list = array();
$outarr = array();
$i = 0;

while(! feof($file))
{
	$line = fgets($file);
	$line = explode("\t", $line);
	if(count($line) > 1)
	{
	$outarr[$i]["uid"] = $line[0];
	$outarr[$i]["pancanceruid"] = $line[0];
	$outarr[$i]["symbol"] = $returned_result[$line[0]]["symbol"];
	$outarr[$i]["description"] = $returned_result[$line[0]]["description"];
	$outarr[$i]["examined_junction"] = $returned_result[$line[0]]["examined_junction"];
	$outarr[$i]["background_major_junction"] = $returned_result[$line[0]]["background_major_junction"];
	$outarr[$i]["altexons"] = $returned_result[$line[0]]["altexons"];
	$outarr[$i]["proteinpredictions"] = $returned_result[$line[0]]["proteinpredictions"];
	$outarr[$i]["dpsi"] = $returned_result[$line[0]]["dpsi"];
	$outarr[$i]["clusterid"] = $returned_result[$line[0]]["clusterid"];
	$outarr[$i]["chromosome"] = $returned_result[$line[0]]["chromosome"];
	$outarr[$i]["coord1"] = $returned_result[$line[0]]["coord1"];
	$outarr[$i]["coord2"] = $returned_result[$line[0]]["coord2"];
	$outarr[$i]["coord3"] = $returned_result[$line[0]]["coord3"];
	$outarr[$i]["coord4"] = $returned_result[$line[0]]["coord4"];
	$outarr[$i]["eventannotation"] = $returned_result[$line[0]]["eventannotation"];
	for($k = 0; $k < count($column_names_initial); $k++)
	{
		//[$column_names_initial[$k]]
		$outarr[$i][$column_names_initial[$k]] = $line[$k+1];
	}
	}
	$index_list[$i] = $line;
	$i = $i + 1;
}

date_default_timezone_set('UTC');

//Set up output
$pull_array = array();
$pull_array["cluster_status"] = $oncosig_base_query;
$pull_array["cancer"] = $cancertype;
$pull_array["compcancer"] = $compcancertype;
$pull_array["oncokey"] = $onco_merged_result_key;
$pull_array["rpsi"] = $rpsi_dict;
$pull_array["rpsi_annot"] = file_exists($TABLE_DICT[$cancertype]["RPSI"]);
$pull_array["rr"] = $outarr;
$pull_array["cci"] = $column_cluster_index;
$pull_array["col_beds"] = $column_names_initial;
$pull_array["date"] = date('l jS \of F Y h:i:s A');
$pull_array = json_encode($pull_array);
echo $pull_array;
?>