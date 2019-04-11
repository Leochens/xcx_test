
const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    const _date = [year, month, day].map(formatNumber).join('-');
    const time = [hour, minute,second].map(formatNumber).join(':');
    const res = _date + ' ' + time;
    return res;
}


module.exports =  formatTime;