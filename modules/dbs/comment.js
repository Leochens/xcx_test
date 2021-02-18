const Sequelize = require('sequelize');
const { Model } = Sequelize;
const sequelize = require('../../db');
class Comment extends Model { };
// 评论表
Comment.init({
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  comment_type: {
    type: Sequelize.TINYINT,
    defaultValue: 0,
  },
  content: {
    type: Sequelize.TEXT,
    defaultValue: ''
  },
  u_id: {
    type: Sequelize.STRING,
    comment: '评论者'
  },
  t_id: {
    type: Sequelize.STRING,
    comment: '属于哪个子任务'
  }
}, {
  sequelize,
  modelName: 'Comment'
})

// 附带createdAt

module.exports = Comment;