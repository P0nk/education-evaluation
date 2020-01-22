/**
* Create an empty form in a predetermined folder
* @return {Form} created form
*/
function createNewForm() {
  var formTitle = generateFormFileTitle();
  var form = FormApp.create(formTitle);
  var folder = DriveApp.getFoldersByName(drive.generatedFormFolderName).next();
  var folderId = folder.getId();
  moveFileToFolder(form.getId(), folderId);
  // Remains from when a template was used
  //var templateFile = DriveApp.getFileById(drive.templateFormId);
  //var templateCopy = templateFile.makeCopy().setName(generateFormFileTitle()).getId();
  // moveFile(templateCopy, drive.generatedFormFolderId); // Not necessary if template file is in same folder
  setDestinationSheet(form);
  return form;
}

/**
* Add basic structure to a form. This includes title, description, 'kurs' question, 'name' question
* @param {Form} form - the form to add structure to
* @return {Form} form with structure added to it
*/
function createFormSkeleton(form) {
  form.setTitle(newForm.title);
  form.setDescription(newForm.desc);
  
  var itemNamn = form.addTextItem();
  itemNamn.setTitle(newForm.nameTitle);
  itemNamn.setHelpText(newForm.nameDesc);
  itemNamn.setRequired(true);
  
  var itemKurs = form.addTextItem();
  var pattern = newForm.kursPattern;
  var kursValidation = FormApp.createTextValidation()
      .requireTextMatchesPattern(newForm.kursPattern)
      .setHelpText(newForm.kursPatternDesc)
      .build();
  itemKurs.setValidation(kursValidation);
  itemKurs.setTitle(newForm.kursTitle);
  itemKurs.setHelpText(newForm.kursDesc);
  itemKurs.setRequired(true);

  return form;
}


// Fills a form with questions
// questionData is only partially filled (based on data from database, 'larandemal' table)
/**
* @param {Form} form - form to fill
* @param {ResponseMal} input - mal data taken from form response
* @param {LarandeMal[][]} questionData
* @return {Form} form filled with questions
*/
function fillForm(form, input, questionData) {
  if(!Array.isArray(questionData) || questionData.length == 0){
    return;
  }
  
  var title = Utilities.formatString('%s %s', input.word, input.number);
  var description = input.text;
  form.addPageBreakItem().setTitle(title).setHelpText(description);
  
  for(var j = 0; j < questionData.length; j++) {
    if(!Array.isArray(questionData[j]) || !questionData[j]) {
      continue;
    }
    
    var item = form.addCheckboxItem();
    var itemTitle = newForm.questionPrefix + j + newForm.questionSeparator + getBloomTitle(j);
    item.setTitle(itemTitle);
    
    var choices = [];
    for(var k = 0; k < questionData[j].length; k++) {
      var description = questionData[j][k].description;
      var version = questionData[j][k].version;
      //var bloomLevel = k + 1; // should apply real bloom level from data instead of array index
      var number = questionData[j][k].number;
      var choice = Utilities.formatString('%s: %s [v%s]', number, description, version);
      choices.push(item.createChoice(choice));
    }
    
    item.setChoices(choices);
  }
  
  return form;
}

/**
* Generate a form file title which includes current date and time.
* @return {String} - the generated title
*/
function generateFormFileTitle() {
  var date = new Date();
  var curDayMonth = date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getYear();
  var minutes = date.getMinutes();
  if(minutes < 10) {
    minutes = '0' + minutes;
  }
  var curTime = date.getHours() + ':' + minutes;
  var title = Utilities.formatString('Formulär - %s %s', curDayMonth, curTime);
  
  return title;
}

// Sets and renames
function setDestinationSheet(form) {
  form.setDestination(FormApp.DestinationType.SPREADSHEET, drive.formDestinationSpreadsheet);
  var formFileName = DriveApp.getFileById(form.getId()).getName();
  var formUrl = trimUrl(form.getEditUrl()); 
  Logger.log('Form url: %s', formUrl);
  
  var destinationSpreadsheet = SpreadsheetApp.openById(drive.formDestinationSpreadsheet);
  destinationSpreadsheet.getSheets().forEach(function(sheet){
    var sheetUrl = sheet.getFormUrl();
    //Logger.log('Sheet url: %s', sheetUrl);
    
    if(sheetUrl) { // null if no connected form
      sheetUrl = trimUrl(sheetUrl);
    }
    
    if (sheetUrl  === formUrl) {
      sheet.setName(formFileName);
      // Loose protecion of column titles
      sheet.getRange('1:1').protect().setWarningOnly(true);
      Logger.log('URLs are equal');
    }
  });
}



/* Previously used when the idea was to copy forms and set their onFormSubmit trigger by another project, which didn't work
function onGeneratedFormSubmit(e) {
  var authMode = e.authMode;
  Logger.log(authMode);
  var source = e.source;
  Logger.log(source);
  var triggerUid = e.triggerUid;
  Logger.log(triggerUid);
  /
  var response = e.response;
  Logger.log(response);
  Logger.log('authMode %s\nresponse %s\nsource %s\ntriggerUid %s\n', e.authMode, e.response, e.source, e.triggerUid);
  /
  
  var responses = source.getResponses();
  for (var i = 0; i < responses.length; i++) {
    var response = responses[i];
    var timestamp = response.getTimestamp();
    var id = response.getId();
    Logger.log('Timestamp %s Response ID %s', timestamp, id);
  }
}
*/
