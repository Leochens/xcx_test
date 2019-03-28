const conn = require('./db');
const genId = require('../utils/genId');
const dbQuery = require('../utils/dbQuery');
const taskFlow = {};



taskFlow.getTaskFlowsByUserId = function (u_id) {
    const sql = `SELECT * from task_flow where id IN (
        SELECT tf_id FROM user_taskflow WHERE u_id = '${u_id}')`;
    return new Promise(function (resolve, reject) {
        dbQuery(sql).then(function (res) {
            resolve(res);
        }).catch(function (err) {
            reject(err);
        });
    })
}
taskFlow.getTaskFlowByTFId = function (tf_id) {
    const sql = `select * from task_flow where id = '${tf_id}'`;
    return new Promise(function (resolve, reject) {
        dbQuery(sql).then(function (res) {
            resolve(res);
        }).catch(function (err) {
            reject(err);
        });
    })
}

taskFlow.updateTaskFlow = function (tf_id, tf) {

}
taskFlow.deleteTaskFlow = function (tf_id) {
    const sql = `delete from task_flow where id = '${tf_id}'`;
    return new Promise(function (resolve, reject) {
        dbQuery(sql).then(function (res) {
            resolve(res);
        }).catch(function (err) {
            reject(err);
        });
    })
}
/**
 * tf_id
 * tf_name
 * tf_describe
 * is_completed
 * category
 * begin_time
 * end_time
 * 插入到指定用户的一条tf 并返回它的tf_id
 */

const t = {
    "id": "12222",
    "tf_name": "啦啦测试流",
    "tf_describe":"人家就是做测试的嘛",
    "is_completed": false,
    "category": "测试",
    "begin_time": "2019-01-01 00:00:01",
    "end_time": "2019-12-01 00:00:01"
}
taskFlow.addTaskFlow = function (u_id, tf) {
    const tf_id = genId.genUniqueId();
    const sql = `insert into task_flow values(
        '${tf_id}',
        '${tf.tf_name}',
        '${tf.tf_describe}',
        ${tf.is_completed},
        '${tf.category}',
        '${tf.begin_time}',
        '${tf.end_time}');
        insert into user_taskflow values(
            '${u_id}',
            '${tf_id}',0,0
        )`;
    return new Promise(function (resolve, reject) {
        dbQuery(sql).then(function (res) {
            resolve(tf_id);
        }).catch(function (err) {
            reject(err);
        });
    })
}


module.exports = taskFlow;

