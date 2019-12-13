//Använd add och get developer metadata funktionerna på ranges. 
//Hämta markerade ranges I ranges list. För varje range hämta dess metadata
//Som i detta fall är lärandemålets Id, måste också hämtas!!
//
//Gör anrop till databasen 
//update aktivalarandemal
//Set aktiverat = 1 
//Where larandemal in (1,3,5)


function loadLarandemalListaToSheet() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var latestLarandemal = loadLatestLarandemal();
  
  var latestLarandemalObject = [];
  for(i = 1; i<=amountExMal; i++){
    var exmal = [];
    for(j = 1; j <= antalBloomNivaer; j++){
      exmal[j] = [];   
    }
    latestLarandemalObject[i]= exmal;  
  }
  var latestLarandemalLength = latestLarandemal.length;
  //SpreadsheetApp.getUi().alert(latestLarandemalLength);
  for(i = 0; i<latestLarandemalLength; i++){
    //SpreadsheetApp.getUi().alert(i);
    var exmalNumber = latestLarandemal[i].examensmal; 
    var bloomLevel = latestLarandemal[i].bloomLevel;
    var larandemal = {id: latestLarandemal[i].id, number: latestLarandemal[i].number, description: latestLarandemal[i].description, activated: latestLarandemal[i].aktiverat };
    //SpreadsheetApp.getUi().alert(larandemal);
    //SpreadsheetApp.getUi().alert(i);
    latestLarandemalObject[exmalNumber][bloomLevel].push(larandemal);
  }
  var latestLarandemalCurrentIndex = 0; 
  var exmalInfo = loadExmalInfo();
  var examgoalTitleTextStyle = SpreadsheetApp.newTextStyle().setFontSize(36).build();
  var examgoalTextTextStyle = SpreadsheetApp.newTextStyle().setFontSize(12).build();
  var bloomTextStyle = SpreadsheetApp.newTextStyle().setFontSize(14).build();
  var larandemalTextTextStyle = SpreadsheetApp.newTextStyle().setFontSize(11).build();
  var larandemalNumericalCodeTextStyle = SpreadsheetApp.newTextStyle().setFontSize(10).build();
  for(i = 1; i<=amountExMal; i++){
    var currentExamGoal = 'Examensmål '+i;
    var sheetName = currentExamGoal;
    var sheet = spreadsheet.getSheetByName(sheetName);
    if(sheet === null){
      sheet = spreadsheet.insertSheet(sheetName);
    }
    else{
      sheet.clear();
    }
    var currentSheetRow = 0; 
    var examgoalTitle = sheet.getRange(1,3,1,4);
    examgoalTitle = examgoalTitle.merge();
    examgoalTitle.setValue(currentExamGoal);
    examgoalTitle.setTextStyle(examgoalTitleTextStyle);
    examgoalTitle.setVerticalAlignment('middle');
    examgoalTitle.setHorizontalAlignment('center');
    currentSheetRow+= examgoalTitle.getNumRows()+1; 
    var examgoalText = sheet.getRange(currentSheetRow,1, 1, 6);
    examgoalText = examgoalText.merge();
    examgoalText.setValue('Beskrivning: '+ exmalInfo[i-1].beskrivning);
    examgoalText.setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
    examgoalText.setTextStyle(examgoalTextTextStyle);
    examgoalText.setVerticalAlignment('middle');
    examgoalText.setHorizontalAlignment('left');
    currentSheetRow+=examgoalText.getNumRows() + 2; 
    
    for(j = 1; j<= antalBloomNivaer; j++){
      var numberOfLarandemal = latestLarandemalObject[i][j].length;
      if(numberOfLarandemal === 0){
      //Nothing on this bloomlevel skip
       //SpreadsheetApp.getUi().alert('a'+j);
       //SpreadsheetApp.getUi().alert(latestLarandemalObject[i][j]);
       continue;
      }
      //SpreadsheetApp.getUi().alert('b'+j);
      var bloomString = i+'.'+j+' Lärandemål '+'(Bloom nivå '+j+' - '+ BLOOM_1+')';
      var bloomText = sheet.getRange(currentSheetRow,1,2,6);
      bloomText = bloomText.merge();
      bloomText.setValue(bloomString);
      bloomText.setHorizontalAlignment('left');
      bloomText.setVerticalAlignment('middle');
      currentSheetRow+=bloomText.getNumRows() + 1;
      for(k = 0; k<numberOfLarandemal; k++){
        var larandemalNumericalCode = sheet.getRange(currentSheetRow,1,1,1);
        var larandemalNumericalCodeString = i+'.'+j+'.'+latestLarandemalObject[i][j][k].number;
        larandemalNumericalCode.setValue(larandemalNumericalCodeString);
        larandemalNumericalCode.setVerticalAlignment('top');
        larandemalNumericalCode.setHorizontalAlignment('right');
        larandemalNumericalCode.setTextStyle(larandemalNumericalCodeTextStyle)
        var larandemalText = sheet.getRange(currentSheetRow,2,1,5);
        larandemalText = larandemalText.merge();
        larandemalText.setValue(latestLarandemalObject[i][j][k].description);
        larandemalText.setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
        larandemalText.setVerticalAlignment('top');
        larandemalText.setHorizontalAlignment('left');
        larandemalText.setTextStyle(larandemalTextTextStyle);
        var metadataRowPosition = larandemalText.getRow();
        //SpreadsheetApp.getUi().alert(metadataRowPosition);
        var metadataRow = sheet.getRange(metadataRowPosition+":"+metadataRowPosition);
        metadataRow.addDeveloperMetadata("id",latestLarandemalObject[i][j][k].id.toString());
        if(latestLarandemalObject[i][j][k].activated === 1){
          larandemalText.setFontColor("black");
        }
        else if(latestLarandemalObject[i][j][k].activated === 0){
          larandemalText.setFontColor("gray");
        }
        currentSheetRow+=bloomText.getNumRows() + 1;
        
      }
      
      
      
      
    }
    
//    while(latestLarandemal[latestLarandemalCurrentIndex].examensmal === i){
//      //SpreadsheetApp.getUi().alert(counter);
//      sheet.GetRange
//      sheet.getRange(counter+1,2).setValue(latestLarandemal[latestLarandemalCurrentIndex].bloom); 
//      //sheet.getRange(counter+1,3).setValue(latestLarandemal[latestLarandemalCurrentIndex].examensmal); 
//      sheet.getRange(counter+1,4).setValue(latestLarandemal[latestLarandemalCurrentIndex].nummer);
//      counter++;
//      latestLarandemalCurrentIndex++;
//      if(latestLarandemalCurrentIndex === latestLarandemalLength){
//        break;
//      }
//    
//    }
    
//    if(latestLarandemalCurrentIndex === latestLarandemalLength){
//        break;
//      }  
  }
//  var sheet = spreadsheet.getSheetByName(larandemalListSheetName);
//  //sheet not found create sheet 
//  if (sheet == null) {
//    //The new sheet becomes the active sheet automatically 
//    spreadsheet.insertSheet(larandemalListSheetName);
//  }
//  //else{
//  //var spreadsheet = SpreadsheetApp.getActive().setActiveSheet(larandemalListSheetName);
//  //}
//  var latestLarandemal = loadLatestLarandemal();
//  var sheet = SpreadsheetApp.getActive().getSheetByName(larandemalListSheetName);
//  for(i = 0; i<latestLarandemal.length; i++){
//    sheet.getRange(i+1,2).setValue(latestLarandemal[i].bloom); 
//    sheet.getRange(i+1,3).setValue(latestLarandemal[i].examensmal); 
//    sheet.getRange(i+1,4).setValue(latestLarandemal[i].nummer); 
//  }  
}


