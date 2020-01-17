/* Setup an empty sheet based on the value in the top left cell. 
* Is meant to only run once per sheet.
* 1. Get [programkod] & [terminstart] from sheet
* 2. Retrieve from database: kurs & examensmal
* 3. If no results: stop. Otherwise, write sheet metadata: programkod & terminsstart and continue.

* 4. Write all examensmal to sheet.
* 5. Configure sheet design; merged cells, borders, text size, font, alignment(, text wrapping) for examensmal (top 5 rows)
* 
* 6. Write all kurs to sheet. Split up with "Årskurs" rows & rows for "Inriktning"
* 7. Configure sheet design for kurs (left 2 columns)
*
* 8. Insert auto background conditional formatting.
* 9. Insert tables below.
* 10. Insert diagrams below tables.
*/

/** 
* Load all structural data into the sheet
*/
function initialize() {
  var sheet = SpreadsheetApp.getActiveSheet();
  
  // Retrieve data from sheet, which is required to proceed
  var providedProgram = getCellValue(sheet, loc.program.row, loc.program.col);
  var providedTermin = getCellValue(sheet, loc.termin.row, loc.termin.col);
  if(!providedProgram || !providedTermin){
    alertOk(alertText.error, alertText.noProvidedInitialData);
    return;
  }
  Logger.log('program:%s, termin:%s', providedProgram, providedTermin);
  var con = Common.establishDbConnection();
  Logger.log('con:%s', con);
  var programMal = retrieveProgramMal(con, providedProgram);
  Logger.log('programmal:%s', programMal);
  if(programMal.length == 0) {
    alertOk(alertText.error, alertText.noMalDataInDb);
    return;
  }
  
  var kurser = retrieveProgramKurs(con, providedProgram, providedTermin);
  if(kurser.length == 0) {
    alertOk(alertText.error, alertText.noKursDataInDb);
    return;
  }
  
  // Set metadata
  setProgramDataInSheet(sheet, providedProgram, providedTermin);
  
  // Write programmal
  var malData = writeProgramMalData(sheet, programMal);
  
  // Set metadata about programmal placement
  var malDataString = JSON.stringify(malData);
  sheet.addDeveloperMetadata(mdKey.malData, malDataString);
  
  var numCols = 0;
  for(var i in malData) {
    numCols += malData[i].amount;
  }
  
  if(numCols == 0) {
    return;
  }
  
  // Write kursdata and get data about sections
  var sections = writeProgramKursData(sheet, kurser);
  
  // Insert the sections
  addSections(sheet, sections, numCols);
  var amountSections = sections.length;
  
  // Calculate how many data rows there are
  var amountKurser = kurser.length;
  var amountDataRows = amountKurser + amountSections;
  sheet.addDeveloperMetadata(mdKey.dataRows, amountDataRows);
  
  // General formatting for the whole sheet
  setFormattingSheet(sheet);
  
  // Tables, charts and formatting, separated into compartments by programmal
  for(var i in malData) {
    var curMalData = malData[i];
    var startRow = loc.data.row;
    var startCol = curMalData.titleStartCol;
    var amountCols = curMalData.amount;
    var dataRange = sheet.getRange(startRow, startCol, amountDataRows, amountCols);
    
    setFormattingData(dataRange);
    setColorCondForm(sheet, dataRange);
    createBloomTable(sheet, dataRange, curMalData);
    createBloomDiagram(sheet, dataRange);
  }
  
  // Set row heights for bloom tables
  var startRow = dataRange.getLastRow() + layout.table.numSpacerRows;
  var amountRows = layout.table.rows;
  var rowHeight = layout.table.rowHeight;
  sheet.setRowHeights(startRow, amountRows, rowHeight); 
}

/**
* Load all content into the sheet
*/
function load() {
  var con = Common.establishDbConnection();
  var sheet = SpreadsheetApp.getActiveSheet();
  var programData = getProgramDataFromSheet(sheet);
  var programCode = programData[mdKey.programCode];
  var programStart = programData[mdKey.programStart];
  //Logger.log('<%s> <%s> <%s>', programData, programCode, programStart);
  var sheetData = retrieveDataForProgram(con, programCode, programStart);
  writeSheetData(sheet, sheetData);
  
  con.close();
}
