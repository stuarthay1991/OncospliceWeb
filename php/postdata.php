<?php

class PostType {
    public $contents = array();

    function __construct($type, $base_query=""){
        switch($type){
            case "Query":
                $this->contents = array(
                    "query" => "",
                    "objects" => array(
                        "exists" => false,
                        "counter" => 0,
                    ),
                );
                break;
            case "Cluster":
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
        $this->contents = $post_variable;
    }

    function setBaseQuery($str_obj){
        $this->contents["query"] = $str_obj;
    }

    function addToQuery($str_obj){
        $this->contents["query"] = $this->contents["query"] . $str_obj;
        $this->addToCounter();
    }

    function getCounter(){
        return $this->contents->["objects"]["counter"];
    }

    function getKey(){
        return $this->contents->["objects"]["key"];
    }

    function getQuery(){
        return $this->contents->["query"];
    }

    function addToCounter(){
        $this->contents->["objects"]["counter"] = $this->getCounter() + 1;
    }
}

class PostData {
	private $post = array();

    private $Cancer = "";
    public $Coords = new PostType("Query");
    public $Genes = new PostType("Query");
    public $Signatures = new PostType("Query");
    public $SplicingQueries = new PostType("Query");
    public $MergedResults = new PostType("Cluster");
    public $Histories = new PostType("History");

    function __construct($post_variable){
        $this->post = $post_variable;
        $this->Cancer = $this->post["CANCER"];
        $this->setValues();
    }

    function setBaseQueries(){
        $this->SplicingQueries->setBaseQuery(("SELECT * FROM " . $this->Cancer . "_TCGA_META"));
        $this->Signatures->setBaseQuery(("SELECT * FROM " . $this->Cancer . "_TCGA_SIGNATURE"));
        $this->Genes->setBaseQuery(" WHERE (");
        $this->Coords->setBaseQuery(" WHERE (");
    }

    function setValues(){
    	foreach ($this->post as $key => $value) {
    		$key_possible_prefix_5 = substr($key, 0, 5));
            $key_possible_prefix_4 = substr($key, 0, 4));
            $key_possible_prefix_3 = substr($key, 0, 3));
            if($key_possible_prefix_5 == "COORD"){
                $value = substr($value, 5);
                continue;
            }
            if($key_possible_prefix_3 == "PSI"){
                $key = substr($key, 3);
                $key = str_replace("+", "_", $key);
                $this->Signatures->contents["objects"]["exists"] = true;
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
                    $value = substr($value, 4);
                    
                    $this->Genes->contents["objects"]["exists"] = true;
                    if($this->Genes->getCounter() != 0){
                        $this->Genes->addToQuery((" OR symbol = '" . $value . "'"));
                    }
                    else{
                        $this->Genes->addToQuery((" symbol = '" . $value . "'"));
                    }
                    $cligene_base_count = $cligene_base_count + 1;
                    break;

                case "RPSI":
                    $key = substr($key, 4);
                    if(strpos($key, "("))
                    {
                        $key_split = explode("_(", $key);
                        $key = $key_split[0];
                    }
                    $this->MergedResults->contents["objects"]["exists"] = true;
                    $this->MergedResults->contents["objects"]["key"] = $key;
                    break;

                case "SPLC":
                    $key = substr($key, 4);
                    $this->SplicingQueries->contents["objects"]["exists"] = true;
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
                    $this->Histories->contents["objects"]["exists"] = true;
                    $this->Histories->contents["objects"]["key"] = $key;
                    break;
            }
    	}

    }
}
?>