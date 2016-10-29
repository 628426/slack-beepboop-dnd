'use strict'
const os = require('os')
const n = require('./normaliser.js')
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

    let names = ['intelligence', 'wisdom', 'charisma', 'dexterity', 'strength', 'constitution']

    for (var c in names) {
        wireupCommand(slapp, names[c], `Rolls for ${names[c]}, this is the same as /roll d20 + your characters ${names[c]} bonus`, require('./attributeCheck')(names[c]))
    }

    let abbreviations = ['int', 'wis', 'cha', 'dex', 'str', 'con']

    for (var a in abbreviations) {
        let c = abbreviations[a]
        wireupCommand(slapp, c, `A shorthand alias for /${c}`, require('./attributeCheck')(c))
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


    for(var s in skills) {
        let sname = skills[s].name
        let aname = skills[s].attribute
        let allforms = n.getAllForms(sname)
        for(var on in allforms) {
            wireupCommand(slapp, allforms[on], `Makes a ${n.toNormalForm(allforms[on])} check /${allforms[on]} (optional: flavour text e.g. /disguise dress up like Guy Pearce)`, require('./skillCheck')(allforms[on], aname))
        }
    }

    wireupCommand(slapp, 'roll', 'Rolls the specified di(c)e e.g. /roll d20', require('./roll'))
    wireupCommand(slapp, 'getplayer', 'Get the specified player i.e. /getplayer fug ', require('./getplayer'))
    wireupCommand(slapp, 'setplayer', 'Sets attributes of the specified player i.e. /setplayer fug hp 99', require('./setplayer'))
    wireupCommand(slapp, 'setdm', 'Sets the specified player as dungeon master i.e. /setdm tony', require('./setDm'))

    wireupCommand(slapp, 'getdm', 'Returnns the current dm i.e. /getdm ', require('./getDm'))

    wireupCommand(slapp, 'dndhelp', 'Lists available commands e.g. /dndhelp', dndhelp)

}
