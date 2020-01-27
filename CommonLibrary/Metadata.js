/** 
* Display all metadata entries in current spreadsheet in an alert window.
*/
function displaySpreadsheetMetadata() {
  displayMetadata(MODE_SPREADSHEET);
}

/** 
* Display all metadata entries in current sheet in an alert window.
*/
function displaySheetMetadata() {
  displayMetadata(MODE_SHEET);
}

/** 
* Add one metadata entry to current spreadsheet.
*/
function addSpreadsheetMetadata() {
  var data = promptAddDevData();
  addDevData(MODE_SPREADSHEET, data.key, data.value);
}

/** 
* Add one unit of metadata to current sheet.
*/
function addSheetMetadata() {
  var data = promptAddDevData();
  addDevData(MODE_SHEET, data.key, data.value);
}

/** 
* Delete all metadata with a given key in current spreadsheet.
*/
function deleteSpreadsheetMetadata() {
  var key = promptDeleteDevData();
  deleteAllDevData(MODE_SPREADSHEET, key);
}

/** 
* Delete all metadata with a given key in current sheet.
*/
function deleteSheetMetadata() {
  var key = promptDeleteDevData();
  deleteAllDevData(MODE_SHEET, key);
}

/** 
* Get all developer metadata
* @param {Integer} mode - the type of metadata to get. 1 = spreadsheet, 2 = sheet
* @returns {MetadataEntry[]} - all developer metadata
*/
function getAllDevData(mode) {
  if(mode === MODE_SPREADSHEET) {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var metadata = spreadsheet.getDeveloperMetadata();
  } else if (mode == MODE_SHEET) {
    var sheet = SpreadsheetApp.getActiveSheet();
    var metadata = sheet.getDeveloperMetadata();
  } else {
    return;
  }
  
  var metadataValues = [];
  for(var i in metadata) {
    var key = metadata[i].getKey();
    var value = metadata[i].getValue();
    var mde = new MetadataEntry(key, value);
    metadataValues.push(mde);
  }
  
  return metadataValues;
}

/** 
* Get all developer metadata in the specified sheet
* @param {Sheet} sheet - the sheet to retrieve the metadata from
* @returns {MetadataEntry[]} array of metadata objects
*/
function getAllDevDataSheet(sheet) {
  var metadata = sheet.getDeveloperMetadata(); 
  var metadataValues = [];
  for(var i in metadata) {
    var key = metadata[i].getKey();
    var value = metadata[i].getValue();
    var mde = new MetadataEntry(key, value);
    metadataValues.push(mde);
  }
  
  return metadataValues;
}

/** 
* Get value of a metadata entry with a specific key in location given by mode. 
* Only the first match will return.
* @param {Integer} mode - type of metadata to get
* @param {String} key - get metadata with this key
* @returns the metadata value
*/
function getDevData(mode, key) {
  var allMetadata = getAllDevData(mode);
  
  for(var i in allMetadata) {
    if(allMetadata[i].key == key) {
      var value = allMetadata[i].value;
      return value;
    }
  }
}

/** 
* Get value of a metadata entry with a specific key from the specified sheet. 
* Only the first match will return.
* @param {Sheet} sheet - the sheet to search in for the metadata entry 
* @param {String} key - the key to look for
* @return {String} - the metadata value if found, else null. 
*/
function getDevDataSheet(sheet, key){
  
  var allMetadata = getAllDevDataSheet(sheet);
  for(var i in allMetadata) {
    if(allMetadata[i].key == key) {
      var value = allMetadata[i].value;
      return value;
    }
    
    
  }
  
  /*
  var mdFinder = sheet.createDeveloperMetadataFinder().withLocationType(SpreadsheetApp.DeveloperMetadataLocationType.SHEET);
  var metadatas = mdFinder.withKey(key).find();
  
  if(Array.isArray(metadatas) && (typeof metadatas[0]) == 'object') {
    var mdValue = metadatas[0].getValue();
    return mdValue;
  }
  */
}

/** 
* Display all metadata in an alert window
* @param {Integer} mode - the type of metadata to display. 1 = spreadsheet, 2 = sheet
*/
function displayMetadata(mode) {
  var ui = SpreadsheetApp.getUi();
  var metadata = getAllDevData(mode);
  var alertText = '';
  for(var i in metadata) {
    alertText = alertText.concat(metadata[i].key + ':' + metadata[i].value + '\n');
  }
  if(alertText) {
    ui.alert(alertText);
  } else {
    ui.alert('<No metadata>');
  }
}

/** 
* Open a prompt and let the user enter data in the textbox.
* TODO add sanitization of response text
*/
function promptAddDevData() {
  var ui = SpreadsheetApp.getUi();
  var response = ui.prompt('Enter metadata as "key:value".', ui.ButtonSet.OK_CANCEL);
  if(response.getSelectedButton().OK) {
    var responseText = response.getResponseText();
    var regex = /^([a-zA-Z]*[\w]+):(.*)$/;
    var match = regex.exec(responseText);
    var key = match[1];
    var value = match[2];
    //Logger.log('key:<%s>, value:<%s>', key, value);
    var mde = new MetadataEntry(key, value);
    return mde;
  }
}

/** 
* Add developer metadata to current location
* @param {Integer} mode - the type of metadata to add. 1 = spreadsheet, 2 = sheet
*/
function addDevData(mode, key, value) {
  if(mode == MODE_SPREADSHEET) {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    spreadsheet.addDeveloperMetadata(key, value);
    // var location = 'spreadsheet';
    // var id = spreadsheet.getId();
  } else if(mode == MODE_SHEET) {
    var sheet = SpreadsheetApp.getActiveSheet();
    sheet.addDeveloperMetadata(key, value);
    // var location = 'sheet';
    // var id = sheet.getSheetId();
  } else {
    return;
  }
  
  //Logger.log('Added {%s:%s} to %s with id %s', key, value, location, id);
}

/** 
* Open a prompt and let the user enter a key to delete in the textbox.
* TODO add sanitization of response text
*/
function promptDeleteDevData() {
  var ui = SpreadsheetApp.getUi();
  var response = ui.prompt('Enter metadata key. All entries of the key will be deleted.', ui.ButtonSet.OK_CANCEL);
  if(response.getSelectedButton().OK) {
    var responseText = response.getResponseText();
    return responseText;
  } 
}

/** 
* Delete all metadata entries in the active document that match the provided key in the location given by mode.
* @param {Integer} mode - the type of metadata to delete. 1 = spreadsheet, 2 = sheet.
* @param {String} key - only metadata that have the same key will be deleted.
*/
function deleteAllDevData(mode, key) {
  if(mode == 1) {
    var metadata = SpreadsheetApp.getActiveSpreadsheet().getDeveloperMetadata();
  } else if (mode == 2) {
    var metadata = SpreadsheetApp.getActiveSheet().getDeveloperMetadata();
  } else {
    return;
  }
  
  for(var i in metadata) {
    if(metadata[i].getKey() == key) {
      metadata[i].remove();
    }
  }
}