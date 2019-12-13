// Returns a 3-dimensional array containing objects of type: {bloom:bloomLevel, number:bloomNumber, description:larandemalDescription}
// 1st dim: examensmal
// 2nd dim: bloom level
// 3rd dim: larandemal
function retrieveQuestionData(con, questions) {
  var query = 
    "SELECT bloom, nummer, beskrivning, id " + 
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
      var id = rs.getInt(4);
      var dataTransferObj = {bloom:bloom, number:number, description:description, id:id};
      
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

function testGetSubQuestionIds() {
  var con = establishDbConnection();
  var examensmal = 1;
  var larandemal = getSubQuestionIds(con, examensmal);
  Logger.log(larandemal);
}

function getSubQuestionIds(con, mainQuestion) {
  var query = 
    "SELECT id " + 
    "FROM larandemal lmOuter " + 
    "WHERE examensmal = ? " + 
      "AND version IN (SELECT MAX(version) FROM larandemal lmInner WHERE lmOuter.id = lmInner.id) " + 
    "ORDER BY id";
  var statement = con.prepareStatement(query);
  statement.setInt(1, mainQuestion);
  var rs = statement.executeQuery();
  
  var ids = [];
  while(rs.next()) {
    var id = rs.getInt(1);
    ids.push(id);
  }
  
  rs.close();
  statement.close();
  
  return ids;
}

// UNTESTED.
// Can either parse questionData (which is error prone due to large 3d array),
// or do an extra call to db to fetch only pure ids, making this function much simpler
function saveNewFormQuestions(con, formId, questionIds) {
  var query = 
      'INSERT INTO enkatfraga(enkat, larandemal) ' + 
      'VALUES ((SELECT id FROM enkat WHERE form_id = ?), ?)'; 
  var statement = con.prepareStatement(query);
  statement.setString(1, formId);
  
  /* Simple method using array of ids */
  for(var i = 0; i < questionIds.length; i++) {
    var id = questionIds[i];
    statement.setInt(2, id);
    statement.addBatch();
  }
  
  /* Clunky method of parsing questionData
  for(var i = 0; i < questionData.length; i++) {
    if(!Array.isArray(questionData[i])){
       continue;
    }
    
    for(var j = 0; j < questionData[i].length; j++) {
      if(!Array.isArray(questionData[i][j])){
        continue;         
      }
      
      for(var k = 0; k < questionData[i][j].length; k++) {
        if(!Array.isArray(questionData[i][j][k])){
          continue;
        }
        
        var lmId = questionData[i][j][k].id;
        statement.setInt(2, lmId);
        statement.addBatch();
      }
    }
  }
  */
  
  statement.executeBatch();
  statement.close();
}
