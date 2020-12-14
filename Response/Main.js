/** 
* Add a custom menu to the UI
*/
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu(menu.title)
  .addItem(menu.subTitleSave, 'saveResponses')
  .addToUi();
  
  /* For debugging timestamp in current cell 
  .addItem('Display date', 'displayDate') 
  */
}

/** 
* Save form responses in the database, and delete successful inserts.
*/
function saveResponses() {
  var sheet = SpreadsheetApp.getActiveSheet();
  
  // Get form id from connected from
  var formId = getFormId(sheet);
  Logger.log('Form id:<%s>', formId);
  
  // Get header row index from constants
  var headerRowIndex = loc.header.row;
  Logger.log('Header row index:<%s>', headerRowIndex);
  
  // Get all cell values of the header row
  var headers = readRow(sheet, headerRowIndex);
  Logger.log('Headers:<%s>', headers);
  
  // Get bloom levels from header values
  var levels = getLevels(headers);
  Logger.log('Bloom levels:<%s>', levels);
  
  // Get response data by parsing response text based on given bloom levels.
  var responses = parseRows(sheet, levels);
  Logger.log('Data:<%s>', responses);
  
  // All sheet data has now been processed, and it's time to use the database.
  var con = Common.establishDbConnection();
  
  // The essential columns (timestamp, kurskod, namn) of each row are inserted into the database. 
  // As a result of an insert, a 'response id' is generated. This 'response id' is added to the each corresponding 'data object', making them 'response object's.
  var responseObjects = insertResponses(con, formId, responses);
  Logger.log('Responses:<%s>', responseObjects);
  
  // Each response object contains information about multiple database records to be inserted. 
  // They get unwinded for easier insertion into the database. Storing records also makes it easier to delete rows later.
  var records = convertToRecords(responseObjects);
  Logger.log('Records:<%s>', records);
  if(!Array.isArray(records) || records.length == 0) {
    Logger.log('Nothing to save');
    return;
  }
  
  // Records are inserted into the database. Get data about successful inserts so rows can be removed.
  var insertSuccesses = insertAnswers(con, formId, records);
  Logger.log('<Insert successes: %s>', insertSuccesses);
  
  // Delete rows from the sheet containing data that has been saved in the database.
  deleteInsertSuccesses(sheet, insertSuccesses, records);
}

/**
* Parse sheet rows to extract response data
* @param {Sheet} sheet - sheet to parse rows from
* @param {Integer[]} levels - bloom levels
* @return {Response[]} response objects derived from parsed rows
*/
function parseRows(sheet, levels) {
  var data = sheet.getDataRange().getValues();
  var responses = [];
  var parsedRows = [];
  // Skip header row (start on 1)
  for(var i = 1; i < data.length; i++) {
    if(data[i].length == 0){
      continue;
    }
    
    var date = data[i][0];
    var name = data[i][1];
    var course = data[i][2].toString().toUpperCase();
    if(!date || !name || !course){
      continue;
    }
    
    if(!(date instanceof Date)) {
      continue; // Can't convert to sql timestamp easily
    }
    var timestamp = getSqlTimestamp(date);
    
    //var dataObject = {timestamp:timestamp, name:name, course:course, row:(i + 1), answers:[]};
    var row = i + 1; // rows are 1-indexed
    var response = new Response(timestamp, name, course, row);
    for(var j = 0; j < levels.length; j++) {
      var columnIndex = question.columnIndexStart + j - 1; // columns are 1-indexed, therefore -1
      var value = data[i][columnIndex];
      
      if(value.toString().trim()) {
        var answer = extractAnswers(value);
      } else {
        var answer = [];
      }
      response.answers[j] = answer;
    } 
    responses.push(response);
  }
  //Logger.log('data object: %s', dataObjects);
  return responses;
}

/** 
* Extract larandemal from form response text.
* @param multiAnswerText - form question response. Format: see below
* @returns array of Answer objects - this is the parsed data from the text
*
* multiAnswerText format: 
* 1:QUESTIONTEXT [v_], 2:QUESTIONTEXT [v_], 3:QUESTIONTEXT [v_], 4:QUESTIONTEXT...
*/
function extractAnswers(multiAnswerText) {
  var regex = /(\d+):\s.*?\[v(\d+)\]/g;
  var answers = [];
  
  while ((match = regex.exec(multiAnswerText)) != null) {
    var number = match[1];
    var version = match[2];
    var answer = new Answer(number, version);
    answers.push(answer);
  }
  
  return answers;
}

// Old regex: var matches = multiAnswerText.match(/\d+:\s/g);
  
// This is what you have to do to match multiple texts with multiple capture groups.
// matchAll() could possibly be used in the future
// exec while-loop: https://stackoverflow.com/questions/14707360/javascript-regex-multiple-captures-again

/** 
* Extract bloom levels from header text. 
* Example header text: "Nivå 1: Fakta". In this case 1 would be obtained.
* @param {String[]} values - header cell values
* @returns {Integer[]} bloom levels
*/
function getLevels(values) {
  var bloomLevels = [];
  
  for(var i = 0; i < values.length; i++) {
    if(!values[i]){
      continue;
    }
    
    var value = values[i];
    if(value.indexOf(question.prefix) === 0) {
      var level = extractLevel(value);
      bloomLevels.push(level);
    } 
  }
  
  return bloomLevels;
}



// Reads all cell values of a row, filtering out empty cells
/**
* Get all values from cells in a specific row in a sheet
* @param {Sheet} sheet - sheet to get values from
* @param {Integer} rowIndex - index of the row to get values from
* @return {String[]} cell values
*/
function readRow(sheet, rowIndex) {
  //var sheet = SpreadsheetApp.getActiveSheet();
  var rowRangeNotation = rowIndex + ':' + rowIndex;
  var range = sheet.getRange(rowRangeNotation);
  var values = range.getValues()[0];
  var filteredValues = values.filter(function(val) { return val.trim() } );
    
  return filteredValues;
}

/**
* Get form id for a destination sheet
* @param {Sheet} sheet - a destination sheet
* @return {String} form id
*/
function getFormId(sheet) {
  //var sheet = SpreadsheetApp.getActiveSheet();
  var formUrl = sheet.getFormUrl();
  var formId = extractFormId(formUrl);
  return formId;
}

/**
* Delete rows which have its data saved in the database successfully
* @param {Sheet} sheet - sheet to delete rows from
* @param {Boolean[]} successfulInserts - insert success status for all records
* @param {ResponseRecords[]} records - response records containing records in the same order as successfulInsert
*/
function deleteInsertSuccesses(sheet, successfulInserts, records) {
  var rowsToDelete = getRowsToDelete(successfulInserts, records);
  var sortNumberAsc = function(a, b) { return a  -b; };
  rowsToDelete.sort(sortNumberAsc);
  
  while(rowsToDelete.length > 0) {
    var row = rowsToDelete.pop();
    sheet.deleteRow(row);
    //Logger.log('Deleting row <%s>', row);
  }
}

/**
* Deduce which rows are safe to delete 
* @param {Boolean[]} successfulInserts - data about which records have been stored in the database
* @param {ResponseRecords[]} records - data about all records
* @return {Integer[]} indices of rows that have their data stored in the database and can be deleted
*/
function getRowsToDelete(successfulInserts, records) {
  var rowsToDelete = [];
    
  var indexCounter = 0;
  for(var i = 0; i < records.length; i++) {
    var hasMissedInserts = 0;
    
    for(var j = 0; j < records[i].records.length; j++) {
      if(successfulInserts[indexCounter] == 0) {
        hasMissedInserts++;
      }
      indexCounter++;
    }
    
    if(hasMissedInserts <= 0) {
      rowsToDelete.push(records[i].row);
    }
  } 
  
  return rowsToDelete;
}

/**
* Convert responses to individual records for easier work with database
* @param {Response[]} responseObjects - responses to convert
* @return {ResponseRecords[]} resulting records
*/
function convertToRecords(responseObjects) {
  // Create data structure of records. 
  // This is used for insertion of records into the database, as well as deletion of rows in the sheet.
  var records = [];
  for(var i = 0; i < responseObjects.length; i++) {
    // Check if responseId exists in the object
    if(!('responseId' in responseObjects[i])) {
      continue; // Can't insert records without the id
    }
    
    var responseId = responseObjects[i].responseId;
    var row = responseObjects[i].row;
    var answers = responseObjects[i].answers;
    //Logger.log('Response id:<%s>, Answers:<%s>', responseId, answers);
    
    // The 'answers' array will be unwinded into multiple records
    for(var j = 0; j < answers.length; j++) {
      var bloomLevel = j + 1;
      
      for(var k = 0; k < answers[j].length; k++) {
        var number = answers[j][k].number;
        var version = answers[j][k].version;
        var lm = new Larandemal(bloomLevel, number, version);
        
        // Find index of object with current responseId
        var responseIndex = -1;
        for(var i = 0; i < records.length; i++) {
          if(records[i].responseId == responseId) {
            responseIndex = i;
            break;
          }
        }
        
        if(responseIndex < 0) {
          var resRec = new ResponseRecords(responseId, row);
          resRec.records.push(lm);
          records.push(resRec); 
        } else {
          records[responseIndex].records.push(lm);
        }
      }
    }
  } 
  //Logger.log('Records:<%s>', records);
  return records;
}

// UNUSED
// responseObjects contains data about exactly which row
// insertedRowsAscOrder determines if a row of the same index in responseObjects was inserted or not
/* Naive solution that is completely broken
function deleteRows(sheet, insertedRowsAscOrder, responseObjects) {
  Logger.log(responseObjects);
  Logger.log(insertedRowsAscOrder);
  var rows = insertedRowsAscOrder;
  for(var i = (rows.length - 1); i >= 0; i--) {
    if(rows[i] == 1) {
      var rowToDelete = responseObjects[i].row + 1;
      var rowA1Notation = rowToDelete + ':' + rowToDelete;
      sheet.getRange(rowA1Notation).setBackground('green');
    }
  }
}
*/
