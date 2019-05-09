const express = require('express')
const router = express.Router();
const checkSession = require('../utils/checkSession');
const TaskFlow = require('../modules/taskFlow');
const Task = require('../modules/task');
const ERR = require('../config/error');

const url = '/search/:u_id/:keyword';



/**
 * 搜索任务流或者子任务
 */
router.get(url, function (req, res) {
    const u_id = req.params.u_id;
    const keyword = req.params.keyword;
    TaskFlow.search(u_id, keyword).then(function (tf_list) {
        Task.search(u_id, keyword).then(function (t_list) {
            res.json({
                msg: "获取成功",
                data: {
                    task_flows: tf_list,
                    tasks: t_list
                }
            });
        }).catch(function (err) {
            console.log(err);
            res.json(ERR.TF_QUERY_FAILD)
        });
    }).catch(function (err) {
        console.log(err);
        res.json(ERR.TF_QUERY_FAILD);
    })
})



module.exports = router;