const express = require('express')
const router = express.Router();
const checkSession = require('../utils/checkSession');
const ERR = require('../config/error');
const User = require('../modules/user');
const Task = require('../modules/task');
/**
 * 获得任务流的成员信息
 */
const tf_url = '/task_flows/:tf_id/users'; // tf人员操作
/**
 * 获得一个tf的的所有参与人员
 */
router.get(tf_url, function (req, res) {
    const tf_id = req.params.tf_id;
    if (!tf_id) return res.json(ERR.MISSING_ARGUMENT);
    User.getUsersByTFId(tf_id).then(list => res.json(list)).catch(err => {
        console.log(err);
        return res.json(ERR.GET_ALL_TF_USERS_FAILD);
    })

});
/**
 * 向一个tf中添加一个新的人员
 * 用户邀请微信好友的接口 
 * 好友在分享页面登录后紧接着调这个api就可以完成参加任务流
 */
router.post(tf_url, function (req, res) {
    const u_id = req.body.u_id;
    const tf_id = req.params.tf_id;
    if (!u_id) { return res.json(ERR.MISSING_ARGUMENT) }
    User.addTFMember(tf_id, u_id).then(flag => res.json(flag)).catch(err => {
        console.log(err);
        return res.json(ERR.TF_INVITE_MEMBER_FAILD);
    })
})

/**
 * 用户退出任务流 
 * 几种不能退出的情况
 * TODO
 *  1. 用户有任务在身
 *  2. 用户是leader
 *  3. 用户不是该tf的成员
 */
router.delete(tf_url, function (req, res) {
    const tf_id = req.params.tf_id;
    const u_id = req.body.u_id;
    if (!u_id) { return res.json(ERR.MISSING_ARGUMENT) }
    User.deleteUserInTaskFlow(tf_id, u_id).then(flag => res.json(flag)).catch(err => {
        console.log(err);
        return res.json(ERR.USER_QUIT_TF_FAILD);
    })

})



////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////

const t_url = '/tasks/:t_id/users';   // task人员操作


/**
 * 获得一个task的人员
 */
router.get(t_url, function (req, res) {
    const t_id = req.params.t_id;
    User.getUsersByTId(t_id).then(list => {
        console.log("获得task的任务人成功", list);
        return res.json(list);
    }).catch(err => {
        console.log(err);
        res.json(ERR.GET_TASK_MEMBER_FAILD);
    })
})

/**
 * 获得一组人在单个子任务中的状态 是请假还是正常
 */
router.post(t_url + '/status', function (req, res) {
    const t_id = req.params.t_id;
    const u_ids = JSON.parse(req.body.u_ids);

    User.getMemberStatusInTaskByIds(t_id, u_ids).then(list => {
        console.log("获得task的任务人的状态成功", list);
        return res.json({
            msg: "获得状态成功",
            data: list
        });
    }).catch(err => {
        console.log(err);
        res.json(ERR.GET_TASK_MEMBER_STATUS_FAILD);
    })
})



/**
 * 为task添加负责人
 * u_ids
 */
router.post(t_url, function (req, res) {
    const t_id = req.params.t_id;
    const u_ids = JSON.parse(req.body.u_ids);
    Task.addTaskMember(t_id, u_ids).then(flag => {
        console.log("添加task的任务人成功");
        return res.json("添加task的任务人成功");
    }).catch(err => {
        console.log(err);
        res.json(ERR.ADD_TASK_MEMBER_FAILD);
    })
})

/**
 * 删除一个task的负责人
 */
router.delete(t_url, function (req, res) {

});

router.get('/users', function (req, res) {
    const SID = req.headers['cookie'];
    console.log(SID);
    return checkSession(req).then(function (_res) {
        res.json(
            ''
        );
    }).catch(function (err) {
        res.statusCode = 401;
        console.log(err);
        console.log("认证失败")
        res.json(ERR.USER_AUTH_FAILD);
    });

})


module.exports = router;