function onFormSubmit(e) {
  //var answers = parseFormResponse(e.response);
  //Logger.log(answers);
  var answers = [1];
  
  if(answers.length < 1){
    return;
  }
  
  var con = establishDbConnection();
  var questionData = retrieveQuestionData(con, answers);
  Logger.log(questionData);
  
  // Skip form creation if no available data about larandemal in database
  if(questionData[0] < 1) {
    return;
  }
  
  var newForm = createNewForm();
  var formSkeleton = createFormSkeleton(newForm);
  var form = fillForm(formSkeleton, answers, questionData);
  
  con.close();
  
//  var trigger = ScriptApp.newTrigger('onGeneratedFormSubmit').forForm(form).onFormSubmit().create();
  // TODO: set up trigger for onFormSubmit via the service
  // and implement the function that will run on trigger
  // Add the form in database, 'enkat' table
  // Add description to each PageBreakItem; provide link to document with info about examensmal and its larandemal (not yet available)
}

// Extract examensmal numbers from question items
function parseFormResponse(formResponse) {
  var itemResponses = formResponse.getItemResponses();
  var providedNumbers = [];
  
  for (var i = 0; i < itemResponses.length; i++) {
    var itemResponse = itemResponses[i];
    var subResponse = itemResponse.getResponse();
    
    for(var j = 0; j < subResponse.length; j++) {
      var value = extractFirstNumber(subResponse[j]);
      providedNumbers.push(value); 
    }
  }
  
  return providedNumbers;
}

// Used to extract '3' from 'Examensmål 3' for example
function extractFirstNumber(text) {
  if(typeof text != 'string') {
    return;
  }
  
  var regexp = /\d+/;
  var value = regexp.exec(text)[0];
  return value;
}

// Manual test function
function testRetrieveQuestionData() {
  var con = establishDbConnection();
  var answers = [1, 2];
  var questionData = retrieveQuestionData(con, answers);
  Logger.log(questionData);
}
