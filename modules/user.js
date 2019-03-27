const conn = require('./db');
const genId = require('../utils/genId');

function User(user) {
    this.nickName = user.nickName;
    this.uid = user.uid;
}


User.getUserInfoById = function (id, callback) {
    const sql = "SELECT * FROM user WHERE 'u_id' = ?";
    conn.query(sql, [openid], function (err, res) {
        if (err) {
            console.log("getUserInfoById:err", err);
            return;
        }
        console.log(res);
        callback(err, res);
    })
}
/**
 * 如果用户存在 即可以查询到openid 那么就返回u_id
 * 不存在就插入一个用户 返回u_id
 */
User.insertUserByOpenId = function (openid) {
    return new Promise(function (resolve, reject) {
        User.checkUserExist(openid).then(function (res) {
                if (res.length === 0) { // 不存在用户 插入
                    console.log(res);
                    const u_id = genId.genUniqueUserId(openid);
                    const sql = `insert into user(u_id,openid) values('${u_id}','${openid}');`
                    conn.query(sql,function(err,res){
                        if(err){
                            return reject(err);
                        }
                        return resolve(u_id);
                    });
                }else{
                    resolve(res[0].u_id);
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
User.getUserInfoByOpenId = function (openid) {
    const sql = `select * from user where openid = '${openid}' limit 1`;
    return new Promise(function (resolve, reject) {
        conn.query(sql, function (err, res) {
            if (err) {
                console.log('checkUserExist 查询用户检测openid存在性失败');
                return reject(err);
            }
            console.log('查询结果', res);
            return resolve(res);
        })
    })

    // return u_id;
}

User.updateUserByOpenId = function (openid) {
    // 根据openid来更新用户的信息 然后返回用户的u_id
    const sql = `SET @update_id := 0;
                UPDATE user SET 
                    row = 'value', 
                id = (SELECT @update_id := id)
                WHERE some_other_row = 'blah' LIMIT 1;
                SELECT @update_id';`;

}

module.exports = User;