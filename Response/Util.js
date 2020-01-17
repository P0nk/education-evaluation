/**
* Construct a timestamp for MySQL
* @param {Date} sheetTimestamp - source for date and time data
* @return {String} MySQL timestamp
*/
function getSqlTimestamp(sheetTimestamp) {
  var date = sheetTimestamp;
  var year = date.getYear();
  var monthWithOffset = date.getMonth();
  var month = pad(monthWithOffset + 1);
  var day = pad(date.getDate());
  var hour = pad(date.getHours());
  var minute = pad(date.getMinutes());
  var second = pad(date.getSeconds());
  var dateString = Utilities.formatString('%s-%s-%s %s:%s:%s', year, month, day, hour, minute, second);
  return dateString;
}

/**
* Add a leading zero to a single digit number 
* @param {Integer} number - number to pad
* @return {Integer} padded number
*/
function pad(number) {
  if(number <= 9) {
    return '0' + number;
  } else {
    return number;
  }
}

// Form URLs match the following format: 
// https://docs.google.com/forms/d/FORM_ID/viewform
/**
* Extract form id from a form url
* @param {String} formUrl - form url to extract from
* @return {String} form id
*/
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
  level = parseInt(level);
  return level;
}

// Timestamp in Sheet and MySQL are different
// MySQL format: 2019-12-15 16:45:14
// Current sheet format: Thu Dec 12 2019 16:10:59 GMT+0100 (CET)
//
// Old Sheet format: Thu Dec 15 16:45:14 GMT+01:00 2019
// I think it changed after I changed Spreadsheet settings Locale
// TODO Utilize Date object that is returned by getValue() before getting sent here. No need to parse the timestamp string.
/* Old. Used before the realization hit that the timestamp column straight up contains Date objects that can be modified directly.
function convertTimestamp(sheetTimestamp) {
  var year = sheetTimestamp.substring(11, 15);
  var monthText = sheetTimestamp.substring(4, 7);
  var month = monthTextToNumber(monthText);
  var day = sheetTimestamp.substring(8, 10);
  var hourMinuteSecond = sheetTimestamp.substring(16, 24);
  var newTimestamp = Utilities.formatString('%s-%s-%s %s', year, month, day, hourMinuteSecond);
  return newTimestamp;
}
*/

/*
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
*/