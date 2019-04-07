const genId = require('../utils/genId');
const dbQuery = require('../utils/dbQuery');
const comment = {};
/**
 * id	comment_type	content	create_time	u_id	t_id
 */

comment.getCommentByTId = function (t_id) {
    const sql = `select * from comment where t_id = '${t_id}' order by create_time`;

    return new Promise((resolve, reject) => {
        dbQuery(sql).then(res => resolve(res)).catch(err => reject(err));
    })
}
/**
 * 为task添加一个cmt
 * t_id task的id
 * cmt 评论内容
 * 返回cmt的id
 */
comment.addComment = function (cmt) {
    const c_id = genId.genUniqueId();

    const sql = `replace into comment values(
        '${c_id}',
        ${cmt.comment_type},
        '${cmt.content}',
        '${cmt.create_time}',
        '${cmt.u_id}',
        '${cmt.t_id}')`;
        
    return new Promise((resolve, reject) => {
        dbQuery(sql).then(res => resolve(c_id)).catch(err => reject(err));
    })
}

// /**
//  * 删除c_id对应的评论 
//  * 权限检测 不是自己发的不能删除
//  */
// comment.deleteComment = function (u_id,c_id) {
//     //TODO: check auth
//     const sql = `delete from comment where id = '${c_id}'`;
//     return new Promise((resolve, reject) => {
//         dbQuery(sql).then(res => resolve(res)).catch(err => reject(err));
//     })
// }

module.exports = comment;

