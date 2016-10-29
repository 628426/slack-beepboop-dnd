const r = require('./roll/index.js')

const n = require('./normaliser.js')

module.exports = function (keyword, msg, text, say, a) {

    let attribute = n.toNormalForm(a)

    let db = require('./db')(require('./persist')(msg._slapp.client, { token: msg.meta.app_token, schema: 'dnd' }))

    db.getPlayer(msg.body["user_name"], function (err, player) {
        if (!player) {
            return say(`:sob: Sorry, I couldn't find your player.  Have your dm use /setplayer ${msg.body["user_name"]} ${attribute} value `)
        } else if (!player[attribute]) {
            return say(`:sob: Sorry, I couldn't find your player's ${attribute}.  Have your dm use /setplayer ${msg.body["user_name"]} ${attribute} value `)
        } else {
            
            let rs = `d20+${(player[attribute] - 10) / 2}`
            console.log(`rolling ${rs}`)

            var roll = new r().roll(rs)

            return say(`@${msg.body["user_name"]} rolled _${rs}_ for a ${attribute} check and got ${roll.result} (dice rolled were ${JSON.stringify(roll.rolled)})`)            
        }
    })

}