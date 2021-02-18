const Sequelize = require('sequelize');
const { Model } = Sequelize;
const sequelize = require('../../db');
class UserTask extends Model { };
// 用户-子任务表
UserTask.init({
  u_id: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  t_id: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  user_status: {
    type: Sequelize.TINYINT,
    defaultValue: 1,
    comment: '用户状态 2完成 1进行中 0请假'
  },
  break_reason: {
    type: Sequelize.STRING,
    comment: '请假原因'
  },
  refuse_reason: {
    type: Sequelize.STRING,
    comment: '驳回请假请求的原因'
  },
}, {
  sequelize,
  modelName: 'UserTask'
})

// 附带createdAt

module.exports = UserTask;