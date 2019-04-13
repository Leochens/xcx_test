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
        content: `您创建了任务流${tf.tf_name}`,
        to_user_id: u_id
    }
    add(msg);
}

// 成员新加入一个任务流
function joinInNewTaskFlow(tf_id,u_id) {
    TaskFlow.getTaskFlowByTFId(tf_id).then(tf => {
        console.log("in joinInNewTaskFlow tf = ",tf)
        const msg = {
            content: `您新加入了任务流${tf.tf_name}`,
            to_user_id: u_id
        }

        add(msg);
    }).catch(err => {
        console.log("查询指定任务流失败",err);
    })
}

// 创建一个新的子任务 需要给任务人发通知
function createNewTask(t_id,u_ids){
    Task.getTaskById(t_id).then(task=>{
        console.log(task)
        const msg = {
            content:`你有一个新的任务需要完成:${task[0].t_name}`
        }
        addMultiple(msg,u_ids);
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
function taskFlowDelay(tf_id){
    const msg = {
        content:"任务流... 已延期到...."
    }
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
    taskFlowDelay,
    joinInNewTaskFlow
}


