const conn = require('./db');
const genId = require('../utils/genId');
const user = {};
const User = require('./dbs/user');
user.getUserInfoById = function (id, callback) {
  User.findOne({
    id
  }).then(res => {
    console.log(res);
    callback(err, res);
  }).catch(err => {
    console.log("getUserInfoById:err", err);
    return;
  })
  // const sql = "SELECT * FROM user WHERE 'u_id' = ?";
  // conn.query(sql, [id], function (err, res) {
  //   if (err) {

  //   }
  //   console.log(res);
  //   callback(err, res);
  // })
}
/**
 * 如果用户存在 即可以查询到openid 那么就返回u_id
 * 不存在就插入一个用户 返回u_id
 */
user.insertUserByOpenId = function (openid) {
  return new Promise(function (resolve, reject) {
    user.getUserInfoByOpenId(openid).then(function (res) {
      if (res.length === 0) { // 不存在用户 插入
        console.log(res);
        const u_id = genId.genUniqueUserId(openid);
        console.log('这边来了一个新人，大家一起欺负他,他的openid==>', openid);
        User.upsert({
          id: u_id,
          openid
        }).then(res => {
          return resolve(u_id);
        }).catch(err => {
          return reject(err);
        })
        // const sql = `insert into user(id,openid) values('${u_id}','${openid}');`
        // conn.query(sql, function (err, res) {
        //   if (err) {
        //     return reject(err);
        //   }
        //   return resolve(u_id);
        // });
      } else {
        console.log("老用户登陆哦==>", openid);
        resolve(res[0].dataValues.u_id);
      }
    }

    ).catch(function (err) {
      reject(err);
    })
  })

}


/**
 * 以openid为键来获得用户信息
 * 检测数据库中是否有该用户
 */
user.getUserInfoByOpenId = function (openid) {
  // const sql = `select * from user where openid = '${openid}' limit 1`;
  return new Promise(function (resolve, reject) {
    User.findOne({
      openid
    }).then(res => {
      return resolve(res);
    }).catch(err => {
      console.log('checkUserExist 查询用户检测openid存在性失败');
      return reject(err);
    });

    // conn.query(sql, function (err, res) {
    //   if (err) {
    //     console.log('checkUserExist 查询用户检测openid存在性失败');
    //     return reject(err);
    //   }
    //   console.log('查询结果', res);
    //   return resolve(res);
    // })
  })

  // return u_id;
}

user.updateUserById = function (u_id, userInfo) {
  // 根据openid来更新用户的信息 然后返回用户的u_id
  console.log("前端用户已经确认得到userInfo了,准备根据发来的u_id和userInfo更新用户表表");

  // const sql = `UPDATE user 
  //       SET
  //       nick_name= '${userInfo.nickName}',
  //       phone_number= '${userInfo.phoneNumber}',
  //       city='${userInfo.city}',
  //       province='${userInfo.province}',
  //       country='${userInfo.country}',
  //       avatar_url='${userInfo.avatarUrl}',
  //       gender=${userInfo.gender}
  //       WHERE
  //       id = '${u_id}'
  //   `;
  return new Promise(function (resolve, reject) {
    User.update({
      nick_name: userInfo.nickName,
      phone_number: userInfo.phoneNumber,
      city: userInfo.city,
      province: userInfo.province,
      country: userInfo.country,
      avatar_url: userInfo.avatarUrl,
      gender: userInfo.gender,
    }, { where: { id: u_id } }).then(res => resolve(true)).catch(err => {
      console.log("更新失败"); return reject(err)
    })
    // conn.query(sql, function (err, res) {
    //   if (err) { console.log("更新失败"); return reject(err) }
    //   console.log("更新成功");
    //   return resolve(true);
    // });
  });
}

module.exports = user;