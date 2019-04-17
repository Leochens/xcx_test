const express = require('express')
const router = express.Router();
const ERR = require('../config/error');
const checkSession = require('../utils/checkSession');
const Task = require('../modules/task');
const Comment = require('../modules/comment');
const User = require('../modules/user');
const url = '/task_flows/:tf_id/tasks';
const messageControl = require('../modules/messageControl');

// 在这里做判断
router.delete(url, async function (req, res, next) {
    const tf_id = req.params.tf_id;
    const { u_id } = req.body;
    let noAuth = false;
    await User.checkRole(u_id, tf_id).catch(function (errMsg) {
        noAuth = true;
        return res.json(ERR.REQUIRE_LEADER);
    });
    if (noAuth) return;
    next();
})
router.put(url, async function (req, res, next) {
    const tf_id = req.params.tf_id;
    const { u_id } = req.body;
    let noAuth = false;
    await User.checkRole(u_id, tf_id).catch(function (errMsg) {
        noAuth = true;
        return res.json(ERR.REQUIRE_LEADER);
    });
    if (noAuth) return;
    next();
})

/**
 * 得到一个tf的所有task
 */
router.get(url, function (req, res) {
    const tf_id = req.params.tf_id;
    Task.getTasksByTfId(tf_id).then(async list => {
        for (let task of list) {
            const t_id = task.id;
            task.members = await User.getUsersByTId(t_id);
            task.comments = await Comment.getCommentByTId(t_id);
            task.status_map = await Task.getStatusMapByTId(t_id);
        }
        return res.json({
            msg: "获取成功",
            data: list
        })
    }).catch(err => {
        console.log(err);
        return res.json(ERR.TASK_QUERY_BY_TF_ID_FAILD);
    });
})
/**
 * 得到一条指定id的task的信息
 */
router.get(url + '/:t_id', function (req, res) {
    const t_id = req.params.t_id;
    Task.getTaskById(t_id).then(task => res.json(task)).catch(err => {
        console.log(err);
        return res.json(ERR.TASK_QUERY_BY_T_ID_FAILD);
    })
})

/**
 * 为指定tf增加一个task
 * 返回t_id
 */
router.post(url, function (req, res) {
    const task = JSON.parse(req.body.task);
    const tf_id = req.params.tf_id;
    if (!task) return res.json(ERR.MISSING_ARGUMENT);

    const t = {
        ...task,
        comments: [],
        is_completed: 0,
        is_important: 0,
        tf_id,
        // status_map:
    }
    Task.addTask(tf_id, task).then(t_id => {
        if (Array.isArray(task.members) && task.members.length > 0) { //
            const u_ids = task.members.map(m => m.id);
            messageControl.createNewTask(t_id, u_ids);
            Task.addTaskMember(t_id, u_ids).then(flag => {
                res.json({
                    msg: "插入新任务成功 插入任务人成功",
                    data: {
                        ...t,
                        id: t_id,
                    }
                })
            }).catch(err => {
                console.log(err);
                return res.json(ERR.TASK_INSERT_FAILD);
            });
        } else {
            res.json({
                msg: "插入新任务成功 但是该任务无任务人",
                data: {
                    ...t,
                    id: t_id,
                    members: []
                }
            })
        }
    }).catch(err => {
        console.log(err);
        return res.json(ERR.TASK_INSERT_FAILD);
    })
})
/**
 * 全量更新一条task
 * 要做权限认证 
 */
router.put(url, function (req, res) {
    const { t_id, u_id, task } = req.body;
    const _task = JSON.parse(task);
    if (!t_id || !u_id || !_task) return res.json(ERR.MISSING_ARGUMENT);
    Task.updateTask(t_id, _task).then(flag => res.json(_task)).catch(err => {
        console.log(err);
        return res.json(ERR.TASK_UPDATE_FAILD);
    })
})



/**
 * 删除一条task
 * 要做权限认证
 */
router.delete(url, function (req, res) {
    const { t_id, u_id } = req.body;
    if (!t_id || !u_id) return res.json(ERR.MISSING_ARGUMENT);
    Task.deleteTask(t_id).then(flag => res.json(flag)).catch(err => {
        console.log(err);
        return res.json(ERR.TASK_DELETE_FAILD);
    })
})



const break_url = '/tasks/:t_id/break';

/**
 * 成员申请请假
 */
router.post(break_url, function (req, res) {
    const t_id = req.params.t_id;
    const break_reason = req.body.break_reason;
    const u_id = req.body.u_id;
    console.log("break_reason=>", break_reason);
    Task.applyTakeBreak(t_id, u_id, break_reason).then(flag => {
        res.json({
            msg: "请假请求成功"
        })
    }).catch(e => {
        console.log(e);
        res.json(ERR.APPLY_BREAK_FAILD);
    })
})

/**
 * 请假结果
 */
router.put(break_url, function (req, res) {
    const t_id = req.params.t_id;
    const u_id = req.body.u_id;
    if (!u_id) return res.json(ERR.MISSING_ARGUMENT);
    const refuse_reason = req.body.refuse_reason;

    if (refuse_reason) { // 拒绝请假
        Task.refuseTakeBreak(t_id, u_id, refuse_reason).then(flag => {
            res.json({
                msg: "拒绝请假成功"
            })
        }).catch(e => {
            res.json(ERR.REFUSE_BREAK_FAILD);
        })
    } else {  // 同意请假
        Task.allowTakeBreak(t_id, u_id).then(flag => {
            res.json({
                msg: "同意请假成功"
            })
        }).catch(e => {
            res.json(ERR.ALLOW_BREAK_FAILD);
        })
    }
})

/**
 * 完成子任务
 */
router.post('/tasks/:t_id/complete', function (req, res) {
    const t_id = req.params.t_id;
    const { u_id } = req.body;
    if (!t_id || !u_id) return res.json(ERR.MISSING_ARGUMENT);
    Task.completeTask(t_id, u_id).then(msg => {
        res.json({
            msg: msg
        });
    }).catch(e => {
        console.log(e);
        res.json(ERR.COMPLETE_TASK_FAILD);
    })

})
module.exports = router;