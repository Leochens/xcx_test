const dbQuery = require('../utils/dbQuery');
const redis = require('redis');
const client = redis.createClient(6379, '127.0.0.1');
const formId = {};
client.auth('123456', function () {
    console.log("认证成功");
})
const formIdExpiretion = 1000 * 60 * 60 * 24 * 7; // 过期时间是7天
// 为不同用户缓存form_id
formId.addFormId = function (fid, u_id) {
    if (fid === 'the formId is a mock one') return "the formId is a mock one";
    console.log("前端发的fid", fid);
    const key = 'uid:' + u_id;
    const data = {
        fid,
        time: Date.parse(new Date())
    }
    client.lpush(key, JSON.stringify(data), redis.print);
}
// 得到用户的
formId.getOne = function (u_id) {
    // 如何才能保证拿到的一定是不过期的？ 不能用while循环
    const key = 'uid:' + u_id;
    return new Promise(function (resolve, reject) {
        client.blpop(key, 2, function (err, form) {
            if (err) {
                console.log(err);
                return reject(err);
            }
            if (!form) {
                const err = "拿不到formid";
                console.log(err);
                return reject(err);
            }
            console.log(form);
            const formData = JSON.parse(form[1]);
            if (!formData.fid) {
                console.log("获得的fid为null");
                return reject('获得的fid为null');
            }
            const now = Date.parse(new Date());
            const time = formData.time;
            if (now - time > formIdExpiretion) { // 过期
                // 继续
                console.log("已经没有可以使用的formId了 执行无效formId清空程序");
                client.ltrim(key, 1, 0)// 清空formId中所有的数据
                // 即 ltrim key start end 中的start要比end大即可，数值且都为正数。
            } else {
                console.log("被选中的formid", formData.fid);
                return resolve(formData.fid);
            }
        })
    })
}

module.exports = formId;

