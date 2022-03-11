<?php

$conn = pg_pconnect("dbname=oncocasen");
if (!$conn) {
    echo "An error occurred0.\n";
    exit;
}

$postExRetrieve = $_POST["GENE"];

date_default_timezone_set('UTC');

$exonquery = "SELECT * FROM HS_EXON WHERE gene = '" . $postExRetrieve . "';";
$exonresult = pg_query($conn, $exonquery);
if (!$exonresult) {
    echo "An error occurred1.\n";
    exit;
}

$blob_arr_gm_count = 0;
$blob_arr_tr_count = 0;
$blob_arr_j_count = 0;
$blob_arr = array();

$m_arr_count = 0;
$m_arr = array();

while ($mrow = pg_fetch_assoc($exonresult)) {
    $m_arr[$m_arr_count]["exon_name"] = $mrow["exon_id"];
    $m_arr[$m_arr_count]["start"] = $mrow["exon_region_start_s_"];
    $m_arr[$m_arr_count]["stop"] = $mrow["exon_region_stop_s_"];
    $m_arr[$m_arr_count]["splice_junctions"] = $mrow["splice_junctions"];
    $m_arr[$m_arr_count]["ensembl_exon_id"] = $mrow["ens_exon_ids"];
    $blob_arr["genemodel"][$blob_arr_gm_count] = $mrow;
    $m_arr_count = $m_arr_count + 1;
    $blob_arr_gm_count = $blob_arr_gm_count + 1;
}

$transcriptquery = "SELECT * FROM HS_TRANSCRIPT_ANNOT WHERE ensembl_gene_id = '" . $postExRetrieve . "';";
$transresult = pg_query($conn, $transcriptquery);
if (!$transresult) {
    echo "An error occurred2.\n";
    exit;
}

$t_arr_count = 0;
$t_arr = array();



while ($mrow = pg_fetch_assoc($transresult)) {
    //$t_arr[$t_arr_count]["transcript"] = $mrow["ensembl_transcript_id"];
    //$t_arr[$t_arr_count]["ensembl_exon_id"] = $mrow["ensembl_exon_id"];
    //$t_arr[$t_arr_count]["start"] = $mrow["exon_start__bp_"];
    //$t_arr[$t_arr_count]["stop"] = $mrow["exon_end__bp_"];

    $cur_transcript = $mrow["ensembl_transcript_id"];
    //$t_arr[$cur_transcript][count($t_arr[$cur_transcript])] = $mrow["ensembl_exon_id"];
    $t_arr[$cur_transcript][count($t_arr[$cur_transcript])] = $mrow["exon_start__bp_"];
    $blob_arr["trans"][$blob_arr_tr_count] = $mrow;
    $blob_arr_tr_count = $blob_arr_tr_count + 1;

    //$t_arr_count = $t_arr_count + 1;
}

$juncquery = "SELECT * FROM HS_JUNC WHERE gene = '" . $postExRetrieve . "';";
$juncresult = pg_query($conn, $juncquery);
if (!$juncresult) {
    echo "An error occurred3.\n";
    exit;
}

$j_arr_count = 0;
$j_arr = array();

while ($mrow = pg_fetch_assoc($juncresult)) {
    $j_arr[$j_arr_count]["junction"] = $mrow["exon_id"];
    $j_arr[$j_arr_count]["ensembl_exon_id"] = $mrow["ens_exon_ids"];
    $j_arr[$j_arr_count]["start"] = $mrow["exon_region_start_s_"];
    $j_arr[$j_arr_count]["stop"] = $mrow["exon_region_stop_s_"];
    $j_arr[$j_arr_count]["strand"] = $mrow["strand"];
    $blob_arr["junc"][$blob_arr_j_count] = $mrow;
    $blob_arr_j_count = $blob_arr_j_count + 1;
    $j_arr_count = $j_arr_count + 1;
}


$o_arr = array();
$o_arr["gene"] = $m_arr;
$o_arr["trans"] = $t_arr;
$o_arr["junc"] = $j_arr;
$o_arr["blob"] = $blob_arr;

$o_arr = json_encode($o_arr);
echo $o_arr;
?>