function setBloomColors(range) {
  for(i =1; i<=range.getNumRows(); i++){
    for(j=1; j<=range.getNumColumns(); j++){
      setCellBloomColor(range.getCell(i,j))
    }
  
  }
  
}

function setCellBloomColor(cell){
  var regexBloomLevel1 = RegExp('[1-9][0-9]*\.1\.[1-9]');
  var regexBloomLevel2 = RegExp('[1-9][0-9]*\.2\.[1-9]');
  var regexBloomLevel3 = RegExp('[1-9][0-9]*\.3\.[1-9]');
  var regexBloomLevel4 = RegExp('[1-9][0-9]*\.4\.[1-9]');
  var regexBloomLevel5 = RegExp('[1-9][0-9]*\.5\.[1-9]');
  var regexBloomLevel6 = RegExp('[1-9][0-9]*\.6\.[1-9]');
  var cellData = cell.getValue().toString();
  if(regexBloomLevel6.test(cellData)){
    cell.setBackground("gray");
  }
  else if(regexBloomLevel6.test(cellData)){
    cell.setBackground("yellow");
  }
  else if(regexBloomLevel5.test(cellData)){
    cell.setBackground("orange");
  }
  else if(regexBloomLevel4.test(cellData)){
    cell.setBackground("red");
  }
  else if(regexBloomLevel3.test(cellData)){
    cell.setBackground("purple");
  }
  else if(regexBloomLevel2.test(cellData)){
    cell.setBackground("pink");
  }
  else if(regexBloomLevel1.test(cellData)){
    cell.setBackground("green");
  }
  
  

}
