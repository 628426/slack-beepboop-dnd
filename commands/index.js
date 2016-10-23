'use strict'

function wireupCommand(slapp, keyword, cmd) {

    slapp.command('/' + keyword, /.*/, (msg, text) => {
        let say = function (text) {
            try {
                msg.say(text)
            }
            catch (e) {
                msg.say(':sob: Exception::' + e.toString())
            }
        }
        try {
            cmd(keyword, msg, text, say);
        }
        catch (e) {
            say(':sob: Exception::' + e.toString())
        }
    })

    slapp.message(keyword, ['direct_mention', 'direct_message', 'mention'], (msg, text) => {
        let say = function (t) {
            try {
                msg.respond(t)
            }
            catch (e) {
                msg.say(':sob: Exception::' + e.toString())
            }
        }
        try {
            cmd(keyword, msg, text, say)

        }
        catch (e) {
            say(':sob: Exception:' + e.toString())
        }

    })


}

// list out explicitly to control order
module.exports = (slapp) => {

    wireupCommand(slapp, 'roll', require('./roll'))
    wireupCommand(slapp, 'setdm', require('./setDm'))

}
