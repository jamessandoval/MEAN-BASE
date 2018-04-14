// Invoke 'strict' JavaScript mode
'use strict';

// These functions are being used on the test-case-editor page -------------------------

function showIt(ID){
    var p = document.getElementById("gherkin");
    var text =document.getElementById("tcSelection").value;
    p.innerHTML = text;
    
    var p2=document.getElementById("selectedID");
    var input =ID[ID.selectedIndex].id;
    p2.innerHTML = input;
}

function editTc(){

    var hidden=document.getElementById("hiddenRow");
    hidden.setAttribute("style", "display:visible");
            
    var placement1= document.getElementById("theID");
    var ID=document.getElementById("selectedID").innerHTML; //grab the TestCaseID from the hidden paragraph above
    placement1.innerHTML=ID;

    var placement2= document.getElementById("theScenario");  //get the location under the "Scenario" heading
    var content2 = document.getElementById("gherkin").innerHTML;
    if(content2.indexOf('Then') > -1){
        content2=content2.substring(0, content2.indexOf('Then'));
    }
    if(content2.indexOf('When') > -1){
        content2=content2.substring(0, content2.indexOf('When'));
    }
    placement2.innerHTML = content2;

    var placement3= document.getElementById("theGherkin");
    var content3=document.getElementById("tcSelection").value;
    content3= content3.replace(content2,''); //this gets rid of the Scenario so that content3 only contains Gherkin 
    content3=content3.replace("@javascript",''); //this gets rid of the '@javascript' that is in some of these Gherkin strings
    content3=content3.replace(/\n/,''); 
    placement3.innerHTML=content3;
    // getLive(content1);

    var buttons = document.getElementsByClassName("x");

     for (var q=0; q<buttons.length; q++){
        buttons[q].setAttribute("class", "btn btn-light locale-button x");
    }

    var string = '"';
    for (var x=0; x<buttons.length; x++){
        var buttonData = buttons[x].value;
        buttonData = buttonData.split(",");

        if (buttonData.indexOf(ID.toString(),0) > -1){
            buttons[x].setAttribute("class", "btn btn-warning locale-button x");
        }
    }

    
}

function classSwitch(thisOne){
    var currentID = thisOne.getAttribute("id");
    var currentClass = thisOne.getAttribute("class").toString();
    if (currentClass.indexOf("btn-warning") > -1){
        thisOne.setAttribute("class", "btn locale-button x btn-danger");
    } else if (currentClass.indexOf("btn-danger") > -1) {
        thisOne.setAttribute("class", "btn locale-button x btn-warning");
    }else if (currentClass.indexOf("btn-light") > -1) {
        thisOne.setAttribute("class", "btn locale-button x btn-success");
    }else if (currentClass.indexOf("btn-success") > -1) {
        thisOne.setAttribute("class", "btn locale-button x btn-light");
    }

}

function createTc(){
    var hidden=document.getElementById("hiddenRow");
    hidden.setAttribute("style", "display:visible");
}

function filterFunction() {
    var input, filter, ul, li, a, i;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    div = document.getElementById("tcSelection");
    a = div.getElementsByTagName("option");
    for (i = 0; i < a.length; i++) {
        if (a[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
        a[i].style.display = "";
        } else {
        a[i].style.display = "none";
        }
    }
}



function exportGherkin() {

    // console.log("exporting.");
    var arrayOfObjects = new Array();
    var theCaseID = document.getElementById("theID").innerHTML;
    // console.log(theCaseID + "  ----   This is the ID -----");
    var newScenario = document.getElementById("theScenario").value;
    // console.log(newScenario + "  ------   This is the Scenario ---");
    var newGherkin = document.getElementById("theGherkin").value;
    // console.log(newGherkin + "------  the Gherkin -----");
    var newPagesArray=[];
    var removePagesArray = [];

    var newPages = document.getElementsByClassName("btn locale-button x btn-success");        
    for (var x=0; x<newPages.length;x++){
        newPagesArray[x] = newPages[x].innerHTML;
        newPagesArray[x]=newPagesArray[x].replace(/^[^f]*/, '');
        newPagesArray[x]=newPagesArray[x].replace(/[^\d+]+$/, '');
    }

    var removals = document.getElementsByClassName("btn locale-button x btn-danger");
    for (var q=0; q < removals.length; q++){
        removePagesArray[q] = removals[q].innerHTML;
        removePagesArray[q]=removePagesArray[q].replace(/^[^f]*/, '');
        removePagesArray[q]=removePagesArray[q].replace(/[^\d+]+$/, '');
    }

    var objBunnyEars = { //  for James and Aron  :P
        "theID": theCaseID, 
        "theScenario": newScenario, 
        "theGherkin": newGherkin, 
        "newPages": newPagesArray,
        "removals": removePagesArray
    };

    arrayOfObjects.push(objBunnyEars);
    // console.log(arrayOfObjects);
    // console.log(objBunnyEars.newPages[1] + "-----------this is a page that was selected to be added to ----------");

    let finalObject = JSON.stringify(arrayOfObjects);
  
    // console.log(finalObject + "-----------this is the final object ------------");
  
    $.ajax({
      url: 'http://localhost:3000/post-gherkin',
      type: 'POST',
      data: finalObject,
      contentType: "application/json",
      error: function(data) {
        console.log(data + "------------ it didn't work -----------------");
      },
      success: function(data) {
        console.log(data);
        console.log("I am great success.");
      }
    })
  
  };