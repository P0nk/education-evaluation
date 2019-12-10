// Returns a 3-dimensional array containing objects of type: {bloom:bloomLevel, number:bloomNumber, description:larandemalDescription}
// 1st dim: examensmal
// 2nd dim: bloom level
// 3rd dim: larandemal
function retrieveQuestionData(con, questions) {
  var con = establishDbConnection();
  var questions = [1];
  var query = 
    "SELECT bloom, nummer, beskrivning " + 
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
      var dataTransferObj = {bloom:bloom, number:number, description:description};
      
      if(!Array.isArray(subQuestions[i][bloom]) || !subQuestions[i][bloom].length) {
        subQuestions[i][bloom] = [dataTransferObj];
      } else {
        subQuestions[i][bloom].push(dataTransferObj);
      }
    }
    
    rs.close();
    statement.clearParameters();
  }
  return subQuestions;
}
