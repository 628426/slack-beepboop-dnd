const n = require('./normaliser.js')



module.exports = function (s, a) {

    var innerFunc = function (keyword, msg, text, say) {

        let skill = n.toNormalForm(s)
        let attribute = n.toNormalForm(a)
        let user = msg.body["user_name"].toString().trim()
        let db = require('./db')(require('./persist')(msg._slapp.client, { token: msg.meta.app_token, schema: 'dnd' }))

        db.getPlayer(user, function (err, player) {
            if (!player) {
                return say(`:sob: Sorry, I couldn't find your player [${user}].  Have your dm use /setplayer ${msg.body["user_name"]} ${attribute} value `)
            } else if (!player[attribute]) {
                return say(`:sob: Sorry, I couldn't find your player's ${attribute}.  Have your dm use /setplayer ${msg.body["user_name"]} ${attribute} value `)
            } else {
                // check for proficiencies:
                let isProficient = false
                var profWarn = '';
                if (player.proficiencies) {
                    if (player.proficiencies == skill) {
                        isProficient = true
                    } else if (player.proficiencies.includes &&
                        player.proficiencies.includes(skill)) {
                        isProficient = true
                    }
                } else {
                    profWarn = `(WARNING: Couldn't find any proficiencies for ${user}, have your d use /setplayer ${user} proficiencies stealth`
                }

                let rs = `d20+${(player[attribute] - 10) / 2}`
                if(isProficient && player.level) {
                    rs += '+' + (player.level / 4).toString()
                }
                console.log(`rolling ${rs}`)
                let flavour = ``
                var roll = new r().roll(rs)
                if (text) {
                    flavour = `(_${flavour}_) `
                }
                return say(`@${msg.body["user_name"]} rolled _${rs}_ for a ${skill} check ${flavour}and got ${roll.result} (dice rolled were ${JSON.stringify(roll.rolled)}) ${profWarn}`)
            }
        })
    }
    return innerFunc
}