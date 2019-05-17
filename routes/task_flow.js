const express = require('express')
const router = express.Router();
const checkSession = require('../utils/checkSession');
const TaskFlow = require('../modules/taskFlow');
const User = require('../modules/user');
const Task = require('../modules/task');
const Image = require('../modules/image');
const Comment = require('../modules/comment');
const ERR = require('../config/error');
const messageControl = require('../modules/messageControl');
const Log = require('../modules/log');
const url = '/users/:u_id/task_flows';
const formatTime = require('../utils/formatTime');
const timeWithoutSecond = require('../utils/timeWithoutSecond');


const deleteCheck = async function (req, res, next) {
    const u_id = req.params.u_id;
    const tf_id = req.params.tf_id;
    console.log("delete判断", u_id, tf_id);
    let noAuth = false;
    await User.checkRole(u_id, tf_id).catch(function (errMsg) {
        noAuth = true;
        return res.json(ERR.REQUIRE_LEADER);
    });
    if (noAuth) return;
    next();
}
const updateCheck = async function (req, res, next) {
    const u_id = req.params.u_id;
    const { tf_id } = req.body;
    let noAuth = false;
    await User.checkRole(u_id, tf_id).catch(function (errMsg) {
        noAuth = true;
        return res.json(ERR.REQUIRE_LEADER);
    });
    if (noAuth) return;
    next();
};

// 在这里做判断
router.delete(url + "/:tf_id/members/:delete_user_id", deleteCheck);
router.delete(url + "/break/:tf_id", deleteCheck); // 解散一个任务流

router.put(url, updateCheck)

/**
 * 新增一个tf
 * u_id 新的tf
 * 返回新的tf的id
 */
router.post(url, function (req, res) {
    // checkSession(req).then()
    const tf = JSON.parse(req.body.tf);
    const u_id = req.params.u_id;
    console.log('tf=>', tf, ' u_id=>', u_id);
    TaskFlow.addTaskFlow(u_id, tf).then(function (tf_id) {
        tf.id = tf_id;
        messageControl.createNewTaskFlow(tf, u_id); // 添加一条消息

        Log.logTaskFlow(tf_id, `任务流 ${tf.tf_name} 被创建`).catch(err => console.log(err)); // 写任务流日志

        res.json({ msg: "插入成功", id: tf_id, tf: { ...tf, id: tf_id } });
    }).catch(function (err) {
        console.log("插入新tf失败", err)
        res.json(ERR.TF_INSERT_FAILD);
    })
})

/**
 * 修改一个tf 
 * u_id tf_id 新的tf
 */
router.put(url, async function (req, res) {
    const u_id = req.params.u_id;
    const { tf_id, tf } = req.body;
    //查询是否有操作权限


    const newTf = JSON.parse(tf);

    TaskFlow.getTaskFlowByTFId(tf_id).then(([oldTf]) => {
        console.log(oldTf);

        TaskFlow.updateTaskFlow(tf_id, newTf).then(function (flag) {
            try {
                TaskFlow.updateTaskFlowCategory(u_id, tf_id, newTf.category);
                messageControl.taskFlowChange(tf_id, oldTf, newTf);
                if (oldTf.tf_name != newTf.tf_name) {
                    Log.logTaskFlow(tf_id, `任务流名称由 ${oldTf.tf_name} 改为 ${newTf.tf_name}`).catch(err => console.log(err));
                }
                if (oldTf.tf_describe != newTf.tf_describe) {
                    Log.logTaskFlow(tf_id, `任务流简介被修改为 ${newTf.tf_describe}`).catch(err => console.log(err));
                }
                const oet = timeWithoutSecond(oldTf.end_time);
                const net = timeWithoutSecond(newTf.end_time);
                if (oet != net) {
                    Log.logTaskFlow(tf_id, `任务流截止日期由${formatTime(new Date(oet))} 被修改 ${formatTime(new Date(net))}`).catch(err => console.log(err));
                }
                res.json({
                    errMsg: '更新成功',
                    tf: newTf
                })
            } catch (e) { console.log(e) }
        }).catch(function (err) {
            console.log(err);
        })

    }).catch(e => {
        console.log(e);
        res.json(ERR.TF_UPDATE_FAILD);
    });

});



/**
 * 更改是否允许成员邀请成员的状态
 */
router.put(url + '/:tf_id/invite', function (req, res) {
    const u_id = req.params.u_id;
    const tf_id = req.params.tf_id;
    const status = req.body.status;
    console.log(status);
    Log.logTaskFlow(tf_id, `负责人${status ? '允许' : '禁止'}成员邀请其他人加入任务流`).catch(err => console.log(err));
    TaskFlow.toggleInviteStatus(tf_id, status).then(r => res.json({ msg: "更新成功" })).catch(err => res.json(ERR.TF_UPDATE_FAILD));
})
router.put(url + '/:tf_id/transfer', function (req, res) {
    const u_id = req.params.u_id;
    const tf_id = req.params.tf_id;
    const new_leader_id = req.body.new_leader_id;

    console.log("新的负责人id", new_leader_id);
    User.getUserInfoById(new_leader_id).then(([user]) => {
        if (!user) res.json(ERR.TF_UPDATE_FAILD);
        TaskFlow.transferLeader(tf_id, u_id, new_leader_id).then(r => {
            Log.logTaskFlow(tf_id, `负责人更改为${user.nick_name}`).catch(err => console.log(err));
            messageControl.taskFlowLeaderTransfer(tf_id, user.nick_name);
            res.json({
                msg: "负责人更改成功"
            })
        }).catch(err => console.log(err));
    }).catch(err => {
        console.log(err);
        res.json(ERR.TF_UPDATE_FAILD);
    })
})
/**
 * 提前结束任务流
 * 子任务不能做了
 */
router.put(url + '/:tf_id/finish', function (req, res) {

    const tf_id = req.params.tf_id;
    TaskFlow.updateTaskFlowField(tf_id, 'is_completed', 1).then(r => {
        messageControl.completeTaskFlow(tf_id); // 发提前完成的消息
        res.json({ msg: "结束任务流成功" });
    }).catch(err => res.json(ERR.FINISH_TF_FAILD))
})
/**
 * 获取u_id对应的tfs
 * 返回一个tf组成的列表
 * u_id :{
 *      tf_id: {
 *          t_id,
 *          t_id,
 *          t_id,
 *          ...
 *      },
 *      ....
 * }
 */
router.get(url, function (req, res) {
    const u_id = req.params.u_id;
    TaskFlow.getTaskFlowsByUserId(u_id).then(async function (list) {
        for (const item of list) { // 只有这种方法可以阻塞的获得tasks
            const tf_id = item.id;
            const tasks = await Task.getTasksByTfId(tf_id);
            item.tasks = tasks;
            for (let t of item.tasks) {
                const t_id = t.id;
                t.members = await User.getUsersByTId(t_id);
                t.comments = await Comment.getCommentByTId(t_id);
                t.status_map = await Task.getStatusMapByTId(t_id);
                t.images = await Image.getImagesByTId(t_id);
            }
            item.members = await User.getUsersByTFId(tf_id);

            item.taskStatus = {
                all: tasks.length,
                complete: tasks.filter(t => t.is_completed === 1).length
            }

        }
        res.json({
            msg: "获取成功",
            data: list
        });
    }).catch(function (err) {
        console.log(err);
        res.json(ERR.TF_QUERY_FAILD);
    })
})
// 数据简便化
router.get(url + "/simple", function (req, res) {
    const u_id = req.params.u_id;
    TaskFlow.getTaskFlowsByUserId(u_id).then(async function (list) {
        for (const item of list) { // 只有这种方法可以阻塞的获得tasks
            const tf_id = item.id;
            tasks = await Task.getTasksByTfId(tf_id) || [];
            item.members = await User.getUsersByTFId(tf_id) || [];
            item.taskStatus = {
                all: tasks.length,
                complete: tasks.filter(t => t.is_completed === 1).length
            }
        }
        res.json({
            msg: "获取成功",
            data: list
        });
    }).catch(function (err) {
        console.log(err);
        res.json(ERR.TF_QUERY_FAILD);
    })
})

/**
 * 删除一个tf
 * tf_id
 * 返回flag true|false
 */

router.delete(url + '/:tf_id', async function (req, res) {
    const u_id = req.params.u_id;
    const tf_id = req.params.tf_id;

    if (!u_id || !tf_id) { return res.json(ERR.MISSING_ARGUMENT) };

    TaskFlow.deleteTaskFlow(u_id, tf_id).then(function (flag) {
        Task.deleteTaskMember(tf_id, u_id).then(r => { // 删除一个任务流时 要把他的子任务中的该成员也删掉 注意在task页面会有bug
            messageControl.memberQuit(tf_id, u_id); // 发成员退出通知
            return res.json({
                msg: flag.affectedRows ? "删除成功" : "删除失败,tf_id:" + tf_id + "不存在"
            })
        }).catch(err => { console.log(err); return res.json(ERR.TF_DELETE_FAILD) })

    }).catch(function (err) {
        console.log(err);
        return res.json(ERR.TF_DELETE_FAILD)
    })
})

/**
 * 剔除一个成员
 */
router.delete(url + '/:tf_id/members/:delete_user_id', async function (req, res) {
    const u_id = req.params.u_id;
    const tf_id = req.params.tf_id;
    const delete_user_id = req.params.delete_user_id;
    if (!u_id || !tf_id || !delete_user_id) { return res.json(ERR.MISSING_ARGUMENT) };
    // TODO:给被踢的人发消息 同时记录日志

    TaskFlow.deleteTaskFlow(delete_user_id, tf_id).then(function (flag) {
        Task.deleteTaskMember(tf_id, delete_user_id).then(r => { // 删除一个任务流时 要把他的子任务中的该成员也删掉 注意在task页面会有bug
            messageControl.tickMember(tf_id, delete_user_id); // 发剔除通知
            return res.json({
                msg: flag.affectedRows ? "删除成功" : "删除失败,tf_id:" + tf_id + "不存在"
            })
        }).catch(err => { console.log(err); return res.json(ERR.TF_DELETE_FAILD) })

    }).catch(function (err) {
        console.log(err);
        return res.json(ERR.TF_DELETE_FAILD)
    })
})

router.delete(url + "/break/:tf_id", function (req, res) { // 假删除还是彻底删除呢?
    const u_id = req.params.u_id;
    const tf_id = req.params.tf_id;
    messageControl.taskFlowBreak(tf_id); // 发解散通知
    TaskFlow.breakTaskFlow(tf_id).then(r => {
        res.json({ msg: "解散任务流成功", data: r });
    }).catch(err => { console.log(err); res.json(ERR.BREAK_TF_FAILD) })
}); // 解散一个任务流


// 获得任务流的统计数据
const task_flow_data = '/users/:u_id/task_flows/:tf_id/data';
router.get(task_flow_data, function (req, res) {
    const tf_id = req.params.tf_id;
    const u_id = req.params.u_id;
    TaskFlow.checkUser(tf_id, u_id).then(r => {
        if (!r.length) return res.json({ msg: "您不是该任务流的成员,无权获得数据" });
        // 获取数据
        TaskFlow.getTaskFlowByTFId(tf_id).then(async function ([task_flow]) {
            try {
                const tasks = await Task.getTasksByTfId(tf_id);
                const task_ids = tasks.map(task => task.id);
                const tf_members = await User.getUsersByTFId(tf_id);
                const tf_members_ids = tf_members.map(m => m.id);
                const members = [];
                for (let uid of tf_members_ids) { // 获得人员的状态
                    const status = await TaskFlow.getAllMemberTaskStatus(uid, task_ids);
                    if (!status.length) continue;
                    members.push({
                        nick_name: status[0].nick_name,
                        all: status.length,
                        break: status.filter(st => st.user_status === 0).length,
                        completed: status.filter(st => st.user_status === 2).length
                    })
                }
                let images = [];
                let comments = [];
                for (let t of tasks) {
                    const t_id = t.id;
                    t.images = await Image.getImagesByTId(t_id);
                    t.comments = await Comment.getCommentByTId(t_id);
                    if (t.images && t.images.length) {
                        images = images.concat(t.images);
                    }
                    if (t.comments && t.comments.length) {
                        comments = comments.concat(t.comments);
                    }
                }
                const data = {
                    tf_name: task_flow.tf_name,
                    tf_describe: task_flow.tf_describe,
                    members_count: tf_members.length,
                    images: images,
                    task_flow: {
                        all: tasks.length,
                        completed: tasks.filter(t => t.is_completed === 1).length,
                        delay: tasks.filter(t => t.is_completed === 2).length,
                        continues: tasks.filter(t => t.is_completed === 0).length
                    },
                    comments: comments,
                    members: members,
                    tasks: []
                }
                res.json({
                    msg: "获得任务流统计数据成功",
                    data: data
                });
            } catch (e) { console.log(e); res.json({ errMsg: "获得任务流统计数据失败" }) }

        })

    }).catch(err => {
        console.log(err);
        return res.json({ errMsg: "获得任务流统计数据失败" })
    })
})

module.exports = router;