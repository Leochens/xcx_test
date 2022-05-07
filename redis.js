const redis = require('redis')

let option = {};
if (process.env.NODE_ENV == 'production') {
  option = {
    password: '123456'
  }
}
console.log(option)
const client = redis.createClient(option); //这里填写redis的密码



const x = {
  name: 'RyanHardy',
  age: 21,
  phone: '18332518328'
}



module.exports = client;