const express = require('express')
const router = express.Router();
const checkSession = require('../utils/checkSession');
const ERR = require('../config/error');
const User = require('../modules/user');
const Comment = require('../modules/comment');

const url = '/tasks/:t_id/comments';
/**
 * 获得指定task的评论
 */
router.get(url,function(req,res){
    const t_id = req.params.t_id;
    Comment.getCommentByTId(t_id).then(flag=>res.json(flag)).catch(err=>{
        console.log(err);
        return res.json(ERR.GET_DATA_FAILD);
    })
})

/**
 * 为指定task增加一条评论
 */
router.post(url,function(req,res){
    const cmt = JSON.parse(req.body.cmt);
    
    if(!cmt) {return res.json(ERR.MISSING_ARGUMENT)}
    console.log("post==>",cmt);

    Comment.addComment(cmt).then(c_id=>res.json({
        ...cmt,
        id:c_id
    })).catch(err=>{
        console.log(err);
        return res.json(ERR.COMMENT_FAILD);
    })
})


/**
 * 删除指定task的一条评论
 */

//  router.delete(url,function(req,res){
//      const u_id = req.body.u_id;
//     if(!u_id) {res.json(ERR.MISSING_ARGUMENT)}


//  })
module.exports = router;