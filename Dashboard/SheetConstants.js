// Kurs: A3:A?
var placementKurs = {row: 3, col: 1};

// Data: B3:L?
var placementData = {row: 3, col: 2, colEnd: 11};

var mdKey = {
  'programTitle': 'eduProgramTitle',
  'programYear': 'eduProgramYear'
};

var amountExMal = 11;

function concatTest() {
  
  for(var i = 0; i < 3; i++) {
    var array = new Array(11);
    for(var k = 0; k < array.length; k++) {
      array[k] = '';
    }
    
    
    for(var j = 0; j < 5; j++) {
      array[i] = array[i].concat(j);
    }
    
    Logger.log(i + ' ' + array);
  }
}

