const v = require('./validation')
const r = require('./roll/index.js')
module.exports = function (keyword, msg, text, say) {
    v.requiresParameters(msg,
        text,
        '2d6 or d20 or 3d6+4.  See https://github.com/troygoode/node-roll for more advanced examples',
        1,
        say,
        function () {
            let args = text.split(' ') // support "reasons" for rolling i.e. /roll d20 insight into girls dress
            let reason =  ''
            if(args.length > 1) {
                reason = ' (_' +  args.slice(1).join(' ') + '_)'
            }

            var roll = new r().roll(args[0])

            return say(`@${msg.body["user_name"]} rolled _${args[0]}_${reason} and got ${roll.result} (dice rolled were ${JSON.stringify(roll.rolled)})`)
        })
}