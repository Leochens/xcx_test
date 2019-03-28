const express = require('express')
const app = express()
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const authRouter  = require('./routes/auth');
const dataRouter = require('./routes/data');
const log = require('./utils/log');


app.use(jsonParser);
app.use(bodyParser.urlencoded({ extended: false }));  
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

app.listen(8899, () => console.log('Example app listening on port 8899!'))
