/**
* Set sheet formatting for kurs
* @param {Range} range - range containing kurs
*/
function setFormattingKurs(range) {
  range.setBorder(false, false, false, true, false, false, 'black', SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
  range.setHorizontalAlignment('center');
  range.setVerticalAlignment('middle');
  range.setFontSize(10);
  range.setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
}

/**
* Set sheet formatting for data
* @param {Range} range - range containing data
*/
function setFormattingData(range) {
  range.setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP); 
  // Setting wrap like this causes the row heights to be auto-fit regardless of if setRowHeight has been used.
  // It's a bug on Google's part.
  range.setHorizontalAlignment('center');
  range.setVerticalAlignment('middle');
  range.setNumberFormat('@'); // Plain text
}

/**
* Set general sheet formatting
* @param {Sheet} sheet - sheet to set formatting to
*/
function setFormattingSheet(sheet) {
  var totalRange = sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn());
  totalRange.setFontFamily('Roboto');
  sheet.setFrozenColumns(loc.kurs.colEnd);
  sheet.setFrozenRows(loc.malNummer.rowEnd);
}

/**
* Set sheet formatting for section
* @param {Range} range - range containing section
*/
function setFormattingSection(range) {
  var kursRange = range
  range.setBorder(true, true, true, true, false, false, 'black', SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
  range.setBackground('#1c4587');
  range.setFontColor('white');
  //range.mergeAcross();
  range.setHorizontalAlignment('center');
  range.setVerticalAlignment('middle');
}

/**
* Set sheet formatting for subsection
* @param {Range} range - range containing subsection
*/
function setFormattingSubsection(range) {
  range.setBorder(true, true, true, true, false, false, 'black', SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
  range.setBackground('#c9daf8');
  range.setFontColor('#073763');
  //range.mergeAcross();
  range.setHorizontalAlignment('center');
  range.setVerticalAlignment('middle');
}

/**
* Set sheet formatting for the 'kurs' part of a section
* @param {Range} kursRange - kurs range
*/
function setFormattingSectionKurs(kursRange) {
  kursRange.mergeAcross();
}

/**
* Set sheet formatting for maltext
* @param {Range} range - range containing maltext
*/
function setFormattingMalText(range) {
  range.setFontSize(9);
  range.setHorizontalAlignment('center');
  range.setVerticalAlignment('middle');
  range.setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
  range.setFontFamily('Roboto');
  range.mergeVertically();
}

/**
* Set sheet formatting for malnum
* @param {Range} range - range containing malnum
*/
function setFormattingMalNum(range) {
  range.setBorder(false, false, true, false, false, false, 'black', SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
  range.setFontSize(24);
  range.setHorizontalAlignment('center');
  range.setVerticalAlignment('middle');
  range.setFontFamily('Roboto');
  range.mergeVertically();
}

/**
* Set sheet formatting for maltyp
* @param {Range} range - range containing maltyp
*/
function setFormattingMalTyp(range) {
  range.setTextRotation(90);
  range.setFontSize(24);
  range.setHorizontalAlignment('center');
  range.setVerticalAlignment('middle');
  range.mergeVertically();
}
