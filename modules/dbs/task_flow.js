const Sequelize = require('sequelize');
const { Model } = Sequelize;
const sequelize = require('../../db');
class TaskFlow extends Model { };
// 任务流表
TaskFlow.init({
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  tf_name: {
    type: Sequelize.STRING,
    comment: '任务流名称',
    defaultValue: '未命名任务流',
  },
  tf_describe: {
    type: Sequelize.TEXT,
    comment: '任务流简介',
    defaultValue: '该任务流无简介',
  },
  is_completed: {
    type: Sequelize.TINYINT,
    defaultValue: 0,
    comment: '0 进行中 1 已完成 2 已逾期'
  },
  begin_time: {
    type: Sequelize.DATE,
    allowNull: false,
    comment: '任务流开始时间'
  },
  end_time: {
    type: Sequelize.DATE,
    allowNull: false,
    comment: '任务流结束时间'
  },
  leader_id: {
    type: Sequelize.STRING,
    allowNull: false,
    comment: '主管是谁 user_id'
  },
  invite: {
    type: Sequelize.TINYINT,
    defaultValue: 0,
    comment: '成员是否有邀请权限 1 是 0 否'
  },

}, {
  sequelize,
  modelName: 'TaskFlow'
})

// 附带createdAt

module.exports = TaskFlow;