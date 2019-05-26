var schedule = require('node-schedule');
const mc = require('./modules/messageControl');
const formatTime = require('./utils/formatTime')
function scheduleCronstyle() {
    // 在每一分钟的第一秒执行
    schedule.scheduleJob('30 * * * * *', function () {
        console.log('schedule:' +formatTime(new Date()));
        mc.taskDelay();
    });
}
module.exports = scheduleCronstyle;

