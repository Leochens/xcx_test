const genId = require('../utils/genId');
const dbQuery = require('../utils/dbQuery');

const task = {};

/**
 * 获得tf_id指向的tf中的所有task
 * 返回一个task列表
 */
task.getTasksByTfId = function (tf_id) {
    const sql = `select * from task where tf_id = '${tf_id}'`;
    return new Promise((resolve, reject) => {
        dbQuery(sql).then(res => resolve(res)).catch(err => reject(err));
    })
}


/**
 * 获得t_id所代表的子任务的信息
 * 返回一个子任务的所有信息
 */
task.getTaskById = function (t_id) {

    const sql = `select * from task where id = '${t_id}'`;
    return new Promise((resolve, reject) => {
        dbQuery(sql).then(res => resolve(res)).catch(err => reject(err));
    })
}

/**
 * 向tf中增加子任务
 * 返回子任务的id
 */
task.addTask = function (tf_id, task) {
    const member = task.member;
    if (member) {
        // 添加进user_task映射表
    }
    const t_id = genId.genUniqueId();
    const sql = `replace into task values (
        '${t_id}',
        '${task.t_name}',
        '${task.begin_time}',
        '${task.end_time}',
        ${task.is_completed},
        '${tf_id}',
        ${task.is_important})`;

    return new Promise((resolve, reject) => {
        dbQuery(sql).then(res => resolve(t_id)).catch(err => reject(err));
    })
}
/**
 * 向子任务中添加任务人
 * u_ids    array
 * u_id	t_id	user_status 用户状态 1正常 0请假	break_reason 请假原因	refuse_reason 驳回请假请求的原因
 */
task.addTaskMember = function (t_id, u_ids) {
    // 批量插入
    // if(!t_id||!u_ids||!Array.isArray(u_ids)) return 
    const values = u_ids.map(u_id => [`${u_id}`, `${t_id}`, 1, '', '']);
    const sql = `replace into user_task values ?`;
    return new Promise((resolve, reject) => {
        dbQuery(sql,values).then(res => resolve(res)).catch(err => reject(err));
    })
}

/**
 * 更改一个task的信息 需要role检测
 */
task.updateTask = function(t_id,task){
    const sql = `replace into task values (
        '${t_id}',
        '${task.t_name}',
        '${task.begin_time}',
        '${task.end_time}',
        ${task.is_completed},
        '${task.tf_id}',
        ${task.is_important})`;
    return new Promise((resolve, reject) => {
        dbQuery(sql).then(res => resolve(res)).catch(err => reject(err));
    })
}
/**
 * 删除一个task 需要role检测
 */
task.deleteTask = function(t_id){
    const sql = `delete from task where id = '${t_id}'`;
    return new Promise((resolve, reject) => {
        dbQuery(sql).then(res => resolve(res)).catch(err => reject(err));
    })
}


module.exports = task;
