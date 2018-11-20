const Artist = require('../models/artist');

/**
 * Searches through the Artist collection
 * @param {object} criteria An object with a name, age, and yearsActive
 * @param {string} sortProperty The property to sort the results by
 * @param {integer} offset How many records to skip in the result set
 * @param {integer} limit How many records to return in the result set
 * @return {promise} A promise that resolves with the artists, count, offset, and limit
 */
module.exports = (criteria, sortProperty, offset = 0, limit = 20) => {
  const query = Artist.find(buildQuery(criteria))
    .sort({[sortProperty]: 1})
    .skip(offset)
    .limit(limit);

  //const count = Artist.count();
  // if we simply do Artist.count() this will in fact display the number of artists persisted in our db but won't return the number of artists matching a specific criteria or filter
  // in MongoDB there is no way but to do touch the db in order to come up with the artist count. Now the question is when should we touch the db? ideally before skip and limit otherwise it will always display a count equals to the limit. And since .sort() has no impact, we will in fact query the db for the count right after .find() so we will have
  const count  = Artist.find(buildQuery(criteria)).count();
  
  return Promise.all([query, count])
    .then((results) => {
      return {
        all: results[0],
        count: results[1],
        offset : offset,
        limit: limit
      }
    })
};

const buildQuery = (criteria) => {
  const query = {};

  if(criteria.name){
    query.$text = { $search: criteria.name };
  }

  if(criteria.age){
    query.age = {
      $gte: criteria.age.min,
      $lte: criteria.age.max
    }
  }

  if(criteria.yearsActive){
    query.yearsActive = {
      $gte: criteria.yearsActive.min,
      $lte: criteria.yearsActive.max
    }
  }

  return query
}
