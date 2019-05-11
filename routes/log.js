const express = require('express')
const router = express.Router();
const ERR = require('../config/error');
const Log = require('../modules/log');
const url = '/log/:type/:id';

router.get(url, function (req, res) {
    const type = req.params.type;
    const id = req.params.id;
    if (!type || !id) return res.json(ERR.MISSING_ARGUMENT)
    if (type === 'tf') {
        Log.getTaskFlowLogs(id).then(logs => res.json({ msg: "获取任务流log成功", data: logs })).catch(err => { console.log(err); res.json(ERR.GET_LOGS_FAIL) });
    } else if (type === 't') {
        Log.getTaskLogs(id).then(logs => res.json({ msg: "获取子任务log成功", data: logs })).catch(err => { console.log(err); res.json(ERR.GET_LOGS_FAIL) });
    } else return res.json(ERR.MISSING_ARGUMENT);
});



module.exports = router;