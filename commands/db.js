'use strict'
const n = require('./normaliser.js')
const cachedPlayers = {}
module.exports = function (store) {
    let db = {}

    db.getPlayer = function (name, cb) {
        let me = this;
        let key = "PLAYER_" + name;

        store.get(key, function (err, player) {
            if (err) return cb(err)
            let playerWithCommands = JSON.parse(player)
            if (playerWithCommands && playerWithCommands.commands && playerWithCommands.commands.length > 0 && !playerWithCommands.ts) {
                playerWithCommands.ts = playerWithCommands.commands[playerWithCommands.commands.length - 1].on
            }
            // check cache for newer version...
            if (cachedPlayers[key] && playerWithCommands.ts) {
                if (cachedPlayers[key].ts > playerWithCommands.ts) {
                    console.log('G Cache hit')
                    playerWithCommands = cachedPlayers[key]
                } else {
                    console.log('G Cache stale')
                }
            } else {
                console.log('G Cache miss')
            }
            let playerToReturn = {}
            playerToReturn.name = playerWithCommands.name
            if (playerWithCommands && playerWithCommands.commands && playerWithCommands.commands.length) {
                for (var c = 0; c < playerWithCommands.commands.length; c++) {
                    applyToObject(playerToReturn, playerWithCommands.commands[c].operation, playerWithCommands.commands[c].args)
                }
            }
            
            playerToReturn.version = playerWithCommands.commands.length
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

                    if (loadedPlayer.commands && loadedPlayer.commands.length > 0 && !loadedPlayer.ts) {
                        loadedPlayer.ts = loadedPlayer.commands[loadedPlayer.commands.length - 1].ts
                    }
                    // check cache for newer version...
                    if (cachedPlayers[key] && loadedPlayer.ts) {
                        if (cachedPlayers[key].ts > loadedPlayer.ts) {
                            console.log('SG Cache hit')
                            loadedPlayer = cachedPlayers[key]
                        } else {
                            console.log('SG Cache stale')
                        }
                    } else {
                        console.log('SG Cache miss')
                    }

                    let normalisedArgs = args
                    for (var i = 0; i < normalisedArgs.length; i++) {
                        normalisedArgs[i] = n.toNormalForm(normalisedArgs[i])
                    }
                    loadedPlayer.commands.push({
                        user: user,
                        operation: operation,
                        args: normalisedArgs,
                        on: date
                    })
                    loadedPlayer.ts = date

                    store.set(key, JSON.stringify(loadedPlayer), function (err) {

                        if (err) return cb(err)
                        cachedPlayers[key] = loadedPlayer
                        console.log('Cache back')

                        me.getPlayer(name, function (err, Innerplayer) {

                            if (err) return cb(err)

                            return cb(null, Innerplayer)
                        })
                    })
                } catch (ee) {

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

    // tidy up args
    args = args.map((arg) => {
        return n.toNormalForm(arg.toLowerCase())
    })
    if (!o) {
        o = {}
    }
    if (!args[0]) {
        return
    }

    if (op.toLowerCase() == "set") {
        if (args.length > 2) {
            // need to recurse:
            // take a peek to see if we need to turn something into an object...
            // set player griswold weapons shortsword
            // followed by
            // set player griswold weapons shortsword attack 1d6+1
            if (o[args[0]] &&
                o[args[0]] !== Object(o[args[0]])) {
                // not an object but more than 2 in the array... needs upgrading:
                // used to be a string so set "name"
                if (typeof o[args[0]] === 'string' || o[args[0]] instanceof String) {
                    let v = o[args[0]]
                    o[args[0]] = {}
                    o[args[0]][args[1]] = {}
                    o[args[0]][args[1]].name = v
                }
                applyToObject(o[args[0]][args[1]], op, args.slice(2))
            } else {
                applyToObject(o[args[0]], op, args.slice(1))
            }

        } else if (args.length == 2) {
            try {
                o[args[0]] = args[1]
            } catch (e) {

            }

        }

    } else if (op.toLowerCase() == "push") {
        if (args.length > 2) {

            applyToObject(o[args[0]], op, args.slice(1))

        } else if (args.length == 2) {
            let v = o[args[0]]
            if (v) {
                o[args[0]] = [].concat(v)
            } else {
                o[args[0]] = []
            }
            o[args[0]].push(args[1])
            o[args[0]] = o[args[0]].sort()

        }
    } else if (op.toLowerCase() == "clear") {
        if (args.length == 1) {
            delete o[args[0]]
        } else {
            applyToObject(o[args[0], op, args.slice(1)])
        }
    }
}

function applyToObject2(o, op, args) {
    if (args.length >= 1) {
        for (var argnum = 0; argnum < args.length - 1; argnum++) {
            args[argnum] = args[argnum].toLowerCase()
            args[argnum] = n.toNormalForm(args[argnum])
        }
    }
    if (!o) {
        o = {}
    }
    if (args[0] == "") {
        return;
    }
    if (args.length > 2) { // nested
        let v = null;
        if (o && o.name && o.name == args[0]) {
            v = o.values
        } else if (o[args[0].toLowerCase()]) {
            v = o[args[0].toLowerCase()]
        }
        if (v) {
            // handle "upgrades"
            if (!isObject(v)) {
                if (typeof v === 'string' || v instanceof String) {
                    o[args[0].toLowerCase()] = {
                        name: v,
                        values: null
                    }
                }
                if (typeof v === 'boolean' || v instanceof Boolean) {
                    o[args[0].toLowerCase()] = {
                        flag: v,
                        values: null
                    }
                }
                if (typeof v === 'number' || v instanceof Number) {
                    o[args[0].toLowerCase()] = {
                        index: v,
                        values: null
                    }
                }
                if (o[args[0].toLowerCase()]) {
                    //                    o = o[args[0]].values
                    //                  args = args.slice(1)
                }
            }
        } else {
            o[args[0].toLowerCase()] = {}
        }

    }
    if (args.length == 2 && op != "clear") { // needs a value not object
        let v = null;
        if (o && o.name && o.name == args[0].toLowerCase()) {
            v = o.values
        } else if (o && o[args[0].toLowerCase()]) {
            v = o[args[0].toLowerCase()]
        } else {
        }

        if (v) {
            console.log(`Found v ${JSON.stringify(v)}`)
            // handle upgrades
            if (typeof v == typeof args[1]) {
                console.log(`Found v with same type as ${args[1]}`)
                // same type, check operation..
                if (op == "set") {
                    // overwrite
                    if (o && o.name && o.name == args[0].toLowerCase()) {
                        o.values = args[1]
                    } else if (o && o[args[0].toLowerCase()]) {
                        o[args[0].toLowerCase()] = args[1]
                    }

                    return;
                }
            }
        }
        if (op == "push") {
            console.log(`Found v with same type as ${args[1]}`)
            if (o && o.name && o.name == args[0]) {
                let vv = o.values
                console.log(`Found direct::${JSON.stringify(o.values)}`)
                o.values = []
                if (vv && Array.isArray(vv)) {
                    vv.forEach(function (value) {
                        console.log(`Pushing old value into direct array::${value}`)
                        o.values.push(value)
                    })
                } else if (vv) {
                    o.values.push(vv)
                }
                console.log(`Pushing new value into direct array::${args[1]}`)
                o.values.push(args[1])
                return
            } else if (o && o[args[0].toLowerCase()]) {

                let vv = o[args[0].toLowerCase()]
                console.log(`Found indirect::${JSON.stringify(vv)}`)
                o[args[0].toLowerCase()] = []
                if (vv && Array.isArray(vv)) {
                    console.log(`Found indirect array::${JSON.stringify(vv)}`)
                    vv.forEach(function (value) {
                        console.log(`Pushing old value into indirect array::${value}`)
                        o[args[0].toLowerCase()].push(value)
                    })
                } else if (vv) {
                    // vv was something else push it  in
                    o[args[0].toLowerCase()].push(vv)
                }
                console.log(`Pushing new value into indirect array::${JSON.stringify(args[1])}`)
                o[args[0].toLowerCase()].push(args[1])
                return
            } else {
                console.log(`${JSON.stringify(o)} ${JSON.stringify(args)}`)
            }

            v += ',' + args[0]
            let vv = v
            v = []
            if (vv) {
                vv.split(',').forEach(function (value) {
                    v.push(value)
                })
            }

            v.push(args[1])
            return
        }

    }

    if (o && o.name && o.name == args[0].toLowerCase()) {
        o.values = args[1]

    } else if (args.length == 1 && op == "clear") {
        delete o[args[0].toLowerCase()]
    } else if (args.length > 0 && args[0]) {
        applyToObject(o[args[0].toLowerCase()], op, args.slice(1))
        return;
    }
    else {
        o[args[0].toLowerCase()] = args[1]

    }



}
