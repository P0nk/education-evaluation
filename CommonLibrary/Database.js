/**
* Get connection to the database
* @return {JdbcConnection} - an active connection to the database
*/
function establishDbConnection() {
  /**
  * Get the value of a saved script property
  * @param {string} property - name of the property to get the value of
  * @return {string} - value of the property
  */
  function getPropertyValue(property){
    var value = PropertiesService.getScriptProperties().getProperty(property);
    return value;
  };
  
  var user = 'root';
  var schema = getPropertyValue('DB_SCHEMA');
  var password = getPropertyValue('DB_PASSWORD');
  var subname = getPropertyValue('DB_SUBNAME'); // Subname is called 'Instance connection name' in console overview
  var dbUrl = 'jdbc:google:mysql://' + subname + '/' + schema;
  
  var con = Jdbc.getCloudSqlConnection(dbUrl, user, password);
  return con;
}
