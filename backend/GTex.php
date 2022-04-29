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

$postuid = $_POST["UID"];



$splicequery = "SELECT * FROM gtex WHERE uid = '" . $postuid . "'";
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