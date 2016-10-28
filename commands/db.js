'use strict'

module.exports = function (store) {
    let db = {}
    db.getPlayer = function (name, cb) {
        let key = "PLAYER_" + name;
        console.log('before get')
        store.get(key, function (err, player) {
            if (err) return cb(err)

            if (player && player.commands && player.commands.length) {
                for (var c = 0; c <= player.commands.length; c++) {
                    db.applyToObject(p, player.commands[c].operation, player.commands[c].args)
                }
            }

            cb(null, player)

        })
    }
    db.setPlayer = function (name, user, operation, args, date, cb) {
        let key = "PLAYER_" + name;
        try {
            store.get(key, function (err, player) {
                try {
                    player = JSON.parse(player)
                    if (err) return cb(err)

                    if (!player) {
                        player = {}
                        player.name = name
                    }
                    if (!player.commands) {
                        player.commands = []
                    }
                    player.commands.push({
                        user: user,
                        operation: operation,
                        args: args,
                        on: date
                    })
                    
                    store.set(key, JSON.stringify(player), function (err) {
                    
                        if (err) return cb(err)

                        getPlayer(name, function (err, player) {
                            console.log('after set set get')
                            if (err) return cb(err)

                            cb(null, player)
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

module.exports.applyToObject = function (obj, op, args) {
    applyToObject(obj, op, args)
} 