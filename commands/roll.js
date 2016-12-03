const v = require('./validation')
const r = require('./roll/index.js')
module.exports = function (msg, params, say) {
    v.requiresParameters(msg,
        params.join(' ').trim(),
        '2d6 or d20 or 3d6+4.  See https://github.com/troygoode/node-roll for more advanced examples',
        1,
        say,
        function () {
            // check if params[0] references another function...
            if(params[0].toLowerCase() == "initiative") {
                params[0] = "dexterity"
                if(params.length > 1) {
                    params[1] = "INITIATIVE"
                } else {
                    params.push("INITIATIVE")
                }
            }
            let commands = require('./globals.js').commands
            if (commands['check'] &&
                commands['check'][params[0]]) {
                    return commands['check'][params[0]].cmd(msg, params, say)
            } else {
                let reason = ''
                if (params.length > 1) {
                    reason = ' (_' + params.slice(1).join(' ') + '_)'
                }

                var roll = new r().roll(params[0])

                return say(`@${msg.body["user_name"]} rolled _${params[0]}_${reason} and got ${roll.result} (dice rolled were ${JSON.stringify(roll.rolled)})`)
            }
        })
}