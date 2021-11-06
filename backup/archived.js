///material-app
///ICGS/Oncosplice/build

var splicingreturned = [];
var splicingcols = [];
var splicingcc = [];
var splicingrpsi = [];
var splicingtrans = "";
var sendToViewPane = {};
var keys = {};
var ui_field_dict;
var ui_field_range;

function selectfield(name, value, number, filter){
  //console.log("selectfield starting...");
  var bodyFormData = new FormData();
  sendToViewPane["filter"] = [];
  for(var i = 0; i < keys[filter].length; i++)
  {
    var myString = pre_queueboxchildren[keys[filter][i]].props.value;
    myString = myString.replace(/(\r\n|\n|\r)/gm, "");
    bodyFormData.append(pre_queueboxchildren[keys[filter][i]].props.name, myString);
    sendToViewPane["filter"].push((pre_queueboxchildren[keys[filter][i]].props.name.concat("#").concat(myString)));
  }
  name = name.replace(/(\r\n|\n|\r)/gm, "");
  value = value.replace(/(\r\n|\n|\r)/gm, "");
  bodyFormData.append(("SEL".concat(name)), value);
  bodyFormData.append("CANCER",curCancer);
  axios({
    method: "post",
    url: (targeturl.concat("/backend/getsinglemeta.php")),
    data: bodyFormData,
    headers: { "Content-Type": "multipart/form-data" },
  })
    .then(function (response) {
      //console.log("selectfield response code starting...");
      var in_criterion = response["data"]["single"];
      var selected_left = response["data"]["meta"];
      current_number_of_samples = response["data"]["meta"];
      console.log("selectfield repsonse: ", response["data"]);
      queueboxchildren[number] = <QueueMessage key={number} number={number} name={name} get={number} value={value} type={"samples"} total_selected={in_criterion} total_left={selected_left}/>
      updateQueueBox(curCancer, keys["filter"].length, queueboxchildren, queueboxsignatures);
      //console.log("selectfield response code finished.");
  })
}

function selectsignature(name, number, filter){
  var bodyFormData = new FormData();
  sendToViewPane["single"] = [];
  for(var i = 0; i < keys[filter].length; i++)
  {
    var myString = pre_queueboxsignatures[keys[filter][i]].props.name;
    myString = myString.replace(/(\r\n|\n|\r)/gm, "");
    if(Object.entries(sigTranslate).length > 0)
    {
      console.log("working working");
      if(sigTranslate[myString] != undefined)
      {
        myString = sigTranslate[myString];
        myString = myString.replace("+", "positive_");
      }
      else
      {
        //myString = "PSI_".concat(myString);
        myString = myString.replace(" ", "_");
      }
      console.log(myString);
    }
    bodyFormData.append(myString, myString);
    sendToViewPane["single"].push(myString);
    console.log("SIGBODYFORMDATA1: ", myString);  
  }
  if(Object.entries(sigTranslate).length > 0)
  {
    if(sigTranslate[name] != undefined)
    {
        name = sigTranslate[name];
        name = name.replace("+", "positive_");
    }//TMEPORARY FIX
    else
    {
        //name = "PSI_".concat(name);
        name = name.replace(" ", "_");
    }
    name = name.replace(/(\r\n|\n|\r)/gm, "");
    bodyFormData.append(("SEL".concat(name)), name);
    console.log("SIGBODYFORMDATA2: ", name);
  }
  else
  {
    name = name.replace(/(\r\n|\n|\r)/gm, "");
    bodyFormData.append(("SEL".concat(name)), name);
    console.log("SIGBODYFORMDATA2: ", name);   
  }
  bodyFormData.append("CANCER",curCancer);
  
  axios({
    method: "post",
    url: (targeturl.concat("/backend/getsinglesig.php")),
    data: bodyFormData,
    headers: { "Content-Type": "multipart/form-data" },
  })
    .then(function (response) {
      var in_criterion = response["data"]["single"];
      var selected_left = response["data"]["meta"];
      current_number_of_events = response["data"]["meta"];
      queueboxsignatures[number] = <QueueMessage key={number} number={number} name={"PSI"} get={number} value={name} type={"events"} total_selected={in_criterion} total_left={selected_left}/>
      updateQueueBox(curCancer, keys["single"].length, queueboxchildren, queueboxsignatures);
  })
}

function ajaxfunc() {
  document.getElementById("sub").style.display = "block";
  var bodyFormData = new FormData();
  var qh_arr = [];
  var tmp_qh_obj = {};
  for(var i = 0; i < keys["filter"].length; i++)
  {
    var myString = document.getElementById(childrenFilters[keys["filter"][i]].props.egg.concat("_id")).value;
    myString = myString.replace(/(\r\n|\n|\r)/gm, "");
    tmp_qh_obj = {};
    //console.log("bodyFormDataSPLC", ("SPLC".concat(childrenFilters[keys["filter"][i]].props.egg)), myString);
    bodyFormData.append(("SPLC".concat(childrenFilters[keys["filter"][i]].props.egg)), myString);
    tmp_qh_obj["key"] = "SPLC".concat(childrenFilters[keys["filter"][i]].props.egg);
    tmp_qh_obj["val"] = myString;
    qh_arr.push(tmp_qh_obj);
  }
  for(var i = 0; i < keys["single"].length; i++)
  {
    var myString = postoncosig[keys["single"][i]].props.egg;
    myString = myString.replace(/(\r\n|\n|\r)/gm, "");
    tmp_qh_obj = {};
    if(Object.entries(sigTranslate).length > 0)
    {
      if(sigTranslate[myString] != undefined)
      {
        bodyFormData.append(("RPSI".concat(myString)), myString);
        myString = sigTranslate[myString];
        myString = myString.replace("+", "positive_");
      }//TEMPORARY FIX
      else
      {
        //myString = "PSI_".concat(myString);
        myString = myString.replace(" ", "_");
      }
      console.log("Signature added:", myString);
    }
    myString = "PSI".concat(myString);
    tmp_qh_obj["key"] = myString;
    tmp_qh_obj["val"] = myString;
    qh_arr.push(tmp_qh_obj);
    //console.log("bodyFormDataPSI", myString, myString);
    bodyFormData.append(myString, myString);
  }
  for(var i = 0; i < clientgenes.length; i++)
  {
    var myString = clientgenes[i];
    tmp_qh_obj = {};
    myString = "GENE".concat(myString);
    tmp_qh_obj["key"] = myString;
    tmp_qh_obj["val"] = myString;
    qh_arr.push(tmp_qh_obj);
    //console.log("bodyFormDataGene", myString, myString);
    bodyFormData.append(myString, myString);
  }
  for(var i = 0; i < clientcoord.length; i++)
  {
    var myString = clientcoord[i];
    tmp_qh_obj = {};
    myString = "COORD".concat(myString);
    tmp_qh_obj["key"] = myString;
    tmp_qh_obj["val"] = myString;
    qh_arr.push(tmp_qh_obj);
    //console.log("bodyFormDataGene", myString, myString);
    bodyFormData.append(myString, myString);
  }  
  bodyFormData.append("CANCER",curCancer);
  tmp_qh_obj = {};
  tmp_qh_obj["key"] = "CANCER";
  tmp_qh_obj["val"] = curCancer;
  qh_arr.push(tmp_qh_obj);
  var qh_postdata = JSON.stringify(qh_arr)
  bodyFormData.append("HIST",qh_postdata);
  bodyFormData.append("USER",GLOBAL_user);
  //console.log("bodyFormDataCancer", curCancer)
  if(keys["single"].length == 0 && clientgenes.length == 0 && clientcoord.length == 0)
  {
    alert("Please select at least one signature or gene to continue.");
  }
  else
  {
    axios({
      method: "post",
      url: (targeturl.concat("/backend/metarequest.php")),
      data: bodyFormData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(function (response) {
        var dateval = response["data"]["date"];
        var indatatmp = {};
        //indatatmp["obj"] = qh_arr;
        //indatatmp["date"] = dateval;
        //queryhistory_dat.push(indatatmp);
        //addQueryHistory(indatatmp);
        console.log("METAREQUEST response:", response["data"]);
        //response = JSON.parse(response);
        document.getElementById(`simple-tab-1`).click();
        splicingreturned = response["data"]["rr"];
        splicingcols = response["data"]["col_beds"];
        splicingcc = response["data"]["cci"];
        splicingrpsi = response["data"]["rpsi"];
        splicingtrans = response["data"]["oncokey"];
        updateViewPane(splicingreturned, splicingcols, splicingcc, splicingrpsi, splicingtrans);
        document.getElementById("sub").style.display = "none";
        changeUser(GLOBAL_user);
      })
  }
}

function getfields(cancername) {
  //console.log(cancername);
  var bodyFormData = new FormData();
  bodyFormData.append("cancer_type", cancername);
  axios({
    method: "post",
    url: (targeturl.concat("/backend/ui_fields.php")),
    data: bodyFormData,
    headers: { "Content-Type": "multipart/form-data" },
  })
  .then(function (response) {
    // handle success
    //console.log(response);
    keys["filter"] = [];
    keys["single"] = [];
    queueboxchildren = {};
    pre_queueboxchildren = {};
    queueboxsignatures = {};
    pre_queueboxsignatures = {};
    var local_ui_field_dict = response["data"]["meta"];
    var local_ui_field_range = response["data"]["range"];
    var local_sigFilters = response["data"]["sig"];
    sigTranslate = response["data"]["sigtranslate"];
    console.log("ui_fields.php Response", response["data"]);
    ui_field_dict = local_ui_field_dict;
    ui_field_range = local_ui_field_range;
    sigFilters = local_sigFilters;
    var qcancer_rows = (response["data"]["qbox"]["rows"]).toString();
    var qcancer_cols = (response["data"]["qbox"]["columns"]).toString();
    var cmessage = qcancer_rows.concat(" events and ").concat(qcancer_cols).concat(" samples.");
    current_number_of_events = qcancer_rows;
    current_number_of_samples = qcancer_cols;
    curCancer = cancername;
    sendToViewPane["cancer"] = cancername;
    sendToViewPane["ui_field_dict"] = response["data"]["meta"];
    cancerQueueMessage = <QueueMessage key={"c_type_q"} number={0} name={"cancer"} get={0} value={cancername} type={"cancer"} total_selected={cmessage} total_left={cmessage}/>;
    updateFilterBoxSEF(null);
    syncQB([], "filter");
    syncQB([], "single");
    try {
      document.getElementById("SEF_id").value = "";
      updateClientSEF();
      console.log("Schnoogadoo");
    } catch (error) {
      console.error(error);
    }
    updateQueueBox(curCancer, 1, queueboxchildren, queueboxsignatures);
    //console.log(ui_field_dict);
    updateFilterBox(cancername, 1, local_ui_field_dict, local_ui_field_range, local_sigFilters);
    //console.log("Finished");
  })
}

function selectcoord(num){
  var bodyFormData = new FormData();
  sendToViewPane["single"] = [];
  for(var i = 0; i < clientcoord.length; i++)
  {
    bodyFormData.append(("COORD".concat(clientcoord[i])), ("COORD".concat(clientcoord[i])));
    sendToViewPane["single"].push(("Coord: ".concat(clientcoord[i])));
  }
  bodyFormData.append("CANCER",curCancer);
  axios({
    method: "post",
    url: (targeturl.concat("/backend/getcoord.php")),
    data: bodyFormData,
    headers: { "Content-Type": "multipart/form-data" },
  })
    .then(function (response) {
      var totalmatch = response["data"]["single"];
      console.log("1", totalmatch);
      console.log("2", response["data"]);
      updateNumberCoord(num, totalmatch);
  }) 
}

function selectgene(num){
  var bodyFormData = new FormData();
  sendToViewPane["single"] = [];
  for(var i = 0; i < clientgenes.length; i++)
  {
    bodyFormData.append(("GENE".concat(clientgenes[i])), ("GENE".concat(clientgenes[i])));
    sendToViewPane["single"].push(("Gene: ".concat(clientgenes[i])));
  }
  bodyFormData.append("CANCER",curCancer);
  axios({
    method: "post",
    url: (targeturl.concat("/backend/getgene.php")),
    data: bodyFormData,
    headers: { "Content-Type": "multipart/form-data" },
  })
    .then(function (response) {
      var totalmatch = response["data"]["single"];
      console.log("1", totalmatch);
      console.log("2", response["data"]);
      updateNumberGenes(num, totalmatch);
  }) 
}

function DQ_UI_fields(splicingreturned, splicingcols) {
  var bodyFormData = new FormData();
  bodyFormData.append("cancer_type", "LAML");
  axios({
    method: "post",
    url: (targeturl.concat("/backend/ui_fields.php")),
    data: bodyFormData,
    headers: { "Content-Type": "multipart/form-data" },
  })
  .then(function (response) {
    console.log("DQ_UI_fields", response["data"]);
    sendToViewPane["cancer"] = "LAML";
    sendToViewPane["ui_field_dict"] = response["data"]["meta"];
    sendToViewPane["ui_field_range"] = response["data"]["range"];
    updateViewPane(splicingreturned, splicingcols, splicingcc, splicingrpsi, splicingtrans);
    document.getElementById("sub").style.display = "none";
  })
}

function ajaxdq() {
  var bodyFormData = new FormData();
  bodyFormData.append("PSIPsi cbfb gene fusions vs others", "PSIPsi cbfb gene fusions vs others");
  bodyFormData.append("CANCER","LAML");
  document.getElementById("sub").style.display = "block";
  //console.log("RUNNING running");
  axios({
    method: "post",
    url: (targeturl.concat("/backend/metarequest.php")),
    data: bodyFormData,
    headers: { "Content-Type": "multipart/form-data" },
  })
    .then(function (response) {
      //console.log(response);
      //response = JSON.parse(response);
      document.getElementById(`simple-tab-1`).click();
      splicingreturned = response["data"]["rr"];
      splicingcols = response["data"]["col_beds"];
      splicingcc = response["data"]["cci"];
      sendToViewPane["filter"] = [];
      sendToViewPane["cancer"] = "LAML";
      sendToViewPane["single"] = ["Psi cbfb gene fusions vs others"];
      splicingrpsi = response["data"]["rpsi"];
      splicingtrans = response["data"]["oncokey"];
      DQ_UI_fields(splicingreturned, splicingcols);
  })
}