function loadXMLDoc() {
	var xmlhttp;
	if (window.XMLHttpRequest) {
	  // code for IE7+, Firefox, Chrome, Opera, Safari
	  xmlhttp=new XMLHttpRequest();
	}
	else {
	  // code for IE6, IE5
	  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange=function() {
	  if (xmlhttp.readyState==4 && xmlhttp.status==200) {
	    document.getElementById("secDiv").innerHTML="The selected car is ";
	    document.getElementById("myDiv").innerHTML=xmlhttp.responseText;		    
	  }
	}
	var e = document.getElementById("selectedCar"); 
	var strCar = e.options[e.selectedIndex].value; 
	//alert(strCar);
	xmlhttp.open("GET","/garage/" + strCar,true);
	xmlhttp.send();
}


function setItemMenuActive(hrefValue) {
	if(window.location.href.indexOf(hrefValue) > -1) {			       
       var selectedItemDiv = $('.imgListItemBinding').has('a[href="/'+hrefValue+'/"]');			       
       $(selectedItemDiv).attr('id', 'active');
       $(selectedItemDiv).find('#arrow').css("visibility", "visible");			       
       $(selectedItemDiv).prev().find('li a').css( "border-bottom", "none" );
       
       addOrangeImages();			       
    }		   
}
		   
function addOrangeImages() {		    
	var initialSrc = $('#active').find('img').attr('src');	   		
	var n = initialSrc.lastIndexOf("/");
	var shortPath = initialSrc.substring(n+1);	   		
	var newShortPath = "orange_" + shortPath;
	var newSrc = initialSrc.substring(0, n+1) + newShortPath;
	//alert(newSrc);	   		
	$('#active').find('img').attr('src', newSrc);	   		
}	  
	   

function removeValidationAlert(x) {				
	$(x).removeClass('validationAlert'); 
	$(x).addClass('noValidationAlert'); 
}		

function addValidation() {
	var elements = document.getElementsByClassName('pop');		  
    var index;
    for (index = 0; index < elements.length; ++index) {
  	  if (elements[index].getAttribute("data-content")){
  	      elements[index].className = elements[index].className.replace( /(?:^|\s)noValidationAlert(?!\S)/g , '' )
  		  elements[index].className += " validationAlert";		  				  		
  	  }		  	
    }		  
  		  	
    $(".pop").popover({ trigger: 'focus', html: 'true'});		  
    $('.validationAlert').filter(':visible:first').focus();	
}


