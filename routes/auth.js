const express = require('express')
const router = express.Router();
const request = require('request');
const appID = "wxf18a4b27a92c63bf";
const appSecret = "bb302760e45bf6b7072b4eee0c1b0c8d"
const client = require('../redis');
/**
 * 
 * @param {min} req 
 * @param {number} sessionID 
 */
function checkSession(req,sessionID){

    // 检测是否有sessionId sessionId 过期没
    client.get('sess:'+sessionID,function(err,reply){
        console.log("sess:===>",req.sessionID);
        if(err){
            console.log(err);
            return false;
        }
        console.log("err",err);

        console.log("reply?==>",reply);
        return true;
    })
}

// 用户在第一次登陆的时候触发这个api
// 登陆成功后再redis中存储session 把sessionId下发到小程序端 确保安全
router.get('/login/:code', (req, res) => {
    const code = req.param('code');
    // console.log(code);
    var method = req.method.toUpperCase();
    var proxy_url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appID + '&secret=' + appSecret + '&js_code=' + code + '&grant_type=authorization_code';

    var options = {
        headers: { "Connection": "close" },
        url: proxy_url,
        method: method,
        json: true,
        // body: req.body
    };
    function callback(error, response, data) {
        console.log(req.session)
        if (!error && response.statusCode == 200) {
            log(req.method,req.url,data);
            if(data.session_key && data.openid){
                req.session.user = data;
                // res.cookie('SID',req.sessionID); // 把SessionId发给小程序
                res.json(req.sessionID);
            }else{
                res.json("登陆失败")
            }
        }
    }
    request(options, callback);
});
router.post('/auth', (req, res) => {
    const code = req.body.code;
    console.log("code==>",code);
    console.log('cookie===>',req.header['set-cookie']);
    
    var method = req.method.toUpperCase();
    var proxy_url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appID + '&secret=' + appSecret + '&js_code=' + code + '&grant_type=authorization_code';

    var options = {
        headers: { "Connection": "close" },
        url: proxy_url,
        method: method,
        json: true
    };
    function callback(error, response, data) {
        // console.log(req.session)
        if (!error && response.statusCode == 200) {
            if(data.session_key && data.openid){
                req.session.user = data;
                res.cookie('hello','hello');
                res.cookie('SID',req.sessionID); // 把SessionId发给小程序
                // console.log(res);
                res.json({
                    SID:req.sessionID
                });
            }else{
                res.json("登陆失败")
            }
        }
    }    request(options, callback);
});



module.exports = router;