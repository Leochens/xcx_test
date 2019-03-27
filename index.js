const express = require('express')
const app = express()
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const authRouter  = require('./routes/auth');
const dataRouter = require('./routes/data');
const client = require('./redis');
const log = require('./utils/log');

const options = {
    client:client,
    "host": "127.0.0.1",
    "port": "6379",
    // "ttl": 60 * 60 * 24 * 30,   //Session的有效期为30天
    "ttl": 60*60,   //Session的有效期为1 hour
};
app.use(jsonParser);
app.use(bodyParser.urlencoded({ extended: false }));  
app.use(session({
    store: new RedisStore(options),
    secret: 'Leochens'
}));
app.use(cookieParser());

const logPrint = function(req,res,next){
    log(req.method,req.url);
    next();
};
app.get('*',logPrint);
app.post('*',logPrint);
app.use('/',authRouter);
app.use('/',dataRouter);

app.get('/', (req, res) => {  res.send('Hello World!') });
app.get('/fetch', (req, res, next) => {
    if (req.session.user) {
        const user = req.session.user;
        const name = user.name;
        res.send(`${name} 欢迎您`+req.sessionID);
    } else
        res.send('你还没有登录，先登录下再试试！');
})
app.listen(8899, () => console.log('Example app listening on port 8899!'))
