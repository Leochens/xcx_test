const conn = require('./db');
const genId = require('../utils/genId');
const dbQuery = require('../utils/dbQuery');
const user = {};
const User = require('./dbs/user');
const UserTask = require('./dbs/user_task');
const Seq = require('sequelize');
const UserTaskFlow = require('./dbs/user_taskflow');
/**
 * 如果用户存在 即可以查询到openid 那么就返回u_id
 * 不存在就插入一个用户 返回u_id
 */
user.insertUserByOpenId = function (openid) {
  return new Promise(function (resolve, reject) {
    user.getUserInfoByOpenId(openid).then(function (res) {
      if (!res) { // 不存在用户 插入
        console.log(res);
        const u_id = genId.genUniqueUserId(openid);

        console.log('这边来了一个新人，大家一起欺负他,他的openid==>', openid);
        
        
        User.upsert({
          id: u_id,
          openid
        }).then(res => resolve(u_id)).catch(err => reject(err));
        // const sql = `insert into user(id,openid) values('${u_id}','${openid}');`
        // dbQuery(sql).then(res => resolve(u_id)).catch(err => reject(err));
      } else {
        console.log("老用户登陆哦==>", openid);
        resolve(res.id);
      }
    }
    ).catch(function (err) {
      reject(err);
    })
  })

}

/**
 * 以id为键来获得用户信息
 * 检测数据库中是否有该用户
 */
user.getUserInfoById = function (u_id) {
  return User.findOne({ where: { id: u_id } });
  // const sql = `SELECT * FROM user WHERE id = '${u_id}'`;
  // return new Promise((resolve, reject) => {
  //   dbQuery(sql).then(res => resolve(res)).catch(err => reject(err))
  // })
}
/**
 * 获得一组人在单个子任务中的状态 是请假还是正常
 * t_id 
 * u_ids 一组人的id
 * 返回一个列表 里面是
 * [
 *  {
 *      u_id,
 *      t_id,
 *      status,
 *      break_reason,
 *      refuse_reason
 *  },
 *  ...
 * ]
 */
user.getMemberStatusInTaskByIds = function (t_id, u_ids) {


  return UserTask.findAll({
    where: {
      t_id,
      u_id: {
        [Seq.Op.in]: u_ids
      }
    }
  })
  // let uidsStr = "";
  // u_ids.forEach((u_id, index) => {
  //   if (index === u_ids.length - 1)
  //     uidsStr += `'${u_id}'`;
  //   else
  //     uidsStr += `'${u_id}',`
  // });

  // const sql = `select * from user_task where t_id = '${t_id}' and u_id in (${uidsStr})`;
  // return new Promise(function (resolve, reject) {
  //   dbQuery(sql).then(res => resolve(res)).catch(err => reject(err))
  // });
}

/**
 * 以openid为键来获得用户信息
 * 检测数据库中是否有该用户
 */
user.getUserInfoByOpenId = function (openid) {

  // const sql = `select * from user where openid = '${openid}' limit 1`;
  return new Promise(function (resolve, reject) {
    User.findOne({
      where: {
        openid
      }
    }).then(res => {
      console.log('查询结果', res);
      return resolve(res);
    }).catch(err => {
      console.log('checkUserExist 查询用户检测openid存在性失败');
      return reject(err);
    });
  })
}
/**
 * 根据openid来更新用户的信息
 * 然后返回用户的u_id
 */
user.updateUserById = function (u_id, userInfo) {
  console.log("前端用户已经确认得到userInfo了,准备根据发来的u_id和userInfo更新用户表表", u_id, userInfo);

  return User.update({
    nick_name: userInfo.nickName,
    phone_number: userInfo.phoneNumber,
    city: userInfo.city,
    province: userInfo.province,
    country: userInfo.country,
    avatar_url: userInfo.avatarUrl,
    gender: userInfo.gender
  }, { where: { id: u_id } })
  // const sql = `UPDATE user SET
  //       nick_name= '${userInfo.nickName}',phone_number= '${userInfo.phoneNumber}',city='${userInfo.city}',
  //       province='${userInfo.province}',country='${userInfo.country}',avatar_url='${userInfo.avatarUrl}',gender=${userInfo.gender}
  //       WHERE id = '${u_id}'
  //   `;
  // return new Promise(function (resolve, reject) {
  //   dbQuery(sql).then(res => {
  //     console.log("更新成功");
  //     return resolve(true);
  //   }).catch(err => {
  //     console.log("更新失败"); return reject(err)
  //   })
  // });
}
user.updateUserByField = function (u_id, field, value) {

  return User.update({
    [field]: value
  }, { where: { id: u_id } })
  // const sql = `update user set
  //       ${field}='${value}'
  //       where id='${u_id}'`
  // return new Promise(function (resolve, reject) {
  //   dbQuery(sql).then(res => {
  //     console.log(`更新${field}成功`);
  //     return resolve(`更新${field}成功`);
  //   }).catch(err => {
  //     console.log(`更新${field}失败`); return reject(err)
  //   })
  // });
}



user.checkRole = function (u_id, tf_id) {

  // const sql = `select role from user_taskflow where u_id = '${u_id}' and tf_id = '${tf_id}' limit 1 `;
  return new Promise(function (resolve, reject) {
    UserTaskFlow.findOne({
      attributes: ['role'],
      where: {
        u_id,
        tf_id,
      }
    }).then(function (role) {
      console.log('当前操作者身份=>', role);
      if (!role || !role.role) {
        return reject(false);
      }
      console.log(role.role);
      return resolve(true);
    })
  })
}

///////////////////////////////////////////////////////////////////////////


/**
 * 根据tf_id来获得用户 也就是tf的成员
 * 返回一个列表
 */
user.getUsersByTFId = function (tf_id) {
  const sql = `SELECT * from Users where id IN (
                    SELECT u_id FROM UserTaskFlows WHERE tf_id = '${tf_id}')`;
  // const sql = `SELECT * FROM user,user_taskflow where tf_id = '${tf_id}'`;
  return new Promise((resolve, reject) => {
    dbQuery(sql).then(res => resolve(res)).catch(err => reject(err))
  })
}
/**
 * 根据t_id来获得用户 也就是task的负责人
 * 返回一个列表
 */
user.getUsersByTId = function (t_id) {
  const sql = `select * from Users where id in (
        select u_id from UserTasks where t_id = '${t_id}')`;
  return new Promise((resolve, reject) => {
    dbQuery(sql).then(res => resolve(res)).catch(err => reject(err))
  })
}


/**
 * 删除一个tf中的某个成员
 * 几种不能退出的情况
 */
user.deleteUserInTaskFlow = function (tf_id, u_id) {
  return UserTaskFlow.destroy({
    where: { tf_id, u_id }
  })
  // const sql = `delete from user_taskflow where tf_id = '${tf_id}' and u_id = '${u_id}'`;
  // return new Promise((resolve, reject) => {
  //   dbQuery(sql).then(res => resolve(res)).catch(err => reject(err))
  // })
}


/**
 * 向TF中添加一个新成员
 */
user.addTFMember = function (tf_id, u_id) {
  return UserTaskFlow.upsert({
    u_id,
    tf_id,
    role: 0,
    category: '默认分类'
  })
  // const sql = `replace into user_taskflow values('${u_id}','${tf_id}',0,'默认',${true})`;
  // return new Promise((resolve, reject) => {
  //   dbQuery(sql).then(res => resolve(res)).catch(err => reject(err))
  // })
}
///////////////////////////////////////////////////////////////////////////



user.getReviewList = function (u_id) {
  // 获得当前用户所负责的任务流的所有子任务需要请假的任务的审核列表
  const sql = `SELECT TaskFlows.id as tf_id,TaskFlows.tf_name ,Tasks.id as t_id,Tasks.t_name,UserTasks.u_id as apply_user_id, Users.nick_name as apply_user_name,  user_status,break_reason,refuse_reason from TaskFlows LEFT JOIN Tasks ON TaskFlows.id = Tasks.tf_id LEFT JOIN UserTasks on UserTasks.t_id = Tasks.id left JOIN Users on Users.id = UserTasks.u_id
    WHERE leader_id = '${u_id}' AND user_status = 3`;
  return new Promise((resolve, reject) => {
    dbQuery(sql).then(res => resolve(res)).catch(err => reject(err))
  })
}

module.exports = user;