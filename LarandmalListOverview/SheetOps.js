function onOpen() {
  var ui = SpreadsheetApp.getUi();
  // Or DocumentApp or FormApp.  
  ui.createMenu('Dashboard')
      .addItem('Load larandemal list', 'loadLarandemalList')
      .addItem('activate selected larandemal', 'activateLarandemal')
      .addItem('deactivate selected larandemal', 'deactivateLarandemal')
      .addToUi(); 
}

function activateLarandemal(){
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getActiveSheet();
  var selectedLarandemal = spreadsheet.getActiveRangeList().getRanges();
  var selectedLarandemalId = [];
  for(i = 0; i<selectedLarandemal.length; i++){
    var metadataRowPosition = selectedLarandemal[i].getRow();
    var metadataRow = sheet.getRange(metadataRowPosition+":"+metadataRowPosition);
    //SpreadsheetApp.getUi().alert(metadataRow.getDeveloperMetadata());
    //SpreadsheetApp.getUi().alert(metadataRow.getDeveloperMetadata()[0].getValue());
    selectedLarandemalId[i] = metadataRow.getDeveloperMetadata()[0].getValue()
  
  }
  var activate = 1; 
  activateOrDeactivateLarandemal(selectedLarandemalId, activate);
  loadLarandemalList();
}


function deactivateLarandemal(){
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getActiveSheet();
  var selectedLarandemal = spreadsheet.getActiveRangeList().getRanges();
  var selectedLarandemalId = [];
  for(i = 0; i<selectedLarandemal.length; i++){
    var metadataRowPosition = selectedLarandemal[i].getRow();
    var metadataRow = sheet.getRange(metadataRowPosition+":"+metadataRowPosition);
    selectedLarandemalId[i] = metadataRow.getDeveloperMetadata()[0].getValue()
    //selectedLarandemalId[i] = selectedLarandemal[i].getDeveloperMetadata().getValue();
  }
  var activate = 0;
  activateOrDeactivateLarandemal(selectedLarandemalId, activate);
  loadLarandemalList();

}

function loadLarandemalList(){
//  var  spreadsheet = SpreadsheetApp.getActive();
//  var activeSheet = SpreadsheetApp.getActiveSheet();
  loadLarandemalListaToSheet();
  //var ui = SpreadsheetApp.getUi();
//  if(activeSheet.getName() === larandemalListSheetName){
//    
//    var result = ui.alert(
//    'Loading finished',
//    ui.ButtonSet.OK);
//    
//  }
//  else{
//    
//    var result = ui.alert(
//    'Loading finished', 'Navigate to LarandemalLista?',
//    ui.ButtonSet.YES_NO);
//  
//  if(result === ui.Button.YES){
//    SpreadsheetApp.setActiveSheet(spreadsheet.getSheetByName(larandemalListSheetName))
//  }
//  else{
//    SpreadsheetApp.setActiveSheet(activeSheet);
//  }
//  
//  }
  
 
}


