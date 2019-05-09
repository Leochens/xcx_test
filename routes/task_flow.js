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

const url = '/users/:u_id/task_flows';



// 在这里做判断
router.delete(url + "/:tf_id", async function (req, res, next) {
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
})
router.put(url, async function (req, res, next) {
    const u_id = req.params.u_id;
    const { tf_id } = req.body;
    let noAuth = false;
    await User.checkRole(u_id, tf_id).catch(function (errMsg) {
        noAuth = true;
        return res.json(ERR.REQUIRE_LEADER);
    });
    if (noAuth) return;
    next();
})

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
        console.log(flag);

        return res.json({
            msg: flag.affectedRows ? "删除成功" : "删除失败,tf_id:" + tf_id + "不存在"
        })
    }).catch(function (err) {
        console.log(err);
        return res.json(ERR.TF_DELETE_FAILD)
    })
})



module.exports = router;