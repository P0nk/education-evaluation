function onOpen() {
  var ui = SpreadsheetApp.getUi();
  // Or DocumentApp or FormApp.
  ui.createMenu('Interact')
      .addItem('Load', 'showAlert')
      .addItem('CalculateBloomLevels', 'calculateBloom')
  
      .addToUi(); 
}

function calculateBloom(){
 setBloomColors(SpreadsheetApp.getActiveSheet().getRange(3,2,21,11))
}

function showAlert() {
  var ui = SpreadsheetApp.getUi(); // Same variations.

  var result = ui.alert(
     'Please confirm',
     'Are you sure you want to continue?',
      ui.ButtonSet.YES_NO);

  // Process the user's response.
  if (result == ui.Button.YES) {
    // User clicked "Yes".
    load();
  } else {
    // User clicked "No" or X in the title bar.
  }
}

// Unused
function writeArrayToCell(array, cellRow, cellCol) {
  var sheet = SpreadsheetApp.getActiveSheet();
  var cell = sheet.getRange(cellRow, cellCol);
  cell.setValue(array.toString());
}

  
