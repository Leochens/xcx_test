const genId = require('../utils/genId');
const dbQuery = require('../utils/dbQuery');
const message = {};
const formatTime = require('../utils/formatTime');
const Message = require('./dbs/message');
const Seq = require('sequelize');

/**
 * message
 * id	content	create_time	is_read	to_user_id
 */
/**
 * 添加一个message 就是给用户发送一条message
 */
message.addMessage = function (msg) {
  const id = genId.genUniqueId();
  return Message.upsert({
    id,
    content: msg.content,
    is_read: 0,
    to_user_id: msg.to_user_id,
    tf_id: msg.tf_id,
    t_id: msg.t_id
  })

  // msg.tf_id = msg.tf_id || null;
  // msg.t_id = msg.t_id || null;
  // console.log(msg);
  // const sql = `replace into message values(
  //       '${m_id}',
  //       '${msg.content || ''}',
  //       '${msg.create_time || formatTime(new Date())}',
  //       0,
  //       '${msg.to_user_id}',
  //       ${msg.tf_id ? "'" + msg.tf_id + "'" : null},
  //       ${msg.t_id ? "'" + msg.t_id + "'" : null}
  //       )`;
  // return new Promise((resolve, reject) => {
  //   dbQuery(sql).then(res => resolve(m_id)).catch(err => reject(err));
  // })
}

message.addMessageToUsers = function (msg, u_ids) {

  const values = u_ids.map(u_id => {
    return {
      id: genId.genUniqueId(),
      content: msg.content,
      is_read: 0,
      to_user_id: u_id,
      tf_id: msg.tf_id,
      t_id: msg.t_id
    }
  });
  return Message.bulkCreate(values);

  // const values = u_ids.map(u_id => [
  //   `${genId.genUniqueId()}`,
  //   `${msg.content}`,
  //   `${msg.create_time || formatTime(new Date())}`,
  //   0,
  //   u_id,
  //   msg.tf_id ? `${msg.tf_id}` : null,
  //   msg.t_id ? `${msg.t_id}` : null
  // ]) || [];

  // const sql = `replace into message values ?`;
  // return new Promise((resolve, reject) => {
  //   dbQuery(sql, values).then(res => resolve(res)).catch(err => reject(err));
  // })
}


/**
 * 拉取用户未读的消息 拉取后就将该消息置为已读 然后等待一个月后清空
 */
message.getUnreadMessageByUserId = function (u_id) {
  // 还需要字段提纯 把不需要的剔除
  const sql = `
    select Messages.id, content,Messages.createdAt,is_read,to_user_id,t_id,TaskFlows.id as tf_id,tf_name,t_name,TaskFlows.end_time as tf_end_time,Tasks.end_time as t_end_time from Messages LEFT JOIN TaskFlows ON Messages.tf_id = TaskFlows.id LEFT JOIN Tasks ON Messages.t_id = Tasks.id 
    where to_user_id = '${u_id}' and is_read = 0 `;

  return new Promise((resolve, reject) => {
    dbQuery(sql).then(res => resolve(res)).catch(err => reject(err));
  })
}
/**
 * 将多条消息置为已读
 */
message.setMessageRead = function (m_ids) {

  return Message.update({
    is_read: 1
  }, {
    where: {
      id: {
        [Seq.Op.in]: m_ids
      }
    }
  })

  // let m_ids_str = '';
  // m_ids.forEach((m_id, index) => {
  //   m_ids_str += `'${m_id}'`;
  //   if (index != m_ids.length) m_ids_str += ',';
  // });
  // const sql = `update message set is_read = 1 where id in (${m_ids_str})`;
  // return new Promise((resolve, reject) => {
  //   dbQuery(sql).then(res => resolve(res)).catch(err => reject(err));
  // })

}
/**
 * 将某个用户消息全部置为已读
 */
message.setMessageReadByUid = function (u_id) {
  return Message.update({
    is_read: 1
  }, {
    where: {
      to_user_id: u_id
    }
  })

  // const sql = `update message set is_read = 1 where to_user_id = '${u_id}'`;

  // return new Promise((resolve, reject) => {
  //   dbQuery(sql).then(res => resolve(res)).catch(err => reject(err));
  // })

}


module.exports = message;