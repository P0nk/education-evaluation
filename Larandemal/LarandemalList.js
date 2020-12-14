/** 
* Refresh the whole spreadsheet with information from the database, 
* which means all sheets will be updated.
*/
function loadAllLarandemalLista(){ 
 var con = Common.establishDbConnection();
 
 // Load data about all programmal
 var progmalContainer = loadProgmalInfo(con);
 removeSheetsNotInProgram(progmalContainer); 
 
 // Load data about all larandemal
 var larandemalList = loadLarandemal(con);
 
 // Structure all larandemal into a multi-dimensional array
 var larandemalStructure = new LarandemalStructure(progmalContainer, larandemalList);
 var progmalSortedByType = progmalContainer.getProgrammalSortedByType();
 for(var i = 0; i < progmalSortedByType.length; i++){    
   for(var j = 0; j < progmalSortedByType[i].list.length; j++){
     var progmal = progmalSortedByType[i].list[j];
     if(progmal === null) {
       Logger.log('progmal with typ:<%s>, nummer:<%s> could not be found', (i + 1), (j + 1));
       continue;
     }
     loadLarandemalListaToSheet(larandemalStructure, progmal);
   }
 }
}

/**
* Reloads the sheet for the given programmal 
* @param {Number} programmal - id of a programmal
*/
function loadSingleLarandemalLista(programmal){
  var con = Common.establishDbConnection();
  var progmalContainer = loadProgmalInfo(con);
  var larandemalList = loadLarandemal(con);
  var larandemalStructure = new LarandemalStructure(progmalContainer, larandemalList);
  loadLarandemalListaToSheet(larandemalStructure, progmalContainer.getProgrammalById(programmal));
}

/** 
* Create an object containing a 4D array structure containing all larandemal. The object also has get functions
* that can be used to retrieve larandemal using different parameters
* @param {ProgramMalContainer} progmalInfo - a ProgramMalContainer
* @param {LarandeMal []} larandemalList - array of LarandeMal
* @returns {LarandemalStructure} - Object with 4D array, 1: programmalTyp, 2: programmalNummer, 3: bloomNiva, 4: LarandeMal, and get functions. 
*/
function LarandemalStructure(progmalInfo, larandemalList){
 this.typerMap = new Object([]);
 var progmalTyper = progmalInfo.getAllProgrammalTypes();
 for(var i = 0; i<progmalTyper.length; i++){
   var progmalMap = new Object();
   this.typerMap[progmalTyper[i]] =  progmalMap;
 }
 for(var i = 0; i < progmalInfo.progmalList.length; i++) {
   var curProgmal = progmalInfo.progmalList[i];
   var bloomnivaer = new Object();
   for(var j =1; j<=antalBloomNivaer; j++){
     bloomnivaer[j] = [];
   }
   this.typerMap[curProgmal.typ][curProgmal.nummer] =  bloomnivaer;
 }
 
  // Fill structure with data
 for(var i in larandemalList){
    var larandemal = larandemalList[i];
    var typ = larandemal.progmalTyp;
    var programmalNummer = larandemal.progmalNummer;
    var bloomNiva = larandemal.bloomNiva; 
    this.typerMap[typ][programmalNummer][bloomNiva].push(larandemal);
  }
/**
* Retrieves from the LarandemalStructure the larandemal belonging to the given programmal type, number
* and bloomniva. 
* @param {Number} progmalTyp - the type of the programmal
* @param {Number} progmalNummer - the number of the programmal according to its type 
* @param {Number} bloomniva - the bloomniva from which to retrieve larandemal
* @return {Larandemal []} - an array of larandemal for the given programmal type, number and bloomniva
*/
  this.getLarandemalByBloomLevel = function(progmalTyp,progmalNummer,bloomniva){
    return this.typerMap[progmalTyp][progmalNummer][bloomniva];
  }
/**
* Retrieves from the LarandemalStructure the larandemal belonging to the given programmal type and number
* without specifying a bloomniva.  
* @param {Number} progmalTyp - the type of the programmal
* @param {Number} progmalNummer - the number of the programmal according to its type 
* @return {Larandemal [][]} - a 2D-array of larandemal for the given programmal type and number 
*/
  this.getLarandemal = function(progmalTyp, progmalNummer){
    return this.typerMap[progmalTyp][progmalNummer]; 
  }

}

/** 
* Load a single sheet with all larandemal for a specified programmal
* @param{LarandemalStructure} larandemalStructure - contains a 4D array of all larandemal. typ/bloom/nummer/larandemal
* @param{ProgramMal} progmal - a ProgramMal object
* TODO: Move all sheet layout operations to new function(s). Maybe consolidate them in a new 'Layout.gs' script
*/
function loadLarandemalListaToSheet(larandemalStructure, progmal){
  Logger.log('PROGMAL:<%s>', progmal);
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet(); 
  var progmalTitleTextStyle = SpreadsheetApp.newTextStyle().setFontSize(36).build();
  var progmalTextTextStyle = SpreadsheetApp.newTextStyle().setFontSize(12).build();
  var bloomTextStyle = SpreadsheetApp.newTextStyle().setFontSize(14).build();
  var larandemalTextTextStyle = SpreadsheetApp.newTextStyle().setFontSize(11).build();
  var larandemalNumericalCodeTextStyle = SpreadsheetApp.newTextStyle().setFontSize(10).build();
  var nyVersionText = 'Ny version?'
  var aktiveratText = 'Aktiverat';
  var currentProgmal = Utilities.formatString('%s %s', progmal.typText, progmal.nummer);
  var sheetName = currentProgmal;
  var sheet = spreadsheet.getSheetByName(sheetName);
  
  if(sheet === null) {
     sheet = spreadsheet.insertSheet(sheetName);
  } else {
    sheet.clear();
    var devMetaData = sheet.getDeveloperMetadata();
    for(var i in devMetaData){
       devMetaData[i].remove();   
    }
    var sheetImages = sheet.getImages();
    for(var i in sheetImages){
       sheetImages[i].remove();
    }
    sheet.getRange('G:H').removeCheckboxes();
  }
  sheet.addDeveloperMetadata('savedLarandemal', JSON.stringify(larandemalStructure.getLarandemal(progmal.typ,progmal.nummer)));
  sheet.addDeveloperMetadata('programmal', progmal.id);
  sheet.addDeveloperMetadata('programmalNummer', progmal.nummer);
  var currentSheetRow = 0; 
  var progmalTitle = sheet.getRange(1, 3, 1, 4);
  progmalTitle = progmalTitle.merge();
  progmalTitle.setValue(currentProgmal);
  progmalTitle.setTextStyle(progmalTitleTextStyle);
  progmalTitle.setVerticalAlignment('middle');
  progmalTitle.setHorizontalAlignment('center');
  var aktiveratRange = sheet.getRange(1, 7);
  var nyVersionRange = sheet.getRange(1, 8);
  nyVersionRange.setValue(nyVersionText);
  aktiveratRange.setValue(aktiveratText);
  sheet.setFrozenRows(1);
  currentSheetRow += progmalTitle.getNumRows() + 1; 
  
  var progmalText = sheet.getRange(currentSheetRow, 1, 1, 6);
  progmalText = progmalText.merge();
  progmalText.setValue('Beskrivning: ' + progmal.beskrivning);
  progmalText.setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
  progmalText.setTextStyle(progmalTextTextStyle);
  progmalText.setVerticalAlignment('middle');
  progmalText.setHorizontalAlignment('left');
  currentSheetRow += progmalText.getNumRows() + 2; 
  var bloomNames = Common.BLOOM;
  for(var i = 0; i < antalBloomNivaer; i++){
    var numberOfLarandemal = larandemalStructure.getLarandemalByBloomLevel(progmal.typ, progmal.nummer, (i+1)).length;
    if(numberOfLarandemal === 0){
    //Nothing on this bloomlevel skip
      continue;
    }
    var bloomString = Utilities.formatString('%s.%s Lärandemål (Bloom nivå %s - %s)', progmal.nummer, (i + 1), (i + 1), bloomNames[i]);
    var bloomText = sheet.getRange(currentSheetRow, 1, 2, 6);
    bloomText = bloomText.merge();
    bloomText.setValue(bloomString);
    bloomText.setHorizontalAlignment('left');
    bloomText.setVerticalAlignment('middle');
    currentSheetRow += bloomText.getNumRows();
   
    for(var j = 0; j < numberOfLarandemal; j++){
       var larandemalNumericalCode = sheet.getRange(currentSheetRow, 1, 1, 1);
       var curLarandemal = larandemalStructure.getLarandemalByBloomLevel(progmal.typ, progmal.nummer, (i+1))[j];
       var larandemalNumericalCodeString = Utilities.formatString('%s.%s.%s', progmal.nummer, (i + 1), curLarandemal.nummer);
       larandemalNumericalCode.setValue(larandemalNumericalCodeString);
       larandemalNumericalCode.setVerticalAlignment('top');
       larandemalNumericalCode.setHorizontalAlignment('right');
       larandemalNumericalCode.setTextStyle(larandemalNumericalCodeTextStyle)
       var larandemalText = sheet.getRange(currentSheetRow, 2, 1, 5);
       larandemalText = larandemalText.merge();
       larandemalText.setValue(curLarandemal.beskrivning);
       larandemalText.setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
       larandemalText.setVerticalAlignment('top');
       larandemalText.setHorizontalAlignment('left');
       larandemalText.setTextStyle(larandemalTextTextStyle);
       
       var checkboxRange = sheet.getRange(currentSheetRow, 7, 1, 2);
       checkboxRange.insertCheckboxes();
       if(curLarandemal.aktiverat === 1) {
         larandemalText.setFontColor('black');
         checkboxRange.getCell(1, 1).setValue('TRUE');
       } 
       else if(curLarandemal.aktiverat === 0) {
         larandemalText.setFontColor('gray');
       }
        currentSheetRow += larandemalText.getNumRows();   
     }  
  }
}

/** Removes the sheets for programmal not belonging to the currently selected program
* @param {ProgramMalContainer} progmalContainer - Contains the progmal used by the currently selected program 
*/
function removeSheetsNotInProgram(progmalContainer){
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = spreadsheet.getSheets();
  for(sheet in sheets) {
        var progmmalId = Common.getDevDataSheet(sheets[sheet], 'programmal');
        //the sheet doesn't have programmal metadata so it's ignored. 
        if(progmmalId == null){
          continue; 
        }
        if(progmalContainer.getProgrammalById(progmmalId) === null){
          spreadsheet.deleteSheet(sheets[sheet]);
        }   
  }
}
