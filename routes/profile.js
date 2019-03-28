const express = require('express')
const router = express.Router();
const checkSession = require('../utils/checkSession');
const ERR = require('../config/error');


router.put('/profile/:u_id', (req, res) => {
    // const u_id = req.body.id
    // checkSession()
    const u_id = req.param('u_id');
    const userInfo = req.body.userInfo;
    console.log("/profile 请求参数", req.body, req.param('u_id'));
    User.updateUserById(u_id, userInfo).then(function (flag) {
        if (flag) {
            return res.json({
                id: u_id,
                ...userInfo
            });
        } else {
            res.statusCode = 500;
            res.json(ERR.USER_UPDATE_PROFILE_FAILD);
        }
    }).catch(function (err) {
        console.log(err);
        res.statusCode = 500;
        res.json(ERR.USER_UPDATE_PROFILE_FAILD);
    })
})


module.exports = router;