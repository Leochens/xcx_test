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
  // START_TASK_FLOW: '2yp1OS5xu86ZF0OKi2UtbGuyFaYu8hw_nmzZtuBN1qs',
  START_TASK: 'oP8oGbTFBqhYPecPO62sa03GyO3_19a7yxN1IXBKQhg', // ok
  APPLY_TASK_BREAK: 'mRSr8zsEEd-mRSr8zsEEd-D0Wnd2BIsGdtreCXgVDRT7yHbDYLQjII',  // 请假审批通知
  TASK_BREAK_RESULT: "SFWfDtnCZ-bU5-j1silDcVmRoQMiJ4MVU6ZlwVB4SKg",   // 请假结果通知
  COMPLETE_TASK: "JrE4NelWNRaPIEChIDjH6j1a7ij0i1CxbFqDlm7Jgl0",  // 任务完成通知
  DELETE_TASK: "olaaGLavpd7xQpYysCXHTrw8zZ0q8ANo3zCVbve7_YE", // 任务删除通知
  BREAK_TASK_FLOW: 'G_W9SVewiu8Wqp6p9MjJ4ZcQsqTPEI0JcBY-AW_coXs', // 任务流解散
  TICK_MEMBER: 'PQhfXh-qORbynjVX_TI7J274FOYp0tIgUmDK4DLypSs', // 踢出成员
  MEMBER_QUIT: '41NlG5_G1JyacW7sL7CpxiJHqjePqKWYMXQ6keMKPAs', // 成员退出
  TASK_DELAY: 'kpwhzCj2FMXgIc5-AzpsvGI9vCfojk45TJQiu0UI1bk' // 任务逾期提醒
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
    function callback (error, response, data) {
      if (!error && response.statusCode == 200) {
        return resolve(data.access_token);
      }
      return reject(error);
    }
    request(options, callback);
  })
}

const sendMessage = function (touser, template_id, data, _page) {
  const page = _page || "pages/index/index";
  getToken().then(token => {
    // const url = `https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=${token}`;
    const url = `https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=${token}`;
    function callback (error, response, data) {
      if (!error && response.statusCode == 200) {
        console.log("模板消息成功=>", data);
      }
    }
    request({
      url: url,
      method: "POST",
      json: true,
      body: {
        "touser": touser,
        "template_id": template_id,
        "page": page,
        // "form_id": form_id,
        "lang": "zh_CN",
        "data": data,
        // "emphasis_keyword": noBigText ? '' : "keyword1.DATA"
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
const sendTemplateMsg = function (u_id, template_id, data, page) {

  console.log('要发送的模板消息', data);
  User.getUserInfoById(u_id).then(user => {
    const u = user;
    // const isLeader = data.leader; // 查看是否要写负责人的名字
    // if (isLeader != -1) {
    //   User.getUserInfoById(leader_id).then((leader) => {
    //     data[leaderIndex] = leader.nick_name; // 昵称替换
    //     const d = dataWrap(data);
    //     sendMessage(u.openid, template_id, d, page);
    //   }).catch(err => console.log(err));
    // } else {
    // const d = dataWrap(data);
    sendMessage(u.openid, template_id, data, page);
    // }
  }).catch(err => { console.log(err) });

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
    const leader_id = tf.leader_id;
    toSingle(leader_id, msg);
    templateMsg && templateMsg(leader_id); // 发送指定模板消息
  }).catch(e => console.log(e));
}

const toLeaderByTid = function (t_id, msg) {
  Task.getTaskById(t_id).then(task => {
    const t = task;
    const tf_id = t.tf_id;
    toLeader(tf_id, msg);
  })
}
// 这里有问题 发不了模板消息
// 给子任务的成员发消息
const toTaskMembers = function (t_id, msg, templateMsg) {
  Task.getStatusMapByTId(t_id).then(res => {
    const u_ids = res.map(sm => sm.u_id);
    console.log("toTaskMembers", u_ids)
    if (templateMsg) {
      for (u_id of u_ids) {
        templateMsg(u_id);
      }
    }

    addMultiple(msg, u_ids);
  }).catch(e => console.log(e));
}

// 给新加进来的子任务成员发消息
const toNewTaskMembers = function (t_id, u_ids, msg, templateMsg) {
  if (templateMsg) {
    for (u_id of u_ids) {
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
function createNewTaskFlow (tf, u_id) {
  const msg = {
    content: `您创建了任务流 [${tf.tf_name}]`,
    to_user_id: u_id,
    tf_id: tf.id
  }
  // const template_id = TEMPLATE.START_TASK_FLOW; // 任务接收通知
  // sendTemplateMsg(u_id, template_id, [tf.tf_name, "leader", tf.tf_describe, formatTime(new Date(tf.end_time))], tf.leader_id);
  add(msg);
}
function addTaskMember (t_id, u_ids) {
  Task.getTaskById(t_id).then((task) => {
    const msg = {
      content: `你有一个新的子任务需要完成 [${task.t_name}]`,
      t_id: t_id,
      tf_id: task.tf_id
    }
    const template_id = TEMPLATE.START_TASK; // 工作任务通知
    toNewTaskMembers(t_id, u_ids, msg, function (u_id) {
      sendTemplateMsg(u_id, template_id,
        {
          thing1: { value: task.t_name },
          thing5: { value: task.t_describe },
          time12: { value: formatTime(new Date(task.begin_time)) },
          time14: { value: formatTime(new Date()) },
        }
        // [task.t_name, task.t_describe, formatTime(new Date(task.begin_time)), formatTime(new Date())]
      );
    });
  }).catch(err => console.log(err));
}

// 成员新加入一个任务流
function joinInNewTaskFlow (tf_id, u_id) {
  TaskFlow.getTaskFlowByTFId(tf_id).then(_tf => {

    const tf = _tf;
    const msg = {
      content: `您新加入了任务流 [${tf.tf_name}]`,
      to_user_id: u_id,
      tf_id: tf_id
    }
    // const template_id = TEMPLATE.START_TASK_FLOW; // 任务接收通知

    // sendTemplateMsg(u_id, template_id, [tf.tf_name, "leader", tf.tf_describe, formatTime(new Date(tf.end_time))], tf.leader_id);
    add(msg);
  }).catch(err => {
    console.log("消息函数>joinInNewTaskFlow 查询指定任务流失败", err);
  })
}

// 创建一个新的子任务 需要给任务人发通知
function createNewTask (t_id, u_ids) {
  Task.getTaskById(t_id).then(t => {
    const task = t.dataValues;
    TaskFlow.getTaskFlowByTFId(task.tf_id).then(tf => {
      const msg = {
        content: `你有一个新的子任务需要完成 [${task.t_name}]`,
        t_id: t_id,
        tf_id: task.tf_id
      }
      const template_id = TEMPLATE.START_TASK; // 工作任务通知
      for (u_id of u_ids) {
        console.log('u_id', u_id);
        console.log('task', task);

        sendTemplateMsg(u_id, template_id,
          {
            thing1: { value: task.t_name },
            thing5: { value: task.t_describe },
            time12: { value: formatTime(new Date(task.begin_time)) },
            time14: { value: formatTime(new Date()) },
          }

          // [task.t_name, task.t_describe, formatTime(new Date(task.begin_time)), formatTime(new Date(task.end_time))]
        );
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
function completeTask (t_id) {
  Task.getTaskById(t_id).then(t => {
    const task = t;
    const msg = {
      content: `子任务 [${task.t_name}] 已完成`,
      t_id: task.id,
      tf_id: task.tf_id
    }
    const template_id = TEMPLATE.COMPLETE_TASK
    toTaskMembers(t_id, msg, function (u_id) {
      sendTemplateMsg(u_id, template_id,
        {
          thing1: { value: task.t_name },
          thing2: { value: task.t_describe },
          time7: { value: formatTime(new Date(task.begin_time)) },
          date4: { value: formatTime(new Date()) }
        }
        // [task.t_name, task.t_describe, formatTime(new Date(task.begin_time)), formatTime(new Date())]
      );
    });

  }).catch(err => {
    console.log("消息函数>createNewTask 查询指定任务流失败", err);
  })
}
// 任务流完成了 给全部人员发消息
function completeTaskFlow (tf_id) {
  TaskFlow.getTaskFlowByTFId(tf_id).then((task_flow) => {
    if (!task_flow) return;

    const msg = {
      content: `任务流 [${task_flow.tf_name}] 已提前完成`,
      tf_id
    }
    toAll(tf_id, msg);
  }).catch(err => console.log(err));
}

// 任务流修改 给全部人员发消息
function taskFlowChange (tf_id, oldTf, newTf) {

  const contents = [];
  if (oldTf.tf_name != newTf.tf_name) {
    const content = `${newTf.tf_name} : 任务流名称由 [${oldTf.tf_name}] 改为 [${newTf.tf_name}]`;
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
function memberTakeBreak (tf_id, t_id, brk) {
  const { u_id, break_reason } = brk;
  TaskFlow.getTaskFlowByTFId(tf_id).then((task_flow) => {
    if (!task_flow) return;
    const leader_id = task_flow.leader_id;
    User.getUserInfoById(u_id).then((user) => {
      if (!user) return;
      const { nick_name } = user;
      Task.getTaskById(t_id).then((task) => {
        if (!task) return;
        const leader_msg = {
          content: `[${nick_name}] 申请请假: ${break_reason}`,
          to_user_id: leader_id,
          tf_id: tf_id,
          t_id: t_id
        }
        const msg = {
          content: `请假已申请: ${break_reason}`,
          tf_id: tf_id,
          t_id: t_id
        }
        const template_id = TEMPLATE.APPLY_TASK_BREAK;
        toLeader(tf_id, leader_msg, function (leader_id) {
          sendTemplateMsg(leader_id, template_id,
            {
              thing1: { value: user.nick_name },
              thing6: { value: break_reason },
              thing9: { value: `所属任务流[${task_flow.tf_name}]\n所属子任务[${task.t_name}]` }
            }
            // [user.nick_name, break_reason, `所属任务流[${task_flow.tf_name}]\n所属子任务[${task.t_name}]`]
          );
        });

        toSingle(u_id, msg);// 给自己发一个请假消息
      }).catch(err => console.log(err));
    }).catch(err => console.log(err));
  }).catch(err => console.log(err));

}
// 请假成功 给请假人发
function takeBreakSuccess (t_id, apply_u_id) {
  const template_id = TEMPLATE.TASK_BREAK_RESULT;
  Task.getTaskById(t_id).then((task) => {
    if (!task) return console.log("task为空 在messageControl => taksBresak...")
    const tf_id = task.tf_id;
    TaskFlow.getTaskFlowByTFId(tf_id).then((task_flow) => {
      User.getUserInfoById(apply_u_id).then((user) => {
        if (!user) return;
        const msg = {
          content: `您的请假已成功`,
          t_id: t_id,
          tf_id: tf_id
        }
        toSingle(apply_u_id, msg, function (apply_u_id) {
          sendTemplateMsg(apply_u_id, template_id,
            {
              thing1: { value: user.nick_name },
              phrase3: { value: `同意` },
              thing4: { value: `[${task_flow.tf_name}]-[${task.t_name}]` }
            }
            // [user.nick_name, `所属任务流[${task_flow.tf_name}]\n所属子任务[${task.t_name}]`], null, null, true
          );
        });
      }).catch(err => console.log(err));
    }).catch(err => console.log(err));

  }).catch(err => console.log(err));

}

// 请假失败 给请假人发
function taskBreakFailed (t_id, apply_u_id, refuse_reason) {
  const template_id = TEMPLATE.TASK_BREAK_RESULT;
  Task.getTaskById(t_id).then((task) => {
    if (!task) return console.log("task为空 在messageControl => taksBresak...")
    const tf_id = task.tf_id;
    TaskFlow.getTaskFlowByTFId(tf_id).then((task_flow) => {
      User.getUserInfoById(apply_u_id).then((user) => {
        if (!user) return;
        const msg = {
          content: `子任务[${task.t_name}] 请假失败,拒绝原因:${refuse_reason}`,
          t_id: t_id,
          tf_id: tf_id
        }

        toSingle(apply_u_id, msg, function (apply_u_id) {
          sendTemplateMsg(apply_u_id, template_id,
            {

              thing1: { value: user.nick_name },
              phrase3: { value: `未批准` },
              thing4: { value: `原因:${refuse_reason}` }

            }
            // [user.nick_name, `任务流[${task_flow.tf_name}][${task.t_name}] 请假失败:${refuse_reason}`], null, null, true
          );
        });
      }).catch(err => console.log(err))
    }).catch(err => console.log(err));
  }).catch(err => console.log(err));

}
// 成员退出
function memberQuit (tf_id, u_id) {
  User.getUserInfoById(u_id).then((user) => {
    if (!user) return;
    const msg = {
      content: `成员 [${user.nick_name}] 已退出任务流`,
      tf_id
    }
    TaskFlow.getTaskFlowByTFId(tf_id).then((task_flow) => {
      if (!task_flow) return console.log("error: memberQuit task_flow为空");
      const template_id = TEMPLATE.MEMBER_QUIT;
      toLeader(tf_id, msg, function (u_id) {
        sendTemplateMsg(u_id, template_id, {
          name3: { value: user.nick_name },
          thing2: { value: '成员已退出任务流' },
          thing6: { value: `所属任务流[${task_flow.tf_name}] ${formatTime(new Date())}` }
        }
          // , [user.nick_name, formatTime(new Date()), `所属任务流[${task_flow.tf_name}]`], null, null, true
        );
      });
    }).catch(err => console.log(err));
  }).catch(err => console.log(err));
}

// 剔除成员
function tickMember (tf_id, u_id) {
  User.getUserInfoById(u_id).then((user) => {
    if (!user) return;
    const msg = {
      content: `成员 [${user.nick_name}] 已被移出任务流`,
      tf_id
    }
    toAll(tf_id, msg);
  }).catch(err => console.log(err));
}

function tickMe (tf_id, u_id) {
  TaskFlow.getTaskFlowByTFId(tf_id).then((task_flow) => {
    if (!task_flow) return console.log("error: tickMe  task_flow为空");
    const msg = {
      content: `你已被移出任务流 [${task_flow.tf_name}]`
    }
    // 移除的模板消息
    const template_id = TEMPLATE.TICK_MEMBER;
    toSingle(u_id, msg, function (u_id) {
      sendTemplateMsg(u_id, template_id,
        {
          thing5: { value: `您已被移出任务流[${task_flow.tf_name}]` },
          date4: { value: formatTime(new Date()) }
        }
        // [`您已被移出任务流[${task_flow.tf_name}]`, formatTime(new Date())], null, null, true
      );
    });
  }).catch(err => console.log(err));

}
// 任务流解散
function taskFlowBreak (tf_name, u_ids) {
  if (!tf_name || !Array.isArray(u_ids)) return console.log("缺少tf_name或u_ids");
  const msg = {
    content: `任务流 [${tf_name}] 已解散`
  }
  const template_id = TEMPLATE.BREAK_TASK_FLOW;
  for (u_id of u_ids) {
    sendTemplateMsg(u_id, template_id,
      {
        thing1: { value: tf_name },
        thing2: { value: `负责人已解散该任务流,您的任务流列表中该任务流已消失` }
      },
      // [tf_name, '负责人已解散该任务流,您的任务流列表中该任务流已消失', formatTime(new Date())]
    );
  }

  addMultiple(msg, u_ids);
}

function taskFlowLeaderTransfer (tf_id, nick_name) {
  const msg = {
    content: `负责人更改为:[${nick_name}]`,
    tf_id: tf_id
  }
  toAll(tf_id, msg);
}
// 删除子任务
function deleteTask (t_id) {

  return new Promise(function (resolve, reject) {
    Task.getTaskById(t_id).then((task) => {
      const t_name = task.t_name;
      TaskFlow.getTaskFlowByTFId(task.tf_id).then((tf) => {
        const tf_name = tf.tf_name;
        const msg = {
          content: `子任务[${t_name}]已被删除`,
          tf_id: task.tf_id
        }
        const template_id = TEMPLATE.DELETE_TASK;
        toTaskMembers(t_id, msg, function (apply_u_id) {
          sendTemplateMsg(apply_u_id, template_id,
            {
              thing1: { value: `${t_name} | 所属任务流:[${tf_name}]` },
              time3: { value: formatTime(new Date()) }
            }
            // [t_name, `所属任务流:[${tf_name}]`]
          );
        });
        return resolve(true);
      }).catch(err => { reject(err) });
    }).catch(err => { reject(err) });
  })
}

// 任务逾期提醒
function taskDelay () {
  // 找出所有子任务将在3小时内逾期的
  const hour = 3;
  Task.getBeingDelayTasks(hour).then(function (task_list) {
    // console.log(task_list);
    if (!task_list.length) return console.log("[逾期任务计划]未在此次轮询中检测到将要逾期任务"); // 当前无即将逾期的
    for (let task of task_list) {
      const t_id = task.id;
      const msg = {
        content: `子任务[${task.t_name}]即将在三小时后逾期,请尽快完成!`,
        t_id: t_id,
        tf_id: task.tf_id
      }
      console.log(`${hour}小时逾期提醒子任务[${task.t_name}]的所有成员`);
      const template_id = TEMPLATE.TASK_DELAY;
      const t_name = task.t_name;
      const t_describe = task.t_describe;
      toTaskMembers(t_id, msg, function (u_id) {
        sendTemplateMsg(u_id, template_id, {
          thing1: { value: `${t_name}:${t_describe}` },
          thing3: { value: `子任务[${t_name}]将在${hour}小时后逾期,请尽快完成！` }
        },
          // ['子任务即将逾期', `子任务[${t_name}]将在${hour}小时后逾期,请尽快完成！`, t_name, t_describe, formatTime(new Date())]
        );
      });
    }
    const t_ids = task_list.map(task => task.id);
    Task.updateTaskFieldByTids(t_ids, 'has_alert', true);

  }).catch(err => console.log(err));
  // 拿到这些t_id
  // 给该t_id每个任务人员发消息 发送过delay消息的task就不要再发了 设计一个字段
}

module.exports = {
  memberQuit,
  tickMember,
  tickMe,
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
  deleteTask,
  taskDelay
}


