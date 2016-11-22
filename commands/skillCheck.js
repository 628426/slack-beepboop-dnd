const n = require('./normaliser.js')

const r = require('./roll/index.js')



module.exports = function (skill, attribute) {

    var innerFunc = function (msg, params, say) {

        let user = msg.body["user_name"].toString().trim()
        let db = require('./db')(require('./persist')(msg._slapp.client, { token: msg.meta.app_token, schema: 'dnd' }))

        db.getPlayer(user, function (err, player) {
            if(err) return say(':sob: Sorry, error occurred ' + err)
            if (!player) {
                return say(`:sob: Sorry, I couldn't find your player [${user}].  Have your dm use /set player ${msg.body["user_name"]} ${attribute} value `)
            } else if (!player[attribute]) {
                return say(`:sob: Sorry, I couldn't find your player's ${attribute}.  Have your dm use /set player ${msg.body["user_name"]} ${attribute} value `)
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
                    profWarn = `(WARNING: Couldn't find any proficiencies for ${user}, have your dm use /set player ${user} proficiencies stealth)`
                }

                let rs = `d20+${Math.floor((player[attribute] - 10) / 2)}`
                if(isProficient && player.level) {
                    rs += '+' + (2 + Math.floor((player.level / 4))).toString()
                } else if(!player.level) {
                    profWarn = `(WARNING: Couldn't find level for ${user}, have your dm use /set player ${user} level 1)`
                }
                
                let flavour = ``
                var roll = new r().roll(rs)
                if (params && params.length > 1) {
                    flavour = `(_${params.slice(1).join(' ')}_) `
                }
                return say(`@${user} rolled _${rs}_ for a ${skill} check ${flavour}and got ${roll.result} (dice rolled were ${JSON.stringify(roll.rolled)}) ${profWarn}`)
            }
        })
    }
    return innerFunc
}