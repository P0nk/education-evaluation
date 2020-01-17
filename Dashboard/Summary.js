/**
* Create a table which summarizes how well the data accomplishes bloom's taxonomy
* @param {Sheet} sheet - sheet to add table to
* @param {Range} dataRange - data that the table is concerned with
* @param {ProgramMalPlacement} malData - data necessary to know which columns the table should occupy
*/
function createBloomTable(sheet, dataRange, malData) {
  // Use layout constant
  var lo = layout.table;
  var bloom = Common.BLOOM;
  var numBloomLevels = bloom.length; 
  var numHeaderRows = lo.numHeaderRows;
  var height = numHeaderRows + numBloomLevels;
  var width = dataRange.getNumColumns();
  var numSpacerRows = lo.numSpacerRows;
  var startRow = dataRange.getLastRow() + numSpacerRows;
  var startCol = dataRange.getColumn();
  var numStubCols = lo.numStubCols;
  var malNummer = malData.malNummer;
  
  // Create all ranges
  var totalRange = sheet.getRange(startRow, startCol, height, width);
  var headerRange = sheet.getRange(startRow, (startCol + numStubCols), numHeaderRows, (width - numStubCols));
  var tableBodyRange = sheet.getRange((startRow + numHeaderRows), (startCol + numStubCols), numBloomLevels, (width - numStubCols));
  var stubRange = sheet.getRange(startRow, startCol, height, 1);
  var stubTitleRange = sheet.getRange(startRow, startCol, numHeaderRows, numStubCols);
  var stubContentRange = sheet.getRange((startRow + numHeaderRows), startCol, numBloomLevels, numStubCols);
  
  // Borders
  totalRange.setBorder(true, true, true, true, false, false);
  totalRange.setNumberFormat('@'); // Plain text
  headerRange.setBorder(true, true, true, true, false, false);
  stubTitleRange.setBorder(true, true, true, true, false, false);
  stubContentRange.setBorder(true, true, true, true, false, false);
  
  // Header layout
  var sep = layout.table.headerTextSeparator;
  var headerText = layout.table.headerTextPrefix + bloom[0] + sep + bloom[1] + sep + bloom[2] + sep + bloom[3] + sep + bloom[4] + sep + bloom[5] + '"';
  var headerTextStyle = SpreadsheetApp.newTextStyle().setFontSize(14).setBold(true).build();
  headerRange.setTextStyle(headerTextStyle); 
  headerRange.merge().setValue(headerText).setHorizontalAlignment('center').setVerticalAlignment('middle');
  
  // Table body
  tableBodyRange.setHorizontalAlignment('center').setVerticalAlignment('middle');
  
  // Stub title
  var stubTitleText = layout.table.stubTitleText;
  var stubTitleTextStyle = SpreadsheetApp.newTextStyle().setFontSize(14).setBold(true).build();
  stubTitleRange.setTextStyle(stubTitleTextStyle);
  stubTitleRange.merge().setValue(stubTitleText).setHorizontalAlignment('center').setVerticalAlignment('middle');
  
  // Stub content
  var bloom = Common.BLOOM;
  for(var i = 0; i < stubContentRange.getNumRows(); i++){
    stubContentRange.getCell(1 + i, 1).setValue(bloom[i]).setHorizontalAlignment('center').setVerticalAlignment('middle');
  }
  
  // Formulas in table
  /* Old method
  for(var i = 1; i <= tableBodyRange.getNumColumns(); i++){
    var countRange = sheet.getRange(dataRange.getRow(), dataRange.getColumn() - 1 + i, dataRange.getNumRows(), 1).getA1Notation();
    
    for(var j = 1; j <= numBloomLevels; j++){
      var pattern = Utilities.formatString('*%s.%s.*', i, j);
      var formula = Utilities.formatString('=COUNTIF(%s;"%s")', countRange, pattern);
      tableBodyRange.getCell(j, i).setFormula(formula);
    }
  }
  */
  
  for(var i = 0; i < malNummer.length; i++) {
    var numTitleCols = 1;
    var countRange = sheet.getRange(dataRange.getRow(), (malData.dataStartCol + i), dataRange.getNumRows(), 1).getA1Notation();
    var curMalNummer = malNummer[i];
    
    for(var j = 1; j <= numBloomLevels; j++) {
      var pattern = Utilities.formatString('*%s.%s.*', curMalNummer, j);
      var formula = Utilities.formatString('=COUNTIF(%s;"%s")', countRange, pattern);
      // Since i starts at 0 and getCell() is 1-indexed
      tableBodyRange.getCell(j, (i + 1)).setFormula(formula);
    }
  }
  
  
  /* For debugging */
  //tableHeaderRange.setBackground('red');
  //tableBodyRange.setBackground('green');
  //tableStubTitleRange.setBackground('yellow');
  //tableStubContentRange.setBackground('purple');
}

/**
* Create charts that present the table data
* @param {Sheet} sheet - sheet to add charts to
* @param {Range} dataRange - data that the table is concerned with
*/
function createBloomDiagram(sheet, dataRange){
  // Use layout constant
  var lo = layout.table;
  var numBloomLevels = Common.BLOOM.length;
  var numHeaderRows = lo.numHeaderRows;
  var height = numHeaderRows + numBloomLevels;
  // unused. var tableWidth = dataRange.getNumColumns() + 1;
  var numSpacerRows = lo.numSpacerRows;
  var numStubCols = lo.numStubCols;
  var tableStartRow = dataRange.getLastRow() + numSpacerRows; 
  var startCol = dataRange.getColumn(); 
  var headerData = sheet.getRange((tableStartRow + numHeaderRows), startCol, numBloomLevels, numStubCols);
  
  var chartHeight = layout.chart.height;
  var chartWidth = layout.chart.width;
  var pixelOffset = 0;
  
  for(var i = 1; i < dataRange.getNumColumns(); i++){
    var tableData = sheet.getRange((tableStartRow + numHeaderRows), (startCol + i), numBloomLevels, numStubCols);
    var chart = sheet.newChart()
    .setChartType(Charts.ChartType.COLUMN)
    .addRange(headerData)
    .addRange(tableData)
    .setPosition((tableStartRow + height + numSpacerRows), (startCol + i), pixelOffset, pixelOffset)
    .setOption('width', chartWidth)
    .setOption('height', chartHeight)
    .setOption('legend',{position: 'None'})
    .setOption('series',{"0":{ "items":{"0":{"color":color.bloom1},"1":{"color":color.bloom2},"2":{"color":color.bloom3},"3":{"color":color.bloom4},"4":{"color":color.bloom5},"5":{"color":color.bloom6}}}})
    .setOption('useFirstColumnAsDomain', true)
    .build();
    sheet.insertChart(chart);
  }
}
