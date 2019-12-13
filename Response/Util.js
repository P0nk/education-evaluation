function isEmpty(string) {
  return string.trim();
}

// Timestamp in Sheet and MySQL are different
// MySQL format: 2019-12-15 16:45:14
// Current sheet format: Thu Dec 12 2019 16:10:59 GMT+0100 (CET)
//
// Old Sheet format: Thu Dec 15 16:45:14 GMT+01:00 2019
// I think it changed after I changed Spreadsheet settings Locale
function convertTimestamp(sheetTimestamp) {
  // TODO look into the details and implement this
  var year = sheetTimestamp.substring(11, 15);
  var monthText = sheetTimestamp.substring(4, 7);
  var month = monthTextToNumber(monthText);
  var day = sheetTimestamp.substring(8, 10);
  var hourMinuteSecond = sheetTimestamp.substring(16, 24);
  var newTimestamp = Utilities.formatString('%s-%s-%s %s', year, month, day, hourMinuteSecond);
  return newTimestamp;
}

function monthTextToNumber(monthText) {
  switch(monthText.toLowerCase()) {
    case 'jan': return '01';
    case 'feb': return '02';
    case 'mar': return '03';
    case 'apr': return '04';
    case 'may': return '05';
    case 'jun': return '06';
    case 'jul': return '07';
    case 'aug': return '08';
    case 'sep': return '09';
    case 'oct': return '10';
    case 'nov': return '11';
    case 'dec': return '12';
  }
}


// Form URLs match the following format: 
// https://docs.google.com/forms/d/FORM_ID/viewform
function extractFormId(formUrl) {
  var start = formUrl.indexOf('/d/');
  var end = formUrl.indexOf('/viewform');  
  var id = formUrl.substring(start + 3, end);
  return id;
}

// The text follows this format: 'Nivå BLOOMLEVEL: bloomtext'
function extractLevel(text) {
  var indexAfterLevel = text.indexOf(question.separator);
  var level = text.substring(indexAfterLevel - 1, indexAfterLevel);
  return level;
}
