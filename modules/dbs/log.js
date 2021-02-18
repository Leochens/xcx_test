const Sequelize = require('sequelize');
const { Model } = Sequelize;
const sequelize = require('../../db');
class Log extends Model { };
// 日志表
Log.init({
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
  },

  content: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  type: {
    type: Sequelize.TINYINT,
    allowNull: false,
    comment: '1 任务流 2 子任务'
  },
  tf_id: {
    type: Sequelize.STRING,
    comment: '任务流id',
  },
  t_id: {
    type: Sequelize.STRING,
    comment: '子任务id',
  },
  important: {
    type: Sequelize.TINYINT,
    defaultValue: 0,
    comment: '是否突出显示 1 是 0 否'
  },

}, {
  sequelize,
  modelName: 'Log'
})

// 附带createdAt

module.exports = Log;