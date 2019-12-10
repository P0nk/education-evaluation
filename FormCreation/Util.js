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

function logDate() {
  var date = new Date();
  var day = date.getDate();
  var month = date.getMonth()+1;
  var string = date.getDate() + '/' + (date.getMonth()+1);
  Logger.log(string);
  //Logger.log('%s/%s', Math.round(date.getDate()), Math.round(date.getMonth()+1));
}

function arrayLength() {
  var obj = {abc:123, def:456, ghi: 789};
  var array1 = [obj];
  var array2 = [];
  Logger.log(Array.isArray(array1) == true);
  Logger.log(Array.isArray(array2) == true);
}

function checkType() {
  Logger.log(typeof {} == 'object');
}
