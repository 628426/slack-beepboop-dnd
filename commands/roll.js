const v = require('./validation')
const r = require('./roll/index.js')
module.exports = function (keyword, msg, text, say) {
    v.requiresParameters(msg, text, '2d6 or d20 or 3d6+4.  See https://github.com/troygoode/node-roll for more advanced examples')

    var roll = new r().roll(text)

    return say(`@${msg.body["user_name"]} rolled _${text}_  and got ${roll.result} (dice rolled were ${JSON.stringify(roll.rolled)})`)
}