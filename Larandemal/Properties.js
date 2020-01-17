/* Run one time to set password for the service. It will then be available for all future use.
function setDatabasePassword() {
  var scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty("PASSWORD_DATABASE", "[your_password_here]");
}
*/

/**
* Retrieves the password for the database which is stored as a script property.
* @returns {String} password - the password to the database
*/
function getPassword() {
  var password = PropertiesService.getScriptProperties().getProperty("PASSWORD_DATABASE");
  return password;
}
