const express = require('express')
const router = express.Router();
const request = require('request');
const {APP} = require('../config/config');
const User = require('../modules/user');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const client = require('../redis');
const ERR = require('../config/error');

const options = {
    client:client,
    "host": "127.0.0.1",
    "port": "6379",
    // "ttl": 60 * 60 * 24 * 30,   //Session的有效期为30天
    "ttl": 60*60,   //Session的有效期为1 hour
    "prefix":'SID:'
};
router.use(session({
    store: new RedisStore(options),
    secret: 'Leochens',
    resave: false, // 假设每次登陆，就算会话存在也重新保存一次
    saveUninitialized: false, //强制保存未初始化的会话到存储器
}))


/***
 * 认证 用户在第一次登陆或登录失效的时候触发这个api
 * 登陆成功后再redis中存储session 把sessionId下发到小程序端 确保安全
 */
router.post('/auth', (req, res) => {
    const code = req.body.code;
    console.log("前端发来的code=>", code);

    var proxy_url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + APP.appID + '&secret=' + APP.appSecret + '&js_code=' + code + '&grant_type=authorization_code';

    var options = {
        headers: { "Connection": "close" },
        url: proxy_url,
        method: 'GET',
        json: true
    };
    function callback(error, response, data) {
        if (!error && response.statusCode == 200) {
            if (data.session_key && data.openid) {
                console.log("微信auth返回的data=>",data);
                req.session.user = data;
                User.insertUserByOpenId(data.openid).then(function (u_id) {
                    console.log("用户正在登陆，新老用户都可以获得一个u_id=>", u_id);
                    res.json({
                        SID: req.sessionID,
                        u_id
                    });
                    console.log("用户登录完成")
                }).catch(function (err) { console.log('获取u_id失败，检查数据库查询问题吧老铁..', err) })

            } else {
                console.log('/auth 登录失败', error);
                res.json(ERR.USER_LOGIN_FAILD);
            }
        }
    } 
    request(options, callback);
});



module.exports = router;
