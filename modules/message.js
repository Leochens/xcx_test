const genId = require('../utils/genId');
const dbQuery = require('../utils/dbQuery');
const message = {};
const formatTime = require('../utils/formatTime');



/**
 * message
 * id	content	create_time	is_read	to_user_id
 */
/**
 * 添加一个message 就是给用户发送一条message
 */
message.addMessage = function (msg) {
    const m_id = genId.genUniqueId();
    msg.tf_id = msg.tf_id || null;
    msg.t_id = msg.t_id || null;
    console.log(msg);
    const sql = `replace into message values(
        '${m_id}',
        '${msg.content || ''}',
        '${msg.create_time || formatTime(new Date())}',
        0,
        '${msg.to_user_id}',
        '${msg.tf_id}',
        ${msg.t_id ? "'" + msg.t_id + "'" : null}
        )`;
    return new Promise((resolve, reject) => {
        dbQuery(sql).then(res => resolve(m_id)).catch(err => reject(err));
    })
}
message.addMessageToUsers = function (msg, u_ids) {
    const values = u_ids.map(u_id => [
        `${genId.genUniqueId()}`,
        `${msg.content}`,
        `${msg.create_time || formatTime(new Date())}`,
        0,
        u_id,
        msg.tf_id ? `${msg.tf_id}` : null,
        msg.t_id ? `${msg.t_id}` : null
    ]);
    const sql = `replace into message values ?`;
    return new Promise((resolve, reject) => {
        dbQuery(sql, values).then(res => resolve(res)).catch(err => reject(err));
    })
}


/**
 * 拉取用户未读的消息 拉取后就将该消息置为已读 然后等待一个月后清空
 */
message.getUnreadMessageByUserId = function (u_id) {
    // 还需要字段提纯 把不需要的剔除
    const sql = `
    select message.id, content,create_time,is_read,to_user_id,t_id,task_flow.id as tf_id,tf_name,t_name,task_flow.end_time as tf_end_time,task.end_time as t_end_time from message LEFT JOIN task_flow ON message.tf_id = task_flow.id LEFT JOIN task ON message.t_id = task.id 
    where to_user_id = '${u_id}' and is_read = 0 `;

    return new Promise((resolve, reject) => {
        dbQuery(sql).then(res => resolve(res)).catch(err => reject(err));
    })
}
/**
 * 将多条消息置为已读
 */
message.setMessageRead = function (m_ids) {
    let m_ids_str = '';
    m_ids.forEach((m_id, index) => {
        m_ids_str += `'${m_id}'`;
        if (index != m_ids.length) m_ids_str += ',';
    });
    const sql = `update message set is_read = 1 where id in (${m_ids_str})`;
    return new Promise((resolve, reject) => {
        dbQuery(sql).then(res => resolve(res)).catch(err => reject(err));
    })

}
/**
 * 将某个用户消息全部置为已读
 */
message.setMessageReadByUid = function (u_id) {
    const sql = `update message set is_read = 1 where to_user_id = '${u_id}'`;

    return new Promise((resolve, reject) => {
        dbQuery(sql).then(res => resolve(res)).catch(err => reject(err));
    })

}


module.exports = message;