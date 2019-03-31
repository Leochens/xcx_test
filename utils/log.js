
function log(method,url,req){
    console.log("请求: ["+method+"] "+url+" \n req:");
    
    console.log(req.params,req.body);
    console.log(typeof req.body)
}
const logPrint = function(req,res,next){
    log(req.method,req.url,req);
    next();
};

module.exports = logPrint