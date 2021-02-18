const genId = require('../utils/genId');
const dbQuery = require('../utils/dbQuery');
const formatTime = require('../utils/formatTime');
const Task = require('./dbs/task');
const UserTask = require('./dbs/user_task');
const Seq = require('sequelize');
const User = require('./user');

const task = {};

/**
 * 获得tf_id指向的tf中的所有task
 * 返回一个task列表
 */
task.getTasksByTfId = function (tf_id) {

  return Task.findAll({
    where: {
      tf_id
    }
  })
  // const sql = `select * from task where tf_id = '${tf_id}'`;
  // return new Promise((resolve, reject) => {
  //   dbQuery(sql).then(res => resolve(res)).catch(err => reject(err));
  // })
}


/**
 * 获得t_id所代表的子任务的信息
 * 返回一个子任务的所有信息
 */
task.getTaskById = function (t_id) {

  return Task.findOne({
    where: { id: t_id }
  })
  // const sql = `select * from task where id = '${t_id}'`;
  // return new Promise((resolve, reject) => {
  //   dbQuery(sql).then(res => resolve(res)).catch(err => reject(err));
  // })
}
/**
 * 获得t_id所代表的子任务的人员状态映射表map
 */
task.getStatusMapByTId = function (t_id) {
  return UserTask.findAll({
    where: { t_id }
  })
  // const sql = `select * from user_task where t_id = '${t_id}'`;
  // return new Promise((resolve, reject) => {
  //   dbQuery(sql).then(res => resolve(res)).catch(err => reject(err));
  // })
}
/**
 * 向tf中增加子任务
 * 返回子任务的id
 */
task.addTask = function (tf_id, task) {



  // const member = task.member;
  const t_id = genId.genUniqueId();

  return Task.upsert({
    id: t_id,
    t_name: task.t_name,
    t_describe: task.t_describe,
    begin_time: task.begin_time,
    end_time: task.end_time,
    is_completed: task.is_completed || 0,
    tf_id,
    is_important: task.is_important || 0
  })
  // const sql = `replace into 
  // task(id,t_name,t_describe,begin_time,end_time,is_completed,tf_id,is_important) values (
  //       '${t_id}',
  //       '${task.t_name || "无标题"}',
  //       '${task.t_describe || "无描述"}',
  //       '${task.begin_time}', 
  //       '${task.end_time}',
  //       ${task.is_completed || 0},
  //       '${tf_id}',
  //       ${task.is_important || 0})`;

  // return new Promise((resolve, reject) => {
  //   dbQuery(sql).then(res => resolve(t_id)).catch(err => reject(err));
  // })
}

/**
 * 向子任务中添加任务人
 * u_ids    array
 * u_id	t_id	user_status 用户状态 2审核 1正常 0请假	break_reason 请假原因	refuse_reason 驳回请假请求的原因
 */
task.addTaskMember = function (t_id, u_ids) {
  // 批量插入
  // if(!t_id||!u_ids||!Array.isArray(u_ids)) return 
  // [`${u_id}`, `${t_id}`, 1, '', '']) || [];
  const values = u_ids.map(u_id => {
    return {
      u_id,
      t_id,
      user_status: 1,
      break_reason: '',
      refuse_reason: ''
    }
  })
  return UserTask.bulkCreate(values)
  // const sql = `replace into user_task values ?`;
  // return new Promise((resolve, reject) => {
  //   dbQuery(sql, values).then(res => resolve(res)).catch(err => reject(err));
  // })
}

/**
 * 更改一个task的信息 需要role检测
 */
task.updateTask = function (t_id, task) {

  return Task.update({
    t_name: task.t_name,
    t_describe: task.t_describe,
    begin_time: task.begin_time,
    end_time: task.end_time,
    is_important: task.is_important
  }, {
    where: {
      id: t_id,
      tf_id: task.tf_id
    }
  })
  // const sql = `update task set 
  //       t_name = '${task.t_name}',
  //       t_describe = '${task.t_describe}',
  //       begin_time = '${task.begin_time}',
  //       end_time = '${task.end_time}',
  //       is_important = ${task.is_important}
  //       where id = '${t_id}' and tf_id = '${task.tf_id}'`;
  // return new Promise((resolve, reject) => {
  //   dbQuery(sql).then(res => resolve(res)).catch(err => reject(err));
  // })
}

task.updateTaskField = function (t_id, field, value) {
  return Task.update({
    [field]: value
  }, {
    where: {
      id: t_id
    }
  })
  // if (typeof value === 'boolean' || typeof value === 'number') isInt = true;
  // let isInt = false;
  // const sql = `update task set ${field}='${value}' where id = '${t_id}'`;
  // const sql_Int = `update task set ${field}=${value} where id = '${t_id}'`;
  // return new Promise((resolve, reject) => {
  //   dbQuery(isInt ? sql_Int : sql).then(res => resolve(res)).catch(err => reject(err));
  // })
}
task.updateTaskFieldByTids = function (t_ids, field, value) {

  return Task.update({
    [field]: value
  }, {
    where: {
      [Seq.Op.in]: t_ids
    }
  })
  // if (!Array.isArray(t_ids) || !t_ids.length) return console.error("t_ids不是数组或长度为0")
  // let isInt = false;

  // if (typeof value === 'boolean' || typeof value === 'number') isInt = true;
  // const _t_ids = t_ids.map(t_id => `'${t_id}'`);
  // const update_task_ids = _t_ids.join(',');


  // const sql = `update task set ${field}='${value}' where id in (${update_task_ids})`;
  // const sql_Int = `update task set ${field}=${value} where id in (${update_task_ids})`;
  // return new Promise((resolve, reject) => {
  //   dbQuery(isInt ? sql_Int : sql).then(res => resolve(res)).catch(err => reject(err));
  // })
}
/**
 * 删除一个task 需要role检测
 */
task.deleteTask = function (t_id) {
  return Task.destroy({
    where: {
      id: t_id
    }
  })
  // const sql = `delete from task where id = '${t_id}'`;
  // return new Promise((resolve, reject) => {
  //   dbQuery(sql).then(res => resolve(res)).catch(err => reject(err));
  // })
}

task._completeTask = function (t_id) {

  return Task.update({
    is_completed: 1
  }, {
    where: {
      id: t_id
    }
  }).then(flag => {
    console.log("完成子任务");
    // 此处发消息
  }).catch(e => console.log(e));


  // const sql_complete_task = `update task set is_completed = 1 where id = '${t_id}'`;
  // dbQuery(sql_complete_task).then(flag => {
  //   console.log("完成子任务");
  //   // 此处发消息

  // }).catch(e => console.log(e));
}

// 提前 强制完成子任务
task.forceCompleteTask = function (t_id) {
  // 找出该子任务的还在进行中的任务人

  return new Promise((resolve, reject) => {
    task.getStatusMapByTId(t_id).then(async status => {
      const continueUsers = status.filter(st => st.user_status === 1);
      const u_ids = continueUsers.map(user => user.u_id);
      for (let u_id of u_ids) {

        // const sql = `update user_task set user_status = 2 where t_id = '${t_id}' and u_id = '${u_id}'`
        try {
          // const res = await dbQuery(sql);
          const res = await UserTask.update({
            user_status: 2
          }, {
            t_id, u_id
          });
          // console.log(res, sql);
          console.log(res);
        } catch (e) {
          console.log(e);
          return reject("强制完成子任务失败")
        }
      }
      try {
        await task._completeTask(t_id);
        return resolve("强制完成子任务成功")
      } catch (e) {
        console.log(e);
        return reject("强制完成子任务失败")
      }
    })
  })

}
/**
 * 完成子任务
 * 当所有人都完成子任务时 才是真正完成子任务的时候
 * 这个api应该判断每个人的完成情况
 */
task.completeTask = function (t_id, u_id) {

  return new Promise((resolve, reject) => {
    // 先使得u_id的成员完成任务
    UserTask.update({
      user_status: 2
    }, {
      where: {
        t_id, u_id
      }
    }).then(() => {
      UserTask.findAll({
        where: {
          t_id,
          user_status: {
            [Seq.Op.in]: [1, 3]
          }
        }
      }).then(res => {
        const len = res.length;
        if (len === 0) { // 说明没有人正在进行任务 那就是说该完成任务的人都已经完成任务了 
          task._completeTask(t_id);
          return resolve({ msg: "完成任务", flag: 'all' })
        } else {
          return resolve({ msg: "任务部分完成", flag: 'part' })
        }
      }).catch(err => reject(err));
    }).catch(err => reject(err));
  })

  // // 先使得u_id的成员完成任务
  // const sql = `update user_task set user_status = 2 where t_id = '${t_id}' and u_id = '${u_id}'`;
  // // 在判断每个人的完成情况 只要没有任务中的人员 那么就算每个人都完成 请假的人也算完成 查询任务中的人的数量和0 比较
  // const sql_get_user_status_count = `select * from user_task where t_id = '${t_id}' and user_status in(1,3)`; // 1是进行中 3是审核中  在审核没有成功之前和任务中一样

  // return new Promise((resolve, reject) => {
  //   dbQuery(sql).then(flag => {
  //     dbQuery(sql_get_user_status_count).then(res => {
  //       const len = res.length;
  //       if (len === 0) { // 说明没有人正在进行任务 那就是说该完成任务的人都已经完成任务了 
  //         task._completeTask(t_id);
  //         return resolve({ msg: "完成任务", flag: 'all' })
  //       } else {
  //         return resolve({ msg: "任务部分完成", flag: 'part' })
  //       }
  //     }).catch(err => reject(err));
  //   }).catch(err => reject(err));
  // })
}
/**
 * 请求请假
 * u_id	t_id	user_status 用户状态 2审核 1正常 0请假	break_reason 请假原因	refuse_reason 驳回请假请求的原因
 */
task.applyTakeBreak = function (t_id, u_id, break_reason) {
  return UserTask.upsert({
    u_id, t_id, user_status: 3, break_reason
  })
  // const sql = `replace into user_task values ('${u_id}','${t_id}',3,'${break_reason}','')`;
  // return new Promise((resolve, reject) => {
  //   dbQuery(sql).then(res => resolve(res)).catch(err => reject(err));
  // })
}
/**
 * 同意请假请求
 */
task.allowTakeBreak = function (t_id, u_id) {
  return UserTask.update({
    user_status: 0,
  }, {
    where: { u_id, t_id }
  })
  // const sql = `update user_task set user_status = 0 where u_id ='${u_id}' and t_id = '${t_id}'`;
  // return new Promise((resolve, reject) => {
  //   dbQuery(sql).then(res => resolve(res)).catch(err => reject(err));
  // })
}
/**
 * 拒绝请假
 */
task.refuseTakeBreak = function (t_id, u_id, refuse_reason) {
  return UserTask.update({
    user_status: 1,
    refuse_reason
  }, {
    where: { u_id, t_id }
  })
  // const sql = `update user_task set user_status = 1 , refuse_reason = '${refuse_reason}' where u_id ='${u_id}' and t_id = '${t_id}'`;
  // return new Promise((resolve, reject) => {
  //   dbQuery(sql).then(res => resolve(res)).catch(err => reject(err));
  // })
}



task.search = function (u_id, keyword) {
  const sql = `SELECT * from Tasks LEFT JOIN UserTasks on Tasks.id = UserTasks.t_id WHERE UserTasks.u_id = '${u_id}' and (Tasks.t_name LIKE '%${keyword}%' OR Tasks.t_describe LIKE '%${keyword}%');`
  return new Promise((resolve, reject) =>
    dbQuery(sql).then(res => resolve(res)).catch(err => reject(err)))
}


task.getTasksByUid = function (u_id) {
  const sql = `SELECT id,t_name,t_describe,begin_time,end_time,is_completed,tf_id from Tasks LEFT JOIN UserTasks on Tasks.id = UserTasks.t_id WHERE u_id = '${u_id}' and tf_id in (
        SELECT tf_id from UserTaskFlows WHERE u_id = '${u_id}'
    )`;
  return new Promise((resolve, reject) =>
    dbQuery(sql).then(res => resolve(res)).catch(err => reject(err)))
}

// 删除一个子任务
task.deleteTask = function (t_id) {

  const sql = `
    SET foreign_key_checks = 0; 
    delete from UserTasks where t_id = '${t_id}';
    delete from Tasks where id = '${t_id}';
    SET foreign_key_checks = 1; 
    `;
  return new Promise((resolve, reject) =>
    dbQuery(sql).then(res => resolve(res)).catch(err => reject(err)))
}


task.deleteTaskMember = function (tf_id, u_id) {

  const sql = `delete from UserTasks where t_id in (SELECT id from Tasks WHERE tf_id = '${tf_id}') and u_id = '${u_id}' `;

  return new Promise((resolve, reject) =>
    dbQuery(sql).then(res => {
      resolve(res);
    }).catch(err => reject(err)))
}

// 找出还差不到3个小时就逾期的子任务
task.getBeingDelayTasks = function (hour) {
  if (typeof hour != 'number') return [];
  const now = formatTime(new Date());// 获得现在的时间
  const sql = `select * from Tasks where subtime(timediff(end_time,'${now}'),'0${hour}:00:00')<0 and is_completed = 0 and has_alert = 0`;
  // console.log(sql);
  return new Promise((resolve, reject) =>
    dbQuery(sql).then(res => resolve(res)).catch(err => reject(err)))
}


task.checkUser = function (u_id, t_id) {
  return UserTask.findOne({
    where: {
      u_id,
      t_id
    }
  })
  // const sql = `select * from user_task where u_id = '${u_id}' and t_id = '${t_id}'`;
  // return new Promise((resolve, reject) =>
  //   dbQuery(sql).then(res => resolve(res)).catch(err => reject(err)))
}
module.exports = task;
