const genId = require('../utils/genId');
const dbQuery = require('../utils/dbQuery');
const taskFlow = {};

taskFlow.getTaskFlowsByUserId = function (u_id) {
    const sql = `SELECT * from task_flow where id IN (
        SELECT tf_id FROM user_taskflow WHERE u_id = '${u_id}')`;
    return new Promise((resolve, reject) => {
        dbQuery(sql).then(res => resolve(res)).catch(err => reject(err))
    })
}
taskFlow.getTaskFlowByTFId = function (tf_id) {
    const sql = `select * from task_flow where id = '${tf_id}'`;
    return new Promise(resolve, reject => {
        dbQuery(sql).then(res => resolve(res)).catch(err => reject(err));
    })
}

/**
 * 更新tf的信息 只能leader来操作 
 * 要检测uid的role字段
 */
taskFlow.updateTaskFlow = function (tf_id, tf) {
    const sql = `update task_flow set
        tf_name = '${tf.tf_name}',
        tf_describe = '${tf.tf_describe}',
        is_completed = ${tf.is_completed},
        category = '${tf.category}',
        begin_time = '${tf.begin_time}',
        end_time = '${tf.end_time}'
        where id = '${tf_id}'`
    return new Promise((resolve, reject) => {
        dbQuery(sql).then(res => resolve(res)).catch(err => reject(err));
    })
}
/**
 * 根据u_id删除一个tf
 * 只是从user_taskflow映射表中删除了 真实的task_flow表中还存在的
 * 删除tf后默认该成员从tf中退出了
 */
taskFlow.deleteTaskFlow = function (u_id, tf_id) {
    const sql = `delete from user_taskflow where tf_id = '${tf_id}' and u_id = '${u_id}'`;
    return new Promise(function (resolve, reject) {
        dbQuery(sql).then(function (res) {
            resolve(res);
        }).catch(function (err) {
            reject(err);
        });
    })
}
/**
 * id
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
    "tf_describe": "人家就是做测试的嘛",
    "is_completed": false,
    "category": "测试",
    "begin_time": "2019-01-01 00:00:01",
    "end_time": "2019-12-01 00:00:01"
}
taskFlow.addTaskFlow = function (u_id, tf) {
    const tf_id = genId.genUniqueId();
    const sql = `replace into task_flow values(
        '${tf_id}',
        '${tf.tf_name}',
        '${tf.tf_describe}',
        ${tf.is_completed},
        '${tf.category}',
        '${tf.begin_time}',
        '${tf.end_time}');
        replace into user_taskflow values(
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

