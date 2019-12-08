// hard coded range
function setDevData() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var range = sheet.getRange('4:4');
  range.addDeveloperMetadata('kurs', 'IE1204');
}
// hard coded range
function getDevData() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var range = sheet.getRange('4:4');
  var metaData = range.createDeveloperMetadataFinder().find();
  for(var i = 0; i < metaData.length; i++) {
    Logger.log(metaData[i].getKey() + ": " + metaData[i].getValue());
  }
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
