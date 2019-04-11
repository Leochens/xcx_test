const genId = require('../utils/genId');
const dbQuery = require('../utils/dbQuery');
const message = {};
const formatTime = require('../utils/formatTime');



/**
 * message
 * id	content	create_time	is_read	to_user_id
 */
//TODO: 给用户下发消息是一个难点 因为不知道何时给用户发 用户每次拉取的时候还需要小心重复拉取。。。暂时先不做这一块
/**
 * 添加一个message 就是给用户发送一条message
 */
message.addMessage = function (msg) {
    const m_id = genId.genUniqueId();
    const sql = `replace into message values(
        '${m_id}',
        '${msg.content||''}',
        '${msg.create_time||formatTime(new Date())}',
        0,
        '${msg.to_user_id}')`;
    return new Promise((resolve, reject) => {
        dbQuery(sql).then(res => resolve(m_id)).catch(err => reject(err));
    })
}

message.addMessageToUsers = function (msg,u_ids) {

    const values = u_ids.map(u_id => [`${genId.genUniqueId()}`, `${msg.content}`, `${msg.create_time||formatTime(new Date())}`, 0, u_id]);
    const sql = `replace into message values ?`;
    return new Promise((resolve, reject) => {
        dbQuery(sql,values).then(res => resolve(res)).catch(err => reject(err));
    })
}


/**
 * 拉取用户未读的消息 拉取后就将该消息置为已读 然后等待一个月后清空
 */
message.getUnreadMessageByUserId = function (u_id) {
    const sql = `select * from message where to_user_id = '${u_id}' and is_read = 0`;
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
    const sql = `update messages set is_read = 1 where id in (${m_ids_str})`;
    return new Promise((resolve, reject) => {
        dbQuery(sql).then(res => resolve(res)).catch(err => reject(err));
    })

}


module.exports = message;