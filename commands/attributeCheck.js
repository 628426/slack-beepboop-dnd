const r = require('./roll/index.js')

const n = require('./normaliser.js')



module.exports = function (a) {

    var innerFunc = function (keyword, msg, text, say) {

        let attribute = n.toNormalForm(a)
        let user = msg.body["user_name"].toString().trim()

        let db = require('./db')(require('./persist')(msg._slapp.client, { token: msg.meta.app_token, schema: 'dnd' }))

        db.getPlayer(user, function (err, player) {
            if (!player) {
                return say(`:sob: Sorry, I couldn't find your player [${user}.  Have your dm use /setplayer ${user} ${attribute} value `)
            } else if (!player[attribute]) {
                return say(`:sob: Sorry, I couldn't find your player's ${attribute}.  Have your dm use /setplayer ${user} ${attribute} value `)
            } else {
                if (text && text.toLowerCase() == 'passive') {
                    return say(`@${user}'s passive ${attribute} is ${(10 + player[attribute]).toString()} (10 natural + ${attribute} modifier)`)
                } else {
                    let rs = `d20+${(player[attribute] - 10) / 2}`
                    console.log(`rolling ${rs}`)
                    let flavour = ``
                    var roll = new r().roll(rs)
                    if (text) {
                        flavour = `(_${text}_) `
                    }
                    return say(`@${user} rolled _${rs}_ for a ${attribute} check ${flavour}and got ${roll.result} (dice rolled were ${JSON.stringify(roll.rolled)})`)
                }
            }
        })
    }
    return innerFunc;

}