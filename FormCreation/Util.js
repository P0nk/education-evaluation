function range(lowEnd,highEnd){
    var arr = [],
    c = highEnd - lowEnd + 1;
    while ( c-- ) {
        arr[c] = highEnd--
    }
    return arr;
}

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

function moveFile(fileId, targetFolderId) {
  var sourceFile = DriveApp.getFileById(fileId);
  var sourceFolder = sourceFile.getParents().next();
  if (sourceFolder.getId() != targetFolderId) {
    DriveApp.getFolderById(targetFolderId).addFile(sourceFile);
    sourceFolder.removeFile(sourceFile);
  }
}

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

// Remove all characters after last '/'
function trimUrl(url) {
  var to = url.lastIndexOf('/');
  to = to == -1 ? url.length : to + 1;
  url = url.substring(0, to);
  
  return url;
}