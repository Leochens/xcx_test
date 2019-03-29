const express = require('express')
const router = express.Router();
const checkSession = require('../utils/checkSession');
const TaskFlow = require('../modules/taskFlow');
const User = require('../modules/user');
const Task = require('../modules/task');
const ERR = require('../config/error');

const url = '/users/:u_id/task_flow/';



// 在这里做判断
router.delete(url, async function (req, res, next) {
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

    const _tf = JSON.parse(tf);
    TaskFlow.updateTaskFlow(tf_id, _tf).then(function (flag) {
        console.log(flag);
        res.json({
            errMsg: '更新成功',
            tf: _tf
        })
    }).catch(function (err) {
        console.log(err);
        res.json(ERR.TF_UPDATE_FAILD);

    })
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
router.get(url, async function (req, res) {
    const u_id = req.params.u_id;
    TaskFlow.getTaskFlowsByUserId(u_id).then( await function (list) {
        console.log("getTaskFlowsByUserId=>", list);;
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

router.delete(url, async function (req, res) {
    const u_id = req.params.u_id;
    const tf_id = req.body.tf_id;
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