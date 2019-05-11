const genId = require('../utils/genId');
const dbQuery = require('../utils/dbQuery');
const Task = require('./task');
const taskFlow = {};

/**
 * 通过u_id 获得tf
 * 返回一个列表
 */
taskFlow.getTaskFlowsByUserId = function (u_id) {
    const sql = `
        SELECT 
            category,
            id,
            tf_name,
            tf_describe,
            is_completed,
            begin_time,
            end_time,
            leader_id,
            remark
        from user_taskflow JOIN task_flow ON task_flow.id = user_taskflow.tf_id 
        WHERE user_taskflow.u_id = '${u_id}' 
        order by begin_time DESC;
    `;
    return new Promise((resolve, reject) => {
        dbQuery(sql).then(tfs => {
            resolve(tfs);
        }).catch(err => reject(err))
    })
}

/**
 * 通过tf_id获得tf
 * 返回一条tf
 */

taskFlow.getTaskFlowByTFId = function (tf_id) {
    const sql = `select * from task_flow where id = '${tf_id}'`;
    return new Promise((resolve, reject) => {
        dbQuery(sql).then(tf => {
            // 从获得的tf中拿出id获取tf_id对应的task
            const tf_id = tf.id;
            Task.getTasksByTfId(tf_id).then(tasks => {
                tf.tasks = tasks;
                console.log("in getTaskFlowByTFId tf = ", tf);
                resolve(tf);
            }).catch(err => reject(err));
            // resolve(res)
        }).catch(err => reject(err));
    })
}

/**
 * 更新tf的信息 只能leader来操作  全量更新
 * 要检测uid的role字段
 */
taskFlow.updateTaskFlow = function (tf_id, tf) {

    const sql = `update task_flow set
        tf_name = '${tf.tf_name}',
        tf_describe = '${tf.tf_describe}',
        is_completed = ${tf.is_completed || 0},
        begin_time = '${tf.begin_time}',
        end_time = '${tf.end_time}',
        leader_id = '${tf.leader_id}'
        where id = '${tf_id}';
        replace into user_taskflow values(
            '${tf.leader_id}',
            '${tf_id}',
            1,
            '${tf.category || '默认分类'}'
        )`;
    return new Promise((resolve, reject) => {
        dbQuery(sql).then(res => resolve(res)).catch(err => reject(err));
    })
}

/**
 * 更新任务流分类
 */
taskFlow.updateTaskFlowCategory = function (u_id, tf_id, category) {
    const sql = `update user_taskflow set category = '${category || '默认分类'}'
    where u_id = '${u_id}' and tf_id = '${tf_id}'`;
    return new Promise((resolve, reject) => {
        dbQuery(sql).then(res => resolve(res)).catch(err => reject(err));
    })
}

/**
 * 更新tf的信息 只能leader来操作  字段更新
 * 要检测uid的role字段
 */
taskFlow.updateTaskFlowField = function (tf_id, field, value) {
    const sql = `update task_flow set ${field} = '${value}'`;
    return new Promise(function (resolve, reject) {
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
        dbQuery(sql).then(res => resolve(res)).catch(err => reject(err));
    })
}

/**
 * 插入到指定用户的一条tf 并返回它的tf_id
 */
// const t = {
//     "id": "12222",
//     "tf_name": "啦啦测试流",
//     "tf_describe": "人家就是做测试的嘛",
//     "is_completed": false,
//     "begin_time": "2019-01-01 00:00:01",
//     "end_time": "2019-12-01 00:00:01",
//     "leader_id": "9e7282ab5735accd25cbd99c53264885"
// }
taskFlow.addTaskFlow = function (u_id, tf) {
    const tf_id = genId.genUniqueId();
    console.log("在addTaskFlow tf=>", tf)
    const sql = `replace into task_flow values(
        '${tf_id}',
        '${tf.tf_name}',
        '${tf.tf_describe}',
        ${tf.is_completed || false},
        '${tf.begin_time}',
        '${tf.end_time}',
        '${tf.leader_id}');
        replace into user_taskflow values(
            '${u_id}',
            '${tf_id}',
            1,
            '${tf.category || '默认分类'}'
        )`;
    return new Promise((resolve, reject) =>
        dbQuery(sql).then(res => resolve(tf_id)).catch(err => reject(err)))
}

/**
 * 将u_id加入到tf_id对应的tf中
 * 在user_taskflow表中操作
 * 返回tf_id
 */
taskFlow.addMember = function (tf_id, u_id) {
    const sql = `insert into user_taskflow values('${u_id}','${tf_id}',0,'默认分类')`;
    return new Promise((resolve, reject) =>
        dbQuery(sql).then(res => resolve(tf_id)).catch(err => reject(err)))
}



taskFlow.search = function (u_id, keyword) {
    const sql = `SELECT * from task_flow LEFT JOIN user_taskflow on task_flow.id = user_taskflow.tf_id WHERE user_taskflow.u_id = '${u_id}' and (task_flow.tf_name LIKE '%${keyword}%' OR task_flow.tf_describe LIKE '%${keyword}%');`
    return new Promise((resolve, reject) =>
        dbQuery(sql).then(res => resolve(res)).catch(err => reject(err)))
}



module.exports = taskFlow;

