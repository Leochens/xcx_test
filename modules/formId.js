const dbQuery = require('../utils/dbQuery');
const redis = require('redis');
const client = redis.createClient(6379, '127.0.0.1');
const formId = {};
client.auth('123456', function () {
    console.log("认证成功");
})
formId.addFormId = function (fid) {
    return new Promise(function (resolve, reject) {
        if (fid === 'the formId is a mock one') return reject("the formId is a mock one");
        console.log(fid);
        client.hmset('fid:' + fid, { fid: fid }, function (err, res) {
            if (err) {
                console.log("redis err=>", err);
                return reject(err);
            }
            return resolve('ok formId 插入成功=> ' + fid)

        });
    })
}

formId.getOne = function () {
    return new Promise(function (resolve, reject) {
        client.keys('fid:*', function (err, res) {
            if (err) {
                console.log(err);
                return reject(err);
            }
            if(!res.length) {
                console.log("当前无formid");
                return reject("当前无formid");
            }
            console.log(res);
            const key = res[0];
            const fid = key.split(':')[1];
            console.log("被选中的formid",fid);
            client.del(key, function (err, rep) {
                if (err) { console.log(err); return reject(err) };
                console.log("rep 即时删除成功", rep);
            })
            
            return resolve(fid);
        })
    })
}

module.exports = formId;

