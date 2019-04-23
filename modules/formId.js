const dbQuery = require('../utils/dbQuery');
const redis = require('redis');
const client = redis.createClient(6379, '127.0.0.1');
const formId = {};
client.auth('123456', function () {
    console.log("认证成功");
})

// 为不同用户缓存form_id
formId.addFormId = function (fid,u_id) {
        if (fid === 'the formId is a mock one') return reject("the formId is a mock one");
        console.log("前端发的fid",fid);
        client.lpush('uid:'+u_id,fid,redis.print);
}
// 得到用户的
formId.getOne = function (u_id) {
    return new Promise(function (resolve, reject) {
        client.brpop('uid:'+u_id,100,function(err,fid){
            if (err) {
                console.log(err);
                return reject(err);
            }
            console.log("被选中的formid",fid);
            return resolve(fid);
        })
    })
}

module.exports = formId;

