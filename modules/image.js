// const dbQuery = require('../utils/dbQuery');
const Image = require('./dbs/image');
const image = {};

image.getImagesByTId = function (t_id) {
  return Image.findAll({ where: { t_id: t_id } });
  // const sql = `select * from image where t_id = '${t_id}'`;
  // return new Promise((resolve, reject) => {
  //   return dbQuery(sql).then(res => resolve(res)).catch(err => reject(err));
  // })
}



image.addImage = function (img) {
  const { id, t_id, u_id, url } = img;
  return Image.upsert({
    id, t_id, u_id, url
  })
  // const sql = `replace into image values('${id}','${t_id}','${u_id}','${url}')`;
  // return new Promise((resolve, reject) => {
  //   return dbQuery(sql).then(res => resolve(res)).catch(err => reject(err));
  // })
}


module.exports = image;


