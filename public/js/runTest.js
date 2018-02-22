// Invoke 'strict' JavaScript mode
'use strict';

function runTest() {

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
      window.location = xmlhttp.responseURL;
    }
  }
}
