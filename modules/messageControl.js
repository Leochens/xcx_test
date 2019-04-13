const Task = require('./task');
const TaskFlow = require('./taskFlow');
const User = require('./user');
const Message = require('./message');
const Comment = require('./comment');
const Image = require('./image');



const add = function (msg) {
    Message.addMessage(msg).then(res => {
        console.log("新增msg成功", msg);
    }).catch(err => {
        console.log("新增msg失败", msg,err);
    });
}
const addMultiple = function (msg,u_ids) {
    Message.addMessageToUsers(msg,u_ids).then(res => {
        console.log("新增msg成功", msg);
    }).catch(err => {
        console.log("新增msg失败", msg,err);
    });
}
// 负责人创建了一个新的任务流
function createNewTaskFlow(tf,u_id) {
    const msg = {
        content: `您创建了任务流${tf.tf_name},截止日期为:${tf.end_time}`,
        to_user_id: u_id
    }
    add(msg);
}

// 成员新加入一个任务流
function joinInNewTaskFlow(tf_id,u_id) {
    TaskFlow.getTaskFlowByTFId(tf_id).then(_tf => {
        console.log("in joinInNewTaskFlow tf = ",_tf)
        const tf = _tf[0];
        const msg = {
            content: `您新加入了任务流:${tf.tf_name},截止日期为:${tf.end_time}`,
            to_user_id: u_id
        }

        add(msg);
    }).catch(err => {
        console.log("消息函数>joinInNewTaskFlow 查询指定任务流失败",err);
    })
}

// 创建一个新的子任务 需要给任务人发通知
function createNewTask(t_id,u_ids){
    Task.getTaskById(t_id).then(task=>{
        TaskFlow.getTaskFlowByTFId(tf_id).then(tf=>{
            // console.log(task)
            const msg = {
                content:`你有一个新的任务需要完成:${task[0].t_name},截止日期为:${task[0].end_time},所属任务流:${tf.tf_name}`
            }
            addMultiple(msg,u_ids);
        }).catch(err => {
            console.log("消息函数>createNewTask 查询指定任务流失败",err);
        })
    }).catch(err=>{
        console.log(err);
    })
}

// 完成一个子任务 给子任务人和负责人发消息
function completeTask(t_id,u_ids){

}


// 任务流完成了 给全部人员发消息
function completeTaskFlow(tf_id){

    const msg = {
        content:"任务流... 已完成"
    }

}

// 任务流延期 给全部人员发消息
function taskFlowChange(tf_id,oldTf,newTf){
    User.getUsersByTFId(tf_id).then(users=>{
        const u_ids = users.map(user=>user.id);
        console.log("u_ids=>",Array.from(u_ids));
        const leader = users.filter(user=>user.id === newTf.leader_id)[0];
        const msg = {
            content:`任务流:${oldTf.tf_name}已经被负责人${leader.nick_name}更改,新的任务流名:${newTf.tf_name},简介为:${newTf.tf_describe},截止时间是:${newTf.end_time}.`
        };
        addMultiple(msg,Array.from(u_ids));
    }).catch(err=>{
        console.log(err);
    });


}


// 任务人请假的消息 给负责人发
function memberTakeBreak(t_id,brk){

}
// 请假成功 给请假人发
function takeBreakSuccess(t_id,brk){
    
}

// 请假失败 给请假人发
function taskBreakFailed(){

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


