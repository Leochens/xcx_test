const conn = require('../modules/db');

function dbQuery(sql){
    return new Promise(function(resovle,reject){
        conn.query(sql,function(err,res){
            if(err){
                return reject(err);
            }
            return resovle(res);
        })
    });
}


module.exports = dbQuery;