const v = require('./validation')

module.exports = function (msg, args, say) {

    let db = require('./db')(require('./persist')(msg._slapp.client, { token: msg.meta.app_token, schema: 'dnd' }))

    let operation = "set"
    if(args && args.length > 1 && args[1] == "add") {
        operation = "add"
        args = args.splice(2, 1)
    }

    v.requiresParameters(msg, args.join(' '), 'a players name, like, fug.  E.g. /set player fug hp 99', 1, say, function () {
        v.mustBeDm(msg, say, function () {
            v.mustBeUser(msg, args[0], say, function () {
                if (args.length == 1) {
                    return say(`:sob: Right, I couldn't quite understand you, you'll have to be clearer. I know you want to do something to poor @${args[0]} but I'm not sure what. Try something like /set player ${args[0]} hp 99`)
                }

                db.setPlayer(args[0], msg.body["user_name"], operation, args.slice(1), Date.now(), function (err, player) {
                    if (err) return say(`:sob: Sorry, ${err}`)
                    return say(JSON.stringify(player, null, 4))
                })
            })
        })
    })

}