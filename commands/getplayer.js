const v = require('./validation')

module.exports = function (keyword, msg, text, say) {
    let db = require('./db')(require('./persist')(msg._slapp.client, { token: msg.meta.app_token, schema: 'dnd' }))
    v.requiresParameters(msg, text, 'a players name, like, fug.  E.g. /setplayer fug hp 99', 1, say, function () {
        v.mustBeUser(msg, keyword, text.split(' ')[0], say, function () {

            db.getPlayer(text.split(' ')[0], function (err, player) {
                let args = text.split(' ')
                let output = player
                if(args.length > 1) {
                    let properties = args.slice(1)
                    for(var a in properties) {
                        let an = require('./normaliser.js').toNormalForm(properties[a])
                        output = output[an]
                    }
                }
                say(JSON.stringify(output, null, 4))
            })
        })
    })
}