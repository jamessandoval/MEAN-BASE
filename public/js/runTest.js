// Invoke 'strict' JavaScript mode
'use strict';

function runTest() {

  alert("test is running.");

  var arrayOfObjects = new Array();

  var checkboxes1 = document.getElementsByClassName('FX');

  //console.log(checkboxes1.length);

  var checkboxes2 = document.getElementsByClassName('lang');

  //console.log(checkboxes2[0].id);


  for (var i = 0; i < checkboxes1.length; i++) {

    if (checkboxes1[i].checked == true) {
      var theId = checkboxes1[i].id;

      for (var x = 0; x < checkboxes2.length; x++) {

        if (checkboxes2[x].checked == true) {
          var theLocale = checkboxes2[x].id;

          var obj = { "name": theId, "locale": theLocale };
          //console.log(obj);
          arrayOfObjects.push(obj);
        }
      }
    }
  }
  //console.log(arrayOfObjects);
  var finalObject = { "features": arrayOfObjects };
  var myJSON = JSON.stringify(finalObject);
  //document.getElementById("jsonStuff").innerHTML = myJSON;


  /*$.ajax({
        url: 'http://localhost:3000/result',
        type: 'POST',
        data: {json: myJSON},
        contentType: "application/json",
        error: function(data){
          console.log(data);
        },
        success: function(data){
          console.log(data);
        }

    });
   //dataType: 'json'
  */

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("POST", "/export", true);
  xmlhttp.setRequestHeader("Content-type", "application/json");

  try {
    xmlhttp.send(myJSON);
  } catch (err) {
    console.log("AJAX error: " + err);
  }

  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      console.log(xmlhttp);
      window.location = xmlhttp.responseURL;
    }
  }
}

function exportLanguageSet() {

  alert("Results have been exported to QA Folder.");

  var arrayOfObjects = new Array();

  var checkboxes2 = document.getElementsByClassName('lang');

  for (var x = 0; x < checkboxes2.length; x++) {

    if (checkboxes2[x].checked == true) {
      var theLocale = checkboxes2[x].id;

      var obj = { "name": "all", "locale": theLocale };
      arrayOfObjects.push(obj);
    }
  }

  var finalObject = { "features": arrayOfObjects };
  var myJSON = JSON.stringify(finalObject);

  // Send data to server
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("POST", "/export", true);
  xmlhttp.setRequestHeader("Content-type", "application/json");

  try {
    xmlhttp.send(myJSON);
  } catch (err) {
    console.log("AJAX error: " + err);
  }

  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      console.log(xmlhttp);
    }
  }
}

function exportAll() {

  alert("Results have been exported to QA Folder.");

  var arrayOfObjects = new Array();

  var obj = { "name": "all", "locale": "all" };
  arrayOfObjects.push(obj);

  var finalObject = { "features": arrayOfObjects };
  var myJSON = JSON.stringify(finalObject);

  // Send data to server
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("POST", "/export", true);
  xmlhttp.setRequestHeader("Content-type", "application/json");

  try {
    xmlhttp.send(myJSON);
  } catch (err) {
    console.log("AJAX error: " + err);
  }

  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      console.log(xmlhttp);
    }
  }

}

function exportSelections(){

  let template = '';
  let language = ''; 
  let testresult=""; 
  let query = ""; 
  let thehref="";

  let TchildCount= document.getElementById("pageChildren").children.length;
  let LchildCount= document.getElementById("langChildren").children.length;

  template = document.getElementById("pageChildren").children[0].id; // this takes the first child and puts it in 'template'
  template = template.slice(0,-1);

  for (var x=1; x < TchildCount; x++){  // if there are additional children, we add a comma and the feature page for each child
    let t = document.getElementById("pageChildren").children[x].id; 
    t=t.slice(0,-1);
    template=template + "," + t;
  }
  
  
  language = document.getElementById("langChildren").children[0].id; // this takes the first language child and puts it in 'language'
  language = language.slice(0,-1);

  for (var y=1; y < LchildCount; y++){  // if additional languages were chosen, we add a comma and the language for each one selected
    let l = document.getElementById("langChildren").children[y].id; 
    l=l.slice(0,-1);
    language =language + "," + l;
  }
  

  //the href will contain a list of each languages as 'en-us,de-de' and features will be 'f1,f3,f5' 
  // in the getExportFromResults() function on 'api_export.js' these commas are watched for, so that the string can be split to an array and a query created for all the selections

  thehref="/export?feature="+ template + "&language=" + language + "&testresult=" + testresult + "&query=" + query;
  document.getElementById("myhref").href=thehref;
}