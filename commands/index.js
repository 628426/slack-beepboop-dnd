'use strict'
const os = require('os')
var commands = []
function wireupCommand(slapp, keyword, description, cmd) {
    commands.push({ command: keyword, description: description })
    slapp.command('/' + keyword, /.*/, (msg, text) => {
        let say = function (text) {
            try {
                msg.say(text)
            }
            catch (es) {
                msg.say(':sob: Exception::' + es.toString() + os.EOL + es.stack)
            }
        }
        try {
            cmd(keyword, msg, text, say);
        }
        catch (e) {
            say(':sob: Exception::' + e.toString() + os.EOL + e.stack)
        }
    })

    slapp.message(keyword, ['direct_mention', 'direct_message', 'mention'], (msg, text) => {
        let say = function (t) {
            try {
                msg.respond(t)
            }
            catch (es) {
                msg.say(':sob: Exception::' + es.toString() + os.EOL + es.stack)
            }
        }
        try {
            cmd(keyword, msg, text, say)

        }
        catch (e) {
            say(':sob: Exception::' + e.toString() + os.EOL + e.stack)
        }

    })


}

var dndhelp = function (keyword, msg, text, say) {
    var r = '';
    var sortedCommands = commands.sort(function (a, b) {
        if (a.command > b.command) {
            return 1;
        }
        if (a.command < b.command) {
            return -1;
        }
        // a must be equal to b
        return 0;
    })
    for (var cmdIndex = 0; cmdIndex < sortedCommands.length; cmdIndex++) {
        r += `*${sortedCommands[cmdIndex].command}* ${sortedCommands[cmdIndex].description}` + os.EOL
    }
    say(r);
}

// list out explicitly to control order
module.exports = (slapp) => {

    wireupCommand(slapp, 'roll', 'Rolls the specified di(c)e e.g. /roll d20', require('./roll'))
    wireupCommand(slapp, 'setdm', 'Sets the specified players as dungeon master i.e. /setdm tony', require('./setDm'))

    wireupCommand(slapp, 'dndhelp', 'Lists available commands e.g. /dndhelp', dndhelp)

}
