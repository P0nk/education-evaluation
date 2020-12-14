/**
* Set essential data about the education program as metadata
* @param {Sheet} sheet - sheet that the metadata will be set to
* @param {String} program - program code of the education program, ex: 'TIDAB'
* @param {String} startTime - semester and year of the program, ex: 'HT17'
*/
function setProgramDataInSheet(sheet, program, startTime) {  
  var sheetMode = Common.MODE_SHEET;
  Common.addDevData(sheetMode, mdKey.programCode, program);
  Common.addDevData(sheetMode, mdKey.programStart, startTime);
}

/**
* Get essential metadata from current sheet
* @param {Sheet} sheet - sheet to get data from
* @return {Object} the metadata
*/
function getProgramDataFromSheet(sheet) {
  var sheetMode = Common.MODE_SHEET;
  var program = Common.getDevData(sheetMode, mdKey.programCode);
  var startPeriod = Common.getDevData(sheetMode, mdKey.programStart);
  
  var programData = {};
  programData[mdKey.programCode] = program;
  programData[mdKey.programStart] = startPeriod;
  return programData;
}


/* Used in clearWorkingSpace() */
function deleteSheetMultiDevData(sheet, keys) {
  var spreadsheetId = SpreadsheetApp.getActiveSpreadsheet().getId();
  var resources = [];
  for(var i in keys) {
    var resource = createBatchDeleteSheetResource(sheet, keys[i]);
    resources.push(resource);
  }
  
  Sheets.Spreadsheets.batchUpdate({requests:resources}, spreadsheetId);
}

function createBatchDeleteSheetResource(sheet, key) {
  var sheetId = sheet.getSheetId();
  var resource = {
  "deleteDeveloperMetadata": 
    {"dataFilter": 
      {"developerMetadataLookup": 
        {"metadataKey": key, "locationType":"SHEET","metadataLocation": 
         {"locationType":"SHEET", "sheetId":sheetId}}}}};
  return resource;
}


/* Unused
function setDevDataRow(row) {
  // row = 4;
  var rowA1Notation = row + ':' + row;
  var sheet = SpreadsheetApp.getActiveSheet();
  var range = sheet.getRange(rowA1Notation);
  range.addDeveloperMetadata('kurs', 'IE1204');
}
*/

/* Unused
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
*/

/* Unused
function setDevDataSheet(sheet, key, value){
  sheet.addDeveloperMetadata(key, value);
}
*/

/* Moved to Common
function getDevDataSheet(sheet, searchKey) {  
  var mdFinder = sheet.createDeveloperMetadataFinder().withLocationType(SpreadsheetApp.DeveloperMetadataLocationType.SHEET);
  var metadata = mdFinder.withKey(searchKey).find()[0].getValue();
  
  return metadata;
}
*/


/* Unused
// Set DeveloperMetadata in "Spreadsheet" scope
function setDevDataSpreadsheet() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  spreadsheet.addDeveloperMetadata("application", "Dashboard");
}
*/

/* Unused
// Get array of all DeveloperMetadata in "Spreadsheet" scope
function getDevDataSpreadsheet() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var metadata = spreadsheet.getDeveloperMetadata();
  var metadataValues = [];
  for(var i = 0; i < metadata.length; i++) {
    metadataValues.push({key:metadata[i].getKey(), value:metadata[i].getValue()});
  }
  
  return metadataValues;
}
*/

/* Unused
// Get array of all DeveloperMetadata in "Sheet" scope
function getAllDevDataSheet() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var metadata = sheet.getDeveloperMetadata();
  var metadataValues = [];
  for(var i = 0; i < metadata.length; i++) {
    metadataValues.push({key:metadata[i].getKey(), value:metadata[i].getValue()});
  }
  
  return metadataValues;
}
*/

/* Unused
// Requires Advanced Sheet API v4 to be enabled
function deleteDevData(key) {
  var spreadsheetId = SpreadsheetApp.getActiveSpreadsheet().getId();
  //var sheetId = SpreadsheetApp.getActiveSheet().getSheetId();
  var resource = [{
    "deleteDeveloperMetadata": {
      "dataFilter": {
        "developerMetadataLookup": {
          "metadataKey": key
        }
      }
    }
  }];
  
  Sheets.Spreadsheets.batchUpdate({requests:resource}, spreadsheetId);
}
*/
