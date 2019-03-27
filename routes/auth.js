const express = require('express')
const router = express.Router();
const request = require('request');
const appID = "wxf18a4b27a92c63bf";
const appSecret = "bb302760e45bf6b7072b4eee0c1b0c8d"
const User = require('../modules/user');



/***
 * 认证 用户在第一次登陆或登录失效的时候触发这个api
 * 登陆成功后再redis中存储session 把sessionId下发到小程序端 确保安全
 */
router.post('/auth', (req, res) => {
    const code = req.body.code;
    console.log("前端发来的code=>", code);

    var proxy_url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appID + '&secret=' + appSecret + '&js_code=' + code + '&grant_type=authorization_code';

    var options = {
        headers: { "Connection": "close" },
        url: proxy_url,
        method: 'GET',
        json: true
    };
    function callback(error, response, data) {
        if (!error && response.statusCode == 200) {
            if (data.session_key && data.openid) {
                req.session.user = data;
                User.insertUserByOpenId(data.openid).then(function (u_id) {
                    console.log("用户正在登陆，新老用户都可以获得一个u_id=>",u_id);
                    res.json({
                        SID: req.sessionID,
                        u_id
                    });
                }).catch(function (err) { console.log('获取u_id失败，检查数据库查询问题吧老铁..',err) })
 
            } else {
                console.log('/auth 登录失败', error);
                res.json("登陆失败")
            }
        }
    } request(options, callback);
});



module.exports = router;
