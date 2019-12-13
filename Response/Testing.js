function testing() {
  Logger.log(Statement.RETURN_GENERATED_KEYS);
}

function protectFirstRow() {
  var sheet = SpreadsheetApp.getActiveSheet();
  sheet.getRange('1:1').protect().setWarningOnly(true);
}

function testExtractLevel() {
  var text = 'Nivå 1: Fakta';
  Logger.log(extractLevel(text));
}

function filterTest() {
  var array = [1, 'two', 3, {four:4}, [5], 'six'];
  var filtered = array.filter(function(val){return typeof val == 'string'});
  Logger.log('Filtered array: %s', filtered);
}


function writeToProtected() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var protectedRange = sheet.getRange('10:10');
  protectedRange.protect().setWarningOnly(true);
  var cell1 = protectedRange.getCell(1, 1).setValue('Overwriting protection');
  var cell2 = protectedRange.getCell(1, 2).setValue('Overwriting protection again');
}

function testExtractAnswers() {
  var string = '1: Kunna redogöra för akademiskt arbete och organisation m a p utbildning och forskning samt kunna ange några relevanta forskningsområden, aktuella forskningsresultat och vilka forskningsmetoder som använts., 2: Kunna förklara/definiera vetenskaplighet och hur den kan bedömas i ingenjörsprojekt som handlar om datateknik, elektronik och IT., 3: Kunna redogöra för någon typ av gängse innehållsstruktur i akademiska, vetenskapliga och ingenjörsmässiga artiklar och rapporter t ex den s k IMRaD-modellen., 4: Känna till några relevanta databaser med vetenskapliga/ingenjörsmässiga artiklar och hur man kommer åt att söka och hämta artiklar ur dessa databaser (acm.org, ieee.org, kth.se (diva) m fl )., 5: Känna till någon relevant ansats, definition och metod för ”kritisk granskning” och bedömning av trovärdighet/vetenskaplighet i artiklar, böcker och ingenjörsrapporter., 6: Genom utbildningen aktivt söka och samla, inför det självständiga arbetet och blivande yrkesrollen, referenser till aktuell beprövad ingenjörserfarenhet och kunskap med akademiskt vetenskaplig grund (användning av verktyg som t ex Mandalay, EndNote, Zotero, Google Scholar)., 7: Ordbehandlingsmässigt kunna skriva och redigera mallar (IEEE tvåspalt) för vetenskapliga artiklar (ej infört i matris II1300 eller infört i designmatris), 8: Begreppsmässigt (utan djupare förståelse) kunna ange vad som är aktuella forskningsområden inom specifika ämnen (ämnen i kurs) och vilka forskningsområden som finns vid aktuell (kursgivande) avdelning., 9: Översiktligt kunna beskriva innehållet i någon vetenskaplig artikel som kopplar till ämnet i en kurs.';
  extractAnswers(string);
}

function testConvertTimestamp() {
  var timestampSheet = 'Thu Dec 15 16:45:14 GMT+01:00 2019'
  Logger.log(convertTimestamp(timestampSheet));
}

function testLoopEmpty() {
  for(var i = 0; i < 0; i++) {
    Logger.log('Inside for loop');
  }
}