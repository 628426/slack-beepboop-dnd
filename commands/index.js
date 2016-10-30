'use strict'
const os = require('os')
const n = require('./normaliser.js')
var commands = {}

function handleCommandAndKeyword(slapp, command, keyword, description, example, cmd) {
    let firstWireupForCommand = false
    if (!commands[command]) {
        commands[command] = {}
        firstWireupForCommand = true
    }
    let c = {
        command: command,
        keyword: keyword,
        description: description,
        example: example,
        cmd: cmd
    }
    if (!keyword) {
        commands[command] = c
    } else {
        commands[command][keyword] = c
    }

    if (firstWireupForCommand) {

        slapp.command('/' + command, /.*/, (msg, text) => {

            let say = function (text) {
                try {
                    msg.say(text)
                }
                catch (es) {
                    msg.say(':sob: Exception::' + es.toString() + os.EOL + es.stack)
                }
            }

            let args = []
            if (text) {
                args = text.split(' ')
            }
            args = args.map(function (a) {
                if (a.charAt(0) === "@") {
                    return a.substring(1)
                } else {
                    return a
                }
            })

            let handler = null
            let params = args
            if (!commands || !commands[command]) {
                return say(`:sob: Couldn't find the handler for ${command}`)
            }
            if (commands[command][args[0]]) {
                handler = commands[command][args[0]]

                if (args.length > 1) {
                    params = args.slice(1)
                }
            } else {
                handler = commands[command]
            }
            if (!handler.cmd || (args && args.length > 0 && args[0].toLowerCase() == "help")) {
                let choices = `:sob: Sorry, I couldn't tell what you meant.  Did you mean one of?\r\n`
                for (var p in handler) {
                    choices += `*/${command} ${handler[p].keyword}* ${handler[p].description} e.g. _${handler[p].example}_\r\n`
                }
                return say(choices)
            }

            try {
                handler.cmd(msg, params, say);
            }
            catch (e) {
                say(':sob: Exception::' + e.toString() + os.EOL + e.stack)
            }
        })
    }
}


var dndhelp = function (msg, text, say) {
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

    let attributes = ['intelligence', 'wisdom', 'charisma', 'dexterity', 'strength', 'constitution'].sort(function (a, b) {
        return a > b;
    })

    attributes.forEach(function (attribute) {

        let attributeVariations = n.getAllForms(attribute).sort(function (a, b) {
            return a > b
        }).forEach(function (variation) {

            handleCommandAndKeyword(slapp,
                'check',
                variation,
                `Makes a ${attribute} check`,
                `/check ${variation}`,
                require('./attributeCheck')(attribute))
        })

    })

    let skills = [{
        name: 'acrobatics',
        attribute: 'dex'
    },
    {
        name: 'animalhandling',
        attribute: 'wis'
    },
    {
        name: 'arcana',
        attribute: 'int'
    },
    {
        name: 'athletics',
        attribute: 'str'
    }, {
        name: 'deception',
        attribute: 'cha'
    }, {
        name: 'history',
        attribute: 'int'
    }, {
        name: 'insight',
        attribute: 'int'
    },
    {
        name: 'intimidation',
        attribute: 'cha'
    }, {
        name: 'investigation',
        attribute: 'int'
    }, {
        name: 'medicine',
        attribute: 'wis'
    }, {
        name: 'nature',
        attribute: 'int'
    }, {
        name: 'perception',
        attribute: 'wis'
    }, {
        name: 'persuasion',
        attribute: 'cha'
    }, {
        name: 'religion',
        attribute: 'int'
    }, {
        name: 'sleightofhand',
        attribute: 'dex'
    }, {
        name: 'stealth',
        attribute: 'dex'
    }, {
        name: 'survival',
        attribute: 'wis'
    }
    ]

    for (var s in skills) {
        let sname = skills[s].name
        let aname = skills[s].attribute
        let allforms = n.getAllForms(sname)
        for (var on in allforms) {

            handleCommandAndKeyword(slapp,
                'check',
                allforms[on], // intimidate OR intimidation 
                `Makes a ${sname} check`,
                `/check ${allforms[on]}`,
                require('./skillCheck')(sname, n.toNormalForm(aname))
            )
        }
    }

    handleCommandAndKeyword(slapp,
        'roll',
        null,
        `Rolls the specified dice`,
        `/roll d20`,
        require('./roll')
    )

    handleCommandAndKeyword(slapp,
        'get',
        'player',
        `Gets the specified attribute of the player`,
        `/get player ada hp`,
        require('./getplayer.js')
    )

    handleCommandAndKeyword(slapp,
        'set',
        'player',
        `Set the specified attribute of the player to the specified value`,
        `/set player fug hp 99`,
        require('./setplayer.js')
    )


    handleCommandAndKeyword(slapp,
        'get',
        'dm',
        `Gets the current dm`,
        `/get dm`,
        require('./getDm.js')
    )

    handleCommandAndKeyword(slapp,
        'set',
        'dm',
        `Set the dm to the specified player`,
        `/set dm fug`,
        require('./setDm.js')
    )





    var msg = {
    }
    msg["body"] = {}
    msg.body["user_name"] = "tester"

    var say = function (text) {

    }

    commands['roll'].cmd(msg, ['d20'], say)

    // wireupCommand(slapp, 'setplayer', 'Sets attributes of the specified player i.e. /set player fug hp 99', require('./set player'))

    // wireupCommand(slapp, 'dndhelp', 'Lists available commands e.g. /dndhelp', dndhelp)

}
