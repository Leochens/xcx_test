const express = require('express')
const app = express()
const request = require('request');
const appID = "wxf18a4b27a92c63bf";
const appSecret = "bb302760e45bf6b7072b4eee0c1b0c8d"
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
const redis = require('redis')
const client = redis.createClient({ password: "123456" });//这里填写redis的密码
var options = {
    client:client,
    "host": "127.0.0.1",
    "port": "6379",
    // "ttl": 60 * 60 * 24 * 30,   //Session的有效期为30天
    "ttl": 30,   //Session的有效期为30秒
};

// 此时req对象还没有session这个属性
app.use(session({
    store: new RedisStore(options),
    secret: 'express is powerful'
}));
// 经过中间件处理后，可以通过req.session访问session object。比如如果你在session中保存了session.userId就可以根据userId查找用户的信息了。

app.get('/', (req, res) => { console.log(req); res.send('Hello World!') });
app.get('/api', (req, res) => {
    const code = req.param('code');
    console.log(code);
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
        if (!error && response.statusCode == 200) {
            console.log('------api接口数据------\n', data);

            res.json(data)
        }
    }

    request(options, callback);
    // res.send('Hello World!');

});
app.get('/token', function (req, res) {
    var proxy_url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appSecret}`;
    var method = req.method.toUpperCase();

    var options = {
        headers: { "Connection": "close" },
        url: proxy_url,
        method: method,
        json: true,
        // body: req.body
    };

    function callback(error, response, data) {
        if (!error && response.statusCode == 200) {
            console.log('------token接口数据------\n', data);

            res.json(data)
        }
    }

    request(options, callback);
})

app.get('/login', (req, res, next) => {

    // 从数据库中比对账号验证是否成功，如成功保存用户信息
    var user = {
        name: "Ryan",
        age: "22",
        address: "bj"
    }
    req.session.user = user;
    res.json("登录成功")
});

app.get('/fetch', (req, res, next) => {
    if (req.session.user) {
        const user = req.session.user;
        const name = user.name;
        res.send(`${name} 欢迎您`);
    } else
        res.send('你还没有登录，先登录下再试试！');
})
app.listen(8899, () => console.log('Example app listening on port 8899!'))
