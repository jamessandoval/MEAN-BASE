// Invoke 'strict' JavaScript mode
'use strict';


// function displayChecked(checkedID) {
  
//   var checkBox = document.getElementById(checkedID);  // Get the selected item
//   var parent = document.getElementById(checkedID).parentNode; 
//   var parentClass=checkBox.parentNode.className;
//   var text = parent.textContent; // Get the checkbox's text
//   var paragraph = document.createElement("p");  //create a paragraph
//   var content = document.createTextNode(text);   //create text (for the new paragraph)

//   var checkboxes = new Array();
//   var allBox = document.getElementById("All");
//   var LallBox = document.getElementById("LAll");
//   checkboxes = document.getElementsByTagName('input');

//   console.log(parentClass);

//   //determine where on the page the checked item should be listed
//   if(checkBox.className == "FX double"){
//   	var placement = document.getElementById("pageChildren");
//   }
//   else if(checkBox.className == "case double"){
// 	var placement = document.getElementById("caseChildren");
//   }
//   else if(checkBox.className == "date double"){
// 	var placement = document.getElementById("dateChild");
// 	if (placement.firstChild){
// 		placement.removeChild(placement.firstChild);
// 	}
//   }
//   else if (checkBox.className == "lang double") {
//   	var placement = document.getElementById("langChildren");
//   }

//   // If the checkbox is checked, create a paragraph element and input the checkbox's text
//   if (checkBox.checked == true){ 
// 	if (parentClass =="dates" && document.getElementById("dateChild").hasChildNodes()){//if a radio button for the date was selected, remove any other dates from the display section
// 		document.getElementById("dateChild").innerHTML="";
// 	}
// 	paragraph.appendChild(content);
// 	paragraph.setAttribute('id',checkedID+'x');
// 	placement.appendChild(paragraph);

// 	// if the TEMPLATE ALL button was clicked, remove anything else from the paragraph section and check every feature box
// 	if (checkedID == "All"){			
// 		while (placement.firstChild){
// 			placement.removeChild(placement.firstChild);
// 		}
// 		placement.appendChild(paragraph);
// 		for(var i=0; i<checkboxes.length; i++){
// 			if(checkboxes[i].parentNode.className == "Fx"){
// 				checkboxes[i].checked = true;
// 			}
// 		}		
// 	} else{}


// 	// if the LANGUAGE ALL button was clicked, remove anything else from the paragraph section and check every language box
// 	if (checkedID == "LAll"){             
// 		while (placement.firstChild){
// 			placement.removeChild(placement.firstChild);
// 		}
// 		placement.appendChild(paragraph);
// 		for(var i=0; i<checkboxes.length; i++){
// 			if(checkboxes[i].parentNode.className == "locale"){
// 				checkboxes[i].checked = true;
// 			}
// 		}	
// 	} else{}

	
//   } else { // If you are un-checking the box, you will remove the child paragraph element that had been created.

// 		//If I'm un-checking the PAGE "all" box, uncheck ALL the boxes
// 		if (checkedID == "All"){  
// 			for(var i=0; i<checkboxes.length; i++){
// 				if (checkboxes[i].parentNode.className == "Fx"){
// 					checkboxes[i].checked = false;  // un-check all the boxes 
// 				}
// 			}
// 			var child = document.getElementById(checkedID+'x'); 
// 			child.parentNode.removeChild(child); // and remove "all" under pages selected

// 		//If I'm un-checking the LANGUAGE "all" box, uncheck ALL the boxes
// 		}else if (checkedID == "LAll"){  
// 			for(var i=0; i<checkboxes.length; i++){
// 				if (checkboxes[i].parentNode.className == "locale"){
// 					checkboxes[i].checked = false;  // un-check all the boxes 
// 				}
// 			}
// 			var child = document.getElementById(checkedID+'x'); 
// 			child.parentNode.removeChild(child); // and remove "all" under pages selected
// 		}	

// 		//If I'm un-checking anything other than the "all" boxes
// 		else if (checkedID != "All" && checkedID != "LAll"){ 
// 		console.log("I'm not unchecking an All option");

// 			//If the "all" box HAD been checked for the Feature Page section
// 			if (allBox.checked == true && parentClass == "Fx"){ 
// 			console.log("I've unchecked something when ALL HAD been chosen");
// 				allBox.checked = false;  // un-check the "all" box and remove it from the pages selected section
// 				var allChild = document.getElementById('Allx');
// 				allChild.parentNode.removeChild(allChild);
// 				var eliminator = checkedID;  //note which page you were un-selecting
				
// 				//goes through ALL the F[i] possibilities, and if there was a checkbox for it, but it isn't the ALL or Eliminator (unchecked box) then display a paragraph for that F[i]
// 				for(var i=1; i<26; i++){  
// 					var ID = 'F'+i;
// 					if(document.getElementById(ID)){
// 						var checkBox = document.getElementById(ID);  
// 						console.log(ID);
// 						var parent = document.getElementById(ID).parentNode;
// 						var text = parent.textContent;
// 						var paragraph = document.createElement("p");
// 						var content = document.createTextNode(text);
// 						var placement = document.getElementById("pageChildren");

// 						if (ID != eliminator){
// 							paragraph.appendChild(content);
// 							paragraph.setAttribute('id',"F"+i+'x');
// 							placement.appendChild(paragraph);
// 						}
// 					}
// 				}

// 			//If the "all" box HAD been checked for the Language section
// 			} else if (LallBox.checked == true && parentClass == "locale"){ 
// 			console.log("I've unchecked something in the Lang section when LAll HAD been checked");
// 				LallBox.checked = false;  // un-check the "all" box and remove it from the pages selected section
// 				var allChild = document.getElementById('LAllx');
// 				allChild.parentNode.removeChild(allChild);
// 				var eliminator = checkedID;  //note which page you were un-selecting
				
// 				//goes through all the language possibilities, and if there was a checkbox for it, but it wasn't the ALL or Eliminator, add a paragraph for it
// 				for(var i=1; i<checkboxes.length-1; i++){
// 					if(checkboxes[i].checked && checkboxes[i].parentNode.className == "locale"){
// 						 var text = checkboxes[i].id;
// 						 var paragraph = document.createElement("p");
// 						 var content = document.createTextNode(text);
// 						 var placement = document.getElementById("langChildren");

// 						if (ID != eliminator){
// 							paragraph.appendChild(content);
// 							paragraph.setAttribute('id',checkboxes[i].id+'x');
// 							placement.appendChild(paragraph);
// 						}
// 					}
// 				}
// 			}

// 			// if something other than "all" was un-checked, but "all" had not been checked, just remove the one item from pages selected
// 			else {  
// 			console.log("I've unchecked something when ALL had NOT been selected" );
// 				var child = document.getElementById(checkedID+'x');
// 				child.parentNode.removeChild(child);
// 			}
// 			console.log("the end");
// 		}  //end else if
//     }  //end else
// } //end function displayChecked


function displayChecked(checkedID, parentID, allID, destinationID) {
	console.log("this is the id " + checkedID);
	console.log("this is the parentID " + parentID);
	console.log("this is the All Id "+ allID);
	console.log("this is the destinationID " + destinationID);

	var checkBox = document.getElementById(checkedID);  // Get the selected item
	var parent = document.getElementById(parentID); 
	var parentClass=checkBox.parentNode.parentNode.className;
	var text = parent.textContent; // Get the checkbox's text

	console.log("this is the parent's text " + text);
	var paragraph = document.createElement("p");  //create a paragraph
	var content = document.createTextNode(text);   //create text (for the new paragraph)    
	var checkboxes = new Array();
	var allBox = document.getElementById(allID);
	var checkboxes = document.getElementsByTagName('input');
	var placement = document.getElementById(destinationID);

	console.log("this is the parentClass -----> " +parentClass);

	// If the checkbox is checked, create a paragraph element and input the checkbox's text
	if (checkBox.checked == true){ 
		// if (parentClass =="dates" && document.getElementById("dateChild").hasChildNodes()){//if a radio button for the date was selected, remove any other dates from the display section
		// 	document.getElementById("dateChild").innerHTML="";
		// }
		paragraph.appendChild(content);
		paragraph.setAttribute('id',checkedID+'x');
		placement.appendChild(paragraph);

		// if the ALL button was clicked, remove anything else from the paragraph section and check every box
		if (checkedID == allID){			
			while (placement.firstChild){
				placement.removeChild(placement.firstChild);
			}
			placement.appendChild(paragraph);
			for(var i=0; i<checkboxes.length; i++){
				if(checkboxes[i].parentNode.id == parentID){
					checkboxes[i].checked = true;
				}
			}		
		} else{}

	} else { // If you are un-checking the box, you will remove the child paragraph element that had been created.

			//If I'm un-checking the PAGE "all" box, uncheck ALL the boxes
			if (checkedID == allID){  
				for(var i=0; i<checkboxes.length; i++){
					if (checkboxes[i].parentNode.id == parentID){
						checkboxes[i].checked = false;  // un-check all the boxes 
					}
				}
				var child = document.getElementById(checkedID+'x'); 
				child.parentNode.removeChild(child); // and remove "all" under pages selected
			}	

			//If I'm un-checking anything other than the "all" boxes
			else if (checkedID != allID){ 
			console.log("I'm not unchecking an All option");

				//If the "all" box HAD been checked for the Feature Page section
				if (allBox.checked == true){  // && parentID == parentID                                   <------------------------------------------???
				console.log("I've unchecked something when ALL HAD been chosen");
					allBox.checked = false;  // un-check the "all" box and remove it from the pages selected section
					var allChild = document.getElementById(allID + "x");
					allChild.parentNode.removeChild(allChild);
					var eliminator = checkedID;  //note which page you were un-selecting
					
									
					//goes through all the possibilities, and if there was a checkbox for it, but it wasn't the ALL or Eliminator, add a paragraph for it
					for(var i=1; i<checkboxes.length-1; i++){
						if(checkboxes[i].checked && checkboxes[i].parentNode.id == parentID){
							var text = checkboxes[i].id;
							var paragraph = document.createElement("p");
							var content = document.createTextNode(text);
							var placement = document.getElementById(destinationID);

							if (ID != eliminator){
								paragraph.appendChild(content);
								paragraph.setAttribute('id',checkboxes[i].id+'x');
								placement.appendChild(paragraph);
							}
						}
					}
				}
				// if something other than "all" was un-checked, but "all" had not been checked, just remove the one item from pages selected
				else {  
				console.log("I've unchecked something when ALL had NOT been selected" );
					var child = document.getElementById(checkedID+'x');
					child.parentNode.removeChild(child);
				}
				console.log("the end");
			}  //end else if
		}  //end else



}