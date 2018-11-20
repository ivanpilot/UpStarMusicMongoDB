const Artist = require('../models/artist');

/**
 * Finds the lowest and highest yearsActive of artists in the Artist collection
 * @return {promise} A promise that resolves with an object
 * containing the min and max yearsActive, like { min: 0, max: 14 }.
 */
module.exports = () => {
  const min = Artist
    .find({})
    .sort({age: 1})
    .limit(1)
    .then(artists => artists[0].age)
  // when chaining a .then(), we are now exiting mongodb and using JS
  // it is a very bad thing to switch from mongo to JS but it can make
  // sense like above when we want to retrieve a specific attribute of 
  // a model instance

  const max = Artist
    .find({})
    .sort({age: -1})
    .limit(1)
    .then(artists => artists[0].age)

  // strangely enough, I would have thought that min and max do not return
  // a promise anymore but literally a value of age

  return Promise.all([min, max])
    .then((results) => {
  return {min: results[0], max: results[1]}
  });
      // interesting to notice that Promise.all() returns only 1 thing
      // which is an array of x number of elements depending on the number 
      // of arguments that was passed when invoking Promise.all()
};
