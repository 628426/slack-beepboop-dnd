const v = require('./validation')
const store = require('beepboop-persist')()


module.exports = function (keyword, msg, text, say) {
    v.requiresParameters(msg, text, 'a players name, like, fug.  E.g. /setdm fug')

    store.get("DM", function (err, data) {
        let user = msg.body["user_name"]
        if (err) {
            return say(`":sob: Sorry, ${err} occurred`)
        }
        var dm = data || "griswold"

        if (dm != user && user != 'griswold') {
            return say(`:sob: Sorry, @${dm} is currently the dm and is the only player allowed to user the /setdm command`)
        }

        store.set("DM", text, function (err) {
            if (err) {
                return say(`:sob: Sorry, ${err} occurred`)
            }

            return say(`:smiling_imp: @${text} is now the dm, look out`)

        })
    })



}