function createBloomTable() {
  var bloomLevels = 6; 
  var tableHeight = bloomLevels + 2;
  var tableWidth = amountExMal + 1;
  var tableStartRow = 2 + amountKurser + 2; 
  var tableStartCol = 1;
  var sheet = SpreadsheetApp.getActiveSheet();
  //SpreadsheetApp.getUi().alert(tableHeight);
  //sheet.
  var tableRange = sheet.getRange(tableStartRow, tableStartCol, tableHeight, tableWidth);
  var tableHeaderRange = sheet.getRange(tableStartRow, tableStartCol + 1, 2, tableWidth-1);
  var tableStubRange = sheet.getRange(tableStartRow, tableStartCol, tableHeight, 1);
  var tableStubTitleRange = sheet.getRange(tableStartRow, tableStartCol, 2, 1);
  var tableStubContentRange = sheet.getRange(tableStartRow+2, tableStartCol, tableHeight-2, 1);
  var tableBodyRange = sheet.getRange(tableStartRow + 2, tableStartCol+1, tableHeight-2, tableWidth-1);
  tableRange.setBorder(true, true, true, true, false, false);
  tableHeaderRange.setBorder(true, true, true, true, false, false);
  tableStubTitleRange.setBorder(true, true, true, true, false, false);
  tableStubContentRange.setBorder(true, true, true, true, false, false);
  
  //tableHeaderRange.setBackground('red');
  //tableBodyRange.setBackground('green');
  //tableStubTitleRange.setBackground('yellow');
  //tableStubContentRange.setBackground('purple');
  var tableStubTitleText = 'Bloom-nivå';
  var stubTitleTextStyle = SpreadsheetApp.newTextStyle()
    .setFontSize(14)
    .setBold(true)
    .build();
  tableStubTitleRange.setTextStyle(stubTitleTextStyle);
  tableStubTitleRange.merge().setValue('Bloom-nivå').setHorizontalAlignment('center').setVerticalAlignment('middle');
  var tableHeaderText = 'Antal obl. kurser med förekomst av lärandemål på Bloom-nivå "'+BLOOM_1+'", "'+BLOOM_2+'", "'+BLOOM_3+'", "'+BLOOM_4+'", "'+BLOOM_5+'" och "'+BLOOM_6+ '".';
  var tableHeaderTextStyle = SpreadsheetApp.newTextStyle()
    .setFontSize(14)
    .setBold(true)
    .build();
  tableHeaderRange.setTextStyle(tableHeaderTextStyle); 
  tableHeaderRange.merge().setValue(tableHeaderText).setHorizontalAlignment('center').setVerticalAlignment('middle');
  var arrayOfBloomLevels = [BLOOM_1, BLOOM_2, BLOOM_3, BLOOM_4, BLOOM_5, BLOOM_6];
  for(i =0; i<tableStubContentRange.getNumRows(); i++){
    tableStubContentRange.getCell(i+1,1).setValue(arrayOfBloomLevels[i]).setHorizontalAlignment('center').setVerticalAlignment('middle');;
  }
  tableBodyRange.setHorizontalAlignment('center').setVerticalAlignment('middle');
  for(i =1; i<=amountExMal; i++){
    var countRange = sheet.getRange(LARANDEMAL_TABLE_CONTENT_STARTPOSITION_ROW, LARANDEMAL_TABLE_CONTENT_STARTPOSITION_COL+i-1, amountKurser, 1).getA1Notation();
    for(j=1; j<=bloomLevels; j++){
      var containsLarandemalAtBloomLevelPattern = '*'+i+'.'+j+'.*';
      var formula = '=COUNTIF('+countRange+',"'+containsLarandemalAtBloomLevelPattern+'")';
      tableBodyRange.getCell(j, i).setFormula(formula)
    }
    
  }
//  for(i =1; i<=amountExMal; i++){
//    var chart = sheet.newChart()
//    .setChartType(Charts.ChartType.COLUMN)
//    .addRange(sheet.getRange(tableStartRow + 2, tableStartCol+i, tableHeight-2, 1))
//    .setPosition(tableStartRow + tableHeight+2, tableStartCol+i, 0, 0)
//    .setOption("title", "Dynamic Chart")
//    .setOption("bar.groupWidth", "1")
//    .build();
//    sheet.insertChart(chart);
//  
//  }
  
  //.setOption('bar',{groupWidth: '100%'})
  
//  var sampleData = Charts.newDataTable()
//    .addColumn(Charts.ColumnType.STRING, "Year")
//    .addColumn(Charts.ColumnType.NUMBER, "Sales")
//    .addColumn(Charts.ColumnType.NUMBER, "Expenses")
//    .addRow(["2004", 1000, 400])
//    .addRow(["2005", 1170, 460])
//    .addRow(["2006", 660, 1120])
//    .addRow(["2007", 1030, 540])
//    .addRow(["2008", 800, 600])
//    .addRow(["2009", 943, 678])
//    .addRow(["2010", 1020, 550])
//    .addRow(["2011", 910, 700])
//    .addRow(["2012", 1230, 840])
//    .build();
//
//  var chart = Charts.newColumnChart()
//    .setTitle('Sales & Expenses')
//    .setXAxisTitle('Year')
//    .setYAxisTitle('Amount (USD)')
//    .setDimensions(600, 500)
//    .setDataTable(sampleData)
//    .build();
  
  
}

function createBloomDiagrams(){
  var bloomLevels = 6; 
  var tableHeight = bloomLevels + 2;
  var tableWidth = amountExMal + 1;
  var tableStartRow = 2 + amountKurser + 2; 
  var tableStartCol = 1;
  var sheet = SpreadsheetApp.getActiveSheet(); 
  var range1 = sheet.getRange(tableStartRow+2, tableStartCol, tableHeight-2, 1);
  for(i=1; i<=amountExMal; i++){
    var range2 = sheet.getRange(tableStartRow+2, tableStartCol+i, tableHeight-2, 1)
    //var range = sheet.getRangeList(['A27:A32', 'C27:C32']);
    var chart = sheet.newChart()
    .setChartType(Charts.ChartType.COLUMN)
    //.addRange(sheet.getRange(tableStartRow + 2, tableStartCol+2, tableHeight-2, 1))
    .addRange(range1)
    .addRange(range2)
    .setPosition(tableStartRow + tableHeight+2, tableStartCol+i, 0, 0)
    .setOption('width', 130)
    .setOption('height', 315)
    .setOption('legend',{position: 'None'})
    .setOption('series',{"0":{ "items":{"0":{"color":"#e9f1fc"},"1":{"color":"#bcd4f5"},"2":{"color":"#90b7ee"},"3":{"color":"#649be8"},"4":{"color":"#377ee1"},"5":{"color":"#1954a6"}}}})
    .setOption('useFirstColumnAsDomain',true)
    .build();
    sheet.insertChart(chart);
  }
//  var url = "www.hemsida.se/abba/habba/sabba.html";
//  var splitz = url.split('/');
//  SpreadsheetApp.getUi().alert(splitz[splitz.length-1]);
//  chart.set
  //var chart = sheet.getCharts()[0];
  //chart = chart.modify();
  //chart.getRanges();
  //SpreadsheetApp.getUi().alert(chart.getRanges()[0].getA1Notation());
  //SpreadsheetApp.getUi().alert(chart.getRanges()[1].getA1Notation());
//  .setOption('title', 'Updated!')
//  .build();
  
  //sheet.updateChart(chart);



}


//function summarizeBloomLevelsForExamGoals(numberOfExamgoals, numberOfCourses){
//  
//  var examGoalsBloomLevels = [];
//  for(i=1; i<=numberOfExamgoals; i++){
//    var examgoalBloomLevel = summarizeBloomLevelsForExamgoal(i, numberOfCourses); 
//  }
//
//  
//
//}
//
//
//function summarizeBloomLevelsForExamgoal(examgoalNumber, numberOfCourses){
//  var bloomLevels = 6; 
//  var examgoalBloomLevel = [];
//  var examGo
//  
//  for(i=1; i<=bloomLevels; i++){
//  
//    var cell = sheet.getRange("B5");
//cell.setFormula("=SUM(B3:B4)");
//    
//  } 
//}


