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

$cligene_base_query = " AND (";
$cligene_base_count = 0;

$oncosig_base_query = "SELECT * FROM signature WHERE";
$oncosig_base_count = 0;

$meta_base_query = "SELECT * FROM meta WHERE";
$meta_base_count = 0;
foreach ($_POST as $key => $value) {
	if("GENE" == substr($key, 0, 4))
	{
		$key = substr($key, 4);
		if($cligene_base_count != 0)
		{
	    	$cligene_base_query = $cligene_base_query . " OR ".$key." = '" . $value . "'";
		}
		$cligene_base_query = $cligene_base_query . $key . " = '" . $value . "'";
	}
	if("PSI" == substr($key, 0, 3))
	{
		$key = substr($key, 3);
		if($oncosig_base_count != 0)
		{
	    	$oncosig_base_query = $oncosig_base_query . " OR ".$key." = '1'";
		}
		else
		{
			$oncosig_base_query = $oncosig_base_query." ".$key." = '1'";
		}
	    $oncosig_base_count = $oncosig_base_count + 1;		
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

$cligene_base_query = $cligene_base_query . ")";

//First query for sample UIDS.
$oncosigresult = pg_query($conn, $oncosig_base_query);
if (!$oncosigresult) {
    echo "An error occurred1.\n";
    exit;
}

$pgarr = pg_fetch_all_columns($oncosigresult, 0);
$pgarr_size = count($pgarr);

$uidsub_makequery = " WHERE (";
for($i = 0; $i < $pgarr_size; $i++)
{
	if($i != ($pgarr_size - 1))
	{
		$uidsub_makequery = $uidsub_makequery . "uid = " . "'" . $pgarr[$i] . "' OR ";
	}
	else
	{
		$uidsub_makequery = $uidsub_makequery . "uid = " . "'" . $pgarr[$i] . "')";
	}
}

//First query for sample ids. Will need to be changed to be contructed in depth.
$metaresult = pg_query($conn, $meta_base_query);
if (!$metaresult) {
    echo "An error occurred2.\n";
    exit;
}

//Set up metaresult
$m_arr = array();
$m_arr_count = 0;

while ($mrow = pg_fetch_assoc($metaresult)) {
  $m_arr[$m_arr_count] = $mrow["submitter_id_samples"];
  $m_arr_count = $m_arr_count + 1;
}

//Hardcoded query for annotations for signatures
$makequery = "SELECT symbol, description, examined_Junction, background_major_junction, altexons, proteinpredictions, dpsi, clusterid, uid, coordinates, eventannotation, ";

//Only sample ids matched by the metadata query are retrieved
for($i = 0; $i < count($m_arr); $i++)
{
	//Strings have to be edited in order to be matched
	$str_edit = str_replace(".", "_", $m_arr[$i]);
	$str_edit = str_replace("-", "_", $str_edit);
	$str_edit = $str_edit . "_bed";
	$str_edit = strtolower($str_edit);
	//Add to query string
	$makequery = $makequery . $str_edit;
	if($i != (count($m_arr) - 1))
	{
		$makequery = $makequery . ", ";
	}
	else
	{
		$makequery = $makequery . " FROM gasm " . $uidsub_makequery . $cligene_base_query;
	}
}

//Remove newline characters (if any) from result
$makequery = str_replace("\n", "", $makequery);
$makequery = str_replace("\r", "", $makequery);

//Connect and send the query
$result = pg_query($conn, $makequery);
if (!$result) {
    echo "An error occurred3.\n";
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

//This portion separates the sample ids from the annotation columns
for($i = 0; $i < $total_cols; $i++)
{
	$cur_name = pg_field_name($result, $i);
	$last_4_chars = substr($cur_name, -4);
	if($last_4_chars == "_bed")
	{
		$col_beds[$col_beds_i] = $cur_name;
		$col_beds_i = $col_beds_i + 1;
	}
}
$i = 0;
//Get data
while ($row = pg_fetch_assoc($result)) {
  $returned_result[$i] = $row;
  $i = $i + 1;
}

//Set up output
$pull_array = array();
$pull_array["rr"] = $returned_result;
$pull_array["col_beds"] = $col_beds;
$pull_array = json_encode($pull_array);
echo $pull_array;

?>