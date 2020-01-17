/** Equivalent to a record in 'programmal' table in the database
* @param {Number} id - the unique id of the given programmal 
* @param {Number} typ - number identifying the type of the programmal
* @param {Number} nummer - the number of the programmal for the type it belongs to  
* @param {String} beskrivning - the description of the given programmal
* @param {String} typText - text giving the name of the type 
* @return {ProgramMal} - contains information about the given programmal 
*/
function ProgramMal(id, typ, nummer, beskrivning, typText) {
  this.id = id;
  this.typ = typ;
  this.nummer = nummer;
  this.beskrivning = beskrivning;
  this.typText = typText;
}

/** 
* Wrapper around a list of ProgramMal
* Contains convenience methods for easier data retrieval
* @param {ProgramMal []} array - an array of programmal 
* @return {ProgramMalContainer} - contains a list of programmal and methods to retrieve information from it
*/
function ProgramMalContainer(array) {
  // List of ProgramMal
  this.progmalList = array;
  
  
  /**
  * Get the programmal with the specific typ AND nummer
  * @param {Number} typ - number identifying the type of the programmal
  * @param {Number} nummer - the number of the programmal for the type it belongs to  
  * @return {ProgramMal} - the programmal that matches the given type and function 
  */
  this.getProgrammalByTypeNumber = function(typ, nummer) {
    for(var i in this.progmalList) {
      if((typ === this.progmalList[i].typ) && (nummer === this.progmalList[i].nummer)) {
        return this.progmalList[i];
      }
    }
    return null; 
  };
  
  
   /**
  * Get the programmal with the specific id
  * @param {Number} id - the unique id identifying the programmal 
  * @return {ProgramMal} - the programmal that matches the given id
  */
  this.getProgrammalById = function(id){
    for(var i in this.progmalList) {
      /* For debugging
      var typeid = typeof id;
      var typeprogid = typeof this.progmalList[i].id;
      
      SpreadsheetApp.getUi().alert(typeid+" "+ typeprogid);
      */
      if(id === this.progmalList[i].id) {
        return this.progmalList[i];
      }
    }
    return null; 
  };
   
  /**
  * Sorts the programmal stored in this.progmalList into separate arrays depending on their type
  * @return {{typ: Number, list: ProgramMal []} []} - returns an array of objects with the properties typ and list. 
  * Where typ indicates the type of the programmal stored in list. 
  */
  this.getProgrammalSortedByType = function(){
    var types = this.getAllProgrammalTypes();
    //SpreadsheetApp.getUi().alert('Types: '+types.length);
    var programmalSortedByType = [];
    for(var i = 0; i<types.length; i++){
      programmalSortedByType.push({typ: types[i], list: [] }); 
    }  
    
    for(var i = 0; i<this.progmalList.length; i++){
      var progmal = this.progmalList[i];
      for(var j = 0; j<programmalSortedByType.length; j++){
        if(parseInt(progmal.typ) === parseInt(programmalSortedByType[j].typ)){
          programmalSortedByType[j].list.push(progmal);
          break; 
        }
      }
    }
    return programmalSortedByType;
  };
  
  /**
  * Retrieves all the different types of the programmal stored in this.progmalList
  * @return {Number []}  - the different types of program that appear in this.progmalList each type is indicated 
  * by a number. 
  */
  this.getAllProgrammalTypes = function(){
    var types = [];
    for(var i = 0; i<this.progmalList.length; i++){
      var alreadyInTypes = types.indexOf(this.progmalList[i].typ);
      //SpreadsheetApp.getUi().alert(alreadyInTypes);
      //SpreadsheetApp.getUi().alert(alreadyInTypes === -1);
      if(alreadyInTypes === -1){
        types.push(this.progmalList[i].typ);
      }  
    } 
    return types; 
  };
}

/** All relevant data about a larandemal from the database
* @param {Number} id - the unique id identifying the the larandemal  
* @param {Number} programmal - unique id for the programmal the larandemal is associated with
* @param {Number} bloomNiva - number identifying the bloomNiva of the larandemal
* @param {Number} nummer - the larandemals number 
* @param {Number} version - the version of the larandemal
* @param {String} beskrivning - the larandemal description
* @param {Number} aktiverat - number indicating if the larandemal is activated or not 
* @param {Number} progmalTyp - the type of the programmal the larandemal is associated with
* @param {Number} progmalNummer - the number of the programmal the larandemal is associated with 
* @return {LarandeMal} - contains information about a given larandemal 
*/
function LarandeMal(id, programmal, bloomNiva, nummer, version, beskrivning, aktiverat, progmalTyp, progmalNummer) {
  this.id = id;
  this.programMal = programmal;
  this.bloomNiva = bloomNiva;
  this.nummer = nummer;
  this.version = version;
  this.beskrivning = beskrivning;
  this.aktiverat = aktiverat;
  this.progmalTyp = progmalTyp;
  this.progmalNummer = progmalNummer;
}

/** The skeleton of a new larandemal. 
* Requires a version in addition to the existing fields.
* @param {Number} programmal - unique id for the programmal the larandemal is associated with
* @param {Number} bloomNiva - number identifying the bloomNiva of the larandemal
* @param {Number} nummer - the larandemals number 
* @param {String} beskrivning - the larandemal description
* @param {Number} aktiverat - number indicating if the larandemal is activated or not 
* @return {NewLarandeMal} - contains information about a new larandemal that is to be added into the database 
*/
function NewLarandeMal(programmal, bloomNiva, nummer, beskrivning, aktiverat) {
  this.programmal = programmal;
  this.bloomNiva = bloomNiva;
  this.nummer = nummer;
  this.beskrivning = beskrivning;
  this.aktiverat = aktiverat;
}
 
/**
 * Data which can be used to uniquely identify a larandemal
 * @param {Number} programmal - unique id for the programmal the larandemal is associated with
 * @param {Number} bloomNiva - number identifying the bloomNiva of the larandemal
 * @param {Number} nummer - the larandemals number 
 * @return {LarandeMalIdentifier} - contains data which can be used to identify a larandemal 
 */
function LarandeMalIdentifier(programmal, bloomNiva, nummer) {
  this.programmal = programmal;
  this.bloomNiva = bloomNiva;
  this.nummer = nummer;
}
/**
 * Contains information about what the new field values should when a larandemal is updated 
 * @param {String} beskrivning - the larandemal description
 * @param {Number} aktiverat - number indicating if the larandemal is activated or not 
 * @param {Number} id - the unique id identifying the the larandemal  
 * @return {UpdatedLarandemal} - contains the field values that should be updated for the larandemal. 
 */
function UpdatedLarandemal(beskrivning, aktiverat, id){
  this.beskrivning = beskrivning;
  this.aktiverat = aktiverat;
  this.id = id; 
}
