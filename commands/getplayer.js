const v = require('./validation')

module.exports = function (msg, args, say) {
    let db = require('./db')(require('./persist')(msg._slapp.client, { token: msg.meta.app_token, schema: 'dnd' }))
    v.requiresParameters(msg, args.join(' '), 'a players name, like, fug.  E.g. /set player fug hp 99', 1, say, function () {
        v.mustBeUser(msg, args[0], say, function () {

            db.getPlayer(args[0], function (err, player) {
                let output = player
                if (args.length > 1) {
                    let properties = args.slice(1)
                    properties.forEach(function (a) {
                        let an = require('./normaliser.js').toNormalForm(a).toLowerCase()
                        output = output[an]
                    })
                }
                let newoutput = {

                }
                newoutput[args.join('.')] = output
                say(JSON.stringify(newoutput, null, 4))
            })
        })
    })
}