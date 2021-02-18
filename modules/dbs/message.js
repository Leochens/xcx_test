const Sequelize = require('sequelize');
const { Model } = Sequelize;
const sequelize = require('../../db');
class Message extends Model { };
// 消息表
Message.init({
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
  },

  content: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  is_read: {
    type: Sequelize.TINYINT,
    defaultValue: 0,
    comment: '是否已读 1 是 0 否'
  },
  to_user_id: {
    type: Sequelize.TINYINT,
    allowNull: false,
    comment: '发送给谁'
  },
  tf_id: {
    type: Sequelize.STRING,
    comment: '任务流id',
  },
  t_id: {
    type: Sequelize.STRING,
    comment: '子任务id',
  },


}, {
  sequelize,
  modelName: 'Message'
})

// 附带createdAt

module.exports = Message;