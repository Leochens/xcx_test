const express = require('express')
const router = express.Router();
const checkSession = require('../utils/checkSession');
const taskFlow = require('../modules/taskFlow');

const url = '/users/:u_id/task_flow/';

router.post(url, function (req, res) {
    // checkSession(req).then()
    const tf = JSON.parse(req.body.tf);
    const u_id = req.params.u_id;
    console.log('tf=>',tf,' u_id=>',u_id);
    taskFlow.addTaskFlow(u_id, tf).then(function (tf_id) {
        res.json({ msg: "插入成功", id: tf_id, tf: { ...tf, tf_id } });
    }).catch(function(err){
        console.log("插入新tf失败",err)
        res.json({
            msg:"插入失败"
        })
    })
})

router.get(url,function(req,res){
    const u_id = req.params.u_id;
    taskFlow.getTaskFlowsByUserId(u_id).then(function(list){
        res.json({
            msg:"获取成功",
            data: list
        });
    }).catch(function(err){
        console.log(err);
        res.json({
            msg:'获取失败'
        })
    })
})

module.exports = router;