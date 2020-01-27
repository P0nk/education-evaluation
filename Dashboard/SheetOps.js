/**
* Set the basic structure with programmal on the sheet, and apply new layout
* @param {Sheet} sheet - the sheet to write to
* @param {ProgramMalTyp[]} programMal - the data to write
* @return {ProgramMalPlacement[]} - data about how things were written to the sheet
*/
function writeProgramMalData(sheet, programMal) {
  // If no data exists at all
  if(!Array.isArray(programMal) || programMal.length == 0) {
    return;
  }

  var malData = [];
  var totalAmountCols = 0;

  for(var i in programMal) {
    // Get properties of current programmal
    var malTyp = programMal[i].typ;
    var mal = programMal[i].mal;
    if(mal.length <= 0) {
      break;
    }

    if(typeof(lastCol) == 'undefined') {
      var lastCol = loc.malText.col - 1;
    }

    // Write programmal title
    var titleWidth = 1;
    var titleHeight = (loc.malNummer.rowEnd - loc.malText.row + 1)
    var titleRange = sheet.getRange(loc.malText.row, (lastCol + 1), titleHeight, titleWidth);
    lastCol += titleWidth;
    titleRange.getCell(1, 1).setValue(malTyp);
    setFormattingMalTyp(titleRange);

    // Make writeable arrays
    var malTexter = [];
    var malNummer = [];
    for(var j in mal) {
      var beskrivning = mal[j];
      malTexter.push(beskrivning);
      malNummer.push(j);
    }
    var amountMal = malNummer.length;

    // Calculate ranges to write values to

    // These ranges will be merged visually.
    var textHeight = (loc.malText.rowEnd - loc.malText.row + 1);
    var textMergeRange = sheet.getRange(loc.malText.row, (lastCol + 1), textHeight, amountMal);

    var numHeight = (loc.malNummer.rowEnd - loc.malNummer.row + 1);
    var numMergeRange = sheet.getRange(loc.malNummer.row, (lastCol + 1), numHeight, amountMal);

    // Needed due to merged cells. Only values written to first row and column in range will be visible.
    var textWriteRange = sheet.getRange(loc.malText.row, (lastCol + 1), 1, amountMal);
    var numWriteRange = sheet.getRange(loc.malNummer.row, (lastCol + 1), 1, amountMal);
    lastCol += amountMal;

    // Write values
    textWriteRange.setValues([malTexter]);
    numWriteRange.setValues([malNummer]);

    // Set layout
    setFormattingMalText(textMergeRange);
    setFormattingMalNum(numMergeRange);

    var amountCols = titleWidth + amountMal;
    totalAmountCols += amountCols;

    // Title placement
    var titleColStart = titleRange.getColumn();

    // Data placement. Could use either text/num range
    var dataColStart = textMergeRange.getColumn();
    var dataColEnd = textMergeRange.getLastColumn();
    // malData.push({typId:i, typ:extraMalTyp, startCol:startCol, endCol:endCol, amount:(amountExtraMal + 1)});

    // Save placement about this typ
    var malPlacement = new ProgramMalPlacement(i, malTyp, titleColStart, dataColStart, dataColEnd, malNummer);
    malData.push(malPlacement);
  }

  // Set width of all columns that were written to
  var firstCol = loc.malText.col;
  var colWidth = 150;
  sheet.setColumnWidths(firstCol, totalAmountCols, colWidth);

  return malData;
}

/**
* Write all structural data about kurs, årskurs & inriktning to the sheet. Get data about where sections should be inserted.
* @param {Sheet} sheet - the sheet to write to
* @param {Kurs[]} - the data to write
* @return {Section[]} - data about sections that should be inserted
*/
function writeProgramKursData(sheet, kurser) {
  var amountKurs = kurser.length;

  var kursData = [];
  var curSection = {arskurs: null, inriktningId: null};
  var sections = [];

  for(var i in kurser) {
    var curKurs = kurser[i];
    var kurskod = curKurs.kurskod;
    var kursnamn = curKurs.kursnamn;
    var arskurs = curKurs.arskurs;
    // for(var x in y) doesn't generate integer, but rather a decimal number
    var rowIndex = parseInt(i) + 1;

    kursData.push([kurskod, kursnamn]);

    if(arskurs != curSection.arskurs) {
      var arskursRowText = arskursSectionPrefix + arskurs;
      //var section = {text: arskursRowText, row: i, inriktning: false};
      var section = new Section(arskursRowText, rowIndex, false);
      sections.push(section);

      curSection.arskurs = arskurs;
    }

    if(('inriktning' in curKurs) && ('inriktningId' in curKurs)) {
      if(curKurs.inriktningId != curSection.inriktningId) {
        var inriktning = curKurs.inriktning;
        //var section = {text: inriktning, row: i, inriktning: true};
        var section = new Section(inriktning, rowIndex, true);
        sections.push(section);

        curSection.inriktningId = curKurs.inriktningId;
      }
    }
  }

  // Write values
  var kursWidth = (loc.kurs.colEnd - loc.kurs.col + 1);
  var kursRange = sheet.getRange(loc.kurs.row, loc.kurs.col, amountKurs, kursWidth);
  kursRange.setValues(kursData);

  // Set layout
  var rowHeight = layout.dataRowHeight;
  sheet.setRowHeights(loc.kurs.row, amountKurs, rowHeight);
  setFormattingKurs(kursRange);

  return sections;
}

/**
* Add multiple sections that visually divide up rows
* @param {Sheet} sheet - sheet to add sections to
* @param {Section[]} sections - sections to add. Must be in ascending row order
* @param {Integer} numCols - number of columns that the sections should span, starting from column A
*/
function addSections(sheet, sections, numCols) {
  for(var i = (sections.length - 1); i >= 0; i--) {
    var text = sections[i].text;
    var row = sections[i].row;
    var subsection = sections[i].inriktning;

    insertSection(sheet, row, text, numCols, subsection);
  }
}

/**
* Insert a single section that visually divides up rows
* @param {Sheet} sheet - sheet to insert section in
* @param {Integer} rowIndex - row index where section is to be inserted
* @param {String} text - text in the section
* @param {Integer} numCols - number of columns that the section should span, starting from column A
* @param {Boolean} subsection - if the section is a subsection or not. This dictates the visual design of the section.
*/
function insertSection(sheet, rowIndex, text, numCols, subsection) {
  var newRowIndex = loc.kurs.row + rowIndex - 1;
  sheet.insertRowBefore(newRowIndex); // New row will have same index since it's placed before
  var rowHeight = layout.headerRowHeight;
  sheet.setRowHeight(newRowIndex, rowHeight);

  var kursRange = sheet.getRange(newRowIndex, loc.kurs.col, 1, loc.kurs.colEnd);
  kursRange.getCell(1, 1).setValue(text);
  var malRange = sheet.getRange(newRowIndex, loc.malNummer.col, 1, numCols);
  // malRange.getCell(1, 1).setValue(text);

  setFormattingSectionKurs(kursRange);

  if(subsection) {
    setFormattingSubsection(kursRange);
    setFormattingSubsection(malRange);
  } else {
    setFormattingSection(kursRange);
    setFormattingSection(malRange);
  }
}

<<<<<<< HEAD
// Unused
function writeArrayToCell(array, cellRow, cellCol) {
  var sheet = SpreadsheetApp.getActiveSheet();
  var cell = sheet.getRange(cellRow, cellCol);
  cell.setValue(array.toString());
=======
/**
* Write all content
* @param {Sheet} sheet - the sheet to write to. Has to be initialized (programmaldata & kursdata written already)
* @param {MalUppfyllnad[]} sheetData - the data to write
*/
function writeSheetData(sheet, sheetData) {
  var malDataText = Common.getDevDataSheet(sheet, mdKey.malData);
  var amountDataRows = Common.getDevDataSheet(sheet, mdKey.dataRows);
  var malData = JSON.parse(malDataText);
  var startIndex = loc.data.col;

  // Get kurser from sheet
  var rowStart = loc.kurs.row;
  var colStart = loc.kurs.col;
  var amountCols = (loc.kurs.colEnd - loc.kurs.col) + 1;
  var kurser = sheet.getRange(rowStart, colStart, amountDataRows, amountCols).getValues();

  var malPlacement = [];
  var amountDataCols = 0;

  for(var i in malData) {
    amountDataCols += malData[i].amount;

    /* old method
    var typId = malData[i].typId;
    var startIndex = malData[i].startCol - loc.data.col;
    var endIndex = malData[i].endCol - loc.data.col;
    malPlacement[typId] = {startIndex:startIndex, endIndex:endIndex};
    */
  }

  var programData = [];
  // Index in sheets start on 1, array index start on 0
  for (var i in kurser) {
    var kursKod = kurser[i][loc.kurs.colKursKod - 1].toString().toLowerCase().trim();
    var kursNamn = kurser[i][loc.kurs.colKursNamn - 1].toString().toLowerCase().trim();
    var kursData = [];

    // Initialize kursData to empty string to make array fit into range
    for(var j = 0; j < amountDataCols; j++) {
      kursData[j] = '';
    }

    //programData.push(kursData);
    //Logger.log('programData: <%s>', programData);

    // A section
    if(kursKod && !kursNamn) {
      programData.push(kursData);
      continue;
    }

    for (var j in sheetData) {
      var retrievedKursKod = sheetData[j].kurs.toString().toLowerCase().trim();
      if (kursKod == retrievedKursKod) {
        // round for the comparison later
        var malTyp = Math.round(sheetData[j].typ);
        var malNummer = sheetData[j].nummer;
        var malNummerIndex = -1;

        // Get index
        for(var k in malData) {
          // round for the comparison later
          var typ = Math.round(malData[k].typId);
          if(malTyp === typ) {
            var malNummerList = malData[k].malNummer;
            //var malNummerIndex = malData[k].malNummer.indexOf(malNummer);
            for(var l = 0; l < malNummerList.length; l++) {
              if(malNummer == malNummerList[l]) {
                malNummerIndex = l;
                break;
              }
            }
            // Logger.log('malNummerList:%s', malData[k].malNummer);
            // Logger.log('malNummer:%s', malNummer);
            // Logger.log('malNummerIndex:%s', malNummerIndex);

            var curMalStartIndex = malData[k].titleStartCol;
            // + 1 since Sheets is 1-indexed
            var kursDataIndex = (curMalStartIndex - startIndex) + malNummerIndex + 1;

            // Logger.log('cMSI type:%s, sI type:%s, mNI type:%s', typeof curMalStartIndex, typeof startIndex, typeof malNummerIndex);
            // Logger.log('kursDataIndex:%s', kursDataIndex);
            //Logger.log('mNI:%s, cMSI:%s, kDI:%s', malNummerIndex, curMalStartIndex, kursDataIndex);
          }
        }

        // Invalid index
        if(malNummerIndex == -1) {
          continue;
        }

        //var kursDataIndex = malPlacement[malTyp].startIndex + malNummer - 1;


        var lrMal = sheetData[j].larandemal.toString();
        // If the index already has a string; append. Otherwise set it.
        if(kursData[kursDataIndex].trim()) {
          var old = kursData[kursDataIndex];
          var appended = Utilities.formatString(layout.dataCellValueFormat, old, lrMal);
          kursData[kursDataIndex] = appended;
        } else {
          kursData[kursDataIndex] = lrMal;
        }
      }
    }

    programData.push(kursData);
  }

  var range = sheet.getRange(loc.data.row, loc.data.col, kurser.length, amountDataCols);
  //var width = range.getNumColumns();
  //var height = range.getNumRows();
  //Logger.log('Program data:<%s>, Length:<%s>', programData, programData.length);
  //Logger.log('Width:<%s>, Height:<%s>', width, height);

  range.setValues(programData);
}

/**
* Get date from direct user input into the sheet
* @param {Sheet} sheet - sheet to get date from
* @return {Object} the value from the date box. Is possibly a Date object.
*/
function getUserRequestedDate(sheet) {
  var row = loc.date.row;
  var col = loc.date.col;
  var dateCell = sheet.getRange(row, col).getCell(1, 1);
  var possibleDate = dateCell.getValue();
  return possibleDate;
>>>>>>> develop
}

/**
* Set the basic structure with programmal on the sheet, and apply new layout
* @param {Sheet} sheet - the sheet to write to
* @param {ProgramMalTyp[]} programMal - the data to write
* @return {ProgramMalPlacement[]} - data about how things were written to the sheet
*/
/* Old. Should be avoided, contains hard coded stuff.
function writeProgramMalData(sheet, programMal) {
  // If no data exists at all
  if(!Array.isArray(programMal) || programMal.length == 0) {
    return;
  }

  var malData = [];
  var examensMalId = 1;
  var examensMal = programMal[examensMalId];
  var typ = examensMal.typ;

  // If no data exists about current programmal
  if(!Array.isArray(examensMal.mal) || examensMal.mal.length == 0) {
    return;
  }

  var amountExMal = examensMal.mal.length - 1;
  var amountMal = amountExMal; // -1 since no mal on first index

  var beskrivningar = [];
  var malNummer = [];
  for(var i in examensMal) {
    var beskrivning = examensMal.mal[i];
    beskrivningar.push(beskrivning);
    malNummer.push(i);
  }

  var numValueRange = sheet.getRange(loc.malNummer.row, loc.malNummer.col, 1, amountMal);
  var textValueRange = sheet.getRange(loc.malText.row, loc.malText.col, 1, amountMal);

  numValueRange.setValues([malNummer]);
  textValueRange.setValues([beskrivningar]);

  // Start formatting the sheet
  var numRange = sheet.getRange(loc.malNummer.row, loc.malNummer.col, (loc.malNummer.rowEnd - loc.malNummer.row) + 1, amountMal);
  setFormattingMalNum(numRange);
  var textRange = sheet.getRange(loc.malText.row, loc.malText.col, (loc.malText.rowEnd - loc.malText.row) + 1, amountMal);
  setFormattingMalText(textRange);
  var lastCol = textRange.getLastColumn();

  //malData.push({typId:examensMalId, typ:typ, startCol:loc.malText.col, endCol:lastCol, amount:amountMal});
  var malPlacement = new ProgramMalPlacement(examensMalId, typ, loc.malText.col, lastCol, amountMal);
  malData.push(malPlacement);


  for(var i = 2; i < programMal.length; i++) {
    // Properties of current programmal
    var extraMalTyp = programMal[i].typ;
    var extraMal = programMal[i].mal;
    //var amountExtraMal = extraMal.length - 1; // -1 since no mal on first array index
    if(extraMal.length <= 0) {
      break;
    }

    // Write programmal title
    var extraMalTitle = sheet.getRange(loc.malText.row, (lastCol + 1), (loc.malNummer.rowEnd - loc.malText.row + 1), 1);
    lastCol += 1;
    extraMalTitle.getCell(1, 1).setValue(extraMalTyp);
    setFormattingMalTyp(extraMalTitle);

    // Make writeable arrays
    var extraMalBeskrivningar = [];
    var extraMalNummer = [];
    for(var i in extraMal) {
      var beskrivning = extraMal[i];
      extraMalBeskrivningar.push(beskrivning);
      extraMalNummer.push(i);
    }
    amountExtraMal = extraMalNummer.length;

    // Calculate ranges to write values to
    var extraMalTextRange = sheet.getRange(loc.malText.row, (lastCol + 1), (loc.malText.rowEnd - loc.malText.row + 1), amountExtraMal);
    var extraMalTextValueRange = sheet.getRange(loc.malText.row, (lastCol + 1), 1, amountExtraMal);
    var extraMalNumRange = sheet.getRange(loc.malNummer.row, (lastCol + 1), (loc.malNummer.rowEnd - loc.malNummer.row + 1), amountExtraMal);
    var extraMalNumValueRange = sheet.getRange(loc.malNummer.row, (lastCol + 1), 1, amountExtraMal);
    lastCol += amountExtraMal;

    // Write values
    extraMalTextValueRange.setValues([extraMalBeskrivningar]);
    extraMalNumValueRange.setValues([extraMalNummer]);

    // Set layout
    setFormattingMalText(extraMalTextRange);
    setFormattingMalNum(extraMalNumRange);
    amountMal += 1 + amountExtraMal;

    // Placement
    var startCol = extraMalTextRange.getColumn();
    var endCol = extraMalTextRange.getLastColumn();
    // malData.push({typId:i, typ:extraMalTyp, startCol:startCol, endCol:endCol, amount:(amountExtraMal + 1)});

    // Save placement
    var malPlacement = new ProgramMalPlacement(i, extraMalTyp, startCol, endCol, (amountExtraMal + 1));
    malData.push(malPlacement);
  }

  // Set width of all columns that were written to
  sheet.setColumnWidths(loc.malText.col, amountMal, 150);

  return malData;
}
*/
