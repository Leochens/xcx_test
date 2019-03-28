
function wrapError(errMsg,errCode) {
    
    return {
        errCode,
        errMsg
    }
}

module.exports = wrapError;