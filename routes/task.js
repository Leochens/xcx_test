const express = require('express')
const router = express.Router();
const ERR = require('../config/error');
const checkSession = require('../utils/checkSession');
const Task = require('../modules/task');
const TaskFlow = require('../modules/taskFlow');
const Comment = require('../modules/comment');
const User = require('../modules/user');
const Image = require('../modules/image');
const url = '/task_flows/:tf_id/tasks';
const messageControl = require('../modules/messageControl');
const Log = require('../modules/log');
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
            task.members = (await User.getUsersByTId(t_id) || []).length;
            task.comments = (await Comment.getCommentByTId(t_id) || []).length;
            task.images = (await Image.getImagesByTId(t_id) || []).length;
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
const single = '/tasks/:t_id/'
router.get(single, function (req, res) {
    const t_id = req.params.t_id;
    checkSession(req).then(userData => {
        console.log("userData", userData);
        const u_id = userData.u_id;
        Task.getTaskById(t_id).then(async _task => {
            const task = _task.pop();
            if (!task) return res.json(ERR.NO_SUB_TASK);
            TaskFlow.checkUser(task.tf_id, u_id).then(r => {
                if (!r.length) return res.json(ERR.NO_AUTH); // 该用户不是该子任务的成员 无权查看
            }).catch(err => {
                console.log(err);
                return res.json(ERR.TASK_QUERY_BY_T_ID_FAILD);
            });

            task.members = await User.getUsersByTId(t_id || []);
            task.comments = await Comment.getCommentByTId(t_id) || [];
            task.status_map = await Task.getStatusMapByTId(t_id) || [];
            task.images = await Image.getImagesByTId(t_id) || [];
            res.json({
                msg: "获取成功",
                data: [task]
            });
        }).catch(err => {
            console.log(err);
            return res.json(ERR.TASK_QUERY_BY_T_ID_FAILD);
        })
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
            Log.logTask(t_id, `子任务${task.t_name}被创建`).catch(err => console.log(err));

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
    const { task, members } = req.body;
    const _task = JSON.parse(task);
    if (!_task || !members) return res.json(ERR.MISSING_ARGUMENT);
    console.log('_task=>', _task);
    const t_id = _task.id;
    const u_ids = members.map(m => m.id);

    Task.updateTask(t_id, _task).then(flag => {
        Task.addTaskMember(t_id, u_ids).then(f => {
            return res.json({
                msg: "更新任务成功",
                data: _task
            })
        }).catch(err => {
            console.log(err);
            return res.json(ERR.TASK_UPDATE_FAILD);
        });
    }).catch(err => {
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
        // TODO 发消息
        Task.getTaskById(t_id).then(([task]) => {
            const tf_id = task.tf_id;
            messageControl.memberTakeBreak(tf_id, t_id, { u_id, break_reason });

        }).catch(err => console.log(err));
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
    const apply_user_id = req.body.apply_user_id;
    const u_id = req.body.u_id;

    if (!u_id || !apply_user_id || !t_id) return res.json(ERR.MISSING_ARGUMENT);
    const refuse_reason = req.body.refuse_reason;

    // 
    if (refuse_reason) { // 拒绝请假
        console.log(refuse_reason)
        Task.refuseTakeBreak(t_id, apply_user_id, refuse_reason).then(flag => {

            messageControl.taskBreakFailed(t_id, apply_user_id, refuse_reason); // 给任务人发结果
            res.json({
                msg: "拒绝请假成功"
            })
        }).catch(e => {
            res.json(ERR.REFUSE_BREAK_FAILD);
        })
    } else {  // 同意请假
        Task.allowTakeBreak(t_id, apply_user_id).then(flag => {
            User.getUserInfoById(apply_user_id).then(([user]) => {

                Log.logTask(t_id, `任务人${user.nick_name}已请假`).catch(err => console.log(err));
                messageControl.takeBreakSuccess(t_id, apply_user_id) // 给任务人发结果
            }).catch(err => console.log(err));
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
    Task.completeTask(t_id, u_id).then(ret => {
        const flag = ret.flag;
        User.getUserInfoById(u_id).then(([user]) => {
            Log.logTask(t_id, `任务人${user.nick_name}已完成任务`).catch(err => console.log(err));
        }).catch(err => console.log(err));
        if (flag === 'all') {
            Log.logTask(t_id, `任务已完成`).catch(err => console.log(err));
            messageControl.completeTask(t_id);
        }
        res.json({
            msg: ret.msg
        });
    }).catch(e => {
        console.log(e);
        res.json(ERR.COMPLETE_TASK_FAILD);
    })

})


const user_all_tasks = '/users/:u_id/tasks';
/**
 * 获得一个用户的所有task
 */
router.get(user_all_tasks, function (req, res) {
    const u_id = req.params.u_id;
    Task.getTasksByUid(u_id).then(async list => {
        // for (let t of list) {
        //     const t_id = t.id;
        //     t.members = await User.getUsersByTId(t_id);
        //     t.comments = await Comment.getCommentByTId(t_id);
        //     t.status_map = await Task.getStatusMapByTId(t_id);
        //     t.images = await Image.getImagesByTId(t_id);
        // }

        res.json({
            msg: "获得u_id的tasks成功",
            data: list
        })
    }).catch(err => {
        console.log(err);
        res.json(ERR.TASK_QUERY_BY_U_ID_FAILD);
    })
});


// 权限问题
const edit_url = '/tasks/:t_id';
router.put(edit_url + '/*', async function (req, res, next) {
    const { tf_id, u_id } = req.body;
    let noAuth = false;
    await User.checkRole(u_id, tf_id).catch(function (errMsg) {
        noAuth = true;
        return res.json(ERR.REQUIRE_LEADER);
    });
    if (noAuth) return;
    next();
})
router.put(edit_url + '/t_name', function (req, res) {
    const key = 't_name';
    const t_id = req.params.t_id;
    const value = req.body.value;
    Task.updateTaskField(t_id, key, value).then(r => {
        Log.logTask(t_id, `子任务名称被修改为${value}`).catch(err => console.log(err));
        res.json({ msg: `更新${key}成功` })
    }).catch(err => {
        console.log(err);
        return res.json(ERR.TASK_UPDATE_FAILD);
    })
})
router.put(edit_url + '/t_describe', function (req, res) {
    const key = 't_describe';
    const t_id = req.params.t_id;
    const value = req.body.value;
    Task.updateTaskField(t_id, key, value).then(r => {
        Log.logTask(t_id, `子任务简介被修改为${value}`).catch(err => console.log(err));

        res.json({ msg: `更新${key}成功` })
    }).catch(err => {
        console.log(err);
        return res.json(ERR.TASK_UPDATE_FAILD);
    })
})
router.put(edit_url + '/end_time', function (req, res) {
    const key = 'end_time';
    const t_id = req.params.t_id;
    const value = req.body.value;
    Task.updateTaskField(t_id, key, value).then(r => {
        Log.logTask(t_id, `子任务截止时间被修改为${value}`).catch(err => console.log(err));
        res.json({ msg: `更新${key}成功` })
    }).catch(err => {
        console.log(err);
        return res.json(ERR.TASK_UPDATE_FAILD);
    })
})
// 新增新成员
router.put(edit_url + '/members', function (req, res) {
    const key = 'members';
    const t_id = req.params.t_id;
    const u_ids = JSON.parse(req.body.value);
    Task.addTaskMember(t_id, u_ids).then(r => {
        Log.logTask(t_id, `已新增成员`);
        messageControl.addTaskMember(t_id, u_ids);
        res.json({ msg: `新增${key}成功` })
    }).catch(err => {
        console.log(err);
        return res.json(ERR.TASK_UPDATE_FAILD);
    });
})
module.exports = router;