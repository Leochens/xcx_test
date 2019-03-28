const md5 = require('md5');
/**
 * 根据openid来生成全局唯一的u_id
 * 采用MD5加密 时间戳+随机数+openid
 * @param {string} openid 用户对于小程序的唯一ID
 */
function genUniqueUserId(openid){
    return md5(openid+Date.parse(new Date())+Math.random()*10000);
}


/**
 * 生成全局唯一的id
 * 采用MD5加密 时间戳+随机数
 */
function genUniqueId(){
    return md5(Date.parse(new Date())+Math.random()*10000);
}

module.exports = {
    genUniqueUserId,
    genUniqueId
}
