
function log(method,url,res){
    console.log("请求: ["+method+"] "+url+" \n res:",res);
}
const logPrint = function(req,res,next){
    log(req.method,req.url);
    next();
};

module.exports = logPrint