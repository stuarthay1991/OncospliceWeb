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

$oncosig_base_query = "SELECT * FROM signature";

$result = pg_query($conn, $oncosig_base_query);

$returned_result = array();

$c = 0;
while ($row = pg_fetch_assoc($result)) 
{
  $returned_result[$c] = $row;
  $c = $c + 1;
}

$sig_file = "oncofields.txt";
$sig_file_open = fopen($sig_file, "r");
$line = fgets($sig_file_open);
$line = str_replace(".", "_", $line);
$line = str_replace("-", "_", $line);
$line = strtolower($line);
$line = explode("#", $line);
$line = array_slice($line, 1);
$sig_fields = $line;

$strnum = array();

for($i = 0; $i < count($sig_fields); $i++)
{
	$cur_field = $sig_fields[$i];
	$cur_amt = 0;
	for($k = 0; $k < $c; $k++)
	{
		$number = intval($returned_result[$k][$cur_field]);
		$cur_amt = $cur_amt + $number;
	}
	$strnum[$i] = "(" . strval($cur_amt) . " rows) " . $cur_field;
}

print_r($strnum);