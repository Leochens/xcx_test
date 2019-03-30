const conn = require('../modules/db');

function dbQuery(sql,value){

    return new Promise(function(resovle,reject){
        conn.query(sql,[value],function(err,res){
            if(err){
                return reject(err);
            }
            return resovle(res);
        })
    });
}


module.exports = dbQuery;