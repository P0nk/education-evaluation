/**
* A goal that a course has fulfilled
*/
function MalUppfyllnad(malTyp, malNummer, kurskod, larandemal) {
  this.typ = malTyp;
  this.nummer = malNummer;
  this.kurs = kurskod;
  this.larandemal = larandemal;
}

/**
* A course
*/
function Kurs(kurskod, kursnamn, arskurs) {
  this.kurskod = kurskod;
  this.kursnamn = kursnamn;
  this.arskurs = arskurs;
  
  this.inriktning = null;
  this.inriktningId = null;
}

/**
* Structure programmal.
* @param {String} typBeskrivning - general description of this maltyp
*/
function ProgramMalTyp(typBeskrivning) {
  this.typ = typBeskrivning;
  // malnummer is index. This contains the descriptive texts about mal.
  this.mal = [];
}

/**
* Keep track of where programmal of a specific type is placed
* @param {number} typId - id of programmaltyp
* @param {string} typ - description of programmaltyp
* @param {number} titleStartCol - the first column of the range. Occupied by title.
* @param {number} dataStartCol - the first column that is occupied by programmal
* @param {number} dataEndCol - the last column of the range. Occupied by programmal.
* @param {number[]} malNummer - the programmal that were written to the sheet, in the same order they were written
*/
function ProgramMalPlacement(typId, typ, titleStartCol, dataStartCol, dataEndCol, malNummer) {
  this.typId = typId;
  this.typ = typ;
  this.titleStartCol = titleStartCol;
  this.dataStartCol = dataStartCol;
  this.dataEndCol = dataEndCol;
  this.malNummer = malNummer;
  this.amount = (dataEndCol - titleStartCol) + 1;
  
  /** Disabled because it's impossible to stringify a function
  * Get column index of a programmal
  * @param {Integer} malNummer - mal nummer to find
  * @return {Integer} - column index in this.malNummer -1 if not found.
  *
  this.getMalNummerIndex = function(malNummer) {
    return this.malNummer.indexOf(malNummer);
  }
  */
}

/**
* Split up kurs into sections
* @param {string} text - the section text to be displayed
* @param {number} row - the row that the section will be located on
* @param {boolean} inriktning - if the section is of type inriktning
*/
function Section(text, row, inriktning) {
  this.text = text;
  this.row = row;
  this.inriktning = inriktning;
}