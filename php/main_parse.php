<?php
//parse post input



foreach ($_POST as $key => $value) {
	if("GENE" == substr($key, 0, 4))
	{
		$value = substr($value, 4);
		if($cligene_base_count != 0)
		{
	    	$cligene_base_query = $cligene_base_query . " OR symbol = '" . $value . "'";
		}
		else
		{
			$cligene_base_query = $cligene_base_query . " symbol = '" . $value . "'";
		}
		$cligene_base_count = $cligene_base_count + 1;
	}
	else if("PSI" == substr($key, 0, 3))
	{
		$key = substr($key, 3);
		$key = str_replace("+", "_", $key);
		if($oncosig_base_count != 0)
		{
	    	$oncosig_base_query = $oncosig_base_query . " OR ".$key." = '1'";
		}
		else
		{
			$oncosig_base_query = $oncosig_base_query." WHERE ".$key." = '1'";
		}
	    $oncosig_base_count = $oncosig_base_count + 1;		
	}
	else if("RPSI" == substr($key, 0, 4))
	{
		$key = substr($key, 4);
		if(strpos($key, "("))
		{
			$key_split = explode("_(", $key);
			$key = $key_split[0];
		}
		$onco_merged_result_key = $key;
	}
	else if("SPLC" == substr($key, 0, 4))
	{
		$key = substr($key, 4);
		if(strpos($value, "-") != false)
		{
			$numberstosearch = explode("-", $value);
			if($meta_base_count != 0)
			{
		    	$meta_base_query = $meta_base_query." AND ".$key." >= '".$numberstosearch[0]."'";
			}
			else
			{
				$meta_base_query = $meta_base_query." WHERE ".$key." >= '".$numberstosearch[0]."'";
			}
			$meta_base_count = $meta_base_count + 1;
			$meta_base_query = $meta_base_query." AND ".$key." <= '".$numberstosearch[1]."'";
			$meta_base_count = $meta_base_count + 1;
		}
		else
		{
			if($meta_base_count != 0)
			{
		    	$meta_base_query = $meta_base_query." AND ".$key." = '".$value."'";
			}
			else
			{
				$meta_base_query = $meta_base_query." WHERE ".$key." = '".$value."'";
			}
		}
	    $meta_base_count = $meta_base_count + 1;
	}
	else if("HIST" == substr($key, 0, 4))
	{
		$history_added = $value;
	}
}
?>