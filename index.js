const express = require('express')
const app = express()
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const multer = require('multer');
const scheduleCronstyle = require('./schedule')
const Models = require('./modules/dbs');
app.use(jsonParser);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(multer({ dest: './uploads/' }).array('image'));

const auth = require('./routes/auth');
const profile = require('./routes/profile');
const task_flow = require('./routes/task_flow');
const task = require('./routes/task');
const user = require('./routes/user');
const comment = require('./routes/comment');
const image = require('./routes/image');
const message = require('./routes/message');
const form_id = require('./routes/form_id');
const category = require('./routes/category');
const search = require('./routes/search');
const log = require('./routes/log');

const _log = require('./utils/log');
app.all('*', _log);
// 路由集合
app.use('/', auth);
app.use('/', profile);
app.use('/', task_flow);
app.use('/', task);
app.use('/', user);
app.use('/', comment);
app.use('/', image);
app.use('/', message);
app.use('/', form_id);
app.use('/', category);
app.use('/', search);
app.use('/', log);


async function initModel () {
  // 模型初始化
  for (let model in Models) {
    try {
      await Models[model].sync({
        alter: true,
        /*force: AppConfog.FORCE_SYNC_DATABASE*/
      })
      console.log(`${model}初始化成功!`)
    } catch (e) {
      console.log(e)
      console.log(`${model}初始化失败！`)
    }
  }

}

initModel();


app.get('/', (req, res) => { res.send('Hello World!') });
app.listen(8899, () => console.log('后端启动成功 访问http://localhost:8899!'))
scheduleCronstyle();