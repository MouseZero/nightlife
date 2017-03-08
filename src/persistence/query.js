const _ = require('lodash')

module.exports = _.curry( function(pool, queryString){
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
