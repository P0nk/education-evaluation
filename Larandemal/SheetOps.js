/**
* Function that is automatically called when the SpreadSheet (Lärandemålslista) is opened. 
*/
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  // Or DocumentApp or FormApp.  
  ui.createMenu('Lärandemålslista')
      .addItem('Ladda in alla lärandemål', 'initFullReload')
      .addItem('Spara och uppdatera lärandemål', 'larandemalUpdate')
      .addItem('Ange aktuellt program', 'setCurrentProgram')
      .addSeparator()
      .addSubMenu(ui.createMenu('Dev')
        //.addItem('activate selected larandemal', 'activateLarandemal')
        //.addItem('deactivate selected larandemal', 'deactivateLarandemal')
        .addItem('Visa bok-metadata', 'Common.displaySpreadsheetMetadata')
        .addItem('Visa blad-metadata', 'Common.displaySheetMetadata')
        .addItem('Lägg till bok-metadata', 'Common.addSpreadsheetMetadata')
        .addItem('Lägg till blad-metadata', 'Common.addSheetMetadata')
        .addItem('Ta bort bok-metadata', 'Common.deleteSpreadsheetMetadata')
        .addItem('Ta bort blad-metadata', 'Common.deleteSheetMetadata')
        )
      .addToUi(); 
}

/** 
* Clear visible content of a sheet
* @param {Sheet} sheet - the sheet to clear
*/
function cleanSheet(sheet){
  sheet.clear();
  var sheetImages = sheet.getImages();
  for(var i in sheetImages){
    sheetImages[i].remove();
  }
}


/** Open a prompt asking the user to accept a full reload of the spreadsheet.
* All sheets will be refreshed and populated, and new sheets may also appear.
*/
function initFullReload(){
  var ui = SpreadsheetApp.getUi();
  var alertText = 'Vill du ladda in lärandemålen? Information som du angett i arbetsboken som ej har sparats i databasen kommer att tas bort!!!';
  var result = ui.alert(alertText, ui.ButtonSet.YES_NO);
  if(result === ui.Button.YES){
    loadAllLarandemalLista();
  } else {
    //Do nothing
  }
}
  
  
/**
* Retrieves the larandemal with the given number (nummer) from the given metadata
* @param {Number} nummer - the nummer of the larandemal
* @param {Larandemal []} metadata - an array of larandemal retrieved from metadata 
* @return {Larandemal} - the found larandemal, if no larandemal is found null is returned 
*/
function getLarandemalInMetadataBloomArray(nummer, metadata){
  for(var i in metadata){
    if(metadata[i].nummer === nummer){
      return metadata[i];
    }
  }
  return null; 
}

/**
* Allows the user to enter the programcode for the program he/she wants to make active via a prompt. Information
* about the activated program is stored in the Spreadsheet.
*/
function setCurrentProgram() {
  var ui = SpreadsheetApp.getUi();
  var response = ui.prompt('Ange programkod för det program som ska lista sina lärandemål', ui.ButtonSet.OK_CANCEL);
  
  if(response.getSelectedButton().OK) {
    var responseText = response.getResponseText();
    var mode = 1;
    Common.deleteAllDevData(mode, 'program');
    Common.addDevData(mode, 'program', responseText);
  }
}

/**
* Retrieves information written by the user on the current sheet and uses it combined with
* the metadata stored in the sheet to determine what larandemal should be added or updated in the database.
* After this is done the function reloads the sheet with the new/updated data. 
*/
function larandemalUpdate(){
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getActiveSheet();
  var devMetaDataArray = sheet.getDeveloperMetadata();
  var con = Common.establishDbConnection();
  var progmalInfoObject = loadProgmalInfo(con);
  var devMetaDataString;
  var progmal;
  var count = 0;
  
  for(var i in devMetaDataArray){
    //SpreadsheetApp.getUi().alert(devMetaDataArray[i].getKey());
    if(devMetaDataArray[i].getKey() === 'savedLarandemal') {
      devMetaDataString = devMetaDataArray[i].getValue();
      count++;
    } else if(devMetaDataArray[i].getKey() === 'programmal') {
      progmal = devMetaDataArray[i].getValue();
      count++;
    }
    
    // Only two specific entries of metadata are interesting, the rest are not used
    if(count === 2){
      break;
    }
  }
  //SpreadsheetApp.getUi().alert(devMetaDataString);
  var devMetaData = JSON.parse(devMetaDataString);
  //SpreadsheetApp.getUi().alert(sheet.getDeveloperMetadata()[0].getValue());
  //var devMetaData = JSON.parse(sheet.getDeveloperMetadata()[0]);
  //var regex = RegExp('.\.[1-6]\..'); Fungerar ej varför???
  //var regex = /.\.[1-6]\../;
  var regex = /^[1-9][0-9]*\.[1-6]\.[1-9][0-9]*$/;
  var valueColumn = 1; 
  var startRow = 1; 
  var endRow = sheet.getLastRow();
  var rowsWithLarandemal = parser(sheet, valueColumn, regex, startRow, endRow);
  //SpreadsheetApp.getUi().alert(rowsWithLarandemal);
  var larandemalInformation = []; 
  //SpreadsheetApp.getUi().alert(rowsWithLarandemal.length);
  for (var i = 0; i < rowsWithLarandemal.length; i++) {
    //SpreadsheetApp.getUi().alert(extractLarandemalInformation(rowsWithLarandemal[i].toString()));
    //SpreadsheetApp.getUi().alert(sheet.getRange(rowsWithLarandemal[i],1).getValue());
    // 1st column is the larandemal identifier
    var larandemalInfo  = extractLarandemalInformation(sheet.getRange(rowsWithLarandemal[i], 1).getValue());
    // 2nd column is the description text
    larandemalInfo.beskrivning = sheet.getRange(rowsWithLarandemal[i], 2).getValue();
    // 7th column is the checkbox for activity
    var aktivitet = sheet.getRange(rowsWithLarandemal[i], 7).getValue();
    //SpreadsheetApp.getUi().alert(aktivitet);
    //SpreadsheetApp.getUi().alert(aktivitet === true);
    if(aktivitet === true){
      larandemalInfo.aktiverat = 1;
    } else {
      larandemalInfo.aktiverat = 0; 
    }
    //larandemalInfo.aktiverat = sheet.getRange(rowsWithLarandemal[i], 7).getValue();
    // 8th column is the checkbox for version
    larandemalInfo.newVersion = sheet.getRange(rowsWithLarandemal[i], 8).getValue();
    larandemalInformation.push(larandemalInfo);  
    //SpreadsheetApp.getUi().alert(i);
  }
  var numgoalsBloomlevel = [];
   //SpreadsheetApp.getUi().alert('bla');
//  for(var i in antalBloomNivaer){
//    numgoalsBloomlevel[i] = devMetaData[i].length;  
//  }
  for(var i in devMetaData){
    //SpreadsheetApp.getUi().alert(i);
    numgoalsBloomlevel[i] = devMetaData[i].length;  
  }
  var newLarandemalToAdd = [];
  var larandemalToBeUpdated = [];
  
  for(var i in larandemalInformation){
    //var a = larandemalInformation[i].description;
    //var b = devMetaData[larandemalInformation[i].bloomlevel-1][larandemalInformation[i].number-1].description;
    //SpreadsheetApp.getUi().alert(a);
    //SpreadsheetApp.getUi().alert(b);
    //SpreadsheetApp.getUi().alert(a !== b);
    if((checkIfNummerNotInMetadata(larandemalInformation[i].nummer, devMetaData[larandemalInformation[i].bloomNiva])) || (larandemalInformation[i].newVersion === true)){
      //SpreadsheetApp.getUi().alert("New larandemal");
      var programmal = progmal;
      var bloomNiva = larandemalInformation[i].bloomNiva; 
      var nummer = larandemalInformation[i].nummer;
      var beskrivning = larandemalInformation[i].beskrivning;
      var aktiverat = larandemalInformation[i].aktiverat;
      var newLarandemal = new NewLarandeMal(programmal, bloomNiva, nummer, beskrivning, aktiverat);
      
      if(larandemalInformation[i].newVersion === true){
        //newLarandemal.version = getLarandemalInMetadataBloomArray(larandemalInformation[i].nummer, devMetaData[larandemalInformation[i].bloomNiva]).version + 1;
        var oldLarandemal =  getLarandemalInMetadataBloomArray(larandemalInformation[i].nummer, devMetaData[larandemalInformation[i].bloomNiva]);
        if(oldLarandemal === null){
           newLarandemal.version = 1; 
        }
        else{
          newLarandemal.version = oldLarandemal.version + 1; 
        }

        //devMetaData[larandemalInformation[i].bloomlevel-1][larandemalInformation[i].number-1].version +1;
      } else {
        newLarandemal.version = 1; 
      }
      
      newLarandemalToAdd.push(newLarandemal);
      //Need to add new larandemal
    } else {
      //var updatedLarandemal = {};
      var count = 0;
      //updatedLarandemal.beskrivning = larandemalInformation[i].beskrivning;
      //var updatedBeskrivning = larandemalInformation[i].beskrivning;
      var larandemalMetadata= getLarandemalInMetadataBloomArray(larandemalInformation[i].nummer,devMetaData[larandemalInformation[i].bloomNiva]);
      if(larandemalInformation[i].beskrivning !== larandemalMetadata.beskrivning){
         //SpreadsheetApp.getUi().alert("New description");
        //Need to change description 
        //var id = devMetaData[larandemalInformation[i].bloomlevel-1][larandemalInformation[i].number-1].id;
        //updatedLarandemal.description = larandemalInformation[i].description;
        count++;
      }
      //updatedLarandemal.aktiverat = larandemalInformation[i].aktiverat;
      //var updatedAktiverat = larandemalInformation[i].aktiverat;
      if(larandemalInformation[i].aktiverat !== larandemalMetadata.aktiverat) {
        
        //SpreadsheetApp.getUi().alert("New aktiverat");
        //SpreadsheetApp.getUi().alert(larandemalInformation[i].aktiverat);
        //SpreadsheetApp.getUi().alert(devMetaData[larandemalInformation[i].bloomlevel-1][larandemalInformation[i].number-1].activated);
        count++;
      }
      //updatedLarandemal.id = larandemalMetadata.id;
      //var updatedId = larandemalMetadata.id;
      if(count > 0) {
        //SpreadsheetApp.getUi().alert(count);
        var updatedBeskrivning = larandemalInformation[i].beskrivning;
        var updatedAktiverat = larandemalInformation[i].aktiverat;
        var updatedId = larandemalMetadata.id;
        var updatedLarandemal = new UpdatedLarandemal(updatedBeskrivning, updatedAktiverat, updatedId);
        larandemalToBeUpdated.push(updatedLarandemal);
      }
    }
    
  
  }
  
  /** For debugging 
  var newLarandemalToAddString = '';
  for(var i = 0; i < newLarandemalToAdd.length; i++){
    newLarandemalToAddString += Utilities.formatString('bloomniva: %s examensmal: %s nummer: %s version: %s description: %s aktiverat: %s\n',
      newLarandemalToAdd[i].bloom, newLarandemalToAdd[i].examensmal, newLarandemalToAdd[i].nummer,
      newLarandemalToAdd[i].version, newLarandemalToAdd[i].description,newLarandemalToAdd[i].aktiverat)
  }
  SpreadsheetApp.getUi().alert(newLarandemalToAddString);
  */
  
  /** For debugging
  var larandemalToBeUpdatedString = ""; 
  for(var i = 0; i < larandemalToBeUpdated.length; i++){
    larandemalToBeUpdatedString += Utilities.formatString('id: %s description: %s\n',
      larandemalToBeUpdated[i].id, larandemalToBeUpdated[i].description)
  }
  SpreadsheetApp.getUi().alert(larandemalToBeUpdatedString);
  */
  
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

/** 
* (Deprecated)
* Retrieves the selected larandemal from the sheet and retrieves their id.   
* The id is used to activate the selected larandemal in the database.
* Afterwards all sheets are reloaded with information from the database.
*/
function activateLarandemal(){
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getActiveSheet();
  var selectedLarandemal = spreadsheet.getActiveRangeList().getRanges();
  var selectedLarandemalId = [];
  for(var i in selectedLarandemal){
    var metadataRowPosition = selectedLarandemal[i].getRow();
    var metadataRow = sheet.getRange(metadataRowPosition + ":" + metadataRowPosition);
    //SpreadsheetApp.getUi().alert(metadataRow.getDeveloperMetadata());
    //SpreadsheetApp.getUi().alert(metadataRow.getDeveloperMetadata()[0].getValue());
    selectedLarandemalId[i] = metadataRow.getDeveloperMetadata()[0].getValue();
  
  }
  var activate = 1; 
  activateOrDeactivateLarandemal(selectedLarandemalId, activate);
  initFullReload();
}

/** 
* (Deprecated)
* Retrieves the selected larandemal from the sheet and retrieves their id.   
* The id is used to deactivate the selected larandemal in the database.
* Afterwards all sheets are reloaded with information from the database.
*/
function deactivateLarandemal(){
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getActiveSheet();
  var selectedLarandemal = spreadsheet.getActiveRangeList().getRanges();
  var selectedLarandemalId = [];
  for(var i in selectedLarandemal) {
    var metadataRowPosition = selectedLarandemal[i].getRow();
    var metadataRow = sheet.getRange(metadataRowPosition + ":" + metadataRowPosition);
    selectedLarandemalId[i] = metadataRow.getDeveloperMetadata()[0].getValue();
    //selectedLarandemalId[i] = selectedLarandemal[i].getDeveloperMetadata().getValue();
  }
  var activate = 0;
  activateOrDeactivateLarandemal(selectedLarandemalId, activate);
  initFullReload();

}

/**
* Parses the rows between and including startRow and endRow. The indexes of the rows whos value, in the cell given by the intersection
* of the row and valueColumn, matches the regular expression regex are returned. 
* @param {Sheet} sheet - the sheet to parse
* @param {Number} valueColumn -  the column to parse 
* @param {RegEx} regex -  a regular expression used to select which row numbers to return
* @param {Number} startRow - the first row the parser should check 
* @param {Number} endRow -  the last row the parser should check 
* @return {Number []} - the indexes of the rows whos cell at the intersection of the row and valueColumn matched the regular expression regex
*/
function parser(sheet, valueColumn, regex, startRow, endRow){
  var rowsWithValue = [];

  for(var i = startRow; i <= endRow; i++){
    var currentCell = sheet.getRange(i, valueColumn);
    if(regex.test(currentCell.getValue())){
      rowsWithValue.push(i); 
    }
  }
  return rowsWithValue; 
}

/** Extract the components of a larandemal identifying string
* @param string - the identifying string: format a.b.c, a=programmalNummer, b=bloomNiva, c=nummer
* @returns {LarandeMalIdentifier} - contains information about the larandemals programmalnummer, bloomniva and nummer. 
*/
function extractLarandemalInformation(string){
  var splitString = string.split('.');
  var progmalNummer = parseInt(splitString[0]);
  var bloomNiva = parseInt(splitString[1]);
  var nummer = parseInt(splitString[2]);
  var larandemalIdentifier = new LarandeMalIdentifier(progmalNummer, bloomNiva, nummer);
 
  return larandemalIdentifier;
}

/**
* Function that is called whenever a cell in the Spreadsheet is edited.
* The function is used to autocreate a template for a new larandemal when the user begins typing in
* a larandemal identifying string in a first column cell that previously didn't contain any information. 
* The function also makes sure that if the user types in a larandemal identifying string that is already in use the cell is colored red and an error message 
* is shown asking the user to enter another string. 
*/
function onEdit(e) {
  var range = e.range;
  if(range.getColumn() === 1){
    var sheet = SpreadsheetApp.getActive().getActiveSheet();
    var rowNumber = range.getRow();
    if(e.oldValue === undefined){
      sheet.getRange(rowNumber, 2, 1, 5).merge();
      var checkboxRange = sheet.getRange(rowNumber, 7, 1, 2);
      checkboxRange.insertCheckboxes();  
    }
    var newValue = range.getValue();
    var regex = new RegExp('\^'+newValue+'\$');
    var valueColumn = 1;
    var startRow = 1; 
    var endRow = sheet.getLastRow();
    var rowsWithSameValue = parser(sheet, valueColumn, regex, startRow, endRow);
    var count = 0; 
    for(i in rowsWithSameValue){
      if(rowsWithSameValue[i] !== rowNumber){
        range.setBackground('red');
        range.setValue('Ett lärandemål med sifferkombinationen '+ newValue +' existerar redan. Vänligen skriv in en annan sifferkombination.');
        count++;
        break; 
      }
    }
    if(count === 0){
      range.setBackground('white');
    }
 }
  
}




