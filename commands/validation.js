module.exports.mustBeUser = function (msg, user, say, cb) {
    var slapp = msg._slapp;
    slapp.client.users.list({ token: msg.meta.bot_token }, function (err, result) {
        if (err) {
            return say(`":sob: Sorry, ${err} occurred looking up user list`)
        } else {
            if (result.members.some((u) => {
                if (u.name == user) {
                    return true
                }
            })) {
                cb()
            } else {
                return say(`:sob: Sorry, I expected you to tell me a user where you said _${user}_ so I can't continue`)
            }
        }
    })
}

module.exports.mustBeDm = function (msg, command, say, cb) {
    let store = require('./persist')(msg._slapp.client, { token: msg.meta.app_token, schema: 'dnd' })
    store.get("DM", function (err, data) {
        let user = msg.body["user_name"]
        if (err) {
            return say(`":sob: Sorry, ${err} occurred`)
        }
        var dm = data

        if (dm && dm != user && user != "griswold" && user != "628426") {
            return say(`:sob: Sorry, @${dm} is currently the dm and is the only player allowed to user the /${command} command`)
        }
        return cb()
    })
}

module.exports.requiresParameters = function (msg, text, message, num, say, cb) {
    let valid = true;
    let tokens = null;
    if (text) {
        tokens = text.split(' ')
    } else {
        tokens = []
    }
    let validationMessage = ":sob: Sorry, I couldn't understand you,"
    if (num && num > 1) {
        valid = false
        validationMessage += num.toString() + ' required parameters are missing.'
    } else {
        valid = false
        validationMessage += ' a required parameter is missing.'
    }
    if (!valid && tokens.length < num) {
        validationMessage += '  Try ' + message
        say(validationMessage)
    } else {
        cb()
    }
}