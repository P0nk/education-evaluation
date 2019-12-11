function onFormSubmit(e) {
  var subjects = parseFormResponse(e.response);
  if(subjects.length < 1){
    return;
  }
  
  var con = establishDbConnection();
  var questionData = retrieveQuestionData(con, subjects);
  
  // Skip form creation if no available data about larandemal in database
  if(questionData[0] < 1) {
    return;
  }
  
  var subjectData = retrieveSubjectData(con, subjects);
  var newForm = createNewForm();
  var formSkeleton = createFormSkeleton(newForm);
  var form = fillForm(formSkeleton, subjectData, questionData);
  if(saveNewForm(con, form)){
    Logger.log('Form stored in the database %s', form.getId());
  }
  // TODO store formId as metadata in destination sheet
  con.close();
  
//  var trigger = ScriptApp.newTrigger('onGeneratedFormSubmit').forForm(form).onFormSubmit().create();
  // TODO: set up trigger for onFormSubmit via the service
  // and implement the function that will run on trigger
  // Add the form in database, 'enkat' table
  // Add description to each PageBreakItem; provide link to document with info about examensmal and its larandemal (not yet available)
}

// Extract examensmal numbers from question items.
function parseFormResponse(formResponse) {
  return parseFormResponseSingleSelection(formResponse);
}

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

function parseFormResponseSingleSelection(formResponse) {
  var itemResponses = formResponse.getItemResponses();
  var selection = itemResponses[0];
  var selectionText = selection.getResponse();
  var extractedNumber = extractFirstNumber(selectionText);
  
  return [extractedNumber];
}


// Manual test function
function testRetrieveQuestionData() {
  var con = establishDbConnection();
  var answers = [1, 2];
  var questionData = retrieveQuestionData(con, answers);
  Logger.log(questionData);
}
