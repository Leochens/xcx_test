const express = require('express')
const router = express.Router();
const checkSession = require('../utils/checkSession');
const ERR = require('../config/error');
const User = require('../modules/user');

router.put('/profile/:u_id', (req, res) => {
    // const u_id = req.body.id
    // checkSession()
    const u_id = req.params.u_id;
    const userInfo = req.body.userInfo;
    console.log("/profile 请求参数", req.body, u_id);
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

router.put('/profile/:u_id/nick_name', function (req, res) {
    const u_id = req.params.u_id;
    const nickName = req.body.nickName;
    if (!nickName) return ERR.MISSING_ARGUMENT;

    User.updateUserByField(u_id, 'nick_name', nickName).then(r => res.json(r)).catch(err => {
        console.log(err);
        res.json(ERR.USER_UPDATE_PROFILE_FAILD)
    });
})

module.exports = router;