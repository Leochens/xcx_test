const Sequelize = require('sequelize');
const { Model } = Sequelize;
const sequelize = require('../../db');
class Image extends Model { };
// 图片表
Image.init({
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
  },

  url: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  u_id: {
    type: Sequelize.STRING,
    comment: '发表图片者',
    allowNull: false
  },
  t_id: {
    type: Sequelize.STRING,
    comment: '属于哪个子任务',
    allowNull: false

  }
}, {
  sequelize,
  modelName: 'Image'
})

// 附带createdAt

module.exports = Image;