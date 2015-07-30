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
    //alert("in set active");
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
	var m = initialSrc.lastIndexOf(".");
	var shortPath = initialSrc.substring(n+1, m);
	var newShortPath = "orange_" + shortPath + ".gif";
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
    //if the car has no records, remove the no records message and add a new row
    $('.records tbody').find('.noRecords').remove();
    $('.records tbody').append($('<tr>'));

    //get the table's column names and use them later to name the newly generated input fields
    var columnNames = $('.records').find('thead').find("th");
    var newRowForm = $('.records tbody').find('tr:last()');

    for (i=0; i< columnNames.length-1; i++) {
        var columnName = $(columnNames[i]).text();
		var inputName = getNameForTableInput(columnName);
		var newClass = "tempInput recordsTextInput ";
		var newId = "";
		var cssProperty = "";
		var cssValue = "";

	    if(columnName.indexOf("date") > -1) {
	        //this is the case for date column
	        newClass = newClass + " datepicker ";
	    	newId = "id_datepicker";
	    	cssProperty = "width";
	    	cssValue = "85%";
	    	inputName = "datepicker";
	    }
	    else {
	    	newId = "id_" + inputName;
	    }


        if(columnName == "Itp") {
            //this is a special case because itp field needs select list instead of input text
            newRowForm.append($('<td>')
                  .append($('<select>')
                       .append($("<option>")
                            .attr('value', 'yes').text('yes'))
                       .append($("<option>")
                            .attr('value', 'no').text('no'))
                       .addClass(newClass+' selectList')
                       .attr('name', inputName)
                       .attr('id', newId)
                  )
                  .css('width', '80px'));
        }
        else {
            //generate the rest of the fields
            newRowForm.append($('<td>')
                      .append($('<input>')
                           .prop('type', 'text')
                           .addClass(newClass)
                           .css(cssProperty, cssValue)
                           .attr('name', inputName)
                           .attr('id', newId)
                      ));
        }
    } //end for

    // add the hidden input of date that gets sent to server in the correct format
    newRowForm.find('td').first().append($('<input>')
               .prop('type', 'hidden')
               .attr('class', 'tempInput altDateField'));


    // add the save btn for the new row
    newRowForm.append($('<td>').append($('<div>')
                                .addClass('rowOptions')
                                    .append($('<input>')
                                        .prop('type', 'button')
                                        .addClass('saveRowBtn')
                                        .css('outline', 'none')
                                        //.attr("tabindex",-1)
                                        .on( "click", function() {
                                            saveRowFunction(event);
                                        })
                                    )
                                ));

    // the focus event is usually applicable to a limited set of elements, such as form elements (<input>, <select>, etc.)
    newRowForm.find("input").on("focus", function() {
        unmarkPreviousSelectedRow(true);
        markSelectedRow(newRowForm);
    });

    newRowForm.on("click", function() {
        unmarkPreviousSelectedRow(true);
        markSelectedRow(newRowForm);
    });

    // bear in mind that the new row is added at the bottom of the table
    // so we need to automatically scroll down the table to it
    newRowForm.find("input").focus();


     // for every field of the new row bind the appropriate validation
     //exeption does the date field and the select list field
     $('.tempInput ').not(".datepicker, .selectList").each(function(index, element) {
     		var elementID = $(element).attr('id');
     		if( digitsOnlyValidationArray.indexOf(elementID) > -1) {
					$('#' + elementID).keyup(digitsOnlyValidation);
			}
			else if(lettersOnlyValidationArray.indexOf(elementID) > -1) {
			        $('#' + elementID).keyup(lettersOnlyValidation);
			}
     });

    $('#addRecord').attr('disabled', 'disabled'); // temporarily disable the "Add new row" button

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


function lettersOnlyValidation() {
    var inputValue = $(this).val();
	var elementID = $(this).attr('id');
	var isString = /^[a-zA-Z\s]*$/.test(inputValue);
	if (inputValue === "") {
		isString = true;
	}

	addObjToValidationsArray(validationsArray, elementID, isString, 'lettersOnly');
	var falseLettersOnlyArray = validateTempFieldsByType('lettersOnly');

	if(!isString ) {
		var name =  getNameFromId(elementID);
		$('#' + elementID + '_tip').text('Only letters allowed !');
		$('#' + elementID).css('outline', '1px solid #bd4a48');
		showValidationTip(elementID);
	}
	else {
		$('#' + elementID + '_tip').text('');
		$('#' + elementID).css('outline', '');
		closeValidationTip('#' + elementID + '_tip');

		if(falseLettersOnlyArray.length > 0) {
			var lastElem = falseLettersOnlyArray[falseLettersOnlyArray.length-1];
			var name = getNameFromId(lastElem);
			$('#' + elementID + '_tip').text('Only letters allowed !');
		}
	}

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
	var fields = $('#selectedRow').children().not('td:last').children().not('.ui-datepicker-trigger, .altDateField');

	fields.each(function(index, element) {
		var elemValue = $(element).val();
		//console.log(element);
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


function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

//when row is selected show the trash, save and date icons
//the input boxes from the selected row have ids
function selectRow() {
    var rows = $('tbody tr');
    rows.on('click', function(e){
        var row = $(this);
        var columns = $(this).find('td:not(:last)');

        for(var i=0; i<columns.length; i++){
            $(columns[i]).find('input').removeAttr('readonly');
        }

        unmarkPreviousSelectedRow();
        markSelectedRow(row);

    });

    $(document).bind('selectstart dragstart', function(e) {
        e.preventDefault(); return false;
    });
}

function unmarkPreviousSelectedRow(tempRow) {
    rows = $('.records tbody').find('tr');
    rows.each(function(index, element) {
        $(element).removeAttr('id');
    });
    rows.find('.deleteRowBtn').css('visibility', 'hidden');
    rows.find('.saveRowBtn').css('visibility', 'hidden');

/*
    if(tempRow) {
        rows.find('td').children().not('.tempInput').each(function(index, element) {
            $(element).attr('id', '');
        });
    }else {
    */
        rows.find('td').children().each(function(index, element) {
            $(element).attr('id', '');
        });
    //}
    $('.ui-datepicker-trigger').css('visibility', 'hidden');
}

function markSelectedRow(row) {
    row.attr('id', 'selectedRow');
    row.find('.deleteRowBtn').css('visibility', 'visible');
    row.find('.saveRowBtn').css('visibility', 'visible');

    var urlPath = window.location.pathname;
    var name = "";
    switch (urlPath) {
        case "/refuellings/":
            name = "refuel_date";
            break;
        case "/cleanings/":
            name = "cleaning_date";
            break;
        case "/service/":
            name = "service_date";
            break;
        case "/revisions/":
            name = "revision_date";
            break;
    }

    $('#selectedRow .altDateField').attr('name', name);

    row.find('td:not(:last())').children().not('.ui-datepicker-trigger')
                                                .each(function(index, element) {
                                                    var elemName = $(element).attr('name');
                                                    var elemID = "id_" + elemName;
                                                    //console.log(elemID);
                                                    $(element).attr('id', elemID);

                                                    if( digitsOnlyValidationArray.indexOf(elemID) > -1) {
                                                            $('#' + elemID).keyup(digitsOnlyValidation);
                                                    }
                                                    else if(lettersOnlyValidationArray.indexOf(elemID) > -1) {
                                                            $('#' + elemID).keyup(lettersOnlyValidation);
                                                    }

                                                });
    var altFieldID = $('#selectedRow .altDateField').attr('id');
    //console.log(altFieldID);

    $('#selectedRow').find("#id_datepicker").datepicker({
        setDate: new Date(),
        showOtherMonths: true,
        selectOtherMonths: true,
        dateFormat: 'dd M. yy',
        altField: "#"+altFieldID,
        altFormat: "yy-mm-dd",
        showOn: "button",
        buttonText: 'Show Date',
        buttonImageOnly: true,
        buttonImage: "/myGarageApp/static/myGarage/img/calendar.png"
    });

    $(".ui-datepicker-trigger").mouseover(function() {
        $(this).css('cursor', 'pointer');
    });

    $('#selectedRow').find('.ui-datepicker-trigger').css('visibility', 'visible');

}


function deleteRowFunction(e) {
    e.stopPropagation();

    var urlPath = window.location.pathname;

    var csrftoken = getCookie('csrftoken');
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    });

    recordIDValue = $('#selectedRow .pk');
    recordIDValue = recordIDValue.val().trim();
     if (confirm("Are you sure you want to delete this record?") == true) {
        $.ajax({
            url: ''+urlPath,
            type: 'DELETE',
            data: {recordID: ''+recordIDValue },
            success: function(result) {
                $('#selectedRow').remove();
                alert('deletion was successful');

            },
            error: function() {
                alert('could not be deleted');
            }
        });
     }

}

// because we can't put a form element inside a table or tr
// we clone the original inputs into a display:none form every time the save btn is pushed
// this is also the time when the overall validation takes place
// we need to remove any clones remained from the last failed validation before cloning the new -adjusted by user- values
function saveRowFunction(e) {
    e.stopPropagation();

    if (confirm("Are you sure you want to save this record?") == true) {
        var noRemove = $('#newForm').find('.addNewRecordTip, input[name=csrfmiddlewaretoken], .pk');
        $('#newForm').empty(); //remove any possible failed validation clones
        $('#newForm').html(noRemove); // except for the elements that are not clones and are needed in the form

       var selectedOption = $('#selectedRow').find("option:selected", ".selectList").text();

       var newValues = $('#selectedRow').find('td:not(:last())').children().not('.selectList, .ui-datepicker-trigger, .hasDatepicker').clone();

       for(var i=0; i<newValues.length; i++) {
            $(newValues[i]).attr('id', ''); // remove the ids of clones because the originals already have them (id is unique in a page)
       }

       $('#newForm').append(newValues); //add the clones to form

        //make a new input text to hold the selected option of itp select list
        // -- could not figure out another way of sending the selected option to server --
       if(selectedOption) {
            $('#newForm').append($("<input>")
                                .prop('type', 'text')
                                .attr('name', 'itp')
                                .val(selectedOption));
       }

       // when editing the row if the user doesn't select a different date, use the existing one
       var existingDate = $('#selectedRow .datepicker').val();
       $('#newForm .altDateField').val(moment(new Date(existingDate)).format('YYYY-MM-DD'));

       $('#newForm').submit();
    }
}