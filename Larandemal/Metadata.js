/**
* Function that returns true if no entry in the metadata has a nummer property equal to nummer
* @param {Number} nummer - the nummer which is searched for in the metadata
* @param {Object []} metadata - the metadata which should be searched
* @return {Boolean} - returns false if nummer matches a nummer property for a metadata entry else returns true.
*/
function checkIfNummerNotInMetadata(nummer, metadata){
  for(var i in metadata){
    if(metadata[i].nummer === nummer){
      return false; 
    }  
  }
  return true;
}
