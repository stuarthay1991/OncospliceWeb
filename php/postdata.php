<?php
//ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);
//error_reporting(E_ALL);
class PostType {
    public $contents = array();

    function __construct($type, $base_query=""){
        switch($type){
            case "Query":
                //Any query will have two parts, objects associated with the query (counter and a boolean) and the actual query string itself
                $this->contents = array(
                    "query" => "",
                    "objects" => array(
                        "exists" => false,
                        "counter" => 0,
                    ),
                );
                break;
            case "Cluster":
                //For Cluster and History there is only one key and a boolean for whether or not a key exists
                $this->contents = array(
                    "objects" => array(
                        "exists" => false,
                        "key" => "none",
                    ),
                );
                break;
            case "History":
                $this->contents = array(
                    "objects" => array(
                        "exists" => false,
                        "key" => "none",
                    ),
                );
                break;
        }
    }

    function setBaseQuery($str_obj){
        $this->contents["query"] = $str_obj;
    }

    function addToQuery($str_obj){
        $this->contents["query"] = $this->contents["query"] . $str_obj;
        $this->addToCounter();
    }

    function getCounter(){
        return $this->contents["objects"]["counter"];
    }

    function getKey(){
        return $this->contents["objects"]["key"];
    }

    function getQuery(){
        return $this->contents["query"];
    }

    function addToCounter(){
        $this->contents["objects"]["counter"] = $this->getCounter() + 1;
    }
}

class PostData {
	private $post = array();

    private $Cancer;
    public $Coords;
    public $Genes;
    public $Signatures;
    public $SplicingQueries;
    public $MergedResults;
    public $Histories;

    function __construct($post_variable){
        $this->post = $post_variable;
        $this->Cancer = $this->post["CANCER"];
        $this->CompCancer = $this->post["COMPCANCER"];
        $this->Coords = new PostType("Query");
        $this->Genes = new PostType("Query");
        $this->Signatures = new PostType("Query");
        $this->SplicingQueries = new PostType("Query");
        $this->MergedResults = new PostType("Cluster");
        $this->Histories = new PostType("History");
        $this->setBaseQueries();
        $this->setValues();
    }

    function setBaseQueries(){
        //Special base query cases
        if($this->Cancer == "LAML")
        {
            $this->SplicingQueries->setBaseQuery(("SELECT * FROM TCGA_" . $this->Cancer . "_META"));
            $this->Signatures->setBaseQuery(("SELECT * FROM TCGA_" . $this->CompCancer . "_SIGNATURE"));
        }
        else if($this->Cancer == "AML_Leucegene")
        {
            $this->SplicingQueries->setBaseQuery(("SELECT * FROM " . $this->Cancer . "_META"));
        }
        //All other cases
        else
        {
            $this->SplicingQueries->setBaseQuery(("SELECT * FROM " . $this->Cancer . "_TCGA_META"));
        }

        if($this->CompCancer == "AML_Leucegene")
        {
            $this->Signatures->setBaseQuery(("SELECT * FROM " . $this->CompCancer . "_SIGNATURE"));
        }
        else
        {
            $this->Signatures->setBaseQuery(("SELECT * FROM " . $this->CompCancer . "_TCGA_SIGNATURE"));
        }

        $this->Genes->setBaseQuery(" WHERE (");
        $this->Coords->setBaseQuery(" WHERE ");
    }

    function setValues(){
    	foreach ($this->post as $key => $value) {
            //All possible prefix values
    		$key_possible_prefix_5 = substr($key, 0, 5);
            $key_possible_prefix_4 = substr($key, 0, 4);
            $key_possible_prefix_3 = substr($key, 0, 3);
            if($key_possible_prefix_5 == "COORD"){
                $key = substr($key, 5);
                $key = preg_replace("/\r|\n/", "", $key);
                //Seperate the chromosome label from the rest of the input, isolate to a variable
                $coord1_chrm_split = explode(":", $key);
                $coord1_chrm = $coord1_chrm_split[0];

                //Seperate the input coordinates into the start and end coordinate, isolate to respective variables
                $coord1_pos_split = explode("-", $coord1_chrm_split[1]);
                $coord1_start = $coord1_pos_split[0];
                $coord1_end = $coord1_pos_split[1];
                
                $pre_coord_query = " ((chromosome = " . "'" . $coord1_chrm . "'" . ") AND ((coord1 = " . "'" . $coord1_start . "'" . " OR coord2 = " . "'" . $coord1_start . "'" . " OR coord3 = " . "'" . $coord1_start . "'" . " OR coord4 = " . "'" . $coord1_start . "'" . ") OR (coord1 = " . "'" . $coord1_end . "'" . " OR coord2 = " . "'" . $coord1_end . "'" . " OR coord3 = " . "'" . $coord1_end . "'" . " OR coord4 = " . "'" . $coord1_end . "'" . ")))";

                if($this->Coords->getCounter() != 0){
                    $this->Coords->addToQuery((" OR" . $pre_coord_query));
                }
                else{
                    $this->Coords->addToQuery($pre_coord_query);
                }
                continue;
            }
            if($key_possible_prefix_3 == "PSI"){
                //Cut off prefix
                $key = substr($key, 3);

                //Replace string values in the key so it will match with respective entries in the database
                $key = str_replace("+", "_", $key);

                //Assert that a signature exists in the database
                $this->Signatures->contents["objects"]["exists"] = true;

                //Add signature selection to query
                if($this->Signatures->getCounter() != 0){
                    $this->Signatures->addToQuery((" OR ".$key." = '1'"));
                }
                else{
                    $this->Signatures->addToQuery((" WHERE ".$key." = '1'"));
                }   
                continue;
            }
            switch($key_possible_prefix_4){
                case "GENE":
                    //Cut off prefix
                    $value = substr($value, 4);
                    
                    //Assert that at least one gene entry has matched
                    $this->Genes->contents["objects"]["exists"] = true;

                    //Add gene symbol condition to query
                    if($this->Genes->getCounter() != 0){
                        $this->Genes->addToQuery((" OR symbol = '" . $value . "'"));
                    }
                    else{
                        $this->Genes->addToQuery((" symbol = '" . $value . "'"));
                    }
                    break;

                case "RPSI":
                    //Cut off prefix
                    $key = substr($key, 4);

                    //Remove necessary chars
                    if(strpos($key, "("))
                    {
                        $key_split = explode("_(", $key);
                        $key = $key_split[0];
                    }

                    //Assert existence and assign key
                    $this->MergedResults->contents["objects"]["exists"] = true;
                    $this->MergedResults->contents["objects"]["key"] = $key;
                    break;

                case "SPLC":
                    //Cut off prefix
                    $key = substr($key, 4);

                    //Assert existence
                    $this->SplicingQueries->contents["objects"]["exists"] = true;

                    //Add to query, conditions are based on whether the input is looking for numerical or string values
                    if(strpos($value, "-") != false){
                        $numberstosearch = explode("-", $value);
                        if($this->SplicingQueries->getCounter() != 0){
                            $this->SplicingQueries->addToQuery((" AND ".$key." >= '".$numberstosearch[0]."'"));
                        }
                        else{
                            $this->SplicingQueries->addToQuery((" WHERE ".$key." >= '".$numberstosearch[0]."'"));
                        }
                        $this->SplicingQueries->addToQuery((" AND ".$key." <= '".$numberstosearch[1]."'"));
                    }
                    else{
                        if($this->SplicingQueries->getCounter() != 0){
                            $this->SplicingQueries->addToQuery((" AND ".$key." = '".$value."'"));
                        }
                        else{
                            $this->SplicingQueries->addToQuery((" WHERE ".$key." = '".$value."'"));
                        }
                    }
                    break;

                case "HIST":
                    //Assert existence and assign key
                    $this->Histories->contents["objects"]["exists"] = true;
                    $this->Histories->contents["objects"]["key"] = $value;
                    break;
            }
    	}
        //$this->Genes->addToQuery(")");
    }
}

class QueryData {
    public $uid_sub_makequery;
    public $postdata;
    public $conn;
    function __construct($posted, $connection){
        $this->postdata = $posted;
        $this->conn = $connection;
    }
    function acquireSignatureUIDs(){
        if($this->postdata->Signatures->getCounter() > 0){
            $oncosigresult = pg_query($this->conn, $this->postdata->Signatures->getQuery());
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
            $this->uid_sub_makequery = $uidsub_makequery;
        }
    }
}

?>