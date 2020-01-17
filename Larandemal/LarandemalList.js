//Använd add och get developer metadata funktionerna på ranges. 
//Hämta markerade ranges I ranges list. För varje range hämta dess metadata
//Som i detta fall är lärandemålets Id, måste också hämtas!!
//
//Gör anrop till databasen 
//update aktivalarandemal
//Set aktiverat = 1 
//Where larandemal in (1,3,5)


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
 //SpreadsheetApp.getUi().alert(larandemalStructure);
 //return; //remove when done debugging.
 // TODO remove hard coding 'antalProgMalTyper'. Use progmalContainer to calculate instead.
 // Can add a new method in ProgramMalContainer which does the calculation.
 var progmalSortedByType = progmalContainer.getProgrammalSortedByType();
 //SpreadsheetApp.getUi().alert(progmalSortedByType.length);
 for(var i = 0; i < progmalSortedByType.length; i++){ 
 //Logger.log('progmalSortedByTypeIndex <%s> Length:<%s>', i, progmalSortedByType[i].list.length);
 //Logger.log('larandemalStructureIndex <%s> Length:<%s>', i, larandemalStructure[i].length);
 //for(var i = 0; i < antalProgMalTyper; i++){ 
   //Logger.log('i:<%s>', i);
   
   for(var j = 0; j < progmalSortedByType[i].list.length; j++){
   //for(var j = 0; j < larandemalStructure[i].length; j++){
     //Logger.log('Type:<%s>, Length:<%s>', (i+1), larandemalStructure[i].length);
     //Logger.log('j:<%s>', j);
     var progmal = progmalSortedByType[i].list[j];
     //var progmal = progmalContainer.getProgrammalByTypeNumber(i + 1, j + 1);
     if(progmal === null) {
       Logger.log('progmal with typ:<%s>, nummer:<%s> could not be found', (i + 1), (j + 1));
       continue;
     }
     loadLarandemalListaToSheet(larandemalStructure, progmal);
   }
 }
 //for(var i=0; i<1; i++){
    //SpreadsheetApp.getUi().alert(exmalInfo[i].nummer);
    //SpreadsheetApp.getUi().alert(i);
    //loadLarandemalListaToSheet(latestLarandemalObject, progmalInfo[i]);
  //}
  
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
  //var larandemalStructure = constructLarandemalStructure(progmalInfo);
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
/*
  Logger.log('progmalList length:<%s>', progmalInfo.progmalList.length);
  for(var i in progmalInfo.progmalList) {
    Logger.log('CONSTRUCT progmalInfo.progmalList[%s]:<%s>', i, progmalInfo.progmalList[i]);
  }
  
  for(var i in larandemalList) {
    Logger.log('CONSTRUCT larandemalList[%s]:<%s>', i, larandemalList[i]);
  }
*/
 this.typerMap = new Object([]);
 //this.typerMap = new Map([]);
 //var larandemalStructure = [];
 
 var progmalTyper = progmalInfo.getAllProgrammalTypes();
 for(var i = 0; i<progmalTyper.length; i++){
   var progmalMap = new Object();
   //var progmalMap = new Map([]);
   this.typerMap[progmalTyper[i]] =  progmalMap;
   //this.typerMap.set(progmalTyper[i], progmalMap);
 }
 for(var i = 0; i < progmalInfo.progmalList.length; i++) {
   var curProgmal = progmalInfo.progmalList[i];
   var bloomnivaer = new Object();
   //var bloomnivaer = new Map([]);
   for(var j =1; j<=antalBloomNivaer; j++){
     bloomnivaer[j] = [];
     //bloomnivaer.set(j, [])
   }
   this.typerMap[curProgmal.typ][curProgmal.nummer] =  bloomnivaer;
   //this.typerMap.get(curProgmal.typ).set(curProgmal.nummer, bloomnivaer);
 }
 
  // Fill structure with data
 for(var i in larandemalList){
    var larandemal = larandemalList[i];
    //Logger.log('Larandemal:<%s>', larandemal);
    var typ = larandemal.progmalTyp;
    var programmalNummer = larandemal.progmalNummer;
    var bloomNiva = larandemal.bloomNiva; 
    this.typerMap[typ][programmalNummer][bloomNiva].push(larandemal);
    //this.typerMap.get(typ).get(programmalNummer).get(bloomNiva).push(larandemal);
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
  //return this.typerMap.get(progmalTyp).get(progmalNummer).get(bloomniva);
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
  //return this.typerMap.get(progmalTyp).get(progmalNummer); 
}

 
 
 
 
 // Initialize 1st dimension in structure
// for(var i = 0; i < antalProgMalTyper; i++){ // TODO remove hard coding. Use param programmal to calculate.
//   var typ = [];
//   larandemalStructure.push(typ);
// }
 // Initialize 2nd and 3rd dimension in structure
 //Logger.log('ProgmalList length: '+progmalInfo.progmalList.length);
// for(var i = 0; i < progmalInfo.progmalList.length; i++) {
//    var progmal = [];
//    for(var j = 0; j < antalBloomNivaer; j++){
//      progmal[j] = [];   
//    }
//    
//    var curProgmal = progmalInfo.progmalList[i];
//    larandemalStructure[curProgmal.typ - 1].push(progmal);
// }
 
 // Fill structure with data
// for(var i in larandemalList){
//    var larandemal = larandemalList[i];
//    //Logger.log('Larandemal:<%s>', larandemal);
//    var typ = larandemal.progmalTyp;
//    var programmalNummer = larandemal.progmalNummer;
//    var bloomNiva = larandemal.bloomNiva; 
//    
//    var larandemalTyp = larandemalStructure[typ - 1];
//    var larandemalNummer = larandemalTyp[programmalNummer - 1];
//    var larandemalBloom = larandemalNummer[bloomNiva - 1];
//    larandemalBloom.push(larandemal);
//  }
  
  /* For debugging */
//  for(var i in larandemalStructure) {
//    Logger.log('    pmTyp:%s', i);
//    for(var j in larandemalStructure[i]) {
//      Logger.log('        pmNr:%s', j);
//      for(var k in larandemalStructure[i][j]) {
//       Logger.log('            bloomNr:%s', k);
//       for(var l in larandemalStructure[i][j][k]) {
//         Logger.log('                larandemal:%s, %s', l, larandemalStructure[i][j][k][l]);
//       }
//      }
//    }
//  }
//  
  //return larandemalStructure;
}

/** 
* Load a single sheet with all larandemal for a specified programmal
* @param{LarandemalStructure} larandemalStructure - contains a 4D array of all larandemal. typ/bloom/nummer/larandemal
* @param{ProgramMal} progmal - a ProgramMal object
* TODO: Move all sheet layout operations to new function(s). Maybe consolidate them in a new 'Layout.gs' script
*/
function loadLarandemalListaToSheet(larandemalStructure, progmal){
  Logger.log('PROGMAL:<%s>', progmal);
  //SpreadsheetApp.getUi().alert("Nummer: "+exmalInfo.nummer+" Description: "+exmalInfo.beskrivning);
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet(); 
  var progmalTitleTextStyle = SpreadsheetApp.newTextStyle().setFontSize(36).build();
  var progmalTextTextStyle = SpreadsheetApp.newTextStyle().setFontSize(12).build();
  var bloomTextStyle = SpreadsheetApp.newTextStyle().setFontSize(14).build();
  var larandemalTextTextStyle = SpreadsheetApp.newTextStyle().setFontSize(11).build();
  var larandemalNumericalCodeTextStyle = SpreadsheetApp.newTextStyle().setFontSize(10).build();
  var nyVersionText = 'Ny version?'
  var aktiveratText = 'Aktiverat';
  //SpreadsheetApp.getUi().alert(exmalInfo.nummer);
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
  //larandemalStructure.getLarandemal = function(progmalTyp,progmalNummer,bloomniva)
  sheet.addDeveloperMetadata('savedLarandemal', JSON.stringify(larandemalStructure.getLarandemal(progmal.typ,progmal.nummer)));
  //sheet.addDeveloperMetadata('savedLarandemal', JSON.stringify(larandemalStructure[progmal.typ-1][progmal.nummer-1]));
  sheet.addDeveloperMetadata('programmal', progmal.id);
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
    
  for(var i = 0; i < antalBloomNivaer; i++){
    var numberOfLarandemal = larandemalStructure.getLarandemalByBloomLevel(progmal.typ, progmal.nummer, (i+1)).length;
    //var numberOfLarandemal = larandemalStructure[progmal.typ - 1][progmal.nummer - 1][i].length;
    if(numberOfLarandemal === 0){
    //Nothing on this bloomlevel skip
    //SpreadsheetApp.getUi().alert('a'+j);
    //SpreadsheetApp.getUi().alert(latestLarandemalObject[i][j]);
      continue;
    }
    
    //SpreadsheetApp.getUi().alert('b'+j);
    // Old string formatting: var bloomString = progmal.nummer +'.'+(i+1)+' Lärandemål '+'(Bloom nivå '+(i+1)+' - '+ BLOOMLEVELS[i] +')';
    var bloomString = Utilities.formatString('%s.%s Lärandemål (Bloom nivå %s - %s)', progmal.nummer, (i + 1), (i + 1), BLOOMLEVELS[i]);
    //progmal.nummer +'.'+(i+1)+' Lärandemål '+'(Bloom nivå '+(i+1)+' - '+ BLOOMLEVELS[i] +')';
    var bloomText = sheet.getRange(currentSheetRow, 1, 2, 6);
    bloomText = bloomText.merge();
    bloomText.setValue(bloomString);
    bloomText.setHorizontalAlignment('left');
    bloomText.setVerticalAlignment('middle');
    //currentSheetRow+=bloomText.getNumRows() + 1;
    currentSheetRow += bloomText.getNumRows();
   
    for(var j = 0; j < numberOfLarandemal; j++){
      //Logger.log('larandemalStructure[<%s> - 1][<%s> - 1][<%s>]:<%s>', progmal.typ, progmal.nummer, larandemalStructure[progmal.typ - 1][progmal.nummer - 1][i], i);
       var larandemalNumericalCode = sheet.getRange(currentSheetRow, 1, 1, 1);
       // Old string formatting: var larandemalNumericalCodeString = progmal.nummer + '.' + (i + 1) + '.' + latestLarandemalObject[progmal.typ-1][progmal.nummer-1][i][j].number;
       // TODO fix this. idk why it doesn't work
       var curLarandemal = larandemalStructure.getLarandemalByBloomLevel(progmal.typ, progmal.nummer, (i+1))[j];
       var larandemalNumericalCodeString = Utilities.formatString('%s.%s.%s', progmal.nummer, (i + 1), curLarandemal.nummer);
       //var larandemalNumericalCodeString = Utilities.formatString('%s.%s.%s', progmal.nummer, (i + 1), larandemalStructure[progmal.typ - 1][progmal.nummer - 1][i][j].nummer);

       larandemalNumericalCode.setValue(larandemalNumericalCodeString);
       larandemalNumericalCode.setVerticalAlignment('top');
       larandemalNumericalCode.setHorizontalAlignment('right');
       larandemalNumericalCode.setTextStyle(larandemalNumericalCodeTextStyle)
       
       var larandemalText = sheet.getRange(currentSheetRow, 2, 1, 5);
       larandemalText = larandemalText.merge();
       larandemalText.setValue(curLarandemal.beskrivning);
       //larandemalText.setValue(larandemalStructure[progmal.typ - 1][progmal.nummer - 1][i][j].beskrivning);
       larandemalText.setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
       larandemalText.setVerticalAlignment('top');
       larandemalText.setHorizontalAlignment('left');
       larandemalText.setTextStyle(larandemalTextTextStyle);
       
       var checkboxRange = sheet.getRange(currentSheetRow, 7, 1, 2);
       checkboxRange.insertCheckboxes();
       //var metadataRowPosition = larandemalText.getRow();
       //var metadataRow = sheet.getRange(metadataRowPosition+":"+metadataRowPosition);
       //metadataRow.addDeveloperMetadata("id",latestLarandemalObject[i][j][k].id.toString());
       if(curLarandemal.aktiverat === 1) {
       //if(larandemalStructure[progmal.typ - 1][progmal.nummer - 1][i][j].aktiverat === 1) {
         larandemalText.setFontColor('black');
         checkboxRange.getCell(1, 1).setValue('TRUE');
       } 
       else if(curLarandemal.aktiverat === 0) {
       //else if(larandemalStructure[progmal.typ - 1][progmal.nummer - 1][i][j].aktiverat === 0) {
         larandemalText.setFontColor('gray');
       }
        //currentSheetRow+=larandemalText.getNumRows() + 1; 
        currentSheetRow += larandemalText.getNumRows();   
     }  
  }
  //SpreadsheetApp.getUi().alert(i);
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
