const express = require('express')
const router = express.Router();
const checkSession = require('../utils/checkSession');
const ERR = require('../config/error');
const Message = require('../modules/message');
/**
 * 获得某一用户的全部未读消息
 */
router.get('/users/:u_id/messages', (req, res) => {
    const u_id = req.param('u_id');
    Message.getUnreadMessageByUserId(u_id).then(msgs=>{
        console.log("获得消息成功");
        res.json({
            msg:"获取消息成功",
            data:msgs
        })
    }).catch(err=>{
        return res.json(ERR.GET_MESSAGE_FAILD);
    })
})

/**
 * 将一个用户的消息都置为已读
 */
router.put('/users/:u_id/messages', (req, res) => {
    const u_id = req.param('u_id');
    Message.setMessageReadByUid(u_id).then(flag=>{
        console.log("设置消息已读成功");
        res.json({
            msg:"设置已读成功",
            // data:flag
        })
    }).catch(err=>{
        console.log(err);
        return res.json(ERR.SET_MESSAGE_READ_FAULD);
    })
})


/**
 * 设置多条消息已读
 */
// router.put('/users/:u_id/messages', (req, res) => {
//     const u_id = req.param('u_id');
//     const m_ids = JSON.parse(req.body.m_ids); 
//     Message.setMessageRead(m_ids).then(flag=>{
//         console.log("设置消息已读成功");
//         res.json({
//             msg:"设置已读成功",
//             // data:msgs
//         })
//     }).catch(err=>{
//         return res.json(ERR.SET_MESSAGE_READ_FAULD);
//     })
// })

module.exports = router;