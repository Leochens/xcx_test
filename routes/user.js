const express = require('express')
const router = express.Router();
const checkSession = require('../utils/checkSession');
const ERR = require('../config/error');
const User = require('../modules/user');
/**
 * 获得任务流的成员信息
 */
const tf_url = '/task_flows/:tf_id/user'; // 获得tf的所有人员
const t_url = '/task/:t_id/user';   // 获得task的执行人员


router.get(tf_url, function (req, res) {
    const tf_id = req.params.tf_id;
    if (!tf_id) return res.json(ERR.MISSING_ARGUMENT);
    User.getUsersByTFId(tf_id).then(list=>res.json(list)).catch(err=>res.json(err))

});

router.get('/users', function (req, res) {
    const SID = req.headers['cookie'];
    console.log(SID);
    return checkSession(req).then(function (_res) {
        res.json(
            ''
        );
    }).catch(function (err) {
        res.statusCode = 401;
        console.log(err);
        console.log("认证失败")
        res.json(ERR.USER_AUTH_FAILD);
    });

})


module.exports = router;