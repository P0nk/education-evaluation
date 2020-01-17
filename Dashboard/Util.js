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
