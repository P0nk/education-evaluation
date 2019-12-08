function onFormSubmit(e) {
  //var answers = parseFormResponse(e.response);
  var answers = [1, 2];
  Logger.log('Provided examensmal: ' + answers.toString());
  
  if(answers.length < 1){
    return;
  }
  
  var con = establishDbConnection();
  var questionData = retrieveQuestionData(con, answers);
  con.close();
  Logger.log(questionData);
  
  // Skip form creation if no available data about larandemal in database
  if(questionData[0] < 1) {
    return;
  }
  
  var form = createForm(answers, questionData);
  // TODO: set up trigger for onFormSubmit via the service
  // and implement the function that will run on trigger
  // Add the form in database, 'enkat' table
  // Add description to each PageBreakItem; provide link to document with info about examensmal and its larandemal (not yet available)
  
  /*
  Logger.log('Response #%s to the question "%s" was "%s"',
        (i + 1).toString(),
        itemResponse.getItem().getTitle(),
        itemResponse.getResponse());
  */
  //ScriptApp.newTrigger(functionName).forForm(form).onFormSubmit().create();
}

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

function extractFirstNumber(text) {
  var regexp = /\d+/;
  var value = regexp.exec(text)[0];
  return value;
}

function testRetrieveQuestionData() {
  var con = establishDbConnection();
  var answers = [1, 2];
  var questionData = retrieveQuestionData(con, answers);
  Logger.log(questionData);
}

function retrieveQuestionData(con, questions) {
  var query = "SELECT bloom, COUNT(nummer) FROM larandemal lmOuter WHERE examensmal = ? AND version IN " + 
    "(SELECT MAX(version) FROM larandemal lmInner WHERE lmOuter.id = lmInner.id) " + 
      "GROUP BY bloom";
  var statement = con.prepareStatement(query);
  
  var subQuestions = [];
  for(var i = 0; i < questions.length; i++) {
    subQuestions[i] = [];
    var question = questions[i];
    statement.setInt(1, question);
    var rs = statement.executeQuery();
    
    while(rs.next()) {
      var bloomLevel = rs.getInt(1);
      var subLevels = rs.getInt(2);
      
      subQuestions[i].push({bloomLevel:bloomLevel, subLevels: subLevels});
    }
    
    rs.close();
    statement.clearParameters();
  }
  
  return subQuestions;
}

function createForm(mainQuestions, subQuestions) {
  var form = FormApp.create("Uppfyllnad av lärandemål som ingenjör");
  form.setDescription("Ange de lärandemål som din kurs bidrar till.");
  
  var itemKurs = form.addTextItem();
  itemKurs.setTitle("Ange kurskod");
  itemKurs.setHelpText("Till exempel \"IV1350\"");
  itemKurs.setRequired(true);
  
  var itemNamn = form.addTextItem();
  itemNamn.setTitle("Ange ditt namn");
  itemNamn.setHelpText("För- och efternamn");
  itemNamn.setRequired(true);
  
  for(var i = 0; i < mainQuestions.length; i++) {
    var title = "Examensmål " + mainQuestions[i];
    form.addPageBreakItem().setTitle(title);
    
    for(var j = 0; j < subQuestions[i].length; j++) {
      var itemSubQuestion = form.addCheckboxGridItem();
      itemSubQuestion.setTitle(getBloomTitle(j+1));
      var itemTitle = mainQuestions[i] + "." + (j+1) + ".X";
      itemSubQuestion.setRows([itemTitle]);
      
      var numOnCurLevel = subQuestions[i][j].subLevels;
      itemSubQuestion.setColumns(range(1, numOnCurLevel));
    }
  }
  
  return form;
}
