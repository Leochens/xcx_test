const express = require('express')
const router = express.Router();

router.get('/users',function(req,res){
    console.log('cookie===>',req.cookies);
    res.json(
        {
           data:[
            {
                id:1,
                nickName: 'Ryan'
            }
           ]
        }
    );


})


module.exports = router;