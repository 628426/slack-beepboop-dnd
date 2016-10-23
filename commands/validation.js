module.exports.mustBeDm = function(msg, next) {

}

module.exports.requiresParameters = function (msg, message, num) {
    
    let validationMessage = ":sob: Sorry I couldn't understand you,"
    if(num && num > 1) 
    {
        validationMessage += num.toString() + ' required parameters are missing.' 
    } else {
        validationMessage += ' a required parameter is missing.'
    }
    return validationMessage += '  Try ' + message
}