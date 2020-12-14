/**
* Get data about all goal fulfillments from the database
* @param {JdbcConnection} con - an active JDBC connection to the database
* @param {string} programCode - the program for which to get data
* @param {string} programStart - the arskull for which to get data
* @param {String} timestamp - a timestamp to filter data with. Will only fetch responses sent in after this timestamp.
* @return {MalUppfyllnad[]} - all data about goal fulfillment with the specified program and arskull
*/
function retrieveDataForProgram(con, programCode, programStart, timestamp) {
  var query = 
  'SELECT id, nummer, kurskod, larandemal ' + 
  'FROM (SELECT pmt.id, pm.nummer, k.kurskod, CONCAT(pm.nummer, ".", lm.bloom, ".", lm.nummer) AS larandemal ' +
    'FROM larandemal lm ' + 
    'INNER JOIN enkatfraga AS ef ' + 
      'ON lm.id = ef.larandemal ' + 
    'INNER JOIN enkatfragesvar AS es ' + 
      'ON ef.id = es.enkatfraga ' + 
    'INNER JOIN respons AS rs ' + 
      'ON es.respons = rs.id ' + 
    'INNER JOIN kurs AS k ' + 
      'ON rs.kurskod = k.kurskod ' + 
    'INNER JOIN programkurs AS pk ' + 
      'ON k.id = pk.kurs ' + 
    'INNER JOIN arskull AS ak ' + 
      'ON pk.arskull = ak.id ' + 
    'INNER JOIN programmal AS pm ' + 
      'ON lm.programmal = pm.id ' + 
    'INNER JOIN programmaltyp AS pmt ' + 
      'ON pm.typ = pmt.id ' + 
    'WHERE ak.program = ? ' + 
    'AND ak.terminstart = ? ' + 
    'AND es.svar = TRUE ' + 
    'AND lm.version IN (SELECT MAX(version) FROM larandemal lmInner WHERE lm.id = lmInner.id)) AS with_dups ' + 
  'GROUP BY id, nummer, kurskod, larandemal ' +
  'ORDER BY id, nummer, kurskod, larandemal';
  var statement = con.prepareStatement(query);
  statement.setString(1, programCode);
  statement.setString(2, programStart);
  statement.setString(3, timestamp);
  var rs = statement.executeQuery();
  
  var malUppfyllnadList = [];
  while(rs.next()){
    var malTyp = rs.getInt(1);
    var malNummer = rs.getInt(2);
    var kursKod = rs.getString(3)
    var larandeMal = rs.getString(4);
    var malUppfyllnad = new MalUppfyllnad(malTyp, malNummer, kursKod, larandeMal);
    // malUppfyllnadList.push({typ:malTyp, nummer:malNummer, kurs:kursKod, larandemal:larandeMal});
    malUppfyllnadList.push(malUppfyllnad);
  }
  
  return malUppfyllnadList;
}

/**
* Get data about all goal fulfillments within a specified time range from the database
* @param {JdbcConnection} con - an active JDBC connection to the database
* @param {string} programCode - the program for which to get data
* @param {string} programStart - the arskull for which to get data
* @param {String} timestamp - a timestamp to filter data with. Will only fetch responses sent in after this timestamp.
* @return {MalUppfyllnad[]} - all data about goal fulfillment with the specified program and arskull
*/
function retrieveFilteredDataForProgram(con, programCode, programStart, timestampFilterStart, timestampFilterEnd) {
  var query = 
  'SELECT id, nummer, kurskod, larandemal ' + 
  'FROM (SELECT pmt.id, pm.nummer, k.kurskod, CONCAT(pm.nummer, ".", lm.bloom, ".", lm.nummer) AS larandemal ' +
    'FROM larandemal lm ' + 
    'INNER JOIN enkatfraga AS ef ' + 
      'ON lm.id = ef.larandemal ' + 
    'INNER JOIN enkatfragesvar AS es ' + 
      'ON ef.id = es.enkatfraga ' + 
    'INNER JOIN respons AS rs ' + 
      'ON es.respons = rs.id ' + 
    'INNER JOIN kurs AS k ' + 
      'ON rs.kurskod = k.kurskod ' + 
    'INNER JOIN programkurs AS pk ' + 
      'ON k.id = pk.kurs ' + 
    'INNER JOIN arskull AS ak ' + 
      'ON pk.arskull = ak.id ' + 
    'INNER JOIN programmal AS pm ' + 
      'ON lm.programmal = pm.id ' + 
    'INNER JOIN programmaltyp AS pmt ' + 
      'ON pm.typ = pmt.id ' + 
    'WHERE ak.program = ? ' + 
    'AND ak.terminstart = ? ' + 
    'AND es.svar = TRUE ' + 
    'AND rs.inskickat BETWEEN ? AND ?' + //to be included in some way, but not hard coded like this
    'AND lm.version IN (SELECT MAX(version) FROM larandemal lmInner WHERE lm.id = lmInner.id)) AS with_dups ' + 
  'GROUP BY id, nummer, kurskod, larandemal ' +
  'ORDER BY id, nummer, kurskod, larandemal';
  var statement = con.prepareStatement(query);
  statement.setString(1, programCode);
  statement.setString(2, programStart);
  statement.setString(3, timestampFilterStart);
  statement.setString(4, timestampFilterEnd);
  var rs = statement.executeQuery();
  
  var malUppfyllnadList = [];
  while(rs.next()){
    var malTyp = rs.getInt(1);
    var malNummer = rs.getInt(2);
    var kursKod = rs.getString(3)
    var larandeMal = rs.getString(4);
    var malUppfyllnad = new MalUppfyllnad(malTyp, malNummer, kursKod, larandeMal);
    // malUppfyllnadList.push({typ:malTyp, nummer:malNummer, kurs:kursKod, larandemal:larandeMal});
    malUppfyllnadList.push(malUppfyllnad);
  }
  
  return malUppfyllnadList;
}



/** 
* Get data about all kurs from the database
* @param {JdbcConnection} con - an active JDBC connection to the database
* @param {string} programkod - the program for which to get kurs
* @param {string} terminstart - the arskull for which to get kurs
* @return {Kurs[]} - data about all kurs with the specified programkod and terminstart
*/
function retrieveProgramKurs(con, programkod, terminstart) {
  var query = 
  'SELECT kurskod, namn, ar, inriktning, inriktning_namn FROM ' + 
    '((SELECT k.kurskod, k.namn, pk.ar, null AS inriktning, null AS inriktning_namn ' + 
    'FROM kurs k ' + 
    'INNER JOIN programkurs AS pk ' + 
      'ON k.id = pk.kurs ' + 
    'INNER JOIN arskull AS ak ' + 
      'ON ak.id = pk.arskull ' + 
    'WHERE ak.program = ? ' + 
    'AND ak.terminstart = ? ' + 
    'ORDER BY pk.ar, k.namn) ' + 
  'UNION ' + 
  '(SELECT k.kurskod, k.namn, ik.ar, i.id, i.namn ' + 
  'FROM kurs AS k ' + 
  'INNER JOIN inriktningskurs AS ik ' + 
	'ON k.id = ik.kurs ' + 
  'INNER JOIN inriktning AS i ' + 
	'ON ik.inriktning = i.id ' + 
  'INNER JOIN arskull AS ak ' + 
	'ON ak.id = i.arskull ' + 
  'WHERE ak.program = ? ' + 
  'AND ak.terminstart = ?)) AS unionized ' + 
  'ORDER BY ar, inriktning, namn';
  
  var statement = con.prepareStatement(query);
  statement.setString(1, programkod);
  statement.setString(2, terminstart);
  statement.setString(3, programkod);
  statement.setString(4, terminstart);
  var rs = statement.executeQuery();
  
  var kurser = [];
  while(rs.next()) {
    var kurskod = rs.getString(1);
    var kursnamn = rs.getString(2);
    var arskurs = rs.getInt(3);
    var inriktningId = rs.getInt(4);
    var inriktning = rs.getString(5);
    
    // var kurs = {kurskod:kurskod, kursnamn:kursnamn, arskurs:arskurs};
    var kurs = new Kurs(kurskod, kursnamn, arskurs);
    
    if(inriktningId && inriktning) {
        kurs.inriktningId = inriktningId;
        kurs.inriktning = inriktning;
    }
    
    kurser.push(kurs);
  }
  
  rs.close();
  statement.close();
  return kurser;
}

/**
* Get data about programmal from the database
* @param {JdbcConnection} con - a JDBC connection to the database
* @param {string} programKod - the program code to find programmal for
* @return {ProgramMalTyp[]} - data about all programmal for the specified program
*/
function retrieveProgramMal(con, programKod) {
  var query = 
  'SELECT pm.beskrivning, pm.nummer, typ.id, typ.typ ' + 
  'FROM programmal AS pm ' + 
  'INNER JOIN programmaltyp AS typ ' + 
	'ON pm.typ = typ.id ' + 
  'INNER JOIN programprogrammal AS ppm ' + 
	'ON pm.id = ppm.programmal ' + 
  'INNER JOIN program AS p ' + 
	'ON ppm.program = p.id ' + 
  'WHERE p.programkod = ? ' + 
  'ORDER BY typ.id, pm.nummer';
  var statement = con.prepareStatement(query);
  statement.setString(1, programKod);
  var rs = statement.executeQuery();
  
  var programMal = [];
  while(rs.next()) {
    var beskrivning = rs.getString(1);
    var nummer = rs.getInt(2);
    var typId = rs.getInt(3);
    var typBeskrivning = rs.getString(4);
    
    //var curMal = programMal[typId];
    if(!(programMal[typId])) {
      // programMal[typId] = {typ:typBeskrivning, mal:[]};
      programMal[typId] = new ProgramMalTyp(typBeskrivning);
    }
    programMal[typId].mal[nummer] = beskrivning;
  }
  
  rs.close();
  statement.close();
  return programMal;
}
