function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu(menu.title)
  .addItem(menu.subTitleSave, 'saveResponses')
  .addItem('Testing', 'testing')
  .addToUi();
}

function saveResponses() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var rowIndex = 1;
  var headers = readRow(sheet, rowIndex);
  var levels = getLevels(headers);
  var dataObjects = parseRows(sheet, levels);
  var formId = getFormId(sheet);
  var con = establishDbConnection();
  var responseObjects = insertResponses(con, formId, dataObjects);
  // TODO generate 'insert objects' and pass to insertAnswers
  var insertSuccesses = insertAnswers(con, formId, responseObjects);
  Logger.log('<Insert successes: %s>', insertSuccesses);
  //deleteRows(sheet, insertSuccesses, responseObjects);
}

function parseRows(sheet, levels) {
  var data = sheet.getDataRange().getValues();
  var dataObjects = [];
  var parsedRows = [];
  // Skip first row
  for(var i = 1; i < data.length; i++) {
    if(data[i].length == 0){
      continue;
    }
    
    var timestamp = data[i][0].toString();
    var name = data[i][1];
    var course = data[i][2].toString().toUpperCase();
    if(!timestamp || !name || !course){
      continue;
    }
    
    var dataObject = {timestamp:timestamp, name:name, course:course, row:i, answers:[]};
    for(var j = 0; j < levels.length; j++) {
      var value = data[i][j+(question.columnIndexStart-1)];
      
      if(value.toString().trim()) {
        var answer = extractAnswers(value);
      } else {
        var answer = [];
      }
      dataObject.answers[j] = answer;
    } 
    dataObjects.push(dataObject);
  }
  Logger.log('data object: %s', dataObjects);
  return dataObjects;
}
// The text has format: 
// 1:QUESTIONTEXT, 2:QUESTIONTEXT, 3:QUESTIONTEXT, 4:QUESTIONTEXT...
function extractAnswers(multiAnswerText) {
  var matches = multiAnswerText.match(/\d+:\s/g);
  for(var i = 0; i < matches.length; i++) {
    matches[i] = matches[i].charAt(0);
  }
  
  //Logger.log('%s has matches %s', multiAnswerText, matches);
  return matches;
}

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
function readRow(sheet, rowIndex) {
  //var sheet = SpreadsheetApp.getActiveSheet();
  var rowRangeNotation = rowIndex + ':' + rowIndex;
  var range = sheet.getRange(rowRangeNotation);
  var values = range.getValues()[0];
  var filteredValues = values.filter(function(val) { return val.trim() } );
  
  /*
  values.forEach(function(value) {
    i++;
    if(value){
      Logger.log(value);
    }
  });  
  Logger.log('%s columns', i);
  */
  
  return filteredValues;
}


function getFormId(sheet) {
  //var sheet = SpreadsheetApp.getActiveSheet();
  var formUrl = sheet.getFormUrl();
  var formId = extractFormId(formUrl);
  return formId;
}

// responseObjects contains data about exactly which row
// insertedRowsAscOrder determines if a row of the same index in responseObjects was inserted or not
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
