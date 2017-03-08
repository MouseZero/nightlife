const R = require('ramda');

module.exports = R.curry( function(pool, queryString){
  const params = arguments[2] || [];
  return new Promise(function(resolve, reject){

    pool.connect( function(err, client, done){
      if(err){
        return reject('Error fetching client pool for postresql');
      }

      client.query(queryString, params, function(err, result){
        if(err){
          return reject('error running query:: ' + err);
        }
        resolve(result.rows);
        done();
      });
    });
  });
});
