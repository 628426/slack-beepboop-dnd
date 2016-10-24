const store = require('beepboop-persist')()

module.exports.mustBeUser = function(msg, command, user, say, cb) {
    var slapp = msg._slapp;
    slapp.client.users.list({token:msg.meta.bot_token}, function(err, result) {
        if(err) {
            return say(`":sob: Sorry, ${err} occurred looking up user list`)
        } else {
            console.log(JSON.stringify(result.members))
            if(result.members.some((u) => {
                console.log(`checking [${u.name}] to [${user}]`)
                if(u.name == user) {
                    return true
                }
            })) {
                cb()
            } else {
                return say(`:sob: Sorry, I expected you to tell me a user where you said _${user}_ so I can't continue`)
            }
        }
    })
}

module.exports.mustBeDm = function (msg, command, say, cb) {
    store.get("DM", function (err, data) {
        let user = msg.body["user_name"]
        if (err) {
            return say(`":sob: Sorry, ${err} occurred`)
        }
        var dm = data || "griswold"

        if (dm != user && user != 'griswold') {
            return say(`:sob: Sorry, @${dm} is currently the dm and is the only player allowed to user the /${command} command`)
        }

        cb()

    })
}

module.exports.requiresParameters = function (msg, text, message, num, say, cb) {
    let valid = true;
    let tokens = null;
    if(text) {
        tokens = text.split(' ')
    } else {
        tokens = []
    }
    let validationMessage = ":sob: Sorry I couldn't understand you,"
    if (num && num > 1) {
        valid = false
        validationMessage += num.toString() + ' required parameters are missing.'
    } else {
        valid = false
        validationMessage += ' a required parameter is missing.'
    }
    if (!valid && tokens.length < num) {
        validationMessage += '  Try ' + message
        say(validationMessage)
    } else {
        cb()
    }
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
    console.log(`checking ${args[0]} and ${args[1]}`)
    console.log(`found ${JSON.stringify(o)} `)
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