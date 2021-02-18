const Sequelize = require('sequelize');
const { Model } = Sequelize;
const sequelize = require('../../db');
class Task extends Model { };
// 子任务表
Task.init({
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  t_name: {
    type: Sequelize.STRING,
    comment: '子任务名称',
    defaultValue: '未命名子任务',
  },
  t_describe: {
    type: Sequelize.TEXT,
    comment: '子任务简介',
    defaultValue: '该子任务无简介',
  },
  begin_time: {
    type: Sequelize.DATE,
    allowNull: false,
    comment: '子任务开始时间'
  },
  end_time: {
    type: Sequelize.DATE,
    allowNull: false,
    comment: '子任务结束时间'
  },
  is_completed: {
    type: Sequelize.TINYINT,
    defaultValue: 0,
    comment: '0 进行中 1 已完成 2 已逾期'
  },
  tf_id: {
    type: Sequelize.STRING,
    comment: '所属任务流id',
  },
  is_important: {
    type: Sequelize.TEXT,
    defaultValue: 0,
    comment: '此子任务在任务流中是否是重要的 1重要 0不重要	'
  },
  has_alert: {
    type: Sequelize.TINYINT,
    defaultValue: 0,
    comment: '是否发送过逾期提醒 1 是 0 否'
  },
}, {
  sequelize,
  modelName: 'Task'
})

// 附带createdAt

module.exports = Task;