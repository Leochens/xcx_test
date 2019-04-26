const express = require('express')
const router = express.Router();
const formId = require('../modules/formId');
const checkSession = require('../utils/checkSession');

router.post('/formid',function(req,res){
    const formid = req.body.formid;
    const u_id = req.body.u_id;
    formId.addFormId(formid,u_id);
    res.json("ok");
});

module.exports = router;