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
  parseRows(sheet, levels);
  
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
    Logger.log(data[i]);
    
    var timestamp = data[i][0];
    var name = data[i][1];
    var course = data[i][2];
    if(!timestamp || !name || !course){
      continue;
    }
    
    var dataObject = {timestamp:timestamp, name:name, course:course, answers:[]};
    for(var j = 0; j < levels.length; j++) {
      var value = data[i][j+(question.columnIndexStart-1)];
      var answer = extractAnswers(value);
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


// The text follows this format: 'Nivå BLOOMLEVEL: bloomtext'
function extractLevel(text) {
  var indexAfterLevel = text.indexOf(question.separator);
  var level = text.substring(indexAfterLevel - 1, indexAfterLevel);
  return level;
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
}

// Form URLs match the following format: 
// https://docs.google.com/forms/d/FORM_ID/viewform
function extractFormId(formUrl) {
  var start = formUrl.indexOf('/d/');
  var end = formUrl.indexOf('/viewform');  
  var id = formUrl.substring(start + 3, end);
  return id;
}

