const md5 = require('md5');

// 1.随机数长度控制,定义一个长度变量（length），生成可控长度的随机数：
// Math.random().toString(36).substr(3,length)

// 2.引入时间戳：

// Date.now().toString(36)

// 3.合在一起最终办法：

/**
 * 根据openid来生成全局唯一的u_id
 * 采用MD5加密 时间戳+随机数+openid
 * @param {string} openid 用户对于小程序的唯一ID
 */
function genUniqueUserId(openid) {
    return md5(openid + Number(Math.random().toString().substr(3,32) + Date.now()).toString(36) + Math.random() * 10000);
}


/**
 * 生成全局唯一的id
 * 采用MD5加密 时间戳+随机数
 */
function genUniqueId() {
    return md5(Number(Math.random().toString().substr(3, 32) + Date.now()).toString(36) + Math.random() * 10000);
}

module.exports = {
    genUniqueUserId,
    genUniqueId
}
