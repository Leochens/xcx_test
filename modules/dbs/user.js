const Sequelize = require('sequelize');
const { Model } = Sequelize;
const sequelize = require('../../db');
class User extends Model { };
// 用户表
User.init({
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  openid: {
    type: Sequelize.STRING,
    comment: '用户的微信端id',
    allowNull: false,
  },
  nick_name: {
    type: Sequelize.STRING,
    comment: '昵称',
    defaultValue: '无昵称请修改',
  },
  phone_number: {
    type: Sequelize.STRING,
  },
  city: {
    type: Sequelize.STRING,
  },
  province: {
    type: Sequelize.STRING,
  },
  country: {
    type: Sequelize.STRING,
  },
  avatar_url: {
    type: Sequelize.TEXT,
  },
  gender: {
    type: Sequelize.TINYINT,
  },

}, {
  sequelize,
  modelName: 'User'
})

// 附带createdAt

module.exports = User;