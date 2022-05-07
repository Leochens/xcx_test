const redis = require('redis')
const client = redis.createClient({ });//这里填写redis的密码



const x = {
  name: 'RyanHardy',
  age: 21,
  phone: '18332518328'
}



module.exports = client;
