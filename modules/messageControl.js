const Task = require('./task');
const TaskFlow = require('./taskFlow');
const User = require('./user');
const Message = require('./message');
const Comment = require('./comment');
const Image = require('./image');
const formId = require('./formId');
const request = require('request');
const { APP } = require('../config/config');
const formatTime = require('../utils/formatTime');
const timeWithoutSecond = require('../utils/timeWithoutSecond');
const TEMPLATE = {
    START_TASK_FLOW: '2yp1OS5xu86ZF0OKi2UtbGuyFaYu8hw_nmzZtuBN1qs',
    START_TASK: 'XK5o2IztgPCHQricUusQXIGYHCTmGH3ExgB9UxCgTBs',
    APPLY_TASK_BREAK: '31tTAhlJVGIDnKl_26dgPdQ9F7VqdFVgW3vHA8Gq3sM',
    TASK_BREAK_RESULT: "S2Qln3AkKzwmij_KCQuCCPdGATFMOWeVVL4BnSAGpRQ",
    COMPLETE_TASK: "Rz-yCqQKcjYqUD8m521GVu2I1xyjxnhW3hctG-B2pkI",
    DELETE_TASK: "asPRDvAnPM_XjfXSA6gOOnfLzVll4xkY3mqTyV2gZnQ"
}


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

const sendMessage = function (touser, template_id, form_id, data, _page) {
    const page = _page || "pages/index/index";
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
                "touser": touser,
                "template_id": template_id,
                "page": page,
                "form_id": form_id,
                "data": data,
                "emphasis_keyword": "keyword1.DATA"
            }
        }, callback);
    }).catch(err => {
        console.log(err);
    })
}


const dataWrap = function (data) {
    const res = {};
    if (!Array.isArray(data)) return res;

    data.forEach((d, index) => {
        const key = "keyword" + (index + 1);
        res[key] = {
            "value": d
        };
    })
    return res;
}
// 发送模板消息
const sendTemplateMsg = function (u_id, template_id, data, leader_id) {
    formId.getOne(u_id).then(fid => {
        User.getUserInfoById(u_id).then(user => {
            const u = user[0];
            const leaderIndex = data.indexOf("leader"); // 查看是否要写负责人的名字
            if (leaderIndex != -1) {
                User.getUserInfoById(leader_id).then(([leader]) => {
                    data[leaderIndex] = leader.nick_name; // 昵称替换
                    const d = dataWrap(data);
                    sendMessage(u.openid, template_id, fid, d);
                }).catch(err => console.log(err));
            } else {
                const d = dataWrap(data);
                sendMessage(u.openid, template_id, fid, d);
            }
        }).catch(err => { console.log(err) });
    }).catch(err => {
        console.log("发送模板消息失败", err)
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
const toSingle = function (u_id, msg, templateMsg) {
    msg.u_id = u_id;
    msg.to_user_id = u_id;
    if (templateMsg) templateMsg(u_id);
    add(msg);
}

const toLeader = function (tf_id, msg, templateMsg) {
    TaskFlow.getTaskFlowByTFId(tf_id).then(tf => {
        const leader_id = tf[0].leader_id;
        toSingle(leader_id, msg);
        templateMsg && templateMsg(leader_id); // 发送指定模板消息
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
const toTaskMembers = function (t_id, msg, templateMsg) {
    Task.getStatusMapByTId(t_id).then(res => {
        const u_ids = res.map(sm => sm.u_id);

        if (templateMsg) {
            for (u_id in u_ids) {
                templateMsg(u_id);
            }
        }

        addMultiple(msg, u_ids);
    }).catch(e => console.log(e));
}

// 给新加进来的子任务成员发消息
const toNewTaskMembers = function (t_id, u_ids, msg, templateMsg) {
    if (templateMsg) {
        for (u_id in u_ids) {
            templateMsg(u_id);
        }
    }
    addMultiple(msg, u_ids);
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
    const msg = {
        content: `您创建了任务流${tf.tf_name}`,
        to_user_id: u_id,
        tf_id: tf.id
    }
    const template_id = TEMPLATE.START_TASK_FLOW; // 任务接收通知
    sendTemplateMsg(u_id, template_id, [tf.tf_name, "leader", tf.tf_describe, formatTime(new Date(tf.end_time))], tf.leader_id);
    add(msg);
}
function addTaskMember(t_id, u_ids) {
    Task.getTaskById(t_id).then(([task]) => {
        const msg = {
            content: `你有一个新的任务需要完成:${task.t_name}`,
            t_id: t_id,
            tf_id: task.tf_id
        }
        const template_id = TEMPLATE.START_TASK; // 工作任务通知
        console.log("新增成员发消息")
        toNewTaskMembers(t_id, u_ids, msg, function (u_id) {
            sendTemplateMsg(u_id, template_id, [task.t_name, task.t_describe, formatTime(new Date(task.begin_time)), formatTime(new Date())]);
        });
    }).catch(err => console.log(err));
}

// 成员新加入一个任务流
function joinInNewTaskFlow(tf_id, u_id) {
    TaskFlow.getTaskFlowByTFId(tf_id).then(_tf => {

        const tf = _tf[0];
        const msg = {
            content: `您新加入了任务流:${tf.tf_name}`,
            to_user_id: u_id,
            tf_id: tf_id
        }
        const template_id = TEMPLATE.START_TASK_FLOW; // 任务接收通知

        sendTemplateMsg(u_id, template_id, [tf.tf_name, "leader", tf.tf_describe, formatTime(new Date(tf.end_time))], tf.leader_id);
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
            const template_id = TEMPLATE.START_TASK; // 工作任务通知
            for (u_id of u_ids) {
                sendTemplateMsg(u_id, template_id, [task.t_name, task.t_describe, formatTime(new Date(task.begin_time)), formatTime(new Date(task.end_time))]);
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
        const template_id = TEMPLATE.COMPLETE_TASK
        toLeader(task.tf_id, msg, function (u_id) {
            sendTemplateMsg(u_id, template_id, [task.t_name, task.t_describe, formatTime(new Date(task.begin_time)), formatTime(new Date())]);
        });
        toTaskMembers(t_id, msg, function (u_id) {
            sendTemplateMsg(u_id, template_id, [task.t_name, task.t_describe, formatTime(new Date(task.begin_time)), formatTime(new Date())]);
        });

    }).catch(err => {
        console.log("消息函数>createNewTask 查询指定任务流失败", err);
    })
}
// 任务流完成了 给全部人员发消息
function completeTaskFlow(tf_id) {
    TaskFlow.getTaskFlowByTFId(tf_id).then(([task_flow]) => {
        if (!task_flow) return;

        const msg = {
            content: `任务流 ${task_flow.tf_name} 已提前完成`,
            tf_id
        }
        toAll(tf_id, msg);
    }).catch(err => console.log(err));
}

// 任务流修改 给全部人员发消息
function taskFlowChange(tf_id, oldTf, newTf) {

    const contents = [];
    if (oldTf.tf_name != newTf.tf_name) {
        const content = `${newTf.tf_name} : 任务流名称由 ${oldTf.tf_name} 改为 ${newTf.tf_name}`;
        contents.push(content)
    }
    if (oldTf.tf_describe != newTf.tf_describe) {
        const content = `${newTf.tf_name} : 任务流简介被修改为 ${newTf.tf_describe}`;
        contents.push(content)
    }
    const oet = timeWithoutSecond(oldTf.end_time);
    const net = timeWithoutSecond(newTf.end_time);
    if (oet != net) {
        const content = `${newTf.tf_name} : 任务流截止日期由${formatTime(new Date(oet))} 被修改为 ${formatTime(new Date(net))}`;
        contents.push(content)
    }
    if (!contents.length) return; // 没有改变 不发消息

    for (let content of contents) {
        const msg = {
            content: content,
            tf_id: tf_id
        };
        toAll(tf_id, msg);
    }
}


// 任务人请假的消息 给负责人发
function memberTakeBreak(tf_id, t_id, brk) {
    const { u_id, break_reason } = brk;
    TaskFlow.getTaskFlowByTFId(tf_id).then(([task_flow]) => {
        if (!task_flow) return;
        const leader_id = task_flow.leader_id;
        User.getUserInfoById(u_id).then(([user]) => {
            if (!user) return;
            const { nick_name } = user;
            Task.getTaskById(t_id).then(([task]) => {
                if (!task) return;
                const leader_msg = {
                    content: `${nick_name} 申请请假:${break_reason}`,
                    to_user_id: leader_id,
                    tf_id: tf_id,
                    t_id: t_id
                }
                const msg = {
                    content: `请假已申请:${break_reason}`,
                    tf_id: tf_id,
                    t_id: t_id
                }
                const template_id = TEMPLATE.APPLY_TASK_BREAK;
                toLeader(tf_id, leader_msg, function (leader_id) {
                    sendTemplateMsg(leader_id, template_id, [user.nick_name, break_reason, `${task_flow.tf_name}[${task.t_name}]`]);
                });

                toSingle(u_id, msg);// 给自己发一个请假消息
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));

}
// 请假成功 给请假人发
function takeBreakSuccess(t_id, apply_u_id) {
    const template_id = TEMPLATE.TASK_BREAK_RESULT;
    Task.getTaskById(t_id).then(([task]) => {
        if (!task) return console.log("task为空 在messageControl => taksBresak...")
        const tf_id = task.tf_id;
        TaskFlow.getTaskFlowByTFId(tf_id).then(([task_flow]) => {
            User.getUserInfoById(apply_u_id).then(([user]) => {
                if (!user) return;
                const msg = {
                    content: `请假成功`,
                    t_id: t_id,
                    tf_id: tf_id
                }
                toSingle(apply_u_id, msg, function (apply_u_id) {
                    sendTemplateMsg(apply_u_id, template_id, [user.nick_name, `${task_flow.tf_name}[${task.t_name}] 请假成功`]);
                });
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));

    }).catch(err => console.log(err));

}

// 请假失败 给请假人发
function taskBreakFailed(t_id, apply_u_id, refuse_reason) {
    const template_id = TEMPLATE.TASK_BREAK_RESULT;
    Task.getTaskById(t_id).then(([task]) => {
        if (!task) return console.log("task为空 在messageControl => taksBresak...")
        const tf_id = task.tf_id;
        TaskFlow.getTaskFlowByTFId(tf_id).then(([task_flow]) => {
            User.getUserInfoById(apply_u_id).then(([user]) => {
                if (!user) return;
                const msg = {
                    content: `子任务[${task.t_name}] 请假失败,拒绝原因:${refuse_reason}`,
                    t_id: t_id,
                    tf_id: tf_id
                }

                toSingle(apply_u_id, msg, function (apply_u_id) {
                    sendTemplateMsg(apply_u_id, template_id, [user.nick_name, `${task_flow.tf_name}[${task.t_name}] 请假失败:${refuse_reason}`]);
                });
            }).catch(err => console.log(err))
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));

}
// 成员退出
function memberQuit(tf_id, u_id) {
    User.getUserInfoById(u_id).then(([user]) => {
        if (!user) return;
        const msg = {
            content: `成员 ${user.nick_name} 已退出任务流`,
            tf_id
        }
        toLeader(tf_id, msg);
    }).catch(err => console.log(err));
}

// 剔除成员
function tickMember(tf_id, u_id) {
    User.getUserInfoById(u_id).then(([user]) => {
        if (!user) return;
        const msg = {
            content: `成员 ${user.nick_name} 已被移出任务流`,
            tf_id
        }
        toAll(tf_id, msg);
    }).catch(err => console.log(err));
}
// 任务流解散
function taskFlowBreak(tf_name, u_ids) {
    if (!tf_name || !Array.isArray(u_ids)) return console.log("缺少tf_name或u_ids");
    const msg = {
        content: `任务流 ${tf_name} 已解散`
    }
    addMultiple(msg, u_ids);
}

function taskFlowLeaderTransfer(tf_id, nick_name) {
    const msg = {
        content: `负责人更改为:${nick_name}`,
        tf_id: tf_id
    }
    toAll(tf_id, msg);
}
// 删除子任务
function deleteTask(t_id) {

    return new Promise(function (resolve, reject) {
        Task.getTaskById(t_id).then(([task]) => {
            const t_name = task.t_name;
            TaskFlow.getTaskFlowByTFId(task.tf_id).then(([tf]) => {
                const tf_name = tf.tf_name;
                const msg = {
                    content: `子任务${t_name}已被删除`,
                    tf_id: task.tf_id
                }
                const template_id = TEMPLATE.DELETE_TASK;
                toTaskMembers(t_id, msg, function (apply_u_id) {
                    sendTemplateMsg(apply_u_id, template_id, [t_name, `所属任务流:${tf_name}`]);
                });
                return resolve(true);
            }).catch(err => { reject(err) });
        }).catch(err => { reject(err) });
    })
}

module.exports = {
    memberQuit,
    tickMember,
    taskFlowBreak,
    createNewTaskFlow,
    completeTask,
    completeTaskFlow,
    createNewTask,
    takeBreakSuccess,
    taskBreakFailed,
    memberTakeBreak,
    taskFlowChange,
    joinInNewTaskFlow,
    taskFlowLeaderTransfer,
    addTaskMember,
    deleteTask
}


