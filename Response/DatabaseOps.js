// dataObjects format: [{timestamp:'...', name:'...', course:'...', row:i, answers:[[1,2,3,...],[3,5,6,...],]}, {}, {},]
function insertResponses(con, formId, dataObjects) {
  var query = 
    'INSERT INTO respons(enkat, respondent_namn, kurskod, inskickat) ' + 
    'VALUES((SELECT id FROM enkat WHERE form_id = ?), ?, ?, ?)';
  // Any int is able to substitute Statement.RETURN_GENERATED_KEYS on 2nd parameter
  var statement = con.prepareStatement(query, 1); 
  statement.setString(1, formId);
  
  for(var i = 0; i < dataObjects.length; i++) {
    var object = dataObjects[i];
    var timestampSheet = object.timestamp;
    var timestamp = convertTimestamp(timestampSheet);
    var name = object.name;
    var course = object.course;
    
    statement.setString(2, name);
    statement.setString(3, course);
    statement.setString(4, timestamp);
    statement.addBatch();
    Logger.log('<name %s> <course %s> <timestamp %s>', name, course, timestamp);
  }
  
  statement.executeBatch();
  var responseIds = statement.getGeneratedKeys();
  var i = 0;
  while(responseIds.next()){
    dataObjects[i].responseId = responseIds.getInt(1);
    i++;
  }
  Logger.log('Data objects: %s', dataObjects);
  return dataObjects;
}

function insertAnswers(con, formId, dataObjects) {
  var query = 
      'INSERT INTO enkatfragesvar(respons, svar, enkatfraga) ' +
      'VALUES(?, TRUE, ' + 
        '(SELECT ef.id ' + 
        'FROM enkatfraga ef ' + 
        'INNER JOIN enkat AS e ' + 
          'ON ef.enkat = e.id ' + 
        'INNER JOIN larandemal AS lm ' + 
          'ON ef.larandemal = lm.id ' + 
        'WHERE e.form_id = ? ' + 
        'AND lm.bloom = ? ' +
        'AND lm.nummer = ?))';
  var statement = con.prepareStatement(query);
  statement.setString(2, formId);
  
  for(var i = 0; i < dataObjects.length; i++) {
    var responseId = dataObjects[i].responseId;
    statement.setString(1, responseId);
    var answers = dataObjects[i].answers;
    
    for(var j = 0; j < answers.length; j++) {
      var bloomLevel = j + 1;
      statement.setInt(3, bloomLevel);
      
      for(var k = 0; k < answers[j].length; k++) {
        var number = answers[j][k];
        statement.setInt(4, number);
        statement.addBatch();
      }
    }
  }
  
  var insertResults = statement.executeBatch();
  /*
  var insertResults = [];
  while(rs.next()) {
    var insertResult = rs.getInt(1);
    insertResults.push(insertResult);
  }
  rs.close();
  */
  
  return insertResults;
}
