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

function loadProgmalInfo(){
    var con = establishDbConnection();
    var progmalObject = {};
    progmalObject.progmalList = retrieveProgammalInfo(con);
    progmalObject.getProgrammalByTypeNumber = function(typ, nummer){
    for(var i = 0; i<this.progmalList.length; i++){
      if((typ === this.progmalList[i].typ) && (nummer === this.progmalList[i].nummer)){
        return this.progmalList[i];
      }
    }
    return null; 
    };
    progmalObject.getProgrammalById = function(id){
    for(var i = 0; i<this.progmalList.length; i++){
      var typeid = typeof id;
      var typeprogid = typeof this.progmalList[i].id;
      
      //SpreadsheetApp.getUi().alert(typeid+" "+ typeprogid);
      if(id === this.progmalList[i].id){
        return this.progmalList[i];
      }
    }
    return null; 
    };
    con.close();
    return progmalObject;
}


function addNewLarandemal(newLarandemalToAdd){
  var con = establishDbConnection();
  AddLarandemalToDB(con, newLarandemalToAdd);
  addLarandemalActivity(con, newLarandemalToAdd);
  con.close();

}

function updateLarandemal(larandemalToBeUpdated){
   var con = establishDbConnection();
   updateLarandemalInDB(con, larandemalToBeUpdated);
   con.close();
}

function AddLarandemalToDB(connection, newlarandemalList){
//SpreadsheetApp.getUi().alert("AddLarandemalToDB");
var query = "INSERT INTO larandemal(bloom, programmal, nummer, version, beskrivning) VALUES ";
  for(i=0; i<newlarandemalList.length-1; i++){
    query+= "("+newlarandemalList[i].bloom+","+newlarandemalList[i].programmal+","+newlarandemalList[i].nummer+","+newlarandemalList[i].version+","+
    "'"+newlarandemalList[i].description+"'"+"),";

  }
  query+="("+newlarandemalList[newlarandemalList.length-1].bloom+","+newlarandemalList[newlarandemalList.length-1].programmal+","+newlarandemalList[newlarandemalList.length-1].nummer+","+newlarandemalList[newlarandemalList.length-1].version+","+
    "'"+newlarandemalList[newlarandemalList.length-1].description+"'"+");";
  //SpreadsheetApp.getUi().alert(query);  
  var statement = connection.createStatement();
  statement.executeUpdate(query);
  statement.close();
   
  
}

function  addLarandemalActivity(connection, newLarandemalToAdd){
  //SpreadsheetApp.getUi().alert("addLarandemalActivity");
  var query = "SELECT id from larandemal WHERE (bloom, programmal, nummer, version) IN (";
  for(i=0; i<newLarandemalToAdd.length-1; i++){
    query+= "("+newLarandemalToAdd[i].bloom+","+newLarandemalToAdd[i].programmal+","+newLarandemalToAdd[i].nummer+","+newLarandemalToAdd[i].version+"),";
  }
  query+="("+newLarandemalToAdd[newLarandemalToAdd.length-1].bloom+","+newLarandemalToAdd[newLarandemalToAdd.length-1].programmal+","+newLarandemalToAdd[newLarandemalToAdd.length-1].nummer+
  ","+newLarandemalToAdd[newLarandemalToAdd.length-1].version+"))";
  //SpreadsheetApp.getUi().alert(query);  
  var statement = connection.createStatement();
  var resultSet = statement.executeQuery(query);
  var larandemalIds = [];
  while(resultSet.next()){
    larandemalIds.push(resultSet.getInt(1));
  }
  statement.close();
  
  query = "INSERT INTO aktiveratlarandemal(larandemal,aktiverat) VALUES";
  for(i=0; i<newLarandemalToAdd.length-1; i++){
    query+="("+larandemalIds[i]+","+newLarandemalToAdd[i].aktiverat+"),"; 
  }
  query+="("+larandemalIds[newLarandemalToAdd.length-1]+","+newLarandemalToAdd[newLarandemalToAdd.length-1].aktiverat+");";
  //SpreadsheetApp.getUi().alert(query);  
  statement = connection.createStatement();
  statement.executeUpdate(query);
  statement.close();
}

function updateLarandemalInDB(connection, larandemalToBeUpdatedList){
  //var query = "UPDATE aktiveratlarandemal(larandemal,aktiverat) VALUES";
  
  var statement = connection.createStatement();
  var query = "UPDATE larandemal SET beskrivning = CASE id";
  for(i=0; i<larandemalToBeUpdatedList.length; i++){
  
    query+=" WHEN "+ larandemalToBeUpdatedList[i].id +" THEN '" +larandemalToBeUpdatedList[i].description+"'"; 
  
  }
  query+=" ELSE beskrivning END WHERE id IN ("; 
  for(i=0; i<larandemalToBeUpdatedList.length; i++){
  
    query+=larandemalToBeUpdatedList[i].id+", ";
  
  }
  query+=larandemalToBeUpdatedList[larandemalToBeUpdatedList.length-1].id+");";
  //SpreadsheetApp.getUi().alert(query);
  var result = statement.executeUpdate(query);
  //SpreadsheetApp.getUi().alert("num updated descriptions: "+result);
  query = "UPDATE aktiveratlarandemal SET aktiverat = CASE larandemal";
  for(i=0; i<larandemalToBeUpdatedList.length; i++){
  
    query+=" WHEN "+ larandemalToBeUpdatedList[i].id +" THEN " +larandemalToBeUpdatedList[i].aktiverat; 
  
  }
  query+=" ELSE aktiverat END WHERE larandemal IN ("; 
  for(i=0; i<larandemalToBeUpdatedList.length-1; i++){
     query+=larandemalToBeUpdatedList[i].id+", ";
  }
  query+=larandemalToBeUpdatedList[larandemalToBeUpdatedList.length-1].id+");";
  
  //statement = connection.createStatement();
  result = statement.executeUpdate(query);
  //SpreadsheetApp.getUi().alert("num updated aktiverat: "+result);
  statement.close();
//                          WHEN 1 THEN 1 
//                          WHEN 2 THEN 0 
//                          WHEN 4 THEN 1 
//                          ELSE aktiverat
//                        END, 
//                 Col2 = CASE id 
//                          WHEN 3 THEN 3 
//                          WHEN 4 THEN 12 
//                          ELSE Col2 
//                        END
//             WHERE id IN (1, 2, 3, 4);

  
  //need to update aktiveeratlarandemal also 
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
  
//  var query = "UPDATE aktiveratlarandemal SET aktiverat = ? "+
// "Where larandemal in ?";
 var query = "UPDATE aktiveratlarandemal SET aktiverat = "+activate+ 
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
var query = "SELECT larandemal.id, larandemal.programmal, larandemal.bloom, larandemal.nummer, larandemal.beskrivning, aktiverat, larandemal.version, programmal.typ, programmal.nummer " +
"FROM larandemal " +
"INNER JOIN (SELECT bloom, programmal, nummer, MAX(version) as version FROM larandemal GROUP BY programmal, bloom, nummer) " +
"AS maxversion " +
"ON larandemal.bloom = maxversion.bloom " +
"AND larandemal.programmal = maxversion.programmal "+
"AND larandemal.nummer = maxversion.nummer " +
"AND larandemal.version = maxversion.version " +
"INNER JOIN aktiveratlarandemal " +
"ON larandemal.id = aktiveratlarandemal.larandemal "+
"INNER JOIN programmal "+
"ON larandemal.programmal = programmal.id;";

//  var query = "SELECT larandemal.id, examensmal, larandemal.bloom, larandemal.nummer, larandemal.beskrivning, aktiverat, larandemal.version FROM larandemal INNER JOIN " +
//    "(SELECT bloom, examensmal, nummer, MAX(version) as version FROM larandemal GROUP BY examensmal, bloom, nummer) AS maxversion "
//  +"ON larandemal.bloom = maxversion.bloom AND larandemal.examensmal = maxversion.examensmal AND larandemal.nummer = maxversion.nummer "+
//    "AND larandemal.version = maxversion.version INNER JOIN aktiveratlarandemal ON larandemal.id = aktiveratlarandemal.larandemal";
//  var query = "SELECT DISTINCT larandemal.id, pm.nummer as examensmal, larandemal.bloom, larandemal.nummer, larandemal.beskrivning, aktiverat, larandemal.version FROM larandemal " + 
//            "INNER JOIN (SELECT id, nummer FROM programmal WHERE typ = 1) AS pm ON larandemal.programmal = pm.id INNER JOIN "+
//            "(SELECT pm.nummer as examensmal, larandemal.bloom, larandemal.nummer, MAX(larandemal.version) as version "+
//            "FROM larandemal INNER JOIN (SELECT id, nummer FROM programmal WHERE typ = 1) AS pm ON larandemal.programmal = pm.id "+
//            "GROUP BY examensmal, larandemal.bloom, larandemal.nummer) AS maxversion ON larandemal.bloom = maxversion.bloom "+
//            "AND examensmal = maxversion.examensmal AND larandemal.nummer = maxversion.nummer AND larandemal.version = maxversion.version " +
//             "INNER JOIN aktiveratlarandemal ON larandemal.id = aktiveratlarandemal.larandemal;"

  var resultSet = statement.executeQuery(query);
  var larandemalList = [];
  while(resultSet.next()){
    var larandemal = {};
    larandemal.id = resultSet.getInt(1);
    larandemal.programmal = resultSet.getInt(2);
    larandemal.bloomLevel = resultSet.getString(3);
    larandemal.number = resultSet.getInt(4);
    larandemal.description = resultSet.getString(5);
    larandemal.aktiverat = resultSet.getInt(6);
    larandemal.version = resultSet.getInt(7);
    larandemal.programmalTyp = resultSet.getInt(8);
    larandemal.programmalNummer = resultSet.getInt(9);
    larandemalList.push(larandemal);
  }
  resultSet.close();
  statement.close();
  return larandemalList; 
}

function retrieveProgammalInfo(connection){
  var statement = connection.createStatement();
  var query = "SELECT id, typ, nummer, beskrivning FROM programmal ORDER BY id";
  var resultSet = statement.executeQuery(query);
  var progmalList = [];
  while(resultSet.next()){
    var progmal = {};
    progmal.id = resultSet.getInt(1);
    progmal.typ = resultSet.getInt(2);
    progmal.nummer = resultSet.getInt(3);
    progmal.beskrivning = resultSet.getString(4);
    progmalList.push(progmal);
  }
  resultSet.close();
  statement.close();
  return progmalList; 

}

//parser(){
//}
                       
  

