// Invoke 'strict' JavaScript mode
'use strict';

 function uncheckAll(){ 
      var w = document.getElementsByTagName('input'); 
      for(var i = 0; i < w.length; i++){ 
        if(w[i].type=='checkbox'){ 
          w[i].checked = false; 
        }
      }
  } 



  function loadingAnimation(){
    document.getElementById("loading").style.display = "block";
    document.getElementById("page").style.display = "none";
    // alert("This might take a moment.  Hit OK");
  }


  function loadTester(){
    alert("hello");
    document.getElementById("loading").style.display = "block";
  }