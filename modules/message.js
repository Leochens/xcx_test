const genId = require('../utils/genId');
const dbQuery = require('../utils/dbQuery');
const message = {};



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
        '${msg.content}',
        '${msg.create_time}',
        0
        '${msg.to_user_id}')`;
    return new Promise((resolve, reject) => {
        dbQuery(sql).then(res => resolve(c_id)).catch(err => reject(err));
    })
}



module.exports = message;