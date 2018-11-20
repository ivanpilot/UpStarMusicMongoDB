const Artist = require('../models/artist');

/**
 * Sets a group of Artists as retired
 * @param {array} _ids - An array of the _id's of of artists to update
 * @return {promise} A promise that resolves after the update
 */
module.exports = (_ids) => {
  return Artist.update(
    {_id: {$in: _ids}}, // we update records based on the _id field but which value of _id are we considering? we are considering all ids that belongs to _ids. so it basically means all records at once
    {retired: true},
    {multi: true}
  )
};
