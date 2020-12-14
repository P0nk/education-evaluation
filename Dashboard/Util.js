/**
* For development
* Clear almost everything in a sheet, resetting it to the basics of the template.
*/
function clearWorkingSpace() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var lastRow = (sheet.getLastRow() - loc.malText.row) + 1;
  var lastCol = (sheet.getLastColumn() - loc.kurs.col) + 1;
  var workingRange1 = sheet.getRange(loc.kurs.row, loc.kurs.col, lastRow, lastCol);
  var workingRange2 = sheet.getRange(loc.malText.row, loc.malText.col, lastRow, lastCol);
  workingRange1.clear();
  workingRange2.clear();
  var charts = sheet.getCharts();
  for (var i in charts) {
    sheet.removeChart(charts[i]);
  }
  devDataKeys = [mdKey.programCode, mdKey.programStart, mdKey.dataRows, mdKey.malData];
  deleteSheetMultiDevData(sheet, devDataKeys);
}

/**
* Get the value of a cell
* @param {Sheet} sheet - sheet that the cell is in
* @param {Integer} row - row that the cell is in
* @param {Integer} col - column that the cell is in
* @return {?} cell value
*/
function getCellValue(sheet, row, col) {
  var value = sheet.getRange(row, col).getValue();
  return value;
}

/**
* Generate the smallest possible timestamp that all other normal timestamps should be greater than
* @return {String} the smallest timestamp
*/
function getSmallestTimestamp() {
  var timestamp = '00-00-00 00:00:00';
  return timestamp;
}

/**
* Generate a large timestamp that all timestamps in modern time should be smaller than
* @return {String} the smallest timestamp
*/
function getLargeTimestamp() {
  return '2100-12-30 23:59:59';
}

/**
* Convert a Date object to a MYSQL timestamp string
* @param {Date} date - the date to convert
* @return {String} a string following the MySQL timestamp format
*/
function dateToTimestamp(date) {
  var timezone = Common.TIMEZONE;
  var format = Common.TIMESTAMP_FORMAT;
  var timestamp = Utilities.formatDate(date, timezone, format);
  return timestamp;
}
