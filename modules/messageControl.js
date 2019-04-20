const Task = require('./task');
const TaskFlow = require('./taskFlow');
const User = require('./user');
const Message = require('./message');
const Comment = require('./comment');
const Image = require('./image');
const formId = require('./formId');
const request = require('request');
const { APP } = require('../config/config');

const getToken = function () {
    const appId = APP.appID;
    const secret = APP.appSecret;
    const token_url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${secret}`;
    var options = {
        headers: { "Connection": "close" },
        url: token_url,
        method: 'GET',
        json: true
    };

    return new Promise(function (resolve, reject) {
        function callback(error, response, data) {
            if (!error && response.statusCode == 200) {
                return resolve(data.access_token);
            }
            return reject(error);
        }
        request(options, callback);
    })
}

const sendMessage = function (touser, template_id, form_id, data) {
    getToken().then(token => {
        const url = `https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=${token}`;

        function callback(error, response, data) {
            if (!error && response.statusCode == 200) {
                console.log("模板消息成功=>", data);
            }
            console.log("模板消息失败=>", error)
        }
        request({
            url: url,
            method: "POST",
            json: true,
            body: {
                "touser": "okulZ5LTxceX9Oq_nQL4Nfg_wUDM",
                "template_id": "2yp1OS5xu86ZF0OKi2UtbKGdAXc1flIxkMBKZ8MKo1Y",
                "page": "index",
                "form_id": "723b624519744dc5b2aefc7be93d60f3",
                "data":data,
                "emphasis_keyword": "keyword1.DATA"
            }
        }, callback);
    }).catch(err => {
        console.log(err);
    })
}

const add = function (msg) {
    Message.addMessage(msg).then(res => {
        console.log("新增msg成功", msg);
    }).catch(err => {
        console.log("新增msg失败", msg, err);
    });
}
const addMultiple = function (msg, u_ids) {
    Message.addMessageToUsers(msg, u_ids).then(res => {
        console.log("新增msg成功", msg);
    }).catch(err => {
        console.log("新增msg失败", msg, err);
    });
}


// 给单个人发消息
const toSingle = function (u_id, msg) {
    msg.u_id = u_id;
    add(msg);
}

const toLeader = function (tf_id, msg) {
    TaskFlow.getTaskFlowByTFId(tf_id).then(tf => {
        const leader_id = tf;
        toSingle(leader_id, msg);
    }).catch(e => console.log(e));
}

const toLeaderByTid = function (t_id, msg) {
    Task.getTaskById(t_id).then(task => {
        const t = task[0];
        const tf_id = t.tf_id;
        toLeader(tf_id, msg);
    })
}

// 给子任务的成员发消息
const toTaskMembers = function (t_id, msg) {
    Task.getStatusMapByTId(t_id).then(res => {
        const u_ids = res.map(sm => sm.u_id);
        addMultiple(msg, u_ids);
    }).catch(e => console.log(e));
}

// 给全部人员发消息
const toAll = function (tf_id, msg) {
    User.getUsersByTFId(tf_id).then(users => {
        const u_ids = users.map(user => user.id);
        console.log("u_ids=>", Array.from(u_ids));
        // const leader = users.filter(user=>user.id === newTf.leader_id)[0];
        addMultiple(msg, Array.from(u_ids));
    }).catch(err => {
        console.log(err);
    });
}
// 负责人创建了一个新的任务流
function createNewTaskFlow(tf, u_id) {
    // const sendMessage = function (touser,template_id,form_id,data) {

    const msg = {
        content: `您创建了任务流${tf.tf_name}`,
        to_user_id: u_id,
        tf_id: tf.id
    }
    const template_id = '2yp1OS5xu86ZF0OKi2UtbGuyFaYu8hw_nmzZtuBN1qs';
    formId.getOne().then(fid => {
        User.getUserInfoById(u_id).then(user=>{
            sendMessage(u_id, template_id, fid, {
                "keyword1": {
                    "value": tf.tf_name
                },
                "keyword2": {
                    "value": user.nick_name
                },
                "keyword3": {
                    "value": tf.tf_describe
                },
                "keyword4": {
                    "value": tf.end_time
                },
            });
        }).catch(err=>{console.log(err)});
    }).catch(err => {
        console.log("发送模板消息失败", err)
    })
    add(msg);
}

// 成员新加入一个任务流
function joinInNewTaskFlow(tf_id, u_id) {
    TaskFlow.getTaskFlowByTFId(tf_id).then(_tf => {
        console.log("in joinInNewTaskFlow tf = ", _tf)
        const tf = _tf[0];
        const msg = {
            content: `您新加入了任务流:${tf.tf_name}`,
            to_user_id: u_id,
            tf_id: tf_id
        }
        add(msg);
    }).catch(err => {
        console.log("消息函数>joinInNewTaskFlow 查询指定任务流失败", err);
    })
}

// 创建一个新的子任务 需要给任务人发通知
function createNewTask(t_id, u_ids) {
    Task.getTaskById(t_id).then(t => {
        const task = t[0];
        TaskFlow.getTaskFlowByTFId(task.tf_id).then(tf => {
            const msg = {
                content: `你有一个新的任务需要完成:${task.t_name}`,
                t_id: t_id,
                tf_id: task.tf_id
            }
            addMultiple(msg, u_ids);
        }).catch(err => {
            console.log("消息函数>createNewTask 查询指定任务流失败", err);
        })
    }).catch(err => {
        console.log(err);
    })
}

// 完成一个子任务 给子任务人和负责人发消息
function completeTask(t_id) {
    Task.getTaskById(t_id).then(t => {
        const task = t[0];
        const msg = {
            content: `子任务:${task.t_name} 已完成`,
            t_id: task.id,
            tf_id: task.tf_id
        }

        toLeader(task.tf_id);
        toTaskMembers(t_id, msg);

    }).catch(err => {
        console.log("消息函数>createNewTask 查询指定任务流失败", err);
    })
}


// 任务流完成了 给全部人员发消息
function completeTaskFlow(tf_id) {

    const msg = {
        content: "任务流... 已完成"
    }

    toAll(tf_id, msg);
}
// 子任务完成了 给任务成员和负责人发消息

function completeTask(tf_id) {

    const msg = {
        content: "任务流... 已完成"
    }

    toAll(tf_id, msg);
}

// 任务流延期 给全部人员发消息
function taskFlowChange(tf_id, oldTf, newTf) {

    const msg = {
        content: `任务流:${oldTf.tf_name} 已经被更改,新的任务流名: ${newTf.tf_name}`,
        tf_id: tf_id
    };
    toAll(tf_id, msg);
}


// 任务人请假的消息 给负责人发
function memberTakeBreak(t_id, brk) {

}
// 请假成功 给请假人发
function takeBreakSuccess(t_id, brk) {

}

// 请假失败 给请假人发
function taskBreakFailed() {

}
module.exports = {
    createNewTaskFlow,
    completeTask,
    completeTaskFlow,
    createNewTask,
    takeBreakSuccess,
    taskBreakFailed,
    memberTakeBreak,
    taskFlowChange,
    joinInNewTaskFlow
}


