const client = require('../redis');
/**
 * 
 * @param {min} req
 */
function checkSession(req) {
    const sessionID = req.headers['cookie'];
    return new Promise(function (resolve, reject) {
        // 检测是否有sessionId sessionId 过期没
        client.get('SID:' + sessionID, function (err, reply) {
            console.log("SID:===>", sessionID);
            if (err) {
                console.log(err);
                return reject(err);
            }
            // 因为查询出来的是字符串 要把字符串转换为object
            const R = JSON.parse(reply);
            if (!R||!R.user) {
                console.log("空用户会话");
                return reject("空用户会话");
            }

            console.log("---查询数据---\n", R.user.openid, R.user.session_key);

            return resolve(R.user);
        })
    })

}
module.exports = checkSession;