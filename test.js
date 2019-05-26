var schedule = require('node-schedule');

// function scheduleCronstyle(){
//     schedule.scheduleJob('* * * * * *', function(){
//         console.log('scheduleCronstyle:' + new Date());
//     }); 
// }

// scheduleCronstyle();

const mc = require('./modules/messageControl');
mc.taskDelay();