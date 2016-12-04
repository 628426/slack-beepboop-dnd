const v = require('./validation')
const r = require('./roll/index.js')
module.exports = function (msg, params, say) {
    v.requiresParameters(msg,
        params.join(' ').trim(),
        '2d6 or d20 or 3d6+4.  See https://github.com/troygoode/node-roll for more advanced examples',
        1,
        say,
        function () {

            // see what can be rolled
            if (!/\d/.test(params[0])) {
                // see if there are any matching...
                let matchingRolls = require('./skills.js').map((value) => {
                    return value.name
                }).concat(['attack', 'damage']).sort().filter((value) => {
                    return value.toLowerCase().startsWith(params[0])
                })
                if (matchingRolls && matchingRolls.length == 1) {
                    params[0] = matchingRolls[0]
                } else if (matchingRolls && matchingRolls.length > 1) {
                    let choices = `:sob: Sorry, I couldn't tell what you meant.  Did you mean one of?\r\n`
                    for (var m in matchingRolls) {
                        choices += `/roll ${m}\r\n`
                    }
                    return say(choices)
                }
            }

            if (params[0].toLowerCase() == "attack") {
                console.log('calling attack.attack')
                return require('./attack.js').attack(msg, params.slice(1), say)
            } else if (params[0].toLowerCase() == "damage") {
                console.log('calling attack.damage')
                return require('./attack.js').damage(msg, params.slice(1), say)
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