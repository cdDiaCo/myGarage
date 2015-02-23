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
       $(selectedItemDiv).find('.arrow').css("visibility", "visible");
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
  		  	
    $(".pop").popover({ trigger: 'click', html: 'true'});
    $('.validationAlert').filter(':visible:first').focus();	
}


function addNewRow() {
    var columnNames = $('.records').find('thead').find("th");
    $('.records tbody').append($('<tr>'));

    var newRowForm = $('.records tbody').find('tr:last()');

    for (i=0; i< columnNames.length-1; i++) {

        var columnName = $(columnNames[i]).text();
		var inputName = getNameForTableInput(columnName);
		var newClass = "tempInput recordsTextInput ";
		var newId = "";
		var cssProperty = "";
		var cssValue = "";
		var onKeypress = "";
	    if(columnName.indexOf("date") > -1) {
	    	newClass =  newClass + "datepicker ";
	    	cssProperty = "width";
	    	cssValue = "85%";
	    	inputName = inputName + '_userOnly';
	    }
	    else {
	    	newId = "id_" + inputName;
	    	onKeypress = "";
	    }


        //generate the tempFields
        newRowForm.append($('<td>')
                  .append($('<input>')
                       .prop('type', 'text')
                       .addClass(newClass)
                       .css(cssProperty, cssValue)
                       .attr('name', inputName)
                       .attr('id', newId)
                       .attr("onkeypress", onKeypress )
                  ));
    }

    newRowForm.find('td').first().append($('<input>')
               .prop('type', 'hidden')
               .attr('name', 'refuel_date')
               .attr('class', 'altDateField tempInput'));

    // append the option buttons td
     newRowForm.append($('<td>')
                        .append($('.rowOptions').first().find('.saveRowBtn').clone().attr("tabindex",-1)
                                                                .css('outline', 'none')));

    newRowForm.find('.tempInput, .rowOptions').on("focus", function(){
        unmarkPreviousSelectedRow(true);
        markSelectedRow($('.records tbody').find('tr:last()'));
    });

    $('.tempInput:first()').focus();


     // for every tempField bind the appropriate validation
     $('.tempInput ').not(".datepicker").each(function(index, element) {
     		var elementID = $(element).attr('id');
     		if( digitsOnlyValidationArray.indexOf(elementID) > -1) {
					$('#' + elementID).keyup(digitsOnlyValidation);
			}
			//else if in stringOnlyValidationArray etc

     });

    $('#addRecord').attr('disabled', 'disabled');

}

function addNewRow2() {
	var tempRow = $('#newRow table').find('tbody:last tr');
	var columnNames = $('.records').find('thead').find("th");
	
	for (i=0; i< columnNames.length-1; i++) {	
		// exclude the last column - the one with the check boxes	   			
		var columnName = $(columnNames[i]).text();		
		var inputName = getNameForTableInput(columnName);
		var newId = "id_";
		var cssProperty = "";
		var cssValue = "";
	    if(columnName.indexOf("date") > -1) {
	    	newId = newId + "datepicker";	    	
	    	cssProperty = "width";
	    	cssValue = "85%";
	    	inputName = inputName + '_userOnly';
	    }	
	    else {
	    	newId = newId + "" + inputName;
	    }
				
		//generate the tempFields		   			
		tempRow.append($('<td>')
			   .append($('<input>')		   					
				   .prop('type', 'text')
				   .attr('class', 'tempInput')
				   .css(cssProperty, cssValue)
				   .attr('name', inputName)
				   .attr('id', newId)));  
				   
	}
	
	tempRow.find('td').first().append($('<input>')		   					
				   .prop('type', 'hidden')			   
				   .attr('name', 'refuel_date')
				   .attr('id', 'altDateField'));
	
	$(".datepicker").datepicker({
		showOtherMonths: true,
		selectOtherMonths: true,
		dateFormat: 'dd M. yy',
		altField: "#altDateField",
		altFormat: "yy-mm-dd",
		showOn: "both",
		buttonText: 'Show Date',
		buttonImageOnly: true,
		buttonImage: "/myGarageApp/static/myGarage/img/calendar.png"						
	});
	
	
	 $(".ui-datepicker-trigger").mouseover(function() {
        $(this).css('cursor', 'pointer');
    });
    
    // for every tempField bind the appropriate validation 
     $('.tempInput ').not(".datepicker").each(function(index, element) {
     		var elementID = $(element).attr('id');     		    		
     		if( digitsOnlyValidationArray.indexOf(elementID) > -1) {     								
					$('#' + elementID).keyup(digitsOnlyValidation);					
			}	
			//else if in stringOnlyValidationArray etc			
		   								
     });         

	$('#addRecord').attr('disabled', 'disabled');	
	$('.buttonsAltText').attr('class', 'buttonsAltTextDisabled');   		

	$('#newRow').css('display', 'block');
}

function showValidationTip(elementID) {
    $('#' + elementID + '_tip').css('visibility', 'visible');
    var position = $('#' + elementID).position();
    $('#' + elementID + '_tip').css('left', (position.left + 20) + 'px');
    $('#' + elementID + '_tip' ).css('top', (position.top - 30) + 'px');
}

function closeValidationTip(elem) {
    $(elem).css('visibility', 'hidden');
}

function digitsOnlyValidation() { 	      
	var inputValue = $(this).val();	
	var elementID = $(this).attr('id');
	var isnum = /^\d+\.?\d*$/.test(inputValue);
	if (inputValue === "") {
		isnum = true;
	}	
	addObjToValidationsArray(validationsArray, elementID, isnum, 'digitsOnly');		
	var falseDigitsOnlyArray = validateTempFieldsByType('digitsOnly');	
	
	if(!isnum ) {	
		var name =  getNameFromId(elementID);			
		$('#' + elementID + '_tip').text('Only numbers allowed !');
		$('#' + elementID).css('outline', '1px solid #bd4a48');
		showValidationTip(elementID);
	} 				
	else {		
		$('#' + elementID + '_tip').text('');
		$('#' + elementID).css('outline', '');
		closeValidationTip('#' + elementID + '_tip');
			
		if(falseDigitsOnlyArray.length > 0) {			
			var lastElem = falseDigitsOnlyArray[falseDigitsOnlyArray.length-1];
			var name = getNameFromId(lastElem);
			$('#' + elementID + '_tip').text('Only numbers allowed !');
			//showValidationTip(elementID);
		} 				
	}  	
}

function getNameFromId(id) {
	var firstOccurrenceOfUnderline = id.indexOf('_');
	var name = id.substring(firstOccurrenceOfUnderline+1);
	name = name.replace("_"," ");
	name = name.charAt(0).toUpperCase() + name.slice(1);
	return name;
}


function addObjToValidationsArray(array, property, value, validationType) {	
	// if id already exists replace it's value
	// otherwise add new obj
	
	var i, object = {};
	for (i = 0; i < array.length; i++) { 	  	
    	if(array[i].hasOwnProperty(property)){    		
    		 array[i][property] = value; 
    		 return;   		 
    	}     	  	
    }	
    object[property] = value;
    object['validationTypeKey'] =  validationType;
    array.push(object);         
}


function setColumnsWidth() {
	var columnNames = $('.records').find('thead').find("th");
	var widthValue = 100/columnNames.length;
	var checkBoxColumnWidth = 1/3 * widthValue + "%";
	widthValue = 2/3 * widthValue + (columnNames.length-1) * widthValue;
	widthValue = widthValue/(columnNames.length-1) + "%";
	
	$('.records').find('thead').find("th:not(:last)").css('width', widthValue);
	$('.records').find('tbody').find("td:not(:last)").css('width', widthValue);
	
	$('.records').find('thead').find("th").last().css('width', checkBoxColumnWidth);
	$('.records').find('tbody').find("td").last().css('width', checkBoxColumnWidth);

	

}


function getNameForTableInput(columnName) {
	var firstLetter = columnName.charAt(0).toLowerCase();		   		
	var tempName = firstLetter + columnName.substring(1);		   		
	var name = tempName.replace(/ /g,"_");			   			
	return name;   
}
		   

 function validateTempFields(){			   		   			   		
	//check validationsArray if it has a false value in it		
	// also check for empty fields   	
	var validFields = true;		
		   					   					        	
	for (var i=0; i<validationsArray.length; i++) {	
		for (var key in validationsArray[i]) {	
			   if (key === "validationTypeKey") {	
			   		continue;
			   }				   
			   else if(!validationsArray[i][key]){			   													
			   		return false;						   										  							 
			   }
		}				
	}
	
	// check for empty fields
	var fields = $('#selectedRow').children().not('td:first, td:last').children();

	fields.each(function(index, element) {
		var elemValue = $(element).val();
		console.log(element);
		if (elemValue === "") {
			$('.addNewRecordTip').text('All fields are required!');
			validFields = false;

		}
	});			
	
	if(validFields) {return true;}		
	else {alert('All fields are required!'); return false;}
}			   
		   
function validateTempFieldsByID(id) {
	//returns boolean 
	//checks if elementId is valid or not
	
	for (var i=0; i<validationsArray.length; i++) {	
		for (var key in validationsArray[i]) {
			   if (key === "validationTypeKey") {	
			   		continue;
			   }							   
			   else if(!validationsArray[i][key] && key === id){										
					return false;								  							 
			   }
		}				
	}
	return true;			
} 
		   
function validateTempFieldsByType(validationTypeArg) {
	// returns an array containing the elements' id with false status		   			
    var idsArray = []; 	
    var status = true;	
    var elementID = "";		   	    
		
	for (var i=0; i<validationsArray.length; i++) {	
	    status = true;
		for (var key in validationsArray[i]) {
			   if (key === "validationTypeKey") {
			   		 if(!status && validationsArray[i]['validationTypeKey'] === validationTypeArg) {
			   		 	idsArray.push(elementID);
			   		 }
			   }		  
			   else if(!validationsArray[i][key]){										
					status = false;		
					elementID = key;						  								  
			   }
		}				
	}
	return idsArray;			
}		   



function initializeSlideShow() {
	var currentPosition = 0;
	var slideWidth = 550;
	var slides = $('.slide');
	var numberOfSlides = slides.length;
	var slideShowInterval;
	var speed = 4000;		
	
	slideShowInterval = setInterval(changePosition, speed);				
	slides.wrapAll('<div id="slidesHolder"></div>');				
	slides.css({ 'float' : 'left' });		
	$('#slidesHolder').css('width', slideWidth * numberOfSlides);
	manageNav(currentPosition);	
	


	$('.nav').bind('click', function() {
				
		//determine new position
		currentPosition = ($(this).attr('id')=='rightNav') ? currentPosition+1 : currentPosition-1;
									
		//hide/show controls
		manageNav(currentPosition);
		clearInterval(slideShowInterval);
		slideShowInterval = setInterval(changePosition, speed);
		moveSlide();
	});
	
	function changePosition() {
		if(currentPosition == numberOfSlides - 1) {
			currentPosition = 0;
			manageNav(currentPosition);
		} else {
			currentPosition++;
			manageNav(currentPosition);
		}
		moveSlide();
	}
	
	function moveSlide() {						
			$('#slidesHolder')
	  			.animate({'marginLeft' : slideWidth*(-currentPosition)});						  						
	}
	
	function manageNav(position) {
		//hide left arrow if position is first slide
		if(position==0){ $('#leftNav').hide() }
		else { $('#leftNav').show() }
		//hide right arrow is slide position is last slide
		if(position==numberOfSlides-1){ $('#rightNav').hide() }
		else { $('#rightNav').show() }
	} 
				

}


