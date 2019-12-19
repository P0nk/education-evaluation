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
