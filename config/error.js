
/**
 * -----------------1 user相关 ---------------
 * 10001    用户未登录
 * 10002    用户登录失败
 * 10003    用户新增失败
 * 10004    用户资料更新失败
 * 10005    获得用户数据失败
 * -----------------2 task_flow相关 ---------------
 * 20002    新增tf失败
 * 20003    更新tf失败
 * 20004    删除tf失败
 * 20005    查询tf失败
 * 
 * -----------------3 task相关 ---------------
 * 
 * 
 * 
 * 
 * 
 * -----------------9 其他 ---------------
 * 90001    操作非法,须是leader
 * 90002    操作非法,须是管理员
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


    REQUIRE_LEADER: {
        errCode: 90001,
        errMsg: '操作非法,须是leader'
    },
    REQUIRE_ADMIN: {
        errCode: 90002,
        errMsg: '操作非法,须是管理员'
    }

}


module.exports = ERR;