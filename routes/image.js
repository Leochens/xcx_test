const express = require('express')
const router = express.Router();
const checkSession = require('../utils/checkSession');
const Image = require('../modules/image');
const ERR = require('../config/error');
const url = '/images';
router.post(url, function (req, res) {
    const img = req.body.img;
    if (!img) return res.json(ERR.MISSING_ARGUMENT);
    Image.addImage(img).then(flag => {
        return res.json({
            msg: "上传图片成功"
        });
    }).catch(err => {
        console.log(err);
        return res.json(ERR.ADD_IMAGE_FAILD);
    })

});

module.exports = router;