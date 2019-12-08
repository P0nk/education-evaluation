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
