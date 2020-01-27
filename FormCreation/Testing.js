/* Random functions made to run manually to test stuff */

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

function arrayComposition() {
  var array = [1, 'abc', [1]];
  for(var i = 0; i < array.length; i++) {
    if(typeof array[i] != 'number'){
      continue;
    }
    Logger.log(array[i]);
  }
}

function stringTest() {
  var string = 'abc123abc123';
  var index = string.lastIndexOf('1');
  Logger.log('%s has last 1 at %s', string, index);
  var substr = string.substring(0, index);
  Logger.log('%s substring to last index of 1: %s', string, substr);
}

function testValidation() {
  var validation = FormApp.createTextValidation().setHelpText('Help text 123');
}

function testRange() {
  var arr = range(5, 10);
  Logger.log('range:%s', arr);
}
