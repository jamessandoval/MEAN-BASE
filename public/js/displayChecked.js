// Invoke 'strict' JavaScript mode
'use strict';

function displayChecked(checkedID) {
  
  var checkBox = document.getElementById(checkedID);  // Get the checkbox
  var parent = document.getElementById(checkedID).parentNode;
  var parentId=checkBox.parentNode.id;
  //var parent2 = document.getElementById(checkedID).parentNode;  
  var text = parent.textContent; // Get the checkbox's text
 // var text2 = parent.textContent; // Get the checkbox's text
  //console.log(text);
  var paragraph = document.createElement("p");
  //var paragraph2 = document.createElement("p");
  var content = document.createTextNode(text);
  //var content2 = document.createTextNode(text);

  if(checkBox.className == "FX double"){
  	var placement = document.getElementById("pageChildren");
  }
  else {
  	var placement = document.getElementById("langChildren");
  	//var placement2 = document.getElementById("langChildren2");
  }

  var checkboxes = new Array();
  var allBox = document.getElementById("all");
  checkboxes = document.getElementsByTagName('input');
  //console.log(checkboxes);
  
  if (checkBox.checked == true){  // If the checkbox is checked, create a paragraph element and input the checkbox's text
    paragraph.appendChild(content);
	//paragraph2.appendChild(content2);
	paragraph.setAttribute('id',checkedID+'x');
	//paragraph2.setAttribute('id',checkedID+'x');
	placement.appendChild(paragraph);
	//placement2.appendChild(paragraph2);
	
	if (checkedID == "all"){
		while (placement.firstChild){
			placement.removeChild(placement.firstChild);
		}
	//	while (placement2.firstChild){
	//		placement2.removeChild(placement2.firstChild);
	//	}
		//placement2.appendChild(paragraph);
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
				if (checkboxes[i].parentNode.id != "lang"){
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
						//var placement2 = document.getElementById("pageChildren2");
						if (ID != eliminator){
							paragraph.appendChild(content);
							paragraph.setAttribute('id',"F"+i+'x');
							placement.appendChild(paragraph);
							//placement2 = document.getElementById("pageChildren2");
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