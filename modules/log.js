const genId = require('../utils/genId');
const dbQuery = require('../utils/dbQuery');
const log = {};
const formatTime = require('../utils/formatTime');

/**
 * 写入任务流日志
 * 创建任务流
 * 修改任务流
 * 新成员加入
 * 移除成员
 * 成员退出
 * 
 * 返回一个id
 */
log.logTaskFlow = function (tf_id, content, important) {
    const id = genId.genUniqueId();
    const sql = `replace into log(id,content,type,tf_id,t_id,important,create_time) values(
        '${id}',
        '${content}',
        1,
        '${tf_id}',
        ${null},
        ${important || 0},
        '${formatTime(new Date())}'
    )`;
    return new Promise((resolve, reject) => {
        dbQuery(sql).then(r => resolve(id)).catch(err => reject(err));
    })
}


log.logTask = function (t_id, content, important) {
    const id = genId.genUniqueId();
    const sql = `replace into log(id,content,type,tf_id,t_id,important,create_time) values(
        '${id}',
        '${content}',
        2,
        ${null},
        '${t_id}',
        ${important || 0},
        '${formatTime(new Date())}'
    )`;
    return new Promise((resolve, reject) => {
        dbQuery(sql).then(r => resolve(id)).catch(err => reject(err));
    })
}

log.getTaskLogs = function (t_id) {
    const sql = `select * from log where type = 1 and t_id = '${t_id}'`;
    return new Promise((resolve, reject) => {
        dbQuery(sql).then(list => resolve(list)).catch(err => reject(err));
    })
}

log.getTaskFlowLogs = function (tf_id) {
    const sql = `select * from log where type = 2 and tf_id = '${tf_id}'`;
    return new Promise((resolve, reject) => {
        dbQuery(sql).then(list => resolve(list)).catch(err => reject(err));
    })
}

module.exports = log;