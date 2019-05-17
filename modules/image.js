const dbQuery = require('../utils/dbQuery');

const Image = {};

Image.getImagesByTId = function (t_id) {
    const sql = `select * from image where t_id = '${t_id}'`;
    return new Promise((resolve, reject) => {
        return dbQuery(sql).then(res => resolve(res)).catch(err => reject(err));
    })
}



Image.addImage = function (img) {
    const { id, t_id, u_id, url } = img;
    const sql = `replace into image values('${id}','${t_id}','${u_id}','${url}')`;
    return new Promise((resolve, reject) => {
        return dbQuery(sql).then(res => resolve(res)).catch(err => reject(err));
    })
}


module.exports = Image;


