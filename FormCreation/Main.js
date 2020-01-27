/**
* Add a menu when the form is opened as an editor
*/
function onOpen() {
  FormApp.getUi().createMenu(menu.mainMenuText).addItem(menu.subMenuText, 'reload').addToUi();
}

/**
* Reload all multiple choice options based on input from the user via a prompt
*/
function reload() {
  var ui = FormApp.getUi();
  var response = ui.prompt(menu.codePrompt, ui.ButtonSet.OK_CANCEL);
  
  if(response.getSelectedButton() == ui.Button.CANCEL || !response.getResponseText()) {
    return;
  } 
  
  var con = Common.establishDbConnection();
  var program = response.getResponseText().toUpperCase().trim();
  var programMal = retrieveProgramMal(con, program);
  if(programMal.length == 0) {
    return;
  }
  // Logger.log('<%s>', programMal);
  
  var item = FormApp.getActiveForm().getItems()[0];
  if(item.getType() != FormApp.ItemType.MULTIPLE_CHOICE) {
    return;
  }
  
  var multiChoiceItem = item.asMultipleChoiceItem();
  var questionTitle = Utilities.formatString('%s (%s)', thisForm.questionTitle, program);
  multiChoiceItem.setTitle(questionTitle);
  
  var choices = [];
  for(var i = 0; i < programMal.length; i++) {
    var typ = programMal[i].typ;
    var nummer = programMal[i].nummer;
    var beskrivning = programMal[i].beskrivning;
    var choiceText = Utilities.formatString('%s %s: %s', typ, nummer, beskrivning);
    choices.push(choiceText);
  }
  
  multiChoiceItem.setChoiceValues(choices);
}

/** 
* Create a new form based on form input
* @param {Event} e - the onFormSubmit event
*/
function onFormSubmit(e) {
  var input = parseFormResponse(e.response);
  Logger.log('input:%s', input);
  if(!input.word || !input.number){
    return;
  }
  
  var con = Common.establishDbConnection();
  var questionData = retrieveQuestionData(con, input);
  
  // Skip form creation if no available data about larandemal in database
  if(questionData.length == 0) {
    return;
  }
  
  //var subjectData = retrieveSubjectData(con, input);
  var newForm = createNewForm();
  var formSkeleton = createFormSkeleton(newForm);
  var form = fillForm(formSkeleton, input, questionData);
  if(saveNewForm(con, form)){
    Logger.log('Form stored in the database %s', form.getId());
  }
  
  var questionIds = getSubQuestionIds(con, input); // Lacks support for 2+ examensmal
  saveNewFormQuestions(con, form.getId(), questionIds);
  con.close();
  
  // Add description to each PageBreakItem; provide link to document with info about examensmal and its larandemal (document not available yet)
}

/**
* Extract text from the response to make a new form out of.
* @param {FormResponse} formResponse - the form response to parse
* @return {ResponseMal} - the extracted programmal
*/
function parseFormResponse(formResponse) {
  return parseFormResponseSingleSelection(formResponse);
}

/**
* Extract text from the response where the input is 'Multiple selection'.
* @param {FormResponse} formResponse - the form response to parse
* @return {ResponseMal} - the programmal
*/
function parseFormResponseSingleSelection(formResponse) {
  var itemResponses = formResponse.getItemResponses();
  var selection = itemResponses[0];
  var selectionText = selection.getResponse();
  var input = extractValues(selectionText);
  
  return input;
}


/** Unused. Previously used to generate multiple forms when onFormSubmit triggered.
function parseFormResponseMultiChoice(formResponse) {
  var itemResponses = formResponse.getItemResponses();
  var providedNumbers = [];
  
  for (var i = 0; i < itemResponses.length; i++) {
    var itemResponse = itemResponses[i];
    Logger.log(itemResponse.getItem().getTitle()); 
    continue;
    var subResponse = itemResponse.getResponse();
    
    for(var j = 0; j < subResponse.length; j++) {
      var value = extractFirstNumber(subResponse[j]);
      providedNumbers.push(value); 
    }
  }
  
  return providedNumbers;
}
*/
