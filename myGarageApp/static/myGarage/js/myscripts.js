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


function addNewRow() {		   		
	var tempRow = $("#operations").find('#newRow table').find('tbody:last tr');		   		
	var columnNames = $('.records').find('thead').find("th");
	
	for (i=0; i< columnNames.length; i++) {		   			
		var columnName = $(columnNames[i]).text();		
		var inputName = getNameForTableInput(columnName);
		var newId = "";
		var cssProperty = "";
		var cssValue = "";
	    if(columnName.indexOf("date") > -1) {
	    	newId = "datepicker";
	    	cssProperty = "width";
	    	cssValue = "85%";
	    }	
				   			
		tempRow.append($('<td>')
			   .append($('<input>')		   					
				   .prop('type', 'text')
				   .attr('class', 'tempInput')
				   .css(cssProperty, cssValue)
				   .attr('name', inputName)	
				   .attr('id', newId)));
	}
	
	$("#datepicker").datepicker({
		showOtherMonths: true,
		selectOtherMonths: true,
		altField: "#datepicker",
		altFormat: "dd M. yy",
		showOn: "both",
		buttonText: 'Show Date',
		buttonImageOnly: true,
		buttonImage: "/myGarageApp/static/myGarage/img/calendar.png",
		dateFormat: 'yy-mm-dd',
		constrainInput: true		
	});
	
	
	 $(".ui-datepicker-trigger").mouseover(function() {
        $(this).css('cursor', 'pointer');
    });

	$('#addRecord').attr('disabled', 'disabled');	   		
	diminishMainTableAppearace();		   		  			   		
	$("#operations").find('#newRow').css('display', 'block');	   										
}

function setColumnsWidth() {
	var columnNames = $('.records').find('thead').find("th");
	var widthValue = 100/(columnNames.length) + "%";
	$('.records').find('thead').find("th").css('width', widthValue);
	$('.records').find('tbody').find("td").css('width', widthValue);
	

}


function closeNewRow() {
	restoreMainTableAppearance();		   	
		
	$("#operations").find('#newRow').css('display', 'none');		   		
	$('#tempTable').find('tbody tr').find('td').remove();
	$('#addRecord').removeAttr('disabled');
}
		   
		   
function restoreMainTableAppearance() {
	//restore initial css style
	$('#operations').css('background-color', ' #ffffff');
	$('#operations').removeClass('diminishedBorderShade').addClass("addBorderShade");
	$( "tbody tr:odd" ).css( "background-color", "#F0FFD6" );
	$('.records').find('thead').css('background-color', '#8a9772');
	$('.records').find('th').css('border', '1px solid #8a9772');
	$('.records').find('td').css('border', '1px solid #8a9772');
}		   
		   
function diminishMainTableAppearace() {
	$('#newRow').attr('class', 'addBorderShade');
	$('#operations').removeClass('addBorderShade').addClass("diminishedBorderShade");
	$('#operations').css('background-color', ' #f9fafc'); 	
	$( "#operations").find("tbody tr:odd" ).css( "background-color", "#f9fafc" );	   		
	$('.records').find('thead').css('background-color', '#a4ae91');
	$('.records').find('th').css('border', '1px solid #a4ae91');
	$('.records').find('td').css('border', '1px solid #a4ae91');
}


function getNameForTableInput(columnName) {
	var firstLetter = columnName.charAt(0).toLowerCase();		   		
	var tempName = firstLetter + columnName.substring(1);		   		
	var name = tempName.replace(/ /g,"_");			   			
	return name;   
}
		   
		   
		   
		   

		   
		   





