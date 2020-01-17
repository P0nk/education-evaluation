/** 
*Load all larandemal from the database
* @param {JdbcConnection} con - active JDBC connection
* @returns {LarandeMal []} larandemalArray - array of LarandeMal
*/
function loadLarandemal(con){
  var larandemalArray = retrieveLarandemal(con);
  return larandemalArray;
}

/** 
* Get info about all programmal from the database
* @param {JdbcConnection} con - active JDBC connection
* @returns {ProgramMalContainer} programMalContainer - object containing a list of programmal and with some convenience functions to retrieve data
*/
function loadProgmalInfo(con){
  var progmalList = retrieveProgrammalInfo(con);
  var progmalContainer = new ProgramMalContainer(progmalList);
     
  return progmalContainer;
}

/**
* Inserts the given larandemal into the database
* @param {NewLarandeMal []} newLarandemalToAdd - an array of larandemal that should be added into the database 
*/
function addNewLarandemal(newLarandemalToAdd){
  var con = Common.establishDbConnection();
  addLarandemalToDB(con, newLarandemalToAdd);
  addLarandemalActivity(con, newLarandemalToAdd);
  con.close();
}

/**
* Updates the given larandemal in the database.
* @param {UpdatedLarandemal []} larandemalToBeUpdated - an array of UpdatedLarandemal objects that contain information about how the given larandemal should be updated
*/
function updateLarandemal(larandemalToBeUpdated){
   var con = Common.establishDbConnection();
   updateLarandemalInDB(con, larandemalToBeUpdated);
   con.close();
}
/**
* Inserts the given larandemal into the database
* @param {JdbcConnection} connection - active JDBC connection
* @param {NewLarandeMal []} newLarandemalToAdd - an array of larandemal that should be added into the database 
*/
function addLarandemalToDB(connection, newLarandemalToAdd){
  var query = 'INSERT INTO larandemal(bloom, programmal, nummer, version, beskrivning) VALUES ';
  var lastIndex = newLarandemalToAdd.length - 1;
  for(var i in newLarandemalToAdd) {
    query += Utilities.formatString("(%s, %s, %s, %s, '%s')", newLarandemalToAdd[i].bloomNiva, newLarandemalToAdd[i].programmal, newLarandemalToAdd[i].nummer, newLarandemalToAdd[i].version, newLarandemalToAdd[i].beskrivning);
    query += (i == lastIndex) ? ';' : ',';
  }
  var statement = connection.createStatement();
  statement.executeUpdate(query);
  statement.close();
}

/**
* Inserts information about if the given larandemal are activated or not, into the database
* Susceptible to SQL injection attacks
* @param {JdbcConnection} connection - an active JDBC connection
* @param {NewLarandeMal []} newLarandemalToAdd - an array of larandemal that should be added into the database 
*/
function  addLarandemalActivity(connection, newLarandemalToAdd){
  
  var query = 'SELECT id from larandemal WHERE (bloom, programmal, nummer, version) IN (';
  for(var i = 0; i < (newLarandemalToAdd.length - 1); i++) {
    query +=  Utilities.formatString('(%s, %s, %s, %s),', newLarandemalToAdd[i].bloomNiva, newLarandemalToAdd[i].programmal, newLarandemalToAdd[i].nummer, newLarandemalToAdd[i].version);
  }
  var lastNewLarandemalToAdd = newLarandemalToAdd[newLarandemalToAdd.length - 1];
  query += Utilities.formatString('(%s, %s, %s, %s))',lastNewLarandemalToAdd.bloomNiva, lastNewLarandemalToAdd.programmal, lastNewLarandemalToAdd.nummer, lastNewLarandemalToAdd.version);  
  var statement = connection.createStatement();
  var resultSet = statement.executeQuery(query);
  var larandemalIds = [];
  while(resultSet.next()){
    larandemalIds.push(resultSet.getInt(1));
  }
  resultSet.close();
  statement.close();
    
  query = 'INSERT INTO aktiveratlarandemal(larandemal,aktiverat) VALUES';
  for(var i = 0; i < (newLarandemalToAdd.length - 1); i++) {
    query += Utilities.formatString('(%s, %s),', larandemalIds[i], newLarandemalToAdd[i].aktiverat);
  }
  query += Utilities.formatString('(%s, %s)', larandemalIds[newLarandemalToAdd.length - 1], lastNewLarandemalToAdd.aktiverat);
  query += " ON DUPLICATE KEY UPDATE aktiverat = VALUES(aktiverat);"
  
  statement = connection.createStatement();
  statement.executeUpdate(query);
  statement.close();
}

/**
* Updates the given larandemal in the database.
* @param {JdbcConnection} connection - an active JDBC connection
* @param {UpdatedLarandemal []} larandemalToBeUpdated - an array of UpdatedLarandemal objects that contain information about how the given larandemal should be updated
*/
function updateLarandemalInDB(connection, larandemalToBeUpdatedList){
  
  var statement = connection.createStatement();
  var query = "UPDATE larandemal SET beskrivning = CASE id";
  for(i=0; i<larandemalToBeUpdatedList.length; i++){
  
    query+=" WHEN "+ larandemalToBeUpdatedList[i].id +" THEN '" +larandemalToBeUpdatedList[i].beskrivning+"'"; 
  
  }
  query+=" ELSE beskrivning END WHERE id IN ("; 
  for(i=0; i<larandemalToBeUpdatedList.length; i++){
  
    query+=larandemalToBeUpdatedList[i].id+", ";
  
  }
  query+=larandemalToBeUpdatedList[larandemalToBeUpdatedList.length-1].id+");";
  var result = statement.executeUpdate(query);
  query = "UPDATE aktiveratlarandemal SET aktiverat = CASE larandemal";
  for(i=0; i<larandemalToBeUpdatedList.length; i++){
  
    query+=" WHEN "+ larandemalToBeUpdatedList[i].id +" THEN " +larandemalToBeUpdatedList[i].aktiverat; 
  
  }
  query+=" ELSE aktiverat END WHERE larandemal IN ("; 
  for(i=0; i<larandemalToBeUpdatedList.length-1; i++){
     query+=larandemalToBeUpdatedList[i].id+", ";
  }
  query+=larandemalToBeUpdatedList[larandemalToBeUpdatedList.length-1].id+");";
  result = statement.executeUpdate(query);
  statement.close();

}

/**
* (Deprecated)
* Updates the given larandemal in the database. Has bugs that should be fixed before being used. Look into 'updateLarandemalInDB()
* @param {JdbcConnection} connection - an active JDBC connection
* @param {UpdatedLarandemal []} larandemalToBeUpdated - an array of UpdatedLarandemal objects that contain information about how the given larandemal should be updated
*/
function updateLarandemalInDB2(connection, larandemalToBeUpdatedList){
  
  var statement = connection.createStatement();
  var query = "UPDATE larandemal SET beskrivning = CASE id";
  for(var i in larandemalToBeUpdatedList){
    query += Utilities.formatString(" WHEN %s THEN '%s'", larandemalToBeUpdatedList[i].id, larandemalToBeUpdatedList[i].beskrivning);
  }
  query += " ELSE beskrivning END WHERE id IN ("; 
  for(var i in larandemalToBeUpdatedList){
    query += Utilities.formatString('%s, ', larandemalToBeUpdatedList[i].id);
  }
  query += Utilities.formatString('%s);', larandemalToBeUpdatedList[larandemalToBeUpdatedList.length - 1].id);
  var result = statement.executeUpdate(query);
  query = "UPDATE aktiveratlarandemal SET aktiverat = CASE larandemal";
  for(var i in larandemalToBeUpdatedList.length){
    query += Utilities.formatString(' WHEN %s THEN %s', larandemalToBeUpdatedList[i].id, larandemalToBeUpdatedList[i].aktiverat);
  }
  query += " ELSE aktiverat END WHERE larandemal IN ("; 
  for(var i = 0; i < (larandemalToBeUpdatedList.length - 1); i++){
     query += Utilities.formatString('%s, ', larandemalToBeUpdatedList[i].id);
  }
  query += Utilities.formatString('%s);', larandemalToBeUpdatedList[larandemalToBeUpdatedList.length-1].id);
  
  result = statement.executeUpdate(query);
  statement.close();
}


/**
* Activates or deactivates the given larandemal 
* @param {Number []} larandemalIdArray - an array of larandemal ids that should be activated or deactivated 
* @param {Number} activate - indicates if the given larandemal should be activated (1) or not (0).
*/
function activateOrDeactivateLarandemal(larandemalIdArray, activate){
 var con = Common.establishDbConnection();
  updateActiveStatusLarandemal(con, larandemalIdArray, activate);
 con.close();
}

/**
* Activates or deactivates the given larandemal 
* @param {JdbcConnection} connection - an active JDBC connection
* @param {Number []} larandemalIdArray - an array of larandemal ids that should be activated or deactivated 
* @param {Number} activate - indicates if the given larandemal should be activated (1) or not (0).
*/
function updateActiveStatusLarandemal(connection, larandemalIdArray, activate){
  var larandemalToBeActivatedString ='(';
  for(var i = 0; i < (larandemalIdArray.length - 1); i++){
    larandemalToBeActivatedString += larandemalIdArray[i] + ',';
  }
  //Add last element
  larandemalToBeActivatedString += larandemalIdArray[larandemalIdArray.length - 1] + ')';
  var query = "UPDATE aktiveratlarandemal SET aktiverat = " + activate + " WHERE larandemal in (";
  for(var i = 0; i < (larandemalIdArray.length - 1); i++){
    query += larandemalIdArray[i] + ",";
  }
  query += larandemalIdArray[i] + ")";
  
  var statement = connection.createStatement();
  statement.executeUpdate(query);
  statement.close();  
}

/** 
* Retrieve all larandemal with the latest version from the database
* @param {JdbcConnection} connection - a JDBC connection to the database
* @returns {LarandeMal []} - an array of LarandeMal
*/
function retrieveLarandemal(connection) {
  var spreadsheetMode = 1;
  var program = Common.getDevData(spreadsheetMode, 'program');
  // TODO check if 'program' is a valid string
  var query = 
  'SELECT lm.id, lm.programmal, lm.bloom, lm.nummer, lm.beskrivning, alm.aktiverat, lm.version, pm.typ, pm.nummer ' +
  'FROM larandemal AS lm ' +
  'INNER JOIN (SELECT bloom, programmal, nummer, MAX(version) as version FROM larandemal GROUP BY programmal, bloom, nummer) AS maxversion ' +
    'ON lm.bloom = maxversion.bloom ' +
    'AND lm.programmal = maxversion.programmal ' +
    'AND lm.nummer = maxversion.nummer ' +
    'AND lm.version = maxversion.version ' +
  'INNER JOIN aktiveratlarandemal AS alm ' +
    'ON lm.id = alm.larandemal ' +
  'INNER JOIN programmal AS pm ' +
    'ON lm.programmal = pm.id ' + 
  'INNER JOIN programprogrammal AS ppm ' + 
    'ON pm.id = ppm.programmal ' + 
  'INNER JOIN program AS p ' + 
    'ON ppm.program = p.id ' +
  'WHERE p.programkod = ?;';
  Logger.log(query);
  var statement = connection.prepareStatement(query);
  statement.setString(1, program);
  var resultSet = statement.executeQuery();
  var larandemalList = [];
  while(resultSet.next()) {
    var id = resultSet.getInt(1);
    var programmal = resultSet.getInt(2);
    var bloomNiva = resultSet.getString(3);
    var nummer = resultSet.getInt(4);
    var beskrivning = resultSet.getString(5);
    var aktiverat = resultSet.getInt(6);
    var version = resultSet.getInt(7);
    var progmalTyp = resultSet.getInt(8);
    var progmalNummer = resultSet.getInt(9);
    var larandemal = new LarandeMal(id, programmal, bloomNiva, nummer, version, beskrivning, aktiverat, progmalTyp, progmalNummer);
    larandemalList.push(larandemal);
  }
  
  resultSet.close();
  statement.close();
  //Logger.log('DATABASE larandemalList:<%s>', larandemalList);
  return larandemalList; 
}

/** 
* Retrieve all data from 'programmal' table in the database
* @param {JdbcConnection} connection - JDBC connection to the database
* @returns {programMal []} - an array of programmal, each object is equivalent to one record in the table
*/
function retrieveProgrammalInfo(connection){
  var spreadsheetMode = 1;
  var program = Common.getDevData(spreadsheetMode, 'program');
  Logger.log('program:<%s>', program);
  var query = 
    'SELECT pm.id, pm.typ, pm.nummer, pm.beskrivning, pmt.typ ' + 
    'FROM programmal AS pm ' + 
    'INNER JOIN programmaltyp AS pmt ON pm.typ = pmt.id ' + 
    'INNER JOIN programprogrammal AS ppm ON pm.id = ppm.programmal ' +
    'INNER JOIN program AS p ON ppm.program = p.id ' + 
    'WHERE p.programkod = ? ' + 
    'ORDER BY pm.typ, pm.nummer';
  Logger.log(query); 
  var statement = connection.prepareStatement(query);
  statement.setString(1, program);
  var resultSet = statement.executeQuery();
  
  var progmalList = [];
  while(resultSet.next()){
    var id = resultSet.getInt(1);
    var typ = resultSet.getInt(2);
    var nummer = resultSet.getInt(3);
    var beskrivning = resultSet.getString(4);
    var typText = resultSet.getString(5);
    var programMal = new ProgramMal(id, typ, nummer, beskrivning, typText);
    progmalList.push(programMal);
  }
  resultSet.close();
  statement.close();
  //Logger.log('DATABASE progmalList:<%s>', progmalList);
  return progmalList; 
}
                   