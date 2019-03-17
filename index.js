const express = require('express')
const app = express()
const request = require('request');
const appID = "wxf18a4b27a92c63bf";
const appSecret = "bb302760e45bf6b7072b4eee0c1b0c8d"

app.get('/', (req, res) => {console.log(req);res.send('Hello World!')});
app.get('/api', (req, res) => {
    const code = req.param('code');
    console.log(code);
    var method = req.method.toUpperCase();
    var proxy_url = 'https://api.weixin.qq.com/sns/jscode2session?appid='+appID+'&secret='+appSecret+'&js_code='+code+'&grant_type=authorization_code';

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
app.get('/token',function(req,res){
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

app.listen(8899, () => console.log('Example app listening on port 8899!'))