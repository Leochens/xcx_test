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

}

/**
 * 向tf中增加子任务
 * 返回子任务的id
 */
task.addTask = function (tf_id, task) {

}
/**
 * 向子任务中添加任务人
 * u_ids    array
 */
task.addTaskMember = function (t_id, u_ids) {

}



module.exports = task;
