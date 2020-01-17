function Larandemal(bloom, number, version) {
  this.bloom = bloom;
  this.number = number;
  this.version = version;
}

function ResponseRecords(responseId, row) {
  this.responseId = responseId;
  this.row = row;
  this.records = [];
}

function Answer(number, version) {
  this.number = number;
  this.version = version;
}

function Response(timestamp, name, course, row) {
  this.timestamp = timestamp;
  this.name = name;
  this.course = course;
  this.row = row;
  this.answers = [];
}
