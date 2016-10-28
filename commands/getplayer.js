const v = require('./validation')

module.exports = function (keyword, msg, text, say) {
    let db = require('./db')(require('./persist')(msg._slapp.client, { token: msg.meta.app_token, schema: 'dnd' }))
    v.requiresParameters(msg, text, 'a players name, like, fug.  E.g. /setplayer fug hp 99', 1, say, function () {
        v.mustBeUser(msg, keyword, text, say, function () {

            db.getPlayer(text, function (err, player) {
                say(JSON.stringify(player, null, 4))
            })
        })
    })
}