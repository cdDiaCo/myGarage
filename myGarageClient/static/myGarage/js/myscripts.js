
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

var activeBtnState = {};

// when one of the section buttons gets clicked
function setButtonActive(elem) {
    deactivateButtons();
    $(elem).addClass('active');
    removeTable();
    prepareTable();
}

// before activating a new button, we have to deactivate the last one
function deactivateButtons() {
    var buttons  = $('.sectionsButton');
    var id;
    $.each(buttons, function(){
        if($(this).hasClass("active")) {
            $(this).removeClass("active");
            return;
        }
    });
}

// this gets called as soon as the page loads
// and it populates the cars select box
function getUserCars() {
    var carNum = 0;
    $.ajax({type:"GET", url: "/api/v1/cars/"})
        .fail(function(resp){
            console.log('bad credentials.');
        })
        .done(function(resp){
            carNum = resp.count;
            var options = $('#userCars');
            $.each(resp.results, function() {
                options.append($("<option />").val(this.pk).text(this.manufacturer_name+" "+this.model_name));
            });
            if(carNum>1) {
                $('#carNum').text('My cars');
            } else {
                $('#carNum').text('My car');
            }

            $('#refuellingsButton').addClass('active');
            prepareTable();
        });
}

// check what section button has the active class
// generate table for that section
function prepareTable() {
    $('#tableRecords').css({'display': 'none'});
    var sectionBtn = $('.sectionsButton.active');
    var sectionID = $(sectionBtn).attr('id');
    var index = sectionID.indexOf("Button");
    var sectionName = sectionID.substring(0, index);
    sectionName = sectionName.toLowerCase();
    getTableColumns(sectionName);
}

// gets the records for the selected section
function getTableRecords(sectionName) {
     $.ajax({type:"GET", url: "/api/v1/"+sectionName+"/"})
        .fail(function(resp){
            console.log('bad credentials.');
        })
        .done(function(resp){
            activeBtnState.sectionName = sectionName;
            activeBtnState.numOfRecords = resp.count;
            activeBtnState.results = resp.results;
            addTableBody();
     });
}

// gets the columns for the selected section
function getTableColumns(sectionName) {
    var sectionSingular;
    if(sectionName === "taxes") {
        sectionSingular = sectionName.substring(0, sectionName.length-2);
    }
    else {
        sectionSingular = sectionName.substring(0, sectionName.length-1);
    }
    $.ajax({type:"GET", url: "/api/v1/columns/"+sectionSingular+"/"})
        .fail(function(resp){
            console.log('bad credentials.');
        })
        .done(function(resp){
            activeBtnState.numOfColumns = resp.length-2;
            activeBtnState.columns = resp;
            addTableHead();
            getTableRecords(sectionName);
    });
}

// this builds the table's head
function addTableHead() {
    $('#tableRecords thead').append($('<tr>'));
    var tableHead = $('#tableRecords thead').find('tr');
    for(column in activeBtnState.columns) {
        var columnName = getTableHeadName(activeBtnState.columns[column]);
        if(columnName === "Id" || columnName === "Car") {
            continue;
        }
        tableHead.append($('<th>').text(columnName));
    }
    tableHead.append($('<th>').css({'width': '70px'}));
}

// this builds the table's body
function addTableBody() {
    if(activeBtnState.numOfRecords > 0){ // there are records for this section
         var noRecordsMsg = "";
         var carHasRecords = false;
         $.each(activeBtnState.results, function(index, elem) {
             var tableContainerWidth = $('#garageContent').width();
             $('#contentBody').append($('<tr>'));
             var newRow = $('#contentBody').find('tr').last();
             for (var key in elem) {
                 if(key==="pk") {continue;}
                 if(key==="car") {
                      if(!isSelectedCar(elem[key])) { // this record belongs to another car
                          if(!carHasRecords && index === (activeBtnState.results.length-1)) {
                              // this combination of section and car doesn't have any records
                              noRecordsMsg = 'You have no '+activeBtnState.sectionName+' added for this car!';
                              setNoRecordsBody(newRow, noRecordsMsg);
                          }
                          return; // skip to the next record
                      }
                      carHasRecords = true;
                      continue;
                 }
                 $(newRow).append($('<td>')
                          .append($('<input>')
                               .prop('type', 'text')
                               .attr('name', key)
                               .val(elem[key])
                          ));
             }
             addOperationsButtons(newRow);

             var tableCell = $('td');
             var leftPadding = tableCell.css('padding-left');
             var rightPadding = tableCell.css('padding-right');
             var widthPadding = parseInt(leftPadding.charAt(0)) + parseInt(rightPadding.charAt(0));
             var cellWidth = (tableContainerWidth-70)/activeBtnState.numOfColumns-(widthPadding+1);
             $(newRow).find('input').css({"width": cellWidth});
         });

        // here we remove the table row/rows added and not populated
        // because the corresponding record/records belong/s to another car (the user has more than one car)
        $('#contentBody tr').each(function(index, elem){
                if($(elem).children().length == 0) {
                    $(elem).remove();
                }
        });


         if(!noRecordsMsg) { // we have records for the selected section and car
            arrangeTableForMinHeight();
         }
    }
    else { // there are no records for this section
         $('#tableRecords thead tr').children().last().remove();
         $('#contentBody').append($('<tr>'));
         var newRow = $('#contentBody').find('tr').last();
         var message = 'You have no '+activeBtnState.sectionName+' added yet!';
         setNoRecordsBody(newRow, message);
    }

    var rows = $('#contentBody tr');
    rows.on('click', markSelectedRecord);

    $('#tableRecords').show();
    setAddNewRecordBtn();
}

// here we add an extra tbody that holds an 'empty space'
// the purpose is to make up for the difference between the min height of the table body (150px) and
// the height that the table would have with only 2-3 rows
function arrangeTableForMinHeight() {
    var contentBodyHeight = $("#contentBody tr").length * $('#contentBody tr').height();
    if(contentBodyHeight < 150){
        var emptySpace = 150 - contentBodyHeight;
        $("#emptyBody").append($('<tr>').attr('id', 'emptySpaceRow')
                            .append($('<td>').attr('colspan', activeBtnState.numOfColumns+1)
                                .append($('<div>')
                                    .attr('id', 'emptyDiv'))));
        $("#emptyDiv").height(emptySpace);
    }
}

// adds the button responsible for adding a new row
function setAddNewRecordBtn() {
    var tableHeight = $('#tableRecords').height();
    var marginTop = 15 + tableHeight + "px";
    $('#addNewRecordBtn').css({'top': marginTop, });
    $('#addNewRecordBtn').css({'visibility': 'visible'});
}

function removeAddNewRecordBtn() {
    $('#addNewRecordBtn').css({'visibility': 'hidden'});
}

// this function is called when the user wants to add a new record to the table
function addNewRecord() {
    $("#emptyBody").find("#emptySpaceRow").remove();
    $('#contentBody').append($('<tr>'));
    arrangeTableForMinHeight();
    removeAddNewRecordBtn();
    for (column in activeBtnState.columns) {
        if(activeBtnState.columns[column] == "id" || activeBtnState.columns[column] =="car") {continue;}
        $('#contentBody').find("tr").last().append($("<td>")
                                                .append($('<input>')
                                                .prop('type', 'text')
                                                .attr('name', activeBtnState.columns[column])));
    }
    addOperationsButtons($('#contentBody').find("tr").last());
    setAddNewRecordBtn();
}

// adds an additional column that holds the save and delete row buttons
function addOperationsButtons(newRow) {
     $(newRow).append($('<td>')
            .css({'width': '70px'})
            .append($('<div>')
                .addClass('rowButtons')
                .append($('<img>')
                    .attr("src", saveImgSrc)
                    .addClass("saveRowImg")
                    .click(saveRecord))
                .append($('<img>')
                    .attr("src", deleteImgSrc)
                    .click(deleteRecord))));
}

// set the csrf token before making ajax call
function ajaxSetup() {
    var csrftoken = getCookie('csrftoken');
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    });
}

// mark the record clicked by the user
function markSelectedRecord() {
    if($('#selectedRecord').length !== 0) {
        unmarkSelectedRecord();
    }

    $(this).attr('id', 'selectedRecord');
}

function unmarkSelectedRecord() {
     $("#selectedRecord").removeAttr("id");
}

// returns the input data contained by the selected row
function getSelectedRecordData() {
    var columns = $("#selectedRecord").find("td");
    var data = {};
    for ( var i = 0; i<columns.length-1; i++){
        var cell = columns[i];
        var cellChildren = $(cell).children();
        //console.log(cellChildren);
        var name = cellChildren.attr("name");
        var value = cellChildren.val();
        data[name] = value;
    }
    return data;
}

function getSelectedCarURL() {
    var selectedCar = $('#userCars').val();
    var carUrl = "/api/v1/cars/" + selectedCar + "/";
    return carUrl;
}

function saveRecord() {
    var dataObj = getSelectedRecordData();
    var selectedCarUrl = getSelectedCarURL();
    dataObj["car"] = selectedCarUrl;

    ajaxSetup();
    $.ajax({
              method: "POST",
              url: "/api/v1/refuellings/",
              data: dataObj
          })
          .done(function( msg ) {
              console.log( "Data Saved: " + msg );
          });

}

function deleteRecord() {
    ajaxSetup();
    $.ajax({
              method: "DELETE",
              url: "/api/v1/refuellings/",
              data:{car: "/api/v1/cars/1/",
                    refuel_date: "2015-04-06",
                    current_mileage: 444,
                    quantity_refuelled: 444,
                    sum_refuelled: 444
                   }

          })
          .done(function( msg ) {
              console.log( "Data Saved: " + msg );
          });

}

// this is called when the user has no records for a certain section and/or car
function setNoRecordsBody(newRow, message) {
    $(newRow).append($('<td>')
        .attr('colspan', activeBtnState.numOfColumns+1)
        .append($('<div>')
            .attr('id', 'noRecordsMessage')
            .text(message)));
}

// get table head columns names from the DB column names
function getTableHeadName(key) {
    var res = key.split("_");
    var name ="";
    for (var i=0; i<res.length; i++) {
        if(i === 0) {
            name += res[i].charAt(0).toUpperCase() + res[i].slice(1);
        } else {
            name += " " + res[i];
        }
    }
    return name;
}

// this checks if the car selected by the user matches the current record's car
function isSelectedCar(carUrl) {
    carUrl = String(carUrl);
    var carID = carUrl.charAt(carUrl.length-2);
    var selectedCar = $('#userCars').val();
    if(carID == selectedCar) {
        return true;
    }
    return false;
}

// this is called when the user selects a different car
function selectCarHandler() {
    removeTableRows();
    addTableBody();
}

function removeTableRows() {
    $('#tableRecords tbody').find('tr').remove();
}

function removeTable() {
    $('#tableRecords tbody').find('tr').remove();
    $('#tableRecords thead').find('tr').remove();
}