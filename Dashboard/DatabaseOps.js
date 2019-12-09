function load() {
  var con = establishDbConnection();
  
  var kurser = loadKurser(con);
  var examensmal = loadExamensmal(con);
  loadLarMal(con, 1, kurser);
  loadLarMal(con, 2, kurser);
  //SpreadsheetApp.getUi().alert(SpreadsheetApp.getActiveSheet().getRange(5,2));
  //SpreadsheetApp.getActiveSheet().getRange(5,2)
  //SpreadsheetApp.getUi().alert(kurser.length);
  //SpreadsheetApp.getUi().alert(examensmal.length);
  setBloomColors(SpreadsheetApp.getActiveSheet().getRange(3,2,kurser.length, examensmal.length))
  
  
  con.close();
}


function loadExamensmal(con){

  var examensmal = retrieveExamensmalFromDb(con);
  
  return examensmal; 
  
}



//Examensmal 
function retrieveExamensmalFromDb(con) {
  var statement = con.createStatement();
  var query = "SELECT nummer FROM examensmal";
  var resultSet = statement.executeQuery(query);
  
  var examensmal = [];
  while(resultSet.next()) {
    var examensmalNummer = resultSet.getString(1);
    examensmal.push([examensmalNummer]);
  }
  
  resultSet.close();
  statement.close();
  return examensmal;
  

}

function loadKurser(con) {
  var kurser = retrieveKursFromDb(con);  
  var sheet = SpreadsheetApp.getActiveSheet();
  var kursCol = sheet.getRange(rowKurs, colKurs, kurser.length);
  kursCol.setValues(kurser);
  
  return kurser;
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

