// Returns a 3-dimensional array containing objects of type: {bloom:bloomLevel, number:bloomNumber, description:larandemalDescription}
// 1st dim: examensmal
// 2nd dim: bloom level
// 3rd dim: larandemal
function retrieveQuestionData(con, questions) {
  var query = 
    "SELECT bloom, nummer, beskrivning " + 
    "FROM larandemal lmOuter " + 
    "WHERE examensmal = ? " + 
      "AND version IN (SELECT MAX(version) FROM larandemal lmInner WHERE lmOuter.id = lmInner.id) " + 
    "ORDER BY bloom, nummer";
  var statement = con.prepareStatement(query);
  
  var subQuestions = [];
  for(var i = 0; i < questions.length; i++) {
    subQuestions[i] = [];
    var question = questions[i];
    statement.setInt(1, question);
    var rs = statement.executeQuery();
    
    while(rs.next()) {
      var bloom = rs.getInt(1);
      var number = rs.getInt(2);
      var description = rs.getString(3);
      var dataTransferObj = {bloom:bloom, number:number, description:description};
      
      if(!Array.isArray(subQuestions[i][bloom]) || !subQuestions[i][bloom].length) {
        subQuestions[i][bloom] = [dataTransferObj];
      } else {
        subQuestions[i][bloom].push(dataTransferObj);
      }
    }
    
    rs.close();
    statement.clearParameters();
  }
  
  statement.close();
  return subQuestions;
}

function retrieveSubjectData (con, subjects) {
  var query = 
      'SELECT nummer, beskrivning ' + 
      'FROM examensmal ' + 
      'WHERE nummer = ?';
  var statement = con.prepareStatement(query);
  
  var subjectData = [];
  for(var i = 0; i < subjects.length; i++) {
    if(typeof (subjects[i]) != 'number') {
      Logger.log('%s is not a number. Continuing...', subjects[i]);
      Logger.log(typeof (subjects[i]));
      continue;
    }
    
    statement.setInt(1, subjects[i]);
    var rs = statement.executeQuery();
    
    if(rs.next()) {
      var subjectNumber = rs.getInt(1);
      var subjectDesc = rs.getString(2);
      subjectData[i] = {'number':subjectNumber, 'desc':subjectDesc};
      Logger.log(subjectData[i]);
    }
    
    rs.close();
    statement.clearParameters();
  }
  
  statement.close();
  Logger.log(subjectData);
  return subjectData;
}

function saveNewForm(con, form) {
  var formId = form.getId();
  var query = 
      'INSERT INTO enkat(form_id)' +
      'VALUES(?)';
  var statement = con.prepareStatement(query);
  statement.setString(1, formId);
  var success = statement.executeUpdate();
  
  statement.close();
  return success;
}
