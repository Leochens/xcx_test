
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
 * 20007    改变分类失败
 * 
 * -----------------3 task相关 ---------------
 * 30001    根据tf_id查询task失败
 * 30002    根据t_id查询task失败
 * 30003    新增task失败
 * 30004    更新task失败
 * 30005    删除task失败
 * 30006    获取task任务人失败
 * 30007    添加task任务人失败
 * 30008    获得任务人状态失败
 * 30009    申请请假失败
 * 30010    同意请假失败
 * 30011    拒绝请假失败
 * 30012    根据u_id查询task失败
 * 
 * -----------------4 comment相关 ---------------
 * 40001    评论失败
 * 
 * -----------------5 message相关 ---------------
 * 50001    拉取消息失败
 * 50002    添加新消息失败
 * 50003    消息设为已读失败
 * 
 * -----------------6 image相关 ---------------
 * 60001    上传图片失败
 * 60002    获取图片失败
 * 
 * -----------------9 其他 ---------------
 * 90001    操作非法,须是leader
 * 90002    操作非法,须是管理员
 * 90003    未知的请求地址
 * 90004    缺少必要参数
 * 90005    获得数据失败
 * 90006    获得审核列表失败
 * 90007    获得日志失败
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
    GET_ALL_TF_USERS_FAILD: {
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
    TF_INVITE_MEMBER_FAILD: {
        errCode: 20006,
        errMsg: '邀请新成员失败'
    },
    TF_UPDATE_CATEGORY_FAILD: {
        errCode: 20007,
        errMsg: '改变分类失败'
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
    GET_TASK_MEMBER_FAILD: {
        errCode: 30006,
        errMsg: '获取task任务人失败'
    },
    ADD_TASK_MEMBER_FAILD: {
        errCode: 30007,
        errMsg: '添加task任务人失败'
    },
    GET_TASK_MEMBER_STATUS_FAILD: {
        errCode: 30008,
        errMsg: '获得任务人状态失败'
    },
    APPLY_BREAK_FAILD: {
        errCode: 30009,
        errMsg: '申请请假失败'
    },
    ALLOW_BREAK_FAILD: {
        errCode: 30010,
        errMsg: '同意请假失败'
    },
    REFUSE_BREAK_FAILD: {
        errCode: 30011,
        errMsg: '拒绝请假失败'
    },
    COMPLETE_TASK_FAILD: {
        errCode: 30012,
        errMsg: '完成任务失败'
    },
    TASK_QUERY_BY_U_ID_FAILD:{
        errCode: 30013,
        errMsg: '根据u_id查询task失败'
    },






    COMMENT_FAILD: {
        errCode: 40001,
        errMsg: '评论失败'
    },



    GET_MESSAGE_FAILD: {
        errCode: 50001,
        errMsg: '拉取消息失败'
    },
    ADD_NEW_MESSAGE_FAILD: {
        errCode: 50002,
        errMsg: '添加新消息失败'
    },
    SET_MESSAGE_READ_FAULD: {
        errCode: 50003,
        errMsg: '消息设为已读失败'
    },


    ADD_IMAGE_FAILD: {
        errCode: 60001,
        errMsg: '上传图片失败'
    },
    GET_IMAGE_FAILD: {
        errCode: 60002,
        errMsg: '获取图片失败'
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
    },
    GET_DATA_FAILD: {
        errCode: 90005,
        errMsg: '获得数据失败'
    },
    GET_REVIEW_LIST_FAIL: {
        errCode: 90006,
        errMsg: '获得审核列表失败'
    },
    GET_LOGS_FAIL: {
        errCode: 90007,
        errMsg: '获得日志失败'
    }

}


module.exports = ERR;