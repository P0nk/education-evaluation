function onOpen() {
  var ui = SpreadsheetApp.getUi();
  // Or DocumentApp or FormApp.  
  ui.createMenu('Dashboard')
      .addItem('Load larandemal list', 'loadLarandemalList')
      .addItem('activate selected larandemal', 'activateLarandemal')
      .addItem('deactivate selected larandemal', 'deactivateLarandemal')
      .addItem('Update larandemal', 'larandemalUpdate')
      .addToUi(); 
}


function checkIfNotInMetadata(number, metadata){
  
  for(i=0; i<metadata.length; i++){
    //var typenum = typeof number;
    //var typemeta = typeof metadata[i].number;
    //SpreadsheetApp.getUi().alert("number: "+typenum+"metadatNum: "+ typemeta);
    if(metadata[i].number === number){
      return false; 
    }
  
  }
  return true;
}

function getLarandemalInMetadataBloomArray(number, metadata){
  for(i=0; i<metadata.length; i++){
    if(metadata[i].number === number){
      return metadata[i];
    }
  }
  return null; 
}

function larandemalUpdate(){
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getActiveSheet();
  var devMetaDataArray = sheet.getDeveloperMetadata();
  var progmalInfoObject = loadProgmalInfo();
  var devMetaDataString;
  var progmal;
  var count =0;
  for(var i=0; i<devMetaDataArray.length; i++){
    //SpreadsheetApp.getUi().alert(devMetaDataArray[i].getKey());
    if(devMetaDataArray[i].getKey() === "savedLarandemal"){
      devMetaDataString = devMetaDataArray[i].getValue();
      count++;
    }
    else if(devMetaDataArray[i].getKey() === "programmal"){
      progmal=devMetaDataArray[i].getValue();
      count++;
    }
    if(count === 2){
      break;
    }
  }
  var devMetaData = JSON.parse(devMetaDataString);
  //SpreadsheetApp.getUi().alert(devMetaDataString);
  //SpreadsheetApp.getUi().alert(sheet.getDeveloperMetadata()[0].getValue());
  //var devMetaData = JSON.parse(sheet.getDeveloperMetadata()[0]);
  //var regex = RegExp('.\.[1-6]\..'); Fungerar ej varför???
  //var regex = /.\.[1-6]\../;
  var regex = /[1-9][0-9]*\.[1-6]\.[1-9][0-9]*/;
  var valueColumn = 1; 
  var startRow = 1; 
  var endRow = sheet.getLastRow();
  var rowsWithLarandemal = parser(sheet, valueColumn, regex, startRow, endRow);
  //SpreadsheetApp.getUi().alert(rowsWithLarandemal);
  var larandemalInformation = []; 
  //SpreadsheetApp.getUi().alert(rowsWithLarandemal.length);
  for (i=0; i<rowsWithLarandemal.length; i++){
    //SpreadsheetApp.getUi().alert(extractLarandemalInformation(rowsWithLarandemal[i].toString()));
    //SpreadsheetApp.getUi().alert(sheet.getRange(rowsWithLarandemal[i],1).getValue());
    var larandemalInfo  = extractLarandemalInformation(sheet.getRange(rowsWithLarandemal[i],1).getValue());
    larandemalInfo.description = sheet.getRange(rowsWithLarandemal[i], 2).getValue();
    var aktivitet = sheet.getRange(rowsWithLarandemal[i], 7).getValue();
    //SpreadsheetApp.getUi().alert(aktivitet);
    //SpreadsheetApp.getUi().alert(aktivitet === true);
    if(aktivitet === true){
       larandemalInfo.aktiverat = 1;
    }
    else{
      larandemalInfo.aktiverat = 0; 
    }
    //larandemalInfo.aktiverat = sheet.getRange(rowsWithLarandemal[i], 7).getValue();
    larandemalInfo.newVersion = sheet.getRange(rowsWithLarandemal[i], 8).getValue();
    larandemalInformation.push(larandemalInfo);  
    //SpreadsheetApp.getUi().alert(i);
  }
  var numgoalsBloomlevel = [];
  
  for(var i=0; i<antalBloomNivaer; i++){
    numgoalsBloomlevel[i] = devMetaData[i].length;  
  }
  var newLarandemalToAdd = [];
  var larandemalToBeUpdated = [];
  
  for(var i=0; i<larandemalInformation.length; i++){
    //var a = larandemalInformation[i].description;
    //var b = devMetaData[larandemalInformation[i].bloomlevel-1][larandemalInformation[i].number-1].description;
    //SpreadsheetApp.getUi().alert(a);
    //SpreadsheetApp.getUi().alert(b);
    //SpreadsheetApp.getUi().alert(a !== b);
    if((checkIfNotInMetadata(larandemalInformation[i].number, devMetaData[larandemalInformation[i].bloomlevel-1])) || (larandemalInformation[i].newVersion === true)){
      //SpreadsheetApp.getUi().alert("New larandemal");
      var newLarandemal = {bloom: larandemalInformation[i].bloomlevel, description: larandemalInformation[i].description, 
      programmal: progmal, 
      nummer: larandemalInformation[i].number, aktiverat: larandemalInformation[i].aktiverat};
      if(larandemalInformation[i].newVersion === true){
        newLarandemal.version = getLarandemalInMetadataBloomArray(larandemalInformation[i].number, devMetaData[larandemalInformation[i].bloomlevel-1]).version +1;
        //devMetaData[larandemalInformation[i].bloomlevel-1][larandemalInformation[i].number-1].version +1;
      }
      else{
        newLarandemal.version = 1; 
      }
      
      newLarandemalToAdd.push(newLarandemal);
      //Need to add new larandemal
    }
    else{
      var updatedLarandemal = {};
      var count = 0;
      updatedLarandemal.description = larandemalInformation[i].description;
      var larandemalMetadata= getLarandemalInMetadataBloomArray(larandemalInformation[i].number,devMetaData[larandemalInformation[i].bloomlevel-1]);
      if(larandemalInformation[i].description !== larandemalMetadata.description){
         //SpreadsheetApp.getUi().alert("New description");
        //Need to change description 
        //var id = devMetaData[larandemalInformation[i].bloomlevel-1][larandemalInformation[i].number-1].id;
        //updatedLarandemal.description = larandemalInformation[i].description;
        count++;
      }
      updatedLarandemal.aktiverat = larandemalInformation[i].aktiverat;
      if(larandemalInformation[i].aktiverat !== larandemalMetadata.activated ){
        
        //SpreadsheetApp.getUi().alert("New aktiverat");
        //SpreadsheetApp.getUi().alert(larandemalInformation[i].aktiverat);
        //SpreadsheetApp.getUi().alert(devMetaData[larandemalInformation[i].bloomlevel-1][larandemalInformation[i].number-1].activated);
        count++;
      }
      updatedLarandemal.id = larandemalMetadata.id;
      if(count > 0){
        //SpreadsheetApp.getUi().alert(count);
        larandemalToBeUpdated.push(updatedLarandemal);
      }
    }
    
  
  }
  var newLarandemalToAddString = "";
  for(var i=0; i<newLarandemalToAdd.length; i++){
  
  newLarandemalToAddString +='bloomniva: '+newLarandemalToAdd[i].bloom+' examensmal: '+newLarandemalToAdd[i].examensmal+ ' nummer: '+ newLarandemalToAdd[i].nummer +' version: '+ newLarandemalToAdd[i].version+
  ' description: '+newLarandemalToAdd[i].description+' aktiverat:'+newLarandemalToAdd[i].aktiverat+'\n';
  
  }
  //SpreadsheetApp.getUi().alert(newLarandemalToAddString);
  var larandemalToBeUpdatedString = ""; 
  for(var i=0; i<larandemalToBeUpdated.length; i++){
  
    larandemalToBeUpdatedString+= 'id: ' +larandemalToBeUpdated[i].id + 'description: '+larandemalToBeUpdated[i].description+'\n';
  
  }
  //SpreadsheetApp.getUi().alert(larandemalToBeUpdatedString);
  
  if(newLarandemalToAdd.length !== 0){
    addNewLarandemal(newLarandemalToAdd);
  }
  if(larandemalToBeUpdated.length !== 0){
    updateLarandemal(larandemalToBeUpdated);
  }
  
  loadSingleLarandemalLista(parseInt(progmal));
  
  
  
  //SpreadsheetApp.getUi().alert(numgoalsBloomlevel);
  
//  var testString = "";
//  SpreadsheetApp.getUi().alert(larandemalInformation.length);
//  for(var i=0; i<larandemalInformation.length; i++){
//    testString+="Examensmål: "+larandemalInformation[i].examensmal+" bloomnivå: "+larandemalInformation[i].bloomniva+" nummer: "+larandemalInformation[i].nummer+"\n";
//  
//  }
//  SpreadsheetApp.getUi().alert(testString);



  
  

}


function activateLarandemal(){
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getActiveSheet();
  var selectedLarandemal = spreadsheet.getActiveRangeList().getRanges();
  var selectedLarandemalId = [];
  for(var i = 0; i<selectedLarandemal.length; i++){
    var metadataRowPosition = selectedLarandemal[i].getRow();
    var metadataRow = sheet.getRange(metadataRowPosition+":"+metadataRowPosition);
    //SpreadsheetApp.getUi().alert(metadataRow.getDeveloperMetadata());
    //SpreadsheetApp.getUi().alert(metadataRow.getDeveloperMetadata()[0].getValue());
    selectedLarandemalId[i] = metadataRow.getDeveloperMetadata()[0].getValue();
  
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
  for(var i = 0; i<selectedLarandemal.length; i++){
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
  //loadLarandemalListaToSheet();
  var ui = SpreadsheetApp.getUi();
  var result = ui.alert('Do you want to reload the larandemal. All information on sheets not in database will be removed!!!',
  ui.ButtonSet.YES_NO);
  
  if(result === ui.Button.YES){
    loadAllLarandemalLista();
    //loadLarandemalListaToSheet();
  }
  else{
    //Do nothing
  }
  
  
  
  
 // var ui = SpreadsheetApp.getUi();
  
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

function parser(sheet, valueColumn, regex, startRow, endRow){
  var rowsWithValue = [];

  for(var i = startRow; i<=endRow; i++){
    var currentCell = sheet.getRange(i, valueColumn);
    if(regex.test(currentCell.getValue())){
    
      rowsWithValue.push(i); 
    
    }

  }
  return rowsWithValue; 
}


function extractLarandemalInformation(string){
  var splitString = string.split('.');
  var larandemalInformation = {programmalNummer: parseInt(splitString[0]), bloomlevel: parseInt(splitString[1]), number: parseInt(splitString[2]) };
 
  return larandemalInformation; 



}

function onEdit(e) {
  // Set a comment on the edited cell to indicate when it was changed.
  var range = e.range;
  //var up = range.getNextDataCell(Direction.UP).getA1Notation(); 
  //SpreadsheetApp.getUi().alert("test");
  //SpreadsheetApp.getUi().alert(up);

  if(range.getColumn() === 1){
    if(e.oldValue === undefined){
      var sheet = SpreadsheetApp.getActive().getActiveSheet();
      var rowNumber = range.getRow();
      sheet.getRange(rowNumber, 2, 1, 5).merge();
      var checkboxRange = sheet.getRange(rowNumber, 7,1,2);
      checkboxRange.insertCheckboxes();  
    }
  }
  //range.setNote('Last modified: ' + new Date());
}


