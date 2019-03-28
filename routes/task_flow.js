const express = require('express')
const router = express.Router();
const checkSession = require('../utils/checkSession');
const taskFlow = require('../modules/taskFlow');
const ERR = require('../config/error');

const url = '/users/:u_id/task_flow/';




/**
 * 新增一个tf
 * u_id 新的tf
 * 返回新的tf的id
 */
router.post(url, function (req, res) {
    // checkSession(req).then()
    const tf = JSON.parse(req.body.tf);
    const u_id = req.params.u_id;
    console.log('tf=>',tf,' u_id=>',u_id);
    taskFlow.addTaskFlow(u_id, tf).then(function (tf_id) {
        res.json({ msg: "插入成功", id: tf_id, tf: { ...tf, id:tf_id } });
    }).catch(function(err){
        console.log("插入新tf失败",err)
        res.json(ERR.TF_INSERT_FAILD);
    })
})

/**
 * 修改一个tf 
 * u_id tf_id 新的tf
 */
router.put(url,function(req,res){
    const u_id = req.params.u_id;
    const {tf_id,tf} = req.body;
    const _tf = JSON.parse(tf);
    taskFlow.updateTaskFlow(tf_id,_tf).then(function(flag){
        console.log(flag);
        res.json({
            errMsg: '更新成功',
            tf:_tf
        })
    }).catch(function(err){
        console.log(err);
        res.json(ERR.TF_UPDATE_FAILD);
       
    })
});

/**
 * 获取u_id对应的tfs
 * 返回一个tf组成的列表
 */
router.get(url,function(req,res){
    const u_id = req.params.u_id;
    taskFlow.getTaskFlowsByUserId(u_id).then(function(list){
        res.json({
            msg:"获取成功",
            data: list
        });
    }).catch(function(err){
        console.log(err);
        res.json(ERR.TF_QUERY_FAILD);
    })
})

/**
 * 删除一个tf
 * tf_id
 * 返回flag true|false
 */

router.delete(url,function(req,res){
    const u_id = req.params.u_id;
    const tf_id = req.body.tf_id;
    if(!u_id || !tf_id){return res.json({errMsg:"缺少参数tf_id"})};


    taskFlow.deleteTaskFlow(u_id,tf_id).then(function(flag){
        console.log(flag);

        return res.json({
            msg:flag.affectedRows?"删除成功":"删除失败,tf_id:"+tf_id+"不存在"
        })
    }).catch(function(err){
        console.log(err);
        return res.json(ERR.TF_DELETE_FAILD)
    })
})
module.exports = router;