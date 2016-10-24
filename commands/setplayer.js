const v = require('./validation')
module.exports = function (keyword, msg, text, say) {
    console.log(text)
    let  args = text.split(' ')
    console.log(JSON.stringify(args))
    v.requiresParameters(msg, text, 'a players name, like, fug.  E.g. /setplayer fug hp 99', 1, say, function () {
        v.mustBeDm(msg, keyword, say, function () {
            v.mustBeUser(msg, keyword, args[0], say, function () {
                if (args.length == 1) {
                    return say(`:sob: Right, I couldn't quite understand you, you'll have to be clearer. I know you want to do something to poor @${args[0]} but I'm not sure what. Try something like /setplayer ${args[0]} hp 99`)
                }

                db.setPlayer(args[0], msg.body["user_name"], "set", args.slice(1), Date.now(), function (err, player) {
                    say(JSON.stringify(player, null, 4))
                })
            })
        })
    })

}