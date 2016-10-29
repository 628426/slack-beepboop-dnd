'use strict'
const n = require('./normalise.js')
module.exports = function (store) {
    let db = {}
    db.getPlayer = function (name, cb) {
        let key = "PLAYER_" + name;
        console.log('before get')
        store.get(key, function (err, player) {
            if (err) return cb(err)
            console.log(`getPlayer.get::Got ${player} for ${key}`)
            let playerWithCommands = JSON.parse(player)
            let playerToReturn = {}
            playerToReturn.name = playerWithCommands.name
            if (playerWithCommands && playerWithCommands.commands && playerWithCommands.commands.length) {
                console.log('applying commands')
                for (var c = 0; c < playerWithCommands.commands.length; c++) {
                    console.log('applying command ')
                    applyToObject(playerToReturn, playerWithCommands.commands[c].operation, playerWithCommands.commands[c].args)
                    console.log('applied command ')
                }
                console.log('finished commands ')
            }
            console.log('cbing ')
            console.log(`player:: ${playerToReturn}`)
            return cb(null, playerToReturn)

        })
    }
    db.setPlayer = function (name, user, operation, args, date, cb) {
        let me = this
        let key = "PLAYER_" + name;
        try {
            store.get(key, function (err, player) {
                try {
                    if (err) return cb(err)
                    let loadedPlayer = {}
                    if (!player) {
                        loadedPlayer = {}
                        loadedPlayer.name = name
                    } else {
                        loadedPlayer = JSON.parse(player)
                    }
                    if (!loadedPlayer.commands) {
                        loadedPlayer.commands = []
                    }
                    let normalisedArgs= args
                    for(var i = 0; i < normalisedArgs.length; i++) {
                        normalisedArgs[i] = n.toNormalForm(normalisedArgs[i]) 
                    }
                    loadedPlayer.commands.push({
                        user: user,
                        operation: operation,
                        args: args,
                        on: date
                    })

                    store.set(key, JSON.stringify(loadedPlayer), function (err) {

                        if (err) return cb(err)

                        me.getPlayer(name, function (err, Innerplayer) {
                            console.log('after set set get')
                            if (err) return cb(err)

                            cb(null, Innerplayer)
                        })
                    })
                } catch (ee) {
                    console.log('ee')
                    return cb(ee.stack)
                }

            })
        }
        catch (e) {
            console.log('e')
            return cb(e.stack)
        }
    }

    return db
}


function isObject(obj) {
    return obj === Object(obj);
}
function isArray(obj) {
    return
}

function applyToObject(o, op, args) {

    if (!o) {
        o = {}
    }

    if (args.length > 2) { // nested
        let v = null;
        if (o && o.name && o.name == args[0]) {
            v = o.values
        } else if (o[args[0]]) {
            v = o[args[0]]
        }
        if (v) {
            // handle "upgrades"
            if (!isObject(v)) {
                if (typeof v === 'string' || v instanceof String) {
                    o[args[0]] = {
                        name: v,
                        values: null
                    }
                }
                if (typeof v === 'boolean' || v instanceof Boolean) {
                    o[args[0]] = {
                        flag: v,
                        values: null
                    }
                }
                if (typeof v === 'number' || v instanceof Number) {
                    o[args[0]] = {
                        index: v,
                        values: null
                    }
                }
                if (o[args[0]]) {
                    //                    o = o[args[0]].values
                    //                  args = args.slice(1)
                }
            }
        } else {
            o[args[0]] = {}
        }

    }
    if (args.length == 2) { // needs a value not object
        let v = null;
        if (o && o.name && o.name == args[0]) {
            v = o.values
        } else if (o && o[args[0]]) {
            v = o[args[0]]
        } else {
        }

        if (v) {
            // handle upgrades
            if (typeof v == typeof args[1]) {
                console.log(`upgrading`)
                // same type, check operation..
                if (op == "set") {
                    // overwrite
                    if (o && o.name && o.name == args[0]) {
                        o.values = args[1]
                    } else if (o && o[args[0]]) {
                        o[args[0]] = args[1]
                    }


                    return;
                } else if (op == "add") {
                    if (o && o.name && o.name == args[0]) {
                        let vv = o.values
                        o.values = []
                        o.values.push(vv)
                        o.values.push(args[1])
                        return
                    } else if (o && o[args[0]]) {
                        let vv = o[args[0]]
                        o[args[0]] = []
                        o[args[0]].push(vv)
                        o[args[0]].push(args[1])
                        return

                    }

                    v += ',' + args[0]
                    let vv = v
                    v = []
                    v.push(vv)
                    v.push(args[1])
                    return
                }
            }
        } else {
            if (o && o.name && o.name == args[0]) {
                o.values = args[1]
            } else {
                o[args[0]] = args[1]
            }


            return;
        }
    } else {
        applyToObject(o[args[0]], op, args.slice(1))

    }

}
