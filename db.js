const Sequelize = require('sequelize');
const { DB } = require('./config/config');
const sequelize = new Sequelize(DB.database, DB.user, DB.password, {
  host: DB.host,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 30000
  },
  timezone: '+08:00', // 时区矫正
  logging: false
})

sequelize.authenticate().then(() => {
  console.log('成功与数据库建立连接');
})
  .catch(err => {
    console.error('未能连接到数据库', err);
  });
module.exports = sequelize;