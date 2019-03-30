
/**
 * -----------------1 user相关 ---------------
 * 10001    用户未登录
 * 10002    用户登录失败
 * 10003    用户新增失败
 * 10004    用户资料更新失败
 * 10005    获得用户数据失败
 * 10006    用户会话身份认证失败
 * 10007    用户退出任务流失败
 * 10008    获得tf所有成员失败
 * -----------------2 task_flow相关 ---------------
 * 20002    新增tf失败
 * 20003    更新tf失败
 * 20004    删除tf失败
 * 20005    查询tf失败
 * 20006    邀请新成员失败
 * -----------------3 task相关 ---------------
 * 30001    根据tf_id查询task失败
 * 30002    根据t_id查询task失败
 * 30003    新增task失败
 * 30004    更新task失败
 * 30005    删除task失败
 * 
 * 
 * 
 * -----------------9 其他 ---------------
 * 90001    操作非法,须是leader
 * 90002    操作非法,须是管理员
 * 90003    未知的请求地址
 * 90004    缺少必要参数
 */

const ERR = {
    USER_NOT_LOGIN: {
        errCode: 10001,
        errMsg: '用户未登录'
    },
    USER_LOGIN_FAILD: {
        errCode: 10002,
        errMsg: '用户登录失败'
    },
    USER_IN_INSERT_FAILD: {
        errCode: 10003,
        errMsg: '用户新增失败'
    },
    USER_UPDATE_PROFILE_FAILD: {
        errCode: 10004,
        errMsg: '用户资料更新失败'
    },
    GET_USER_PROFILE_FAILD: {
        errCode: 10005,
        errMsg: '获得用户数据失败'
    },
    USER_AUTH_FAILD: {
        errCode: 10006,
        errMsg: '用户会话身份认证失败'
    },
    USER_QUIT_TF_FAILD: {
        errCode: 10007,
        errMsg: '用户退出任务流失败'
    },
    GET_ALL_TF_USERS_FAILD:{
        errCode: 10008,
        errMsg: '获得tf所有成员失败'
    },

    TF_INSERT_FAILD: {
        errCode: 20002,
        errMsg: '新增tf失败'
    },
    TF_UPDATE_FAILD: {
        errCode: 20003,
        errMsg: '更新tf失败'
    },
    TF_DELETE_FAILD: {
        errCode: 20004,
        errMsg: '删除tf失败'
    },
    TF_QUERY_FAILD: {
        errCode: 20005,
        errMsg: '查询tf失败'
    },
    TF_INVITE_MEMBER_FAILD:{
        errCode:20006,
        errMsg: '邀请新成员失败'
    },


    TASK_QUERY_BY_TF_ID_FAILD: {
        errCode: 30001,
        errMsg: '根据tf_id查询task失败'
    },
    TASK_QUERY_BY_T_ID_FAILD: {
        errCode: 30002,
        errMsg: '根据t_id查询task失败'
    },
    TASK_INSERT_FAILD: {
        errCode: 30003,
        errMsg: '新增task失败'
    },
    TASK_UPDATE_FAILD: {
        errCode: 30004,
        errMsg: '更新task失败'
    },
    TASK_DELETE_FAILD: {
        errCode: 30005,
        errMsg: '删除task失败'
    },






    REQUIRE_LEADER: {
        errCode: 90001,
        errMsg: '操作非法,须是leader'
    },
    REQUIRE_ADMIN: {
        errCode: 90002,
        errMsg: '操作非法,须是管理员'
    },
    UNKNOWN_REQUEST_URL: {
        errCode: 90003,
        errMsg: '未知的请求地址'
    },
    MISSING_ARGUMENT: {
        errCode: 90004,
        errMsg: '缺少必要参数'
    }

}


module.exports = ERR;