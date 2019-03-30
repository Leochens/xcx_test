const express = require('express')
const router = express.Router();
const ERR = require('../config/error');
const checkSession = require('../utils/checkSession');
const Task = require('../modules/task');
const User = require('../modules/user');
const url = '/task_flows/:tf_id/tasks';


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
 * 得到一个tf的所有task
 */
router.get(url,function(req,res){
    const tf_id = req.params.tf_id;
    Task.getTasksByTfId(tf_id).then(list=>res.json(list)).catch(err=>{
        console.log(err);
        return res.json(ERR.TASK_QUERY_BY_TF_ID_FAILD);
    });
})
/**
 * 得到一条指定id的task的信息
 */
router.get(url+'/:t_id',function(req,res){
    const t_id = req.params.t_id;
    Task.getTaskById(t_id).then(task=>res.json(task)).catch(err=>{
        console.log(err);
        return res.json(ERR.TASK_QUERY_BY_T_ID_FAILD);
    })
})

/**
 * 为指定tf增加一个task
 * 返回t_id
 */
router.post(url,function(req,res){
    const task = req.body.task;
    const tf_id = req.params.tf_id;
    if(!task) return res.json(ERR.MISSING_ARGUMENT);
    Task.addTask(tf_id,task).then(t_id=>res.json(t_id)).catch(err=>{
        console.log(err);
        return res.json(ERR.TASK_INSERT_FAILD);
    })
})
/**
 * 全量更新一条task
 * 要做权限认证 
 */
router.put(url,function(req,res){
    const { t_id,u_id,task} = req.body;
    if(!t_id||!u_id||!task) return res.json(ERR.MISSING_ARGUMENT);
    Task.updateTask(t_id,task).then(flag=>res.json(flag)).catch(err=>{
        console.log(err);
        return res.json(ERR.TASK_UPDATE_FAILD);
    })
})



/**
 * 删除一条task
 * 要做权限认证
 */
router.delete(url,function(req,res){
    const { t_id,u_id} = req.body;
    if(!t_id||!u_id) return res.json(ERR.MISSING_ARGUMENT);
    Task.deleteTask(t_id).then(flag=>res.json(flag)).catch(err=>{
        console.log(err);
        return res.json(ERR.TASK_DELETE_FAILD);
    })
})



module.exports = router;