const express = require('express')
const router = express.Router();
const checkSession = require('../utils/checkSession');
const Image = require('../modules/image');
const ERR = require('../config/error');
const request = require('request');
const smms = require('smms-cli')
const fs = require('fs');
const url = '/images';
router.post(url, function (req, res) {

    console.log('body=>', req.body);
    const file = req.files[0];

    const u_id = req.body.u_id;
    const t_id = req.body.t_id;
    if (!u_id || !t_id) return res.json(ERR.MISSING_ARGUMENT);

    smms.upload(file.path).then(json => {
        console.log("成功", json)
        const url = json.data.url;
        const id = json.data.hash;
        // 上传到数据库
        const img = {
            id,
            url,
            t_id,
            u_id 
        }
        console.log("img=>", img);
        Image.addImage(img).then(flag => {
            return res.json({
                msg: "上传图片成功",
                img
            });
        }).catch(err => {
            console.log(err);
            return res.json(ERR.ADD_IMAGE_FAILD);
        })

    }).catch(err => {
        console.log("失败", err.message);
        return res.json(ERR.ADD_IMAGE_FAILD);
    })


    fs.unlink(file.path, function (err) {
        if (err) {
            console.log("删除临时图片文件失败", err);
        } else {

            console.log("删除临时图片文件成功");
        }
    });

});

module.exports = router;