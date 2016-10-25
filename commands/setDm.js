const v = require('./validation')
const store = require('beepboop-persist')()


module.exports = function (keyword, msg, text, say) {
    v.requiresParameters(msg, text, 'a players name, like, fug.  E.g. /setdm fug', 1, say, function () {
        v.mustBeDm(msg, keyword, say, function () {
            v.mustBeUser(msg, keyword, text, say, function () {
                store.set("DM", text, function (err) {
                    if (err) {
                        return say(`:sob: Sorry, ${err} occurred`)
                    }
                    return say(`:smiling_imp: @${text} is now the dm, look out`)
                })

                require('./persist')(msg._slapp, {token: msg.meta.bot_token, schema:'dnd'}).set("DM", text, function (err, output) {
                    if (err) {
                        return say(`:sob: Sorry, ${err} occurred`)
                    }
                    return say(`:smiling_imp: @${output} is now the dm, look out`)
                })
            })
        })
    })
}