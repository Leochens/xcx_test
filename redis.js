const redis = require('redis')
const client = redis.createClient({ password: "123456" });//这里填写redis的密码

module.exports = client;