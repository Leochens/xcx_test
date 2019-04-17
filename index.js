const express = require('express')
const app = express()
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
app.use(jsonParser);
app.use(bodyParser.urlencoded({ extended: false }));  
app.use(cookieParser());


const auth = require('./routes/auth');
const profile = require('./routes/profile');
const task_flow = require('./routes/task_flow');
const task = require('./routes/task');
const user = require('./routes/user');
const comment = require('./routes/comment');
const image = require('./routes/image');
const message = require('./routes/message');
const form_id = require('./routes/form_id');

const log = require('./utils/log');
app.all('*',log);
// 路由集合
app.use('/',auth);
app.use('/',profile);
app.use('/',task_flow);
app.use('/',task);
app.use('/',user);
app.use('/',comment);
app.use('/',image);
app.use('/',message);
app.use('/',form_id);


app.get('/', (req, res) => {  res.send('Hello World!') });
app.listen(8899, () => console.log('后端启动成功 访问http://localhost:8899!'))
