const express = require('express')
const router = express.Router();

router.get('/users',function(req,res){
    console.log('header',req.headers['cookie']);


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