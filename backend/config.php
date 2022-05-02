<?php
header("Access-Control-Allow-Origin: *");
function makePDO(){
$host = '10.200.42.150';
$localhost = '127.0.0.1';
$db = "oncocasen";
$user = 'haym4b';
$password = 'magicburger5_';

try {
	$dsn = "pgsql:host=$host;port=5432;dbname=$db;";
	// make a database connection
	$pdo = new PDO($dsn, $user, $password, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);

	if ($pdo) {
		echo "";

		/*$sql = "SELECT * FROM GBM_TCGA_SPLICE LIMIT 2;";
        foreach($pdo->query($sql) as $row) {
        	echo $row["symbol"];
        }*/
       	
	}
} catch (PDOException $e) {
	die($e->getMessage());
} finally {
	if ($pdo) {
		return $pdo;
	}
	else
	{
		return false;
	}
}
return false;
}
//$bread = makePDO();
?>