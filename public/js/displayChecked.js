// Invoke 'strict' JavaScript mode
'use strict';

function displayChecked(checkedID) {
  
  var checkBox = document.getElementById(checkedID);  // Get the checkbox
  var parent = document.getElementById(checkedID).parentNode;
  var parentId=checkBox.parentNode.id;
  var text = parent.textContent; // Get the checkbox's text
  var paragraph = document.createElement("p");
  var content = document.createTextNode(text);

  if(checkBox.className == "FX double"){
  	var placement = document.getElementById("pageChildren");
  }
  else if(checkBox.className == "case double"){
	var placement = document.getElementById("caseChildren");
  }
  else if(checkBox.className == "date double"){
	var placement = document.getElementById("dateChildren");
  }
  else{
  	var placement = document.getElementById("langChildren");
  }

  var checkboxes = new Array();
  var allBox = document.getElementById("all");
  checkboxes = document.getElementsByTagName('input');

  
  if (checkBox.checked == true){  // If the checkbox is checked, create a paragraph element and input the checkbox's text
	if (parentId =="dates" && document.getElementById("dateChildren").hasChildNodes()){//if a radio button for the date was selected, remove any other dates from the display section
		document.getElementById("dateChildren").innerHTML="";
	}
	paragraph.appendChild(content);
	paragraph.setAttribute('id',checkedID+'x');
	placement.appendChild(paragraph);

	if (checkedID == "all"){
		while (placement.firstChild){
			placement.removeChild(placement.firstChild);
		}
		placement.appendChild(paragraph);
		for(var i=0; i<checkboxes.length; i++){
			if(checkboxes[i].parentNode.id == "Fx"){
				checkboxes[i].checked = true;
			}
		}		
	} else{}
	
  } else { // If you are un-checking the box, you will remove the child element that had been created.
		if (checkedID == "all"){  //If I'm un-checking the "all" box
			for(var i=0; i<checkboxes.length; i++){
				if (checkboxes[i].parentNode.id == "Fx"){
					checkboxes[i].checked = false;  // un-check all the boxes 
				}
			}
			var child = document.getElementById(checkedID+'x'); // and add "all" under pages selected
			child.parentNode.removeChild(child);
		}			
		else if (checkedID != "all"){  //If I'm un-checking anything but the "all" box
			if (allBox.checked == true && parentId == "Fx"){ //If the "all" box HAD been checked
				allBox.checked = false;  // un-check the "all" box and remove it from the pages selected section
				var allChild = document.getElementById('allx');
				allChild.parentNode.removeChild(allChild);
				var eliminator = checkedID;  //note which page you were un-selecting
				
				for(var i=1; i<checkboxes.length-1; i++){
					var ID = 'F'+i;
					if(document.getElementById(ID)){
						var checkBox = document.getElementById(ID);  
						console.log(ID);
						var parent = document.getElementById(ID).parentNode;
						var text = parent.textContent;
						var paragraph = document.createElement("p");
						var content = document.createTextNode(text);
						var placement = document.getElementById("pageChildren");

						if (ID != eliminator){
							paragraph.appendChild(content);
							paragraph.setAttribute('id',"F"+i+'x');
							placement.appendChild(paragraph);
						}
					}
				}
			}
			else {  // if something other than "all" was un-checked, but "all" had not been checked, just remove the one item from pages selected
				var child = document.getElementById(checkedID+'x');
				child.parentNode.removeChild(child);
			}
		}  //end else if
    }  //end else
} //end function displayChecked