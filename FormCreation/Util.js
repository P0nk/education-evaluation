/**
* Create a range of integers
* @param {Integer} lowEnd - range lower bound (inclusive)
* @param {Integer} highEnd - range upper bound (inclusive)
* @return {Integer[]} the range
*/
function range(lowEnd, highEnd){
    var arr = [],
    c = highEnd - lowEnd + 1;
    while ( c-- ) {
        arr[c] = highEnd--
    }
    return arr;
}

/**
* Get bloom text
* @param {Integer} level - bloom level
* @return {String} bloom text
*/
function getBloomTitle(level) {
  switch(level) {
    case 1: 
      return 'Fakta';
      break;
    case 2:
      return 'Förståelse';
      break;
    case 3:
      return 'Tillämpning';
      break;
    case 4:
      return 'Analys';
      break;
    case 5:
      return 'Syntes';
      break;
    case 6:
      return 'Värdering';
      break;
    default:
      return '-';
  }
}

/** 
* Move a file in Drive to another folder.
* @param {String} fileId - id of file to move
* @param {String} targetFolderId - id of the new parent folder
*/
function moveFileToFolder(fileId, targetFolderId) {
  var sourceFile = DriveApp.getFileById(fileId);
  var sourceFolder = sourceFile.getParents().next();
  if (sourceFolder.getId() != targetFolderId) {
    DriveApp.getFolderById(targetFolderId).addFile(sourceFile);
    sourceFolder.removeFile(sourceFile);
  }
}

/**
* Remove all characters after and including the last '/' of a string
* @param {String} url - string to remove characters from
* @return {String} trimmed string
*/
function trimUrl(url) {
  var to = url.lastIndexOf('/');
  to = to == -1 ? url.length : to + 1;
  url = url.substring(0, to);
  
  return url;
}

/**
* Extract certain values from form response text
* @param {String} text - form response text
* @return {ResponseMal} extracted values
*/
function extractValues(text) {
  //var source = 'Examensmål 1: Visa kunskap om det valda teknikområdets vetenskapliga grund och dess beprövade erfarenhet samt kännedom om aktuellt forsknings- och utvecklingsarbete.';
  var regexp = /^([\D]+)\s([\d])+:\s(.*)/;
  var values = regexp.exec(text);
  var word = values[1];
  var number = values[2];
  var text = values[3];
  //Logger.log('Source<%s>, Matched<%s>, Number<%s>, Text<%s>', source, word, number, text);
  var extracted = new ResponseMal(word, number, text);
  return extracted;
}

/* Old. Used when temamal didn't exist
// Used to extract '3' from 'Examensmål 3' for example
function extractFirstNumber(text) {
  if(typeof text != 'string') {
    return;
  }
  
  var regexp = /\d+/;
  var value = regexp.exec(text)[0];
  var valueAsNumber = parseInt(value, 10);
  return valueAsNumber;
}
*/