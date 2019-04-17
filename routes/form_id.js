const express = require('express')
const router = express.Router();
const formId = require('../modules/formId');
const checkSession = require('../utils/checkSession');

router.post('/formid',function(req,res){
    const formid = req.body.formid;
    formId.addFormId(formid).then(msg=>{
        res.json(msg);
    }).catch(err=>{
        res.json(err);
    });
});


router.get('/formid',function(req,res){

    formId.getOne().then(fid=>{
        // 此时得到formid
        
        res.json(fid);
    }).catch(err=>{
        res.json(err);
    })

});
module.exports = router;