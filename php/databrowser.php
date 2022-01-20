<?php
$conn = pg_pconnect("dbname=oncocasen");
if (!$conn) {
    echo "An error occurred1.\n";
    exit;
}


?>

<html>
<body>
<form action="databrowser.php" method="POST">
	<input type="text" "name="stuff" value="" style="width: 200px"></input>
	<button name="submit" value="submit">Submit</button>
</form>
</body>
<table>
<?php
if(isset($_POST["submit"]))
{
	echo json_encode("td");
}
?>
</table>
</html>