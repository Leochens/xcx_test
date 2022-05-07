let DB = {
  host: 'localhost',
  user: 'root',
  password: '659332zhl',
  port: 3306,
  database: 'xcx_task_flow',
  multipleStatements: true,
  charset: 'utf8mb4'
}

if (process.env.NODE_ENV == 'development') {
  DB = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: 3306,
    database: 'xcx_task_flow',
    multipleStatements: true,
    charset: 'utf8mb4'
  }
}

if (process.env.NODE_ENV == 'production') {
  console.log("生产环境")
  DB = {
    host: 'localhost',
    user: 'root',
    port: 3306,
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