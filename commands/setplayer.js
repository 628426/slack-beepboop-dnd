const v = require('./validation')
module.exports = function (keyword, msg, text, say) {

    var args = msg.split(' ')

    v.requiresParameters(msg, text, 'a players name, like, fug.  E.g. /setdm fug', 1, say, function () {
        v.mustBeDm(msg, keyword, say, function () {
            v.mustBeUser(msg, keyword, text, say, function () {
                if (args.length == 1) {
                    return say(`:sob: Right, I couldn't quite understand you, you'll have to be clearer. I know you want to do something to poor @${args[0]} but I'm not sure what. Try something like /setplayer ${args[0]} hp 99`)
                }
            })
        })
    })




    var pkey = "PLAYER:" + args[0]

    store.get("DM", function (err, dm) {
        let user = msg.body["user_name"]
        if (err) {
            return say(`":sob: Sorry, ${err} occurred loading DM`)
        }


        if ((dm || 'griswold') != user && user != 'griswold') {
            return say(`:sob: Sorry, @${(dm || 'griswold')} is currently the dm and is the only player allowed to user the /setdm command`)
        }

        store.get("PLAYERS", function (err, dbPlayers) {
            if (err) {
                return say(`":sob: Sorry, ${err} occurred loading PLAYERS`)
            }
            var players = dbPlayers || [];

            store.get(pkey, function (err, dbPlayer) {
                if (err) {
                    return say(`":sob: Sorry, ${err} occurred loading ${pkey}`)
                }
                var player = dbPlayer || {}
                if (!player.name) {
                    player.name = args[0]
                }
                // fug level 1



            })

        })

    })

}