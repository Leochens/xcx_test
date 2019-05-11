const express = require('express')
const router = express.Router();
const checkSession = require('../utils/checkSession');
const TaskFlows = require('../modules/taskFlow');
const ERR = require('../config/error');;
const url = '/categories';

router.put(url, function (req, res) {
    const { u_id, tf_id, category } = req.body;
    // 更新user_taskflow表的category字段
    TaskFlows.updateTaskFlowCategory(u_id, tf_id, category).then(r => {
        res.json({
            msg: '更新分类成功'
        });
    }).catch(err => {
        console.log(err);
        res.json(ERR.TF_UPDATE_CATEGORY_FAILD)
    });
});



module.exports = router;