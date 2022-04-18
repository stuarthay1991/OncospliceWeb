<?php
$var_user = $_POST["user"];
$pathname = "QueryHistory/" . $var_user;
if(!is_dir($pathname))
{
	mkdir($pathname);
}
$files1 = scandir($pathname);
//print_r($files1);
$outarrhistory = array();
$c = 0;
for($i = 0; $i < count($files1); $i++)
{
	if($files1[$i] != "." && $files1[$i] != ".." && $files1[$i] != ".DS_Store")
	{
		//echo $files1[$i];
		//echo "<br \>";
		//echo $files1[$i];
		//$handle = fopen(("QueryHistory/" . $files1[$i]), "r");
		$fullcontent = file_get_contents(("QueryHistory/" . $var_user . "/" . $files1[$i]));
		$outarrhistory[$c] = json_decode($fullcontent);
		$c = $c + 1;
		//echo $fullcontent;
	}
}

//foreach ($_POST as $key => $value) {

//}

echo json_encode($outarrhistory);
?>