const genId = require('../utils/genId');
const dbQuery = require('../utils/dbQuery');
const Task = require('./task');
const taskFlow = {};

const TaskFlow = require('./dbs/task_flow');
const _Task = require('./dbs/task');
const UserTaskFlow = require('./dbs/user_taskflow');
const UserTask = require('./dbs/user_task');
const Seq = require("sequelize");

// 检测该用户是不是属于该任务流
taskFlow.checkUser = function (tf_id, u_id) {
  return UserTaskFlow.findOne({
    where: {
      tf_id,
      u_id
    }
  })
  // const sql = `select * from user_taskflow where tf_id='${tf_id}' and u_id='${u_id}'`;
  // return new Promise((resolve, reject) => {
  //   dbQuery(sql).then(res => resolve(res)).catch(err => reject(err));
  // })
}

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
            invite
        from UserTaskFlows JOIN TaskFlows ON TaskFlows.id = UserTaskFlows.tf_id 
        WHERE UserTaskFlows.u_id = '${u_id}' 
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
  return new Promise((resolve, reject) => {
    TaskFlow.findOne({
      where: {
        id: tf_id
      }
    }).then(tf => {
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


  // const sql = `select * from task_flow where id = '${tf_id}'`;
  // return new Promise((resolve, reject) => {
  //   dbQuery(sql).then(tf => {
  //     // 从获得的tf中拿出id获取tf_id对应的task
  //     const tf_id = tf.id;
  //     Task.getTasksByTfId(tf_id).then(tasks => {
  //       tf.tasks = tasks;
  //       console.log("in getTaskFlowByTFId tf = ", tf);
  //       resolve(tf);
  //     }).catch(err => reject(err));
  //     // resolve(res)
  //   }).catch(err => reject(err));
  // })
}
taskFlow.getTaskFlowByTFIdAndUId = function (tf_id, u_id) {

  const sql = `SELECT 
  TaskFlows.id,tf_name,tf_describe,is_completed,begin_time,end_time,leader_id,nick_name,role,category,invite,avatar_url 
  from TaskFlows 
  LEFT JOIN UserTaskFlows on TaskFlows.id = UserTaskFlows.tf_id LEFT JOIN Users on UserTaskFlows.u_id = Users.id where task_flow.id = '${tf_id}' and UserTaskFlows.u_id = '${u_id}'`;
  return new Promise((resolve, reject) => {
    dbQuery(sql).then(tf => {
      resolve(tf);
    }).catch(err => reject(err));
  })
}

/**
 * 更新tf的信息 只能leader来操作  全量更新
 * 要检测uid的role字段
 */
taskFlow.updateTaskFlow = function (tf_id, tf) {

  return new Promise((resolve, reject) => {
    TaskFlow.update({
      tf_name: tf.tf_name,
      tf_describe: tf.tf_describe,
      is_completed: tf.is_completed || 0,
      begin_time: tf.begin_time,
      end_time: tf.end_time,
      leader_id: tf.leader_id,
    }, {
      where: {
        id: tf_id
      }
    }).then(() => {
      UserTaskFlow.upsert({
        u_id: tf.leader_id,
        tf_id,
        role: 1,
        category: tf.category || '默认分类'
      }).then(res => resolve(res)).catch(err => reject(err))
    }).catch(err => reject(err));
  })
  // const sql = `update task_flow set
  //       tf_name = '${tf.tf_name}',
  //       tf_describe = '${tf.tf_describe}',
  //       is_completed = ${tf.is_completed || 0},
  //       begin_time = '${tf.begin_time}',
  //       end_time = '${tf.end_time}',
  //       leader_id = '${tf.leader_id}'
  //       where id = '${tf_id}';
  //       replace into user_taskflow(u_id,tf_id,role,category) values(
  //           '${tf.leader_id}',
  //           '${tf_id}',
  //           1,
  //           '${tf.category || '默认分类'}'
  //       )`;
  // return new Promise((resolve, reject) => {
  //   dbQuery(sql).then(res => resolve(res)).catch(err => reject(err));
  // })
}

/**
 * 更新任务流分类
 */
taskFlow.updateTaskFlowCategory = function (u_id, tf_id, category) {
  return UserTaskFlow.update({
    category
  }).where({
    u_id, tf_id
  })
  // const sql = `update user_taskflow set category = '${category || '默认分类'}'
  //   where u_id = '${u_id}' and tf_id = '${tf_id}'`;
  // return new Promise((resolve, reject) => {
  //   dbQuery(sql).then(res => resolve(res)).catch(err => reject(err));
  // })
}

/**
 * 更新tf的信息 只能leader来操作  字段更新
 * 要检测uid的role字段
 */
taskFlow.updateTaskFlowField = function (tf_id, field, value) {
  return TaskFlow.update({
    [field]: value
  }).where({
    tf_id
  })
  // const sql = `update task_flow set ${field} = '${value}' where id='${tf_id}'`;
  // return new Promise(function (resolve, reject) {
  //   dbQuery(sql).then(res => resolve(res)).catch(err => reject(err));
  // })
};
/**
 * 转让负责人
 */
taskFlow.transferLeader = function (tf_id, old_leader_id, new_leader_id) {

  return new Promise(function (resolve, reject) {
    taskFlow.updateTaskFlowField(tf_id, 'leader_id', new_leader_id).then(r => {
      UserTaskFlow.update({ role: 0 }, { where: { u_id: old_leader_id, tf_id } })
        .then(() => {
          UserTaskFlow.update({ role: 1 }, { where: { u_id: new_leader_id, tf_id } })
            .then(res => resolve(res)).catch(err => reject(err));
        }).catch(err => reject(err));
    }).catch(err => reject(err));
  })
  // const sql = `update user_taskflow set role = 0 where u_id = '${old_leader_id}' and tf_id = '${tf_id}';
  //       update user_taskflow set role = 1 where u_id = '${new_leader_id}' and tf_id = '${tf_id}'`
  // return new Promise(function (resolve, reject) {
  //   taskFlow.updateTaskFlowField(tf_id, 'leader_id', new_leader_id).then(r => {
  //     dbQuery(sql).then(res => resolve(res)).catch(err => reject(err));
  //   }).catch(err => reject(err));
  // })
}

/**
 * 根据u_id删除一个tf
 * 只是从user_taskflow映射表中删除了 真实的task_flow表中还存在的
 * 删除tf后默认该成员从tf中退出了
 */
taskFlow.deleteTaskFlow = function (u_id, tf_id) {
  return UserTaskFlow.destroy({
    where: {
      tf_id, u_id
    }
  })
  // const sql = `delete from user_taskflow where tf_id = '${tf_id}' and u_id = '${u_id}'`;
  // return new Promise(function (resolve, reject) {
  //   dbQuery(sql).then(res => resolve(res)).catch(err => reject(err));
  // })
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

  return new Promise((resolve, reject) =>
    TaskFlow.upsert({
      id: tf_id,
      tf_name: tf.tf_name,
      tf_describe: tf.tf_describe,
      is_completed: tf.is_completed || 0,
      begin_time: tf.begin_time,
      end_time: tf.end_time,
      leader_id: tf.leader_id,
      invite: 1,
    }).then(res => {
      UserTaskFlow.upsert({
        u_id,
        tf_id,
        role: 1,
        category: tf.category || '默认分类'
      }).then(res => resolve(tf_id)).catch(err => reject(err))
    }).catch(err => reject(err)))

  // const sql = `replace into task_flow values(
  //       '${tf_id}',
  //       '${tf.tf_name}',
  //       '${tf.tf_describe}',
  //       ${tf.is_completed || false},
  //       '${tf.begin_time}',
  //       '${tf.end_time}',
  //       '${tf.leader_id}',
  //       1);
  //       replace into user_taskflow values(
  //           '${u_id}',
  //           '${tf_id}',
  //           1,
  //           '${tf.category || '默认分类'}'
  //       )`;
  // return new Promise((resolve, reject) =>
  //   dbQuery(sql).then(res => resolve(tf_id)).catch(err => reject(err)))
}

/**
 * 将u_id加入到tf_id对应的tf中
 * 在user_taskflow表中操作
 * 返回tf_id
 */
taskFlow.addMember = function (tf_id, u_id) {
  return UserTaskFlow.upsert({
    u_id,
    tf_id,
    role: 0,
    category: '默认分类'
  })
  // const sql = `insert into user_taskflow values('${u_id}','${tf_id}',0,'默认',${true})`;
  // return new Promise((resolve, reject) =>
  //   dbQuery(sql).then(res => resolve(tf_id)).catch(err => reject(err)))
}



taskFlow.search = function (u_id, keyword) {

  const sql = `SELECT * from TaskFlows LEFT JOIN UserTaskFlows on TaskFlows.id = UserTaskFlows.tf_id WHERE UserTaskFlows.u_id = '${u_id}' and (TaskFlows.tf_name LIKE '%${keyword}%' OR TaskFlows.tf_describe LIKE '%${keyword}%');`
  return new Promise((resolve, reject) =>
    dbQuery(sql).then(res => resolve(res)).catch(err => reject(err)))
}


taskFlow.toggleInviteStatus = function (tf_id, status) {
  return UserTaskFlow.update({
    invite: status
  }, { where: { tf_id } })
  // const sql = `update user_taskflow set invite=${status} where tf_id='${tf_id}'`;
  // return new Promise((resolve, reject) =>
  //   dbQuery(sql).then(res => resolve(res)).catch(err => reject(err)))
}


taskFlow.breakTaskFlow = function (tf_id) {
  // 删除user_taskflow中的信息
  // 删除user_task的信息
  // 删除图片
  // 删除评论
  // 删除子任务
  // 删除任务流



  // const sql = `CALL break_task_flow('${tf_id}')`;
  return new Promise(async (resolve, reject) => {
    try {
      // 删除用户和任务流的关联
      await UserTaskFlow.destroy({ where: { tf_id } });
      // 删除用户和子任务的关联
      let taskIds = await _Task.findAll({ attributes: ['id'], where: { tf_id } });
      taskIds = taskIds.map(item => item.dataValues.id);
      await UserTask.destroy({ where: { t_id: { [Seq.Op.in]: taskIds } } })
      // 删除子任务
      await _Task.destroy({ where: { tf_id } });
      return resolve(true);
    } catch (err) {
      return reject(err)
    }
  })
  // dbQuery(sql).then(res => resolve(res)).catch(err => reject(err))
}


taskFlow.getAllMemberTaskStatus = function (u_id, t_ids) {
  if (!Array.isArray(t_ids) || !t_ids.length) return [];
  const arr = t_ids.map(id => `'${id}'`);
  const _str = arr.join(',');
  console.log(_str);

  const sql = `select * from UserTasks left join Users on Users.id = UserTasks.u_id where u_id='${u_id}' and t_id in (${_str})`;
  return new Promise((resolve, reject) =>
    dbQuery(sql).then(res => resolve(res)).catch(err => reject(err)))
}
module.exports = taskFlow;

