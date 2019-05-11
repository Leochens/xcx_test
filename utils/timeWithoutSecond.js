const formatTime = require('./formatTime');
const timeWithoutSecond = function (time) {
    // 2019-05-11T09:16:00.000Z
    const t = formatTime(new Date(time)); //2019-05-11 17:16:00
    const arr = t.split(':'); // ["2019-05-11 17", "16", "00"]
    arr.pop();// ["2019-05-11 17", "16"]
    const time_str = arr.join(':'); // "2019-05-11 17:16"
    return time_str;
}

module.exports = timeWithoutSecond;