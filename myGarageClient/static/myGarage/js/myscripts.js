
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

function setButtonActive(elem) {
    deactivateButtons();
    $(elem).addClass('active');
    removeTable();
    prepareTable();
}

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

function prepareTable() {
    // check what section button has the active class
    //generate table for that section
    var sectionBtn = $('.sectionsButton.active');
    var sectionID = $(sectionBtn).attr('id');
    var index = sectionID.indexOf("Button");
    var sectionName = sectionID.substring(0, index);
    sectionName = sectionName.toLowerCase();
    getTableColumns(sectionName);

}


function getTableRecords(sectionName) {
     $.ajax({type:"GET", url: "/api/v1/"+sectionName+"/"})
        .fail(function(resp){
            console.log('bad credentials.');
        })
        .done(function(resp){
            console.log('in get table records');
            activeBtnState.sectionName = sectionName;
            activeBtnState.numOfRecords = resp.count;
            activeBtnState.results = resp.results;
            addTableBody();
     });
}

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
            console.log('in get table columns');
            activeBtnState.numOfColumns = resp.length-2;
            activeBtnState.columns = resp;
            addTableHead();
            getTableRecords(sectionName);
    });
}

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
}

function addTableBody() {
    if(activeBtnState.numOfRecords > 0){
         var carHasRecords = false;
         $.each(activeBtnState.results, function(index, elem) {
             var tableContainerWidth = $('#garageContent').width();
             $('#tableRecords tbody').append($('<tr>'));
             var newRow = $('#tableRecords tbody').find('tr').last();
             for (var key in elem) {
                 if(key==="pk") {continue;}
                 if(key==="car") {
                      if(!isSelectedCar(elem[key])) {
                          if(!carHasRecords && index === (activeBtnState.results.length-1)) {
                              var message = 'You have no '+activeBtnState.sectionName+' added for this car!';
                              setNoRecordsBody(newRow, message);
                          }
                          return;
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
             var tableCell = $('td');
             var leftPadding = tableCell.css('padding-left');
             var rightPadding = tableCell.css('padding-right');
             var widthPadding = parseInt(leftPadding.charAt(0)) + parseInt(rightPadding.charAt(0));
             var cellWidth = tableContainerWidth/activeBtnState.numOfColumns-(widthPadding+1);
             $(newRow).find('input').css({"width": cellWidth});
         });
    }
    else {
         $('#tableRecords tbody').append($('<tr>'));
         var newRow = $('#tableRecords tbody').find('tr').last();
         var message = 'You have no '+activeBtnState.sectionName+' added yet!';
         setNoRecordsBody(newRow, message);
    }
}

function setNoRecordsBody(newRow, message) {
    $(newRow).append($('<td>')
        .attr('colspan', activeBtnState.numOfColumns)
        .append($('<div>')
            .attr('id', 'noRecordsMessage')
            .text(message)));
}

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

function isSelectedCar(carUrl) {
    carUrl = String(carUrl);
    var carID = carUrl.charAt(carUrl.length-2);
    var selectedCar = $('#userCars').val();
    if(carID == selectedCar) {
        return true;
    }
    return false;
}


function selectCarHandler() {
    removeTableRows();
    addTableBody();
    //tableStateObj.addNewRow();
}

function removeTableRows() {
    $('#tableRecords tbody').find('tr').remove();
}

function removeTable() {
    $('#tableRecords tbody').find('tr').remove();
    $('#tableRecords thead').find('tr').remove();
}