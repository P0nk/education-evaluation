/**
* Location in sheet
*/
var loc = {
  program: {row: 1, col: 1},
  termin: {row: 2, col: 1},
  minDate: {row: 3, col: 1},
  maxDate: {row: 3, col: 2},
  kurs: {row: 6, col: 1, colEnd: 2, colKursKod: 1, colKursNamn: 2},
  malText: {row: 1, rowEnd: 3, col: 3},
  malNummer: {row: 4, rowEnd: 5, col: 3},
  data: {row: 6, col: 3}
};

/**
* Metadata key
*/
var mdKey = {
  programCode: 'eduProgramCode',
  programStart: 'eduProgramStart',
  dataRows: 'amountDataRows',
  malData: 'malLayoutData'
};

/**
* Menu text
*/
var menu = {
  title:'Måluppfyllnad',
  subTitleLoad:'Ladda data',
  subTitleInit:'Starta igång från mallkopia',
  subTitleBloom:'Calculate bloom levels',
  subTitleTable:'Add summary table',
  subTitleDiagram:'Add diagrams'
}

/**
* Prompt text
*/
var dialogLoad = {
  alertTitle:'Bekräfta.',
  alertText:'Denna operation tar tid. Är du säker på att du vill ladda om all data?'
}

/**
* Prompt text
*/
var dialogInit = {
  alertTitle:'VARNING!',
  alertText:'Denna operation bör endast utföras 1 gång efter att mallen har kopierats. Vill du fortsätta?'
}

/**
* Prompt text
*/
var alertText = {
  error: 'Fel.',
  noProvidedInitialData:'Ange programkod i cell A1 och terminsstart i cell A2 och försök igen.\n Exempelvis: "TIDAB" och "HT17"',
  noKursDataInDb:'Ingen kursdata kunde hittas.',
  noMalDataInDb:'Inga programmål kunde hittas.'
}

var arskursSectionPrefix = 'Årskurs ';

/**
* Background colors
*/
var color = {
  bloom1:'#e9f1fc',
  bloom2:'#bcd4f5',
  bloom3:'#90b7ee',
  bloom4:'#649be8',
  bloom5:'#377ee1',
  bloom6:'#1e65c8'
}

/**
* Layout
*/
var layout = {
  dataRowHeight:38,
  headerRowHeight:18,
  diagramHeight:350,
  malColWidth:150,
  dataCellValueFormat:'%s, %s',
  table: {
    numSpacerRows: 2,
    rowHeight: 21,
    rows: 8,
    numHeaderRows: 2,
    headerTextPrefix: 'Antal obl. kurser med förekomst av lärandemål på Bloom-nivå "',
    headerTextSeparator:'", "',
    stubTitleText:'Bloom-nivå',
    numStubCols: 1
  },
  chart: {
    width:150,
    height:350
  }
}