// 1. Copy template 
// 2. Move to correct folder in Drive
function createNewForm() {
  var form = FormApp.create(getNewFileTitle());
  moveFile(form.getId(), drive.generatedFormFolderId);
  // Remains from when a template was used
  //var templateFile = DriveApp.getFileById(drive.templateFormId);
  //var templateCopy = templateFile.makeCopy().setName(getNewFileTitle()).getId();
  // moveFile(templateCopy, drive.generatedFormFolderId); // Not necessary if template file is in same folder
  setDestinationSheet(form);
  return form;
}

// Create the basic structure of the form. This includes title, description, 'kurs' question, 'name' question
function createFormSkeleton(form) {
  form.setTitle(newForm.title);
  form.setDescription(newForm.desc);
  
  var itemKurs = form.addTextItem();
  itemKurs.setTitle(newForm.kursTitle);
  itemKurs.setHelpText(newForm.kursDesc);
  itemKurs.setRequired(true);
  
  var itemNamn = form.addTextItem();
  itemNamn.setTitle(newForm.nameTitle);
  itemNamn.setHelpText(newForm.nameDesc);
  itemNamn.setRequired(true);
  
  return form;
}


// Fills a form with questions
// subQuestions is only partially filled (based on data from database, 'larandemal' table)
function fillForm(form, mainQuestions, subQuestions) {
  for(var i = 0; i < mainQuestions.length; i++) {
    if(!Array.isArray(subQuestions[i]) || !subQuestions[i].length){
       continue;
    }
       
    var title = newForm.questionTitlePrefix + mainQuestions[i].number;
    var description = mainQuestions[i].desc;
    form.addPageBreakItem().setTitle(title).setHelpText(description);
    
    for(var j = 0; j < subQuestions[i].length; j++) {
      if(!Array.isArray(subQuestions[i][j]) || !subQuestions[i][j]) {
        continue;
      }
      
      var item = form.addCheckboxItem();
      var itemTitle = newForm.questionPrefix + j + newForm.questionSeparator + getBloomTitle(j);
      item.setTitle(itemTitle);
      
      var choices = [];
      for(var k = 0; k < subQuestions[i][j].length; k++) {
        var description = subQuestions[i][j][k].description;
        var choice = (k+1) + ': ' + description;
        choices.push(item.createChoice(choice));
      }
      
      item.setChoices(choices);
    }
  }
  
  return form;
}

function getNewFileTitle() {
  var date = new Date();
  var curDayMonth = date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getYear();
  var curTime = date.getHours() + ':' + date.getMinutes();
  var title = Utilities.formatString('Formulär - %s %s', curDayMonth, curTime);
  
  return title;
}

// Sets and renames
function setDestinationSheet(form) {
  form.setDestination(FormApp.DestinationType.SPREADSHEET, drive.formDestinationSpreadsheet);
  var formFileName = DriveApp.getFileById(form.getId()).getName();
  var formUrl = trimUrl(form.getEditUrl()); 
  Logger.log('Form url: %s', formUrl);
  
  var destinationSheet = SpreadsheetApp.openById(drive.formDestinationSpreadsheet);
  destinationSheet.getSheets().forEach(function(sheet){
    var sheetUrl = sheet.getFormUrl();
    Logger.log('Sheet url: %s', sheetUrl);
    
    if(sheetUrl) { // null if no connected form
      sheetUrl = trimUrl(sheetUrl);
    }
    
    if (sheetUrl  === formUrl) {
      sheet.setName(formFileName);
      Logger.log('URLs are equal');
    }
  });
}

function checkUrl() {
}


// Unused
function onGeneratedFormSubmit(e) {
  var authMode = e.authMode;
  Logger.log(authMode);
  var source = e.source;
  Logger.log(source);
  var triggerUid = e.triggerUid;
  Logger.log(triggerUid);
  /*
  var response = e.response;
  Logger.log(response);
  Logger.log('authMode %s\nresponse %s\nsource %s\ntriggerUid %s\n', e.authMode, e.response, e.source, e.triggerUid);
  */
  
  var responses = source.getResponses();
  for (var i = 0; i < responses.length; i++) {
    var response = responses[i];
    var timestamp = response.getTimestamp();
    var id = response.getId();
    Logger.log('Timestamp %s Response ID %s', timestamp, id);
  }
}
