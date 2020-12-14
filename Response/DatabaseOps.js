/**
* Store responses in the database
* @param {JdbcConnection} con - active database connection
* @param {String} formId - id of the form that the responses belong to
* @param {Response[]} responses - responses to insert
* @return {Response[]} 'responses' input with an additional property 'responseId' for each array element
* 'responseId' value is equal to the generated id in the database from the insert
*/
function insertResponses(con, formId, responses) {
  // previously used INSERT IGNORE INTO, but it caused problems.
  // There's no known order in the generated keys if some batch failed
  // this led to the system always deleting rows starting from the first row
  var query = 
    'INSERT INTO respons(enkat, respondent_namn, kurskod, inskickat) ' + 
    'VALUES((SELECT id FROM enkat WHERE form_id = ?), ?, ?, ?)';
  con.setAutoCommit(false);

  // Any int is able to substitute Statement.RETURN_GENERATED_KEYS on 2nd parameter
  var statement = con.prepareStatement(query, 1); 
  statement.setString(1, formId);
  
  for(var i = 0; i < responses.length; i++) {
    var response = responses[i];
    var timestamp = response.timestamp;
    //var timestamp = getSqlTimestamp(timestampSheet);
    var name = response.name;
    var course = response.course;
    
    statement.setString(2, name);
    statement.setString(3, course);
    statement.setString(4, timestamp);
    statement.addBatch();
   // Logger.log('<name %s> <course %s> <timestamp %s>', name, course, timestamp);
  }
  
  statement.executeBatch();
  con.commit();
  var responseIds = statement.getGeneratedKeys();
  var i = 0;
  while(responseIds.next()){
    responses[i].responseId = responseIds.getInt(1);
    //Logger.log('responseId:<%s>', responses[i].responseId);
    i++;
  }
  //Logger.log('Data objects: %s', responses);
  statement.close();
  con.setAutoCommit(true);
  return responses;
}

/**
* Store answers in the database
* @param {JdbcConnection} con - active database connection
* @param {String} formId - id of form connected to the records
* @param {ResponseRecords[]} records - data to store
* @return {Boolean[]} database insert successes
*/
function insertAnswers(con, formId, records) {
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
        'AND lm.nummer = ? ' + 
        'AND lm.version = ?))';
  var statement = con.prepareStatement(query);
  statement.setString(2, formId);
  Logger.log('formId:<%s>', formId);
  
  for(var i = 0; i < records.length; i++) {
    var responseId = records[i].responseId;
    statement.setString(1, responseId);
    Logger.log('responseId:<%s>', responseId);
    
    var responseRecords = records[i].records;
    for(var j = 0; j < responseRecords.length; j++) {
      Logger.log('responseRecord:<%s>', responseRecords[j]);
      var bloom = responseRecords[j].bloom;
      var number = responseRecords[j].number;
      var version = responseRecords[j].version;
      statement.setInt(3, bloom);
      statement.setInt(4, number);
      statement.setInt(5, version);
      
      statement.addBatch();
    }
  }
  
  var insertResults = statement.executeBatch();
  statement.close();
  return insertResults;
}
