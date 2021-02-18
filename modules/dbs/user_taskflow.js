const Sequelize = require('sequelize');
const { Model } = Sequelize;
const sequelize = require('../../db');
class UserTaskFlow extends Model { };
// 用户-子任务表
UserTaskFlow.init({
  u_id: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  tf_id: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  role: {
    type: Sequelize.TINYINT,
    defaultValue: 0,
    comment: '用户对于此任务流的角色 1 管理员 0member'
  },
  category: {
    type: Sequelize.STRING,
    comment: '任务流所属分类'
  },
}, {
  sequelize,
  modelName: 'UserTaskFlow'
})

// 附带createdAt

module.exports = UserTaskFlow;