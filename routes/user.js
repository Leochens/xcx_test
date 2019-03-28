const express = require('express')
const router = express.Router();
const checkSession = require('../utils/checkSession');

router.get('/users', function (req, res) {
    const SID = req.headers['cookie'];
    console.log(SID);
    return checkSession(req).then(function(_res){
        res.json(
            {
                data: [
                    {
                        id: 1,
                        nickName: 'Ryan'
                    }
                ],
                user:_res
            }
        );
    }).catch(function(err){
        res.statusCode = 401;
        console.log(err);
        console.log("认证失败")
        res.json({
            errMsg: '认证失败'
        })
    });

})


module.exports = router;