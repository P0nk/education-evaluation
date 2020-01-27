function ProgramMal(typ, nummer, beskrivning) {
  this.typ = typ;
  this.nummer= nummer;
  this.beskrivning = beskrivning;
}

function LarandeMal(id, bloom, number, version, description) {
  this.id = id;
  this.bloom = bloom;
  this.number = number;
  this.version = version;
  this.description = description;
}

/** 
* A programmal supplied in form response text
*/
function ResponseMal(word, number, text) {
  this.word = word;
  this.number = number;
  this.text = text;
}
