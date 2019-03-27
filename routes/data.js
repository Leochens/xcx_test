const express = require('express')
const router = express.Router();
const client = require('../redis');
const md5 = require('md5');

/**
 * 
 * @param {min} req 
 * @param {number} sessionID 
 */
function checkSession(sessionID) {

    return new Promise(function (resolve, reject) {
        // 检测是否有sessionId sessionId 过期没
        client.get('sess:' + sessionID, function (err, reply) {
            console.log("sess:===>", sessionID);
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
            console.log('md5==>',md5("hello world"));

            return resolve(R.user);
        })
    })

}
router.get('/users', function (req, res) {
    const SID = req.headers['cookie'];
    console.log(SID);
    checkSession(SID).then(function(_res){
        res.json(
            {
                data: [
                    {
                        id: 1,
                        nickName: 'Ryan'
                    }
                ],
                user:_res
            }
        );
    }).catch(function(err){
        res.statusCode = 401;
        console.log(err);
        console.log("认证失败")
        res.json({
            errMsg: '认证失败'
        })
    });

})


module.exports = router;