const r = require('./roll/index.js')
const n = require('./normaliser.js')
const v = require('./validation')

module.exports = function (attribute) {

    var innerFunc = function (msg, params, say) {

        let user = msg.body["user_name"].toString().trim()

        let db = require('./db')(require('./persist')(msg._slapp.client, { token: msg.meta.app_token, schema: 'dnd' }))

        db.getPlayer(user, function (err, player) {
            if(err) return say(':sob: Sorry, error occurred ' + err)
            
            if (!player) {
                return say(`:sob: Sorry, I couldn't find your player [${user}].  Have your dm use /set player ${user} ${attribute} value `)
            } else if (!player[attribute]) {
                return say(`:sob: Sorry, I couldn't find your player's ${attribute}.  Have your dm use /set player ${user} ${attribute} value `)
            } else {
                if (params.length > 1 && params[1].toLowerCase() == 'passive') {
                    return say(`@${user}'s passive ${attribute} is ${(10 + (player[attribute] - 10) / 2).toString()} (10 natural + ${attribute} modifier)`)
                } else {
                    var rs = `d20+${Math.floor((player[attribute] - 10) / 2)}`
                    
                    let flavour = ``
                    var roll = new r().roll(rs)
                    if (params.length > 1) {
                        flavour = `(_${params.slice(1).join(' ')}_) `
                    }
                    return say(`@${user} rolled _${rs}_ for a ${attribute} check ${flavour}and got ${roll.result} (dice rolled were ${JSON.stringify(roll.rolled)})`)
                }
            }
        })
    }
    return innerFunc;
}