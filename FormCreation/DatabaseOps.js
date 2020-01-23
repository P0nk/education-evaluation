/**
* Retrieve all programmal from the database
* @param {JdbcConnection} con - active database connection
* @param {String} programKod - program to retrieve programmal for
* @return {ProgramMal[]} all programmal dictated by programKod
*/
function retrieveProgramMal(con, programKod) {
  var query = 
  'SELECT pmt.typ, pm.nummer, pm.beskrivning ' + 
  'FROM programmal AS pm ' + 
  'INNER JOIN programmaltyp AS pmt ' + 
	'ON pm.typ = pmt.id ' + 
  'INNER JOIN programprogrammal AS ppm ' + 
	'ON pm.id = ppm.programmal ' + 
  'INNER JOIN program AS p ' + 
	'ON ppm.program = p.id ' + 
  'WHERE p.programkod = ?' +
  'ORDER BY pmt.id, pm.nummer';
  var statement = con.prepareStatement(query);
  statement.setString(1, programKod);
  var rs = statement.executeQuery();
  
  var programMalList = [];
  while(rs.next()) {
    var typ = rs.getString(1);
    var nummer = rs.getInt(2);
    var beskrivning = rs.getString(3);
    
    var programMal = new ProgramMal(typ, nummer, beskrivning);
    programMalList.push(programMal);
    // programMalList.push({typ: typ, nummer: nummer, beskrivning: beskrivning});
  }
  
  return programMalList;
}

/* Not valid anymore I think */
// Returns a 3-dimensional array containing objects of type: {bloom:bloomLevel, number:bloomNumber, description:larandemalDescription}
// 1st dim: examensmal
// 2nd dim: bloom level
// 3rd dim: larandemal

/**
* Retrieve question data from the database.
* @param {JdbcConnection} con - active Jdbc connection to the database
* @param {ResponseMal} input - form input used to 
* @return {LarandeMal[][]} all question data dictated by input
*/
function retrieveQuestionData(con, input) {
  var query = 
  'SELECT lm.bloom, lm.nummer, lm.beskrivning, lm.id, lm.version ' + 
  'FROM larandemal AS lm ' +
  'INNER JOIN aktiveratlarandemal AS alm ' + 
    'ON lm.id = alm.larandemal ' + 
  'INNER JOIN programmal AS pm ' +
	'ON lm.programmal = pm.id ' + 
  'INNER JOIN programmaltyp AS pmt ' + 
	'ON pm.typ = pmt.id ' + 
  'WHERE pmt.typ = ? ' + 
  'AND version IN ' + 
     '(SELECT MAX(version) FROM larandemal lmInner ' + // Filter out old versions
     'WHERE lm.bloom = lmInner.bloom ' +
     'AND lm.nummer = lmInner.nummer) ' +
  'AND pm.nummer = ? ' + 
  'AND alm.aktiverat = TRUE ' +
  'ORDER BY bloom, lm.nummer';
  var statement = con.prepareStatement(query);
  
  var malTyp = input.word;
  var malNummer = input.number;
  statement.setString(1, malTyp);
  statement.setInt(2, malNummer);
  
  var rs = statement.executeQuery();
  
  var subQuestions = [];
  while(rs.next()) {
    var bloom = rs.getInt(1);
    var number = rs.getInt(2);
    var description = rs.getString(3);
    var id = rs.getInt(4);
    var version = rs.getInt(5);
    var dataTransferObj = new LarandeMal(id, bloom, number, version, description);
    
    if(!Array.isArray(subQuestions[bloom]) || !subQuestions[bloom].length) {
      subQuestions[bloom] = [dataTransferObj];
    } else {
      subQuestions[bloom].push(dataTransferObj);
    }
  }
  
  rs.close();
  statement.close();
  return subQuestions;
}

/**
* Insert a new form in the database
* @param {JdbcConnection} con - active database connection
* @param {Form} form - form to insert
* @return {Boolean} insert success
*/
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

/* Old
function testGetSubQuestionIds() {
  var con = establishDbConnection();
  var examensmal = 1;
  var larandemal = getSubQuestionIds(con, examensmal);
  Logger.log(larandemal);
}
*/

/**
* Retrieve larandemal ids for a given programmal
* @param {JdbcConnection} con - active database connection
* @param {ResponseMal} input - form input
* @return {Integer[]} larandemal ids
*/
function getSubQuestionIds(con, input) {
  var query = 
  'SELECT lm.id ' + 
  'FROM larandemal lm ' + 
  'INNER JOIN programmal AS pm ' + 
	'ON lm.programmal = pm.id ' + 
  'INNER JOIN programmaltyp AS pmt ' + 
	'ON pm.typ = pmt.id ' + 
  'WHERE pmt.typ = ? ' + 
  'AND pm.nummer = ? ' +
  'AND version IN (SELECT MAX(version) FROM larandemal lmInner WHERE lm.id = lmInner.id) ' + 
  'ORDER BY lm.id';
  var statement = con.prepareStatement(query);
  statement.setString(1, input.word);
  statement.setString(2, input.number);
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
/**
* Insert question to a form
* @param {JdbcConnection} con - active database connection
* @param {String} formId - form to add questions to
* @param {Integer[]} questionIds - questions to add
*/
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

// Unused
/** Uses old table
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
*/