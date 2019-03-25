session = require('express-session'),
    redis = require('redis'),
    client = redis.createClient({ password: "123456" }),//这里填写redis的密码
    RedisStore = require('connect-redis')(session);
const express = require('express')
const app = express()

client.on("error", function (err) {
    console.log("Error " + err);//用于提示错误信息
});
client.on("ready", function (res) {
    console.log("ready " + res);//用于提示错误信息
});
let options = {
    client: client,
    port: 6379,//端口号
    host: "127.0.0.1"//主机
};

app.use(session({
    store: new RedisStore(options),
    secret: "lhy2018"//以此字符串加密
}));
