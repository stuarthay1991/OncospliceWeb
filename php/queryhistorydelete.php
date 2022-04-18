<?php

$delete_file = $_POST["filename"];
$filepath = "QueryHistory/Default/" . $delete_file . ".json";
unlink($filepath);
?>