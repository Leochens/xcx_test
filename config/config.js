let DB = {
  host: 'localhost',
  user: 'root',
  password: '659332zhl',
  database: 'xcx_task_flow',
  multipleStatements: true,
  charset: 'utf8mb4'
}

if (process.env.NODE_ENV == 'development') {
  DB = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'xcx_task_flow',
    multipleStatements: true,
    charset: 'utf8mb4'
  }
}

if (process.env.NODE_ENV == 'production') {
  DB = {
    host: 'localhost',
    user: 'root',
    port: 19277,
    password: '659332@ZHL',
    database: 'xcx_task_flow',
    multipleStatements: true,
    charset: 'utf8mb4'
  }
}


const APP = {
  appID: "wxf18a4b27a92c63bf",
  appSecret: "bb302760e45bf6b7072b4eee0c1b0c8d"
}


module.exports = {
  DB,
  APP
}