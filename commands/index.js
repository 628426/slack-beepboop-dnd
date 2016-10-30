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
            if (!handler.cmd) {
                let choices = `:sob: Sorry couldn't tell what you meant.  Did you mean one of?\r\n`
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

    for (var a in attributes) {
        let attributeVariations = n.getAllForms(attributes[a]).sort(function (a, b) {
            return a > b
        })
        for (var v in attributeVariations) {
            let attribute = attributeVariations[v]
            handleCommandAndKeyword(slapp,
                'check',
                attribute,
                `Makes a ${attributes[a]} check`,
                `/check ${attribute}`,
                require('./attributeCheck')(attributes[a]))
        }
    }

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

    console.log(JSON.stringify(commands), null, 2)

    var msg = {
    }
    msg["body"] = {}
    msg.body["user_name"] = "tester"
    var say = function (text) {

    }

    commands['roll'].cmd(msg, ['d20'], say)

    //    wireupCommand(slapp, 'roll', 'Rolls the specified di(c)e e.g. /roll d20', require('./roll'))
    // wireupCommand(slapp, 'getplayer', 'Get the specified player i.e. /getplayer fug ', require('./getplayer'))
    // wireupCommand(slapp, 'setplayer', 'Sets attributes of the specified player i.e. /set player fug hp 99', require('./set player'))
    // wireupCommand(slapp, 'setdm', 'Sets the specified player as dungeon master i.e. /setdm tony', require('./setDm'))

    // wireupCommand(slapp, 'getdm', 'Returnns the current dm i.e. /getdm ', require('./getDm'))

    // wireupCommand(slapp, 'dndhelp', 'Lists available commands e.g. /dndhelp', dndhelp)

}
