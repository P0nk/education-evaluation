function load() {
  var con = establishDbConnection();
  var sheet = SpreadsheetApp.getActiveSheet();
  var programData = getEduProgramDataFromSheet(sheet);
  var sheetData = retrieveKurserForProgram(con, programData.eduProgramTitle, programData.eduProgramYear);
  writeSheetData(sheetData);
  setBloomColors(SpreadsheetApp.getActiveSheet().getRange(3,2,21,12))  
  con.close();
}


function loadLatestLarandemal(){
  var con = establishDbConnection();
  var larandemalList = retrieveLatestVersionLarandemal(con);
  con.close();
  return larandemalList;
}

function loadExmalInfo(){
    var con = establishDbConnection();
    var exmalList = retrieveExamensmalInfo(con);
    con.close();
    return exmalList;
}

function activateOrDeactivateLarandemal(larandemalIdList, activate){
 var con = establishDbConnection();
  updateActiveStatusLarandemal(con, larandemalIdList, activate);
 con.close();
}
function updateActiveStatusLarandemal(connection, larandemalIdList, activate){
  var larandemalToBeActivatedString ='(';
  for(i = 0; i<larandemalIdList.length-1; i++){
    larandemalToBeActivatedString+=larandemalIdList[i]+',';
  }
  //Add last element
  larandemalToBeActivatedString+=larandemalIdList[larandemalIdList.length-1]+')';
  
//  var query = "UPDATE aktivalarandemal SET aktiverat = ? "+
// "Where larandemal in ?";
 var query = "UPDATE aktiveradelarandemal SET aktiverat = "+activate+ 
 " Where larandemal in (";
  for(i = 0; i<larandemalIdList.length-1; i++){
  
  query+=larandemalIdList[i]+",";
  
  }
  query+=larandemalIdList[i]+")";
  
  var statement = connection.createStatement();
  //var statement = connection.prepareStatement(query);
  //statement.setInt(1, activate);
  //statement.setString(2, larandemalToBeActivatedString);
  //statement.setString(2, "1");
  statement.executeUpdate(query);
  //var result = statement.executeUpdate();
  //result.next()
  //SpreadsheetApp.getUi().alert(result.getString(1));
  //result.close();
  statement.close();  
}


  
  

function retrieveLatestVersionLarandemal(connection){
  var statement = connection.createStatement();
  var query = "SELECT larandemal.id, larandemal.examensmal, larandemal.bloom, larandemal.nummer, larandemal.beskrivning, aktiverat FROM larandemal INNER JOIN " +
    "(SELECT bloom, examensmal, nummer, MAX(version) FROM larandemal GROUP BY examensmal, bloom, nummer) AS maxversion "
  +"ON larandemal.bloom = maxversion.bloom AND larandemal.examensmal = maxversion.examensmal AND larandemal.nummer = maxversion.nummer "+
    "INNER JOIN aktiveradelarandemal ON larandemal.id = aktiveradelarandemal.larandemal";
  var resultSet = statement.executeQuery(query);
  var larandemalList = [];
  while(resultSet.next()){
    var larandemal = {};
    larandemal.id = resultSet.getInt(1);
    larandemal.examensmal = resultSet.getInt(2);
    larandemal.bloomLevel = resultSet.getString(3);
    larandemal.number = resultSet.getInt(4);
    larandemal.description = resultSet.getString(5);
    larandemal.aktiverat = resultSet.getInt(6);
    
    larandemalList.push(larandemal);
  }
  resultSet.close();
  statement.close();
  return larandemalList; 
}

function retrieveExamensmalInfo(connection){
  var statement = connection.createStatement();
  var query = "SELECT nummer, beskrivning FROM examensmal ORDER BY nummer";
  var resultSet = statement.executeQuery(query);
  var exmalList = [];
  while(resultSet.next()){
    var exmal = {};
    exmal.nummer = resultSet.getInt(1);
    exmal.beskrivning = resultSet.getString(2);
    
    exmalList.push(exmal);
  }
  resultSet.close();
  statement.close();
  return exmalList; 

}
                       
  

