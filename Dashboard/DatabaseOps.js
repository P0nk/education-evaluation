function load() {
  var con = establishDbConnection();
  var sheet = SpreadsheetApp.getActiveSheet();
  var programData = getEduProgramDataFromSheet(sheet);
  var sheetData = retrieveKurserForProgram(con, programData.eduProgramTitle, programData.eduProgramYear);
  writeSheetData(sheetData);
  /*
  var kurser = loadKurser(con);
  loadLarMal(con, 1, kurser);
  loadLarMal(con, 2, kurser);
  */
  
  con.close();
}


function initialize(con) {
  var kurser = retrieveKursFromDb(con);  
  var sheet = SpreadsheetApp.getActiveSheet();
  var kursCol = sheet.getRange(placementKurs.row, placementKurs.col, kurser.length);
  //setDevDataSheet('amountKurs', kurser.length);
  kursCol.setValues(kurser);
  
  return kurser;
}

function writeSheetData(sheetData){
  var sheet = SpreadsheetApp.getActiveSheet();
  var amountKurser = getDevDataSheet('amountKurs');
  var rowStart = placementKurs.row;
  var colStart = placementKurs.col;
  var kurser = sheet.getRange(rowStart, colStart, amountKurser).getValues();
  var programData = [];
  // Index in sheets start on 1, array index start on 0
  for (var i = 0; i < kurser.length; i++) {
    //var kurs = getDevDataRow(i); Does not work yet since no metadata is set in initialize()
    var kurs = kurser[i][0].toString().toLowerCase().trim();
    var kursData = new Array(amountExMal);
    for(var k = 0; k < kursData.length; k++) {
      kursData[k] = '';
    }
    
    for (var j = 0; j < sheetData.length; j++) {
      var kursToFill = sheetData[j].kurs.toString().toLowerCase().trim();
      if (kurs == kursToFill){
        var exMal = sheetData[j].examensmal;
        var lrMal = sheetData[j].larandemal.toString();
        kursData[exMal-1] = kursData[exMal-1].concat(' ' + lrMal);
      }
    }
    programData.push(kursData);
  }
  
  var range = sheet.getRange(placementData.row, placementData.col, kurser.length, placementData.colEnd);
  range.setValues(programData);
}

function retrieveKurserForProgram(con, eduProgram, eduYear) {
  //Logger.log(eduProgram);
  //Logger.log(eduYear);
  var query = 
      "SELECT lm.examensmal, k.kurskod, CONCAT(lm.examensmal, '.', lm.bloom, '.', lm.nummer) AS larandemal " + 
      "FROM larandemal lm " + 
      "INNER JOIN enkatfraga AS ef " + 
        "ON lm.id = ef.larandemal " + 
      "INNER JOIN enkatfragesvar AS es " +
        "ON ef.id = es.enkatfraga " +
      "INNER JOIN respons AS rs " +
        "ON es.respons = rs.id " + 
      "INNER JOIN enkatbedomning AS eb " +
        "ON rs.id = eb.respons " +
      "INNER JOIN kurs AS k " + 
        "ON rs.kurskod = k.kurskod " + 
      "INNER JOIN programkurs AS pk " + 
        "ON k.id = pk.kurs " + 
      "INNER JOIN arskull AS ak " + 
        "ON pk.arskull = ak.id " + 
      "WHERE ak.program = ? " + 
      "AND ak.ar = ? " + 
      "AND es.svar = TRUE " + 
      "AND eb.godkand = TRUE " + 
      "AND lm.version IN (SELECT MAX(version) FROM larandemal lmInner WHERE lm.id = lmInner.id) " + 
      "ORDER BY lm.examensmal, k.kurskod"; 
  var statement = con.prepareStatement(query);
  statement.setString(1, eduProgram);
  statement.setInt(2, eduYear);
  var rs = statement.executeQuery();
  
  var malUppfyllnad = [];
  while(rs.next()){
    var examensmal = rs.getInt(1);
    var kurskod = rs.getString(2)
    var larandemal = rs.getString(3);
    malUppfyllnad.push({'examensmal':examensmal, 'kurs':kurskod, 'larandemal':larandemal});
  }
  Logger.log(malUppfyllnad);
  
  return malUppfyllnad;
}

function loadLarMal(con, exMal, kurser) {
  for(i=0; i<kurser.length; i++) {
    var kurs = kurser[i];
    var larMal = retrieveKursLarMal(con, exMal, kurs);
    var cellValue = larMal.length ? larMal.join(", ") : "-";
    var cellRow = placementData.row + i;
    var cellCol = placementData.col + (exMal - 1);
    writeArrayToCell(cellValue, cellRow, cellCol);
  }
}

// Kurs
function retrieveKursFromDb(connection) {
  var statement = connection.createStatement();
  var query = "SELECT kurskod FROM kurs ORDER BY id";
  var resultSet = statement.executeQuery(query);
  
  var kurs = [];
  while(resultSet.next()) {
    var kursKod = resultSet.getString(1);
    kurs.push([kursKod]);
  }
  
  resultSet.close();
  statement.close();
  return kurs;
}

function retrieveLarMal(connection, exMal, kursKod) {
  // TODO
  // Hur slipper vi skapa massor av queries? ((11 examensmål) * (antal kurser)) blir alldeles för stor belastning.
  // Vi borde kunna ha en stor query some returnerar kurskod-examensmålspar med en generated column för lärandemål (typ "1.2.2"), alltså 3 kolumner i yttersta SELECT-satsen.
}

function retrieveKursLarMal(connection, exMal, kursKod) {
  if(exMal == null || kursKod == null) {
    return [];
  }
  
  var query = "SELECT CONCAT(examensmal,'.',bloom,'.',nummer) AS larandemal FROM larandemal WHERE examensmal = ? AND id IN " + 
    "(SELECT larandemal FROM enkatfraga WHERE id IN " +
      "(SELECT enkatfraga FROM enkatfragesvar WHERE svar = TRUE AND respons IN " + 
        "(SELECT id FROM respons WHERE kurskod = ?))) " + 
          "ORDER BY examensmal, bloom, nummer";
  var statement = connection.prepareStatement(query);
  statement.setInt(1, exMal);
  statement.setString(2, kursKod);
  var rs = statement.executeQuery();
  
  var lMal = [];
  while(rs.next()) {
    //Logger.log(rs.getString(1));
    lMal.push(rs.getString(1));
  }
  
  rs.close();
  statement.close();
  
  return lMal;
}
