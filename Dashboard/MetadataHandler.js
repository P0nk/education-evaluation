function setDevDataRow(row) {
  // row = 4;
  var rowA1Notation = row + ':' + row;
  var sheet = SpreadsheetApp.getActiveSheet();
  var range = sheet.getRange(rowA1Notation);
  range.addDeveloperMetadata('kurs', 'IE1204');
}

function getDevDataRow(row) {
  // row = 4; 
  var rowA1Notation = row + ':' + row;
  var sheet = SpreadsheetApp.getActiveSheet();
  var range = sheet.getRange(rowA1Notation);
  var metaData = range.createDeveloperMetadataFinder().find();
  for(var i = 0; i < metaData.length; i++) {
    Logger.log(metaData[i].getKey() + ": " + metaData[i].getValue());
  }
}

function setDevDataSheet(key, value){
  var sheet = SpreadsheetApp.getActiveSheet();
  
  sheet.addDeveloperMetadata(key, value);
}

function getDevDataSheet(key) {
  var sheet = SpreadsheetApp.getActiveSheet();
  
  var metadata = sheet.getDeveloperMetadata();
  
  for(var i = 0; i < metadata.length; i++) {
    if(metadata[i].getKey() == key) {
      return metadata[i].getValue();
    }
  }
}

function setEduProgramDataOnSheet() {
  var eduProgram = 'TIDAB';
  var year = 2017;
  var sheet = SpreadsheetApp.getActiveSheet();
  
  sheet.addDeveloperMetadata('eduProgramTitle', eduProgram);
  sheet.addDeveloperMetadata('eduProgramYear', year);
}

function getEduProgramDataFromSheet(sheet) {
  var metadata = sheet.getDeveloperMetadata();
  for(var i = 0; i < metadata.length; i++) {
    if(metadata[i].getKey() == mdKey.programTitle) {
      var program = metadata[i].getValue();
    } else if (metadata[i].getKey() == mdKey.programYear) {
      var year = metadata[i].getValue();
    }
  }
  
  return {'eduProgramTitle':program, 'eduProgramYear':year};
}

// Set DeveloperMetadata in "Spreadsheet" scope
function setDevDataSpreadsheet() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  spreadsheet.addDeveloperMetadata("application", "Dashboard");
}

// Display all DeveloperMetadata in "Spreadsheet" scope
function getDevDataSpreadsheet() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var metadata = spreadsheet.getDeveloperMetadata();
  for(var i = 0; i < metadata.length; i++) {
    Logger.log(metadata[i].getKey() + ": " + metadata[i].getValue());
  }
}

function logDevDataSheet() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var metadata = sheet.getDeveloperMetadata();
  for(var i = 0; i < metadata.length; i++) {
    Logger.log(metadata[i].getKey() + ": " + metadata[i].getValue());
  }
}


// Requires advanced Sheet API v4 to be enabled
function deleteDevData() {
  var spreadsheetId = SpreadsheetApp.getActiveSpreadsheet().getId();
  //var sheetId = SpreadsheetApp.getActiveSheet().getSheetId();
  var keyToDelete = "kurs";
  var resource = [{
    "deleteDeveloperMetadata": {
      "dataFilter": {
        "developerMetadataLookup": {
          "metadataKey": keyToDelete
        }
      }
    }
  }];
  
  Sheets.Spreadsheets.batchUpdate({requests:resource}, spreadsheetId);
}
