exports.signin = function(params, req, res){
    var username = params.username;
    var password = params.password;

    //查找用户信息，看是否满足登陆条件
    var user = findUser(username, password);
    if(user){
        //成功获取用户对象
        req.session.regenerate(function(){
            req.user = user;
            req.session.userId = user.id;
            req.session.save();  //保存一下修改后的Session

            res.redirect('/account');
        });  
    }
    else{
        //用户信息不符合，登陆失败
    }
}

exports.signout = function(req, res){
    req.clearCookie('connect.sid');
    req.user = null;

    req.session.regenerate(function(){
        //重新生成session之后后续的处理
        res.redirect('/signin');
    })
}

exports.persist = function(req, res, next){
    var userId = req.session.userId;

    //通过user id去数据库里面查找User对象
    var user = findUserById(userId);

    if(user){
        req.user = user;
        next();
    }
    else{
        //该用户不存在
    }
}