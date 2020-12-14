/**
* Add a menu to the toolbar when the user opens the sheet
*/
function onOpen() {
  createMenu();
}

/**
* Create a custom menu
*/
function createMenu() {
  var ui = SpreadsheetApp.getUi();
  // Or DocumentApp or FormApp.
  ui.createMenu(menu.title)
      .addItem(menu.subTitleLoad, 'dialogLoadData')
      .addItem(menu.subTitleInit, 'dialogInitializeSheet')
      //.addItem('Clear', 'warningClear')
      /*
      .addSubMenu(ui.createMenu('Developer')
        //.addItem('activate selected larandemal', 'activateLarandemal')
        //.addItem('deactivate selected larandemal', 'deactivateLarandemal')
        .addItem('Visa bok-metadata', 'Common.displaySpreadsheetMetadata')
        .addItem('Visa blad-metadata', 'Common.displaySheetMetadata')
        .addItem('Lägg till bok-metadata', 'Common.addSpreadsheetMetadata')
        .addItem('Lägg till blad-metadata', 'Common.addSheetMetadata')
        .addItem('Ta bort bok-metadata', 'Common.deleteSpreadsheetMetadata')
        .addItem('Ta bort blad-metadata', 'Common.deleteSheetMetadata'))
      */
      .addToUi(); 
}

/**
* Open a prompt asking the user to accept starting the initialization process in a new template copy
*/
function dialogInitializeSheet() {
  var ui = SpreadsheetApp.getUi();
  var result = ui.alert(dialogInit.alertTitle, dialogInit.alertText, ui.ButtonSet.YES_NO);

  if (result == ui.Button.YES) {
    initialize();
  } 
}

/**
* Open a prompt asking the user to accept starting the process to load content
*/
function dialogLoadData() {
  var ui = SpreadsheetApp.getUi();
  var result = ui.alert(dialogLoad.alertTitle, dialogLoad.alertText, ui.ButtonSet.YES_NO);

  if (result == ui.Button.YES) {
    load();
  }
}

/**
* Open a prompt with text and an Ok button
* @param {String} title - title text in the prompt
* @param {String} text - content text in the prompt
*/
function alertOk(title, text) {
  var ui = SpreadsheetApp.getUi();
  ui.alert(title, text, ui.ButtonSet.OK);
}

/**
* For development. Open a warning prompt for clearing the entire sheet that the user can choose to accept
*/
function warningClear() {
  var ui = SpreadsheetApp.getUi();
  var result = ui.alert('Warning', 'All initialized content will be cleared', ui.ButtonSet.OK_CANCEL)
  
  if(result == ui.Button.OK) {
    clearWorkingSpace();
  }
}