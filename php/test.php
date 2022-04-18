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

$oncosig_base_query = "SELECT * FROM signature WHERE psi_v26_vs_others = '1'";
$oncosig_base_count = 0;

//First query for sample UIDS.
$oncosigresult = pg_query($conn, $oncosig_base_query);
if (!$oncosigresult) {
    echo "An error occurred1.\n";
    exit;
}

$pgarr = pg_fetch_all_columns($oncosigresult, 0);
print_r($pgarr);
?>