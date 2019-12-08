function establishDbConnection() {
  var user = 'root';
  var schema = 'tidab_quality';
  var password = getPassword();
  var subname = 'lustrous-aleph-260112:europe-north1:tidab-quality'; // Subname is called Instance connection name in console overview
  var dbUrl = 'jdbc:google:mysql://' + subname + '/' + schema;
  
  var con = Jdbc.getCloudSqlConnection(dbUrl, user, password);
  return con;
}

/* Run one time to set password for the service. It will then be available for all future use.
function setDatabasePassword() {
  var scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty("PASSWORD_DATABASE", "[your_password_here]");
}
*/

function getPassword() {
  var password = PropertiesService.getScriptProperties().getProperty("PASSWORD_DATABASE");
  return password;
}
