//Använd add och get developer metadata funktionerna på ranges. 
//Hämta markerade ranges I ranges list. För varje range hämta dess metadata
//Som i detta fall är lärandemålets Id, måste också hämtas!!
//
//Gör anrop till databasen 
//update aktivalarandemal
//Set aktiverat = 1 
//Where larandemal in (1,3,5)


function loadSingleLarandemalLista(programmal){
  var progmalInfo = loadProgmalInfo();
  var latestLarandemalObject = constructLatestLarandemalObject(progmalInfo);
  loadLarandemalListaToSheet(latestLarandemalObject, progmalInfo.getProgrammalById(programmal));
}

function cleanSheet(sheet){
  sheet.clear();
  var sheetImages = sheet.getImages();
  for(var i=0; i<sheetImages.length; i++){
    sheetImages[i].remove();
  }

}



function constructLatestLarandemalObject(progmalInfo){
 var latestLarandemal = loadLatestLarandemal();
 var latestLarandemalObject = [];
 for(var i = 0; i<antalProgMalTyper; i++){
   var typ = [];
   latestLarandemalObject.push(typ)
 }
 for(var i = 0; i<progmalInfo.progmalList.length; i++){
    var progmal = [];
    for(var j = 0; j < antalBloomNivaer; j++){
      progmal[j] = [];   
    }
    latestLarandemalObject[progmalInfo.progmalList[i].typ-1].push(progmal);  
 }
 var latestLarandemalLength = latestLarandemal.length;
  //SpreadsheetApp.getUi().alert(latestLarandemalLength);
 for(var i = 0; i<latestLarandemalLength; i++){
    //SpreadsheetApp.getUi().alert(i);
    var typ = latestLarandemal[i].programmalTyp;
    var bloomLevel = latestLarandemal[i].bloomLevel;
    var programmalNummer = latestLarandemal[i].programmalNummer; 
    var larandemal = {id: latestLarandemal[i].id, number: latestLarandemal[i].number, description: latestLarandemal[i].description, activated: latestLarandemal[i].aktiverat,
    version: latestLarandemal[i].version, programmal: latestLarandemal[i].programmal, programmalTyp: latestLarandemal[i].programmalTyp};
    //SpreadsheetApp.getUi().alert(larandemal);
    //SpreadsheetApp.getUi().alert(i);
    latestLarandemalObject[typ-1][programmalNummer-1][bloomLevel-1].push(larandemal);
  }
  return latestLarandemalObject;
  
}

function loadAllLarandemalLista(){
 //var exmalInfo = loadExmalInfo();
 var progmalInfo = loadProgmalInfo();
 var latestLarandemalObject = constructLatestLarandemalObject(progmalInfo);
 //for(var i=0; i<exmalInfo.length; i++){
   //SpreadsheetApp.getUi().alert("Nummer: "+exmalInfo[i].nummer+" Description: "+exmalInfo[i].beskrivning);
 //}
 //for(var i=0; i<progmalInfo.length; i++){
 for(var i=0; i<antalProgMalTyper; i++){
   for(var j=0; j<latestLarandemalObject[i].length; j++){
     loadLarandemalListaToSheet(latestLarandemalObject, progmalInfo.getProgrammalByTypeNumber(i+1,j+1));
   }
 }
 //for(var i=0; i<1; i++){
    //SpreadsheetApp.getUi().alert(exmalInfo[i].nummer);
    //SpreadsheetApp.getUi().alert(i);
    //loadLarandemalListaToSheet(latestLarandemalObject, progmalInfo[i]);
  //}
  
}




function loadLarandemalListaToSheet(latestLarandemalObject, progmal){
  //SpreadsheetApp.getUi().alert("Nummer: "+exmalInfo.nummer+" Description: "+exmalInfo.beskrivning);
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet(); 
  var progmalTitleTextStyle = SpreadsheetApp.newTextStyle().setFontSize(36).build();
  var progmalTextTextStyle = SpreadsheetApp.newTextStyle().setFontSize(12).build();
  var bloomTextStyle = SpreadsheetApp.newTextStyle().setFontSize(14).build();
  var larandemalTextTextStyle = SpreadsheetApp.newTextStyle().setFontSize(11).build();
  var larandemalNumericalCodeTextStyle = SpreadsheetApp.newTextStyle().setFontSize(10).build();
  var nyVersionText = 'Ny version'
  var aktiveratText = 'Aktiverat';
  //SpreadsheetApp.getUi().alert(exmalInfo.nummer);
  var currentProgmal = PROGMALTYPER[progmal.typ-1] +" "+progmal.nummer;
  var sheetName = currentProgmal;
  var sheet = spreadsheet.getSheetByName(sheetName);
  if(sheet === null){
     sheet = spreadsheet.insertSheet(sheetName);
  }
  else{
    sheet.clear();
    var devMetaData = sheet.getDeveloperMetadata();
    for(var i = 0; i<devMetaData.length; i++){
       devMetaData[i].remove();   
    }
    var sheetImages = sheet.getImages();
    for(var i=0; i<sheetImages.length; i++){
       sheetImages[i].remove();
    }
    sheet.getRange('G:H').removeCheckboxes();
  }
  sheet.addDeveloperMetadata("savedLarandemal", JSON.stringify(latestLarandemalObject[progmal.typ-1][progmal.nummer-1]));
  sheet.addDeveloperMetadata("programmal",progmal.id);
  var currentSheetRow = 0; 
  var progmalTitle = sheet.getRange(1,3,1,4);
  progmalTitle = progmalTitle.merge();
  progmalTitle.setValue(currentProgmal);
  progmalTitle.setTextStyle(progmalTitleTextStyle);
  progmalTitle.setVerticalAlignment('middle');
  progmalTitle.setHorizontalAlignment('center');
  var aktiveratRange = sheet.getRange(1,7);
  var nyVersionRange = sheet.getRange(1,8);
  nyVersionRange.setValue(nyVersionText);
  aktiveratRange.setValue(aktiveratText);
  sheet.setFrozenRows(1);
  currentSheetRow+= progmalTitle.getNumRows()+1; 
  var progmalText = sheet.getRange(currentSheetRow,1, 1, 6);
  progmalText = progmalText.merge();
  progmalText.setValue('Beskrivning: '+ progmal.beskrivning);
  progmalText.setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
  progmalText.setTextStyle(progmalTextTextStyle);
  progmalText.setVerticalAlignment('middle');
  progmalText.setHorizontalAlignment('left');
  currentSheetRow+=progmalText.getNumRows() + 2; 
    
  for(var i = 0; i< antalBloomNivaer; i++){
    var numberOfLarandemal = latestLarandemalObject[progmal.typ-1][progmal.nummer-1][i].length;
    if(numberOfLarandemal === 0){
    //Nothing on this bloomlevel skip
    //SpreadsheetApp.getUi().alert('a'+j);
    //SpreadsheetApp.getUi().alert(latestLarandemalObject[i][j]);
      continue;
    }
    //SpreadsheetApp.getUi().alert('b'+j);
    var bloomString = progmal.nummer +'.'+(i+1)+' Lärandemål '+'(Bloom nivå '+(i+1)+' - '+ BLOOMLEVELS[i] +')';
    var bloomText = sheet.getRange(currentSheetRow,1,2,6);
    bloomText = bloomText.merge();
    bloomText.setValue(bloomString);
    bloomText.setHorizontalAlignment('left');
    bloomText.setVerticalAlignment('middle');
    currentSheetRow+=bloomText.getNumRows() + 1;
   
    for(j = 0; j<numberOfLarandemal; j++){
       var larandemalNumericalCode = sheet.getRange(currentSheetRow,1,1,1);
       var larandemalNumericalCodeString = progmal.nummer+'.'+(i+1)+'.'+latestLarandemalObject[progmal.typ-1][progmal.nummer-1][i][j].number;
       larandemalNumericalCode.setValue(larandemalNumericalCodeString);
       larandemalNumericalCode.setVerticalAlignment('top');
       larandemalNumericalCode.setHorizontalAlignment('right');
       larandemalNumericalCode.setTextStyle(larandemalNumericalCodeTextStyle)
       var larandemalText = sheet.getRange(currentSheetRow,2,1,5);
       larandemalText = larandemalText.merge();
       larandemalText.setValue(latestLarandemalObject[progmal.typ-1][progmal.nummer-1][i][j].description);
       larandemalText.setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
       larandemalText.setVerticalAlignment('top');
       larandemalText.setHorizontalAlignment('left');
       larandemalText.setTextStyle(larandemalTextTextStyle);
       var checkboxRange = sheet.getRange(currentSheetRow,7,1,2);
       checkboxRange.insertCheckboxes();
       //var metadataRowPosition = larandemalText.getRow();
       //var metadataRow = sheet.getRange(metadataRowPosition+":"+metadataRowPosition);
       //metadataRow.addDeveloperMetadata("id",latestLarandemalObject[i][j][k].id.toString());
       if(latestLarandemalObject[progmal.typ-1][progmal.nummer-1][i][j].activated === 1){
            larandemalText.setFontColor("black");
            checkboxRange.getCell(1, 1).setValue("TRUE");
        }
        else if(latestLarandemalObject[progmal.typ-1][progmal.nummer-1][i][j].activated === 0){
          larandemalText.setFontColor("gray");
        }
        currentSheetRow+=larandemalText.getNumRows() + 1;             
     }
      
      
  }
  //SpreadsheetApp.getUi().alert(i);
}





















//function loadLarandemalListaToSheet() {
//  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
//  var latestLarandemal = loadLatestLarandemal();
//  
//  var latestLarandemalObject = [];
//  for(var i = 0; i<amountExMal; i++){
//    var exmal = [];
//    for(j = 0; j < antalBloomNivaer; j++){
//      exmal[j] = [];   
//    }
//    latestLarandemalObject[i]= exmal;  
//  }
//  var latestLarandemalLength = latestLarandemal.length;
//  //SpreadsheetApp.getUi().alert(latestLarandemalLength);
//  for(var i = 0; i<latestLarandemalLength; i++){
//    //SpreadsheetApp.getUi().alert(i);
//    var exmalNumber = latestLarandemal[i].examensmal; 
//    var bloomLevel = latestLarandemal[i].bloomLevel;
//    var larandemal = {id: latestLarandemal[i].id, number: latestLarandemal[i].number, description: latestLarandemal[i].description, activated: latestLarandemal[i].aktiverat,
//    version: latestLarandemal[i].version};
//    //SpreadsheetApp.getUi().alert(larandemal);
//    //SpreadsheetApp.getUi().alert(i);
//    latestLarandemalObject[exmalNumber-1][bloomLevel-1].push(larandemal);
//  }
//  
//  var latestLarandemalCurrentIndex = 0; 
//  var exmalInfo = loadExmalInfo();
//  var examgoalTitleTextStyle = SpreadsheetApp.newTextStyle().setFontSize(36).build();
//  var examgoalTextTextStyle = SpreadsheetApp.newTextStyle().setFontSize(12).build();
//  var bloomTextStyle = SpreadsheetApp.newTextStyle().setFontSize(14).build();
//  var larandemalTextTextStyle = SpreadsheetApp.newTextStyle().setFontSize(11).build();
//  var larandemalNumericalCodeTextStyle = SpreadsheetApp.newTextStyle().setFontSize(10).build();
//  var nyVersionText = 'Ny version'
//  var aktiveratText = 'Aktiverat';
//  //var newLearningGoalButtonBlob = DriveApp.getFilesByName("newLearningGoalButton.png").next().getBlob();
// for(var i = 0; i<amountExMal; i++){
//  //for(var i = 0; i<=0; i++){
//    var currentExamGoal = 'Examensmål '+(i+1);
//    var sheetName = currentExamGoal;
//    var sheet = spreadsheet.getSheetByName(sheetName);
//    if(sheet === null){
//      sheet = spreadsheet.insertSheet(sheetName);
//    }
//    else{
//      sheet.clear();
//      var devMetaData = sheet.getDeveloperMetadata();
//      for(j = 0; j<devMetaData.length; j++){
//        devMetaData[j].remove();   
//      }
//     var sheetImages = sheet.getImages();
//    // SpreadsheetApp.getUi().alert(sheetImages.length);
//      for(j=0; j<sheetImages.length; j++){
//        sheetImages[j].remove();
//      }
//      //var lastRow = sheet.getLastRow();
//      //SpreadsheetApp.getUi().alert(lastRow);
//      sheet.getRange('G:H').removeCheckboxes();
//      //SpreadsheetApp.flush();
//      //cleanSheet(sheet);
//    }
//    //SpreadsheetApp.getUi().alert(JSON.stringify(latestLarandemalObject[i]));
//    //JSON.parse(JSON.stringify(latestLarandemalObject[i]));
//    sheet.addDeveloperMetadata("savedLarandemal", JSON.stringify(latestLarandemalObject[i]));
//    var currentSheetRow = 0; 
//    var examgoalTitle = sheet.getRange(1,3,1,4);
//    examgoalTitle = examgoalTitle.merge();
//    examgoalTitle.setValue(currentExamGoal);
//    examgoalTitle.setTextStyle(examgoalTitleTextStyle);
//    examgoalTitle.setVerticalAlignment('middle');
//    examgoalTitle.setHorizontalAlignment('center');
//    var aktiveratRange = sheet.getRange(1,7);
//    var nyVersionRange = sheet.getRange(1,8);
//    
//    nyVersionRange.setValue(nyVersionText);
//    aktiveratRange.setValue(aktiveratText);
//    sheet.setFrozenRows(1);
//    currentSheetRow+= examgoalTitle.getNumRows()+1; 
//    var examgoalText = sheet.getRange(currentSheetRow,1, 1, 6);
//    examgoalText = examgoalText.merge();
//    examgoalText.setValue('Beskrivning: '+ exmalInfo[i].beskrivning);
//    examgoalText.setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
//    examgoalText.setTextStyle(examgoalTextTextStyle);
//    examgoalText.setVerticalAlignment('middle');
//    examgoalText.setHorizontalAlignment('left');
//    currentSheetRow+=examgoalText.getNumRows() + 2; 
//    
//    for(j = 0; j< antalBloomNivaer; j++){
//      var numberOfLarandemal = latestLarandemalObject[i][j].length;
//      if(numberOfLarandemal === 0){
//      //Nothing on this bloomlevel skip
//       //SpreadsheetApp.getUi().alert('a'+j);
//       //SpreadsheetApp.getUi().alert(latestLarandemalObject[i][j]);
//       continue;
//      }
//      //SpreadsheetApp.getUi().alert('b'+j);
//      var bloomString = (i+1)+'.'+(j+1)+' Lärandemål '+'(Bloom nivå '+(j+1)+' - '+ BLOOMLEVELS[j] +')';
//      var bloomText = sheet.getRange(currentSheetRow,1,2,6);
//      bloomText = bloomText.merge();
//      bloomText.setValue(bloomString);
//      bloomText.setHorizontalAlignment('left');
//      bloomText.setVerticalAlignment('middle');
//      currentSheetRow+=bloomText.getNumRows() + 1;
//      for(k = 0; k<numberOfLarandemal; k++){
//        var larandemalNumericalCode = sheet.getRange(currentSheetRow,1,1,1);
//        var larandemalNumericalCodeString = (i+1)+'.'+(j+1)+'.'+latestLarandemalObject[i][j][k].number;
//        larandemalNumericalCode.setValue(larandemalNumericalCodeString);
//        larandemalNumericalCode.setVerticalAlignment('top');
//        larandemalNumericalCode.setHorizontalAlignment('right');
//        larandemalNumericalCode.setTextStyle(larandemalNumericalCodeTextStyle)
//        var larandemalText = sheet.getRange(currentSheetRow,2,1,5);
//        larandemalText = larandemalText.merge();
//        larandemalText.setValue(latestLarandemalObject[i][j][k].description);
//        larandemalText.setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
//        larandemalText.setVerticalAlignment('top');
//        larandemalText.setHorizontalAlignment('left');
//        larandemalText.setTextStyle(larandemalTextTextStyle);
//        var checkboxRange = sheet.getRange(currentSheetRow,7,1,2);
//        checkboxRange.insertCheckboxes();
//        //var metadataRowPosition = larandemalText.getRow();
//        //var metadataRow = sheet.getRange(metadataRowPosition+":"+metadataRowPosition);
//        //metadataRow.addDeveloperMetadata("id",latestLarandemalObject[i][j][k].id.toString());
//        if(latestLarandemalObject[i][j][k].activated === 1){
//          larandemalText.setFontColor("black");
//          checkboxRange.getCell(1, 1).setValue("TRUE");
//          
//        }
//        else if(latestLarandemalObject[i][j][k].activated === 0){
//          larandemalText.setFontColor("gray");
//        }
//        currentSheetRow+=larandemalText.getNumRows() + 1;
//        //SpreadsheetApp.getUi().alert(bloomText.getNumRows());
//        //sheet.getRange(currentSheetRow, 1).setBackground('blue');
//        
//      }
////      var newLearningGoalButtonImage = sheet.insertImage(newLearningGoalButtonBlob, 2, currentSheetRow, 0, 0);
////        newLearningGoalButtonImage.setHeight(25);
////        newLearningGoalButtonImage.setWidth(200);
////        currentSheetRow+=2;
//      
//      
//      
//      
//    }
//    
//
//    
////    while(latestLarandemal[latestLarandemalCurrentIndex].examensmal === i){
////      //SpreadsheetApp.getUi().alert(counter);
////      sheet.GetRange
////      sheet.getRange(counter+1,2).setValue(latestLarandemal[latestLarandemalCurrentIndex].bloom); 
////      //sheet.getRange(counter+1,3).setValue(latestLarandemal[latestLarandemalCurrentIndex].examensmal); 
////      sheet.getRange(counter+1,4).setValue(latestLarandemal[latestLarandemalCurrentIndex].nummer);
////      counter++;
////      latestLarandemalCurrentIndex++;
////      if(latestLarandemalCurrentIndex === latestLarandemalLength){
////        break;
////      }
////    
////    }
//    
////    if(latestLarandemalCurrentIndex === latestLarandemalLength){
////        break;
////      }  
//  }
//  
////  var sheet = spreadsheet.getSheetByName(larandemalListSheetName);
////  //sheet not found create sheet 
////  if (sheet == null) {
////    //The new sheet becomes the active sheet automatically 
////    spreadsheet.insertSheet(larandemalListSheetName);
////  }
////  //else{
////  //var spreadsheet = SpreadsheetApp.getActive().setActiveSheet(larandemalListSheetName);
////  //}
////  var latestLarandemal = loadLatestLarandemal();
////  var sheet = SpreadsheetApp.getActive().getSheetByName(larandemalListSheetName);
////  for(var i = 0; i<latestLarandemal.length; i++){
////    sheet.getRange(i+1,2).setValue(latestLarandemal[i].bloom); 
////    sheet.getRange(i+1,3).setValue(latestLarandemal[i].examensmal); 
////    sheet.getRange(i+1,4).setValue(latestLarandemal[i].nummer); 
////  }  
//
//}


