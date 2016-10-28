const v = require('./validation')

module.exports = function (keyword, msg, text, say) {
    let args = text.split(' ')

    let db = require('./db')(require('./persist')(msg._slapp.client, { token: msg.meta.app_token, schema: 'dnd' }))

    v.requiresParameters(msg, text, 'a players name, like, fug.  E.g. /setplayer fug hp 99', 1, say, function () {
        v.mustBeDm(msg, keyword, say, function () {
            v.mustBeUser(msg, keyword, args[0], say, function () {
                if (args.length == 1) {
                    return say(`:sob: Right, I couldn't quite understand you, you'll have to be clearer. I know you want to do something to poor @${args[0]} but I'm not sure what. Try something like /setplayer ${args[0]} hp 99`)
                }

                db.setPlayer(args[0], msg.body["user_name"], "set", args.slice(1), Date.now(), function (err, player) {
                    if (err) say(`:sob: Sorry, ${err}`)
                    say(JSON.stringify(player, null, 4))
                })
            })
        })
    })

}