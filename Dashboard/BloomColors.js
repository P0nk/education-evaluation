/**
* Get rule for conditional formatting coloring
* @param {Integer} bloomLevel - bloom level to get rule for
* @return {String} conditional formatting rule
*/
function getTextRule(bloomLevel){
  return '*.' + bloomLevel + '.*';
}


/**
* Set conditional formatting which changes background color based on the highest bloom level the cell contains
* @param {Sheet} sheet - sheet to set conditional formatting in
* @param {Range} range - range to set conditional formatting in
*/
function setColorCondForm(sheet, range) {
  var abstractRule = SpreadsheetApp.newConditionalFormatRule().setRanges([range]);
  var rules = [];
  rules[1] = abstractRule.whenTextContains(getTextRule(1)).setBackground(color.bloom1).build();
  rules[2] = abstractRule.whenTextContains(getTextRule(2)).setBackground(color.bloom2).build();
  rules[3] = abstractRule.whenTextContains(getTextRule(3)).setBackground(color.bloom3).build();
  rules[4] = abstractRule.whenTextContains(getTextRule(4)).setBackground(color.bloom4).build();
  rules[5] = abstractRule.whenTextContains(getTextRule(5)).setBackground(color.bloom5).build();
  rules[6] = abstractRule.whenTextContains(getTextRule(6)).setBackground(color.bloom6).build();
  
  var activeRules = sheet.getConditionalFormatRules();
  for(var i = 6; i > 0; i--){
    activeRules.push(rules[i]);
  }
  sheet.setConditionalFormatRules(activeRules);
}

/* Old, slow method.
function setBloomColors(range) {
  for(i =1; i<=range.getNumRows(); i++){
    for(j=1; j<=range.getNumColumns(); j++){
      setCellBloomColor(range.getCell(i,j))
    }
  }
}
*/

/* Old, slow method.
function setCellBloomColor(cell){
  var regexBloomLevel1 = RegExp('[1-9][0-9]*\.1\.[1-9][0-9]*');
  var regexBloomLevel2 = RegExp('[1-9][0-9]*\.2\.[1-9][0-9]*');
  var regexBloomLevel3 = RegExp('[1-9][0-9]*\.3\.[1-9][0-9]*');
  var regexBloomLevel4 = RegExp('[1-9][0-9]*\.4\.[1-9][0-9]*');
  var regexBloomLevel5 = RegExp('[1-9][0-9]*\.5\.[1-9][0-9]*');
  var regexBloomLevel6 = RegExp('[1-9][0-9]*\.6\.[1-9][0-9]*');
  var cellData = cell.getValue().toString();
  if(regexBloomLevel6.test(cellData)){
    cell.setBackground("#1954a6");
  }
  else if(regexBloomLevel6.test(cellData)){
    cell.setBackground("#1e65c8");
  }
  else if(regexBloomLevel5.test(cellData)){
    cell.setBackground("#377ee1");
  }
  else if(regexBloomLevel4.test(cellData)){
    cell.setBackground("#649be8");
  }
  else if(regexBloomLevel3.test(cellData)){
    cell.setBackground("#90b7ee");
  }
  else if(regexBloomLevel2.test(cellData)){
    cell.setBackground("#bcd4f5");
  }
  else if(regexBloomLevel1.test(cellData)){
    cell.setBackground("#e9f1fc");
  }
}
*/