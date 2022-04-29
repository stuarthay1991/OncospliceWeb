<?php
ini_set('display_errors', 'on');
ini_set('log_errors', 'on');
ini_set('display_startup_errors', 'on');
ini_set('error_reporting', E_ALL);

try {
	$ruts = shell_exec("cwltool --no-read-only --debug oncorsurvplot.cwl input.json 2>&1 &");
	//$ruts = shell_exec("cwltool --no-read-only --debug oncorsurvplot.cwl input.json 2>&1 &");
} catch (Exception $e) {
    echo 'Caught exception: ',  $e->getMessage(), "\n";
}

echo $ruts;
echo E_ALL;
?>