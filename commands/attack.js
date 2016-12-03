const r = require('./roll/index.js')
const mechanics = require('./mechanics.js')
function getWeapon(player, params) {
    let weapon = null
    let unarmed = {}
    unarmed.name = 'unarmed'
    unarmed.attack = '1d20'
    unarmed.modifier = 'strength'
    unarmed.damage = '1d1'
    if (params && params[0] && params[0].toLowerCase() == "unarmed") {
        weapon = unarmed
    }
    console.log(`looking for the weapon of ${JSON.stringify(player)} using ${JSON.stringify(params)}`)

    let weaponName = null
    // did the supply params?
    if (!weapon && params && params.length > 0 && params[0]) {
        // did they match a weapon:
        if (player && player.weapons && player.weapons[params[0]]) {
            weapon = player.weapons[params[0]]

        } else if (player && player.weapons) {
            let matchingWeaponKeys = Object.keys(player.weapons).filter(w => {
                return w.startsWith(params[0])
            })
            if (matchingWeaponKeys.length == 1) {
                weapon = player.weapons[matchingWeaponKeys[0]]
                params[0] = matchingWeaponKeys[0]
            }
        }
    }

    // do they have a weapon yet?
    if (!weapon) {
        // what weapon did they use last time?
        if (player && player.lastweaponattackedwith && player.weapons && player.weapons[player.lastweaponattackedwith]) {
            weapon = player.weapons[player.lastweaponattackedwith]
        }
    }

    // do they have a weapon yet?
    if (!weapon) {
        weapon = unarmed
    }
    // add weapon modifiers
    weapon.attackmodifier = weapon.attackmodifier || weapon.modifier
    weapon.damagemodifier = weapon.damagemodifier || weapon.modifier

    return weapon
}

module.exports.attack = function (msg, params, say) {
    let db = require('./db')(require('./persist')(msg._slapp.client, { token: msg.meta.app_token, schema: 'dnd' }))
    let user = msg.body["user_name"].toLowerCase()

    db.getPlayer(user, function (err, player) {
        if (err) throw err
        if (player) {
            console.log('got player a ' + user)
            console.log('got params ' + JSON.stringify(params))
            console.log('got playerj a ' + JSON.stringify(player))
            let weapon = getWeapon(player, params)
            console.log('got playerj ab ' + JSON.stringify(player))
            console.log('got weapon ' + weapon.name)

            rollText = `${weapon.attack}+${mechanics.getProficiency(player)}+${mechanics.getModifier(player, weapon.attackmodifier)}`
            console.log('got rolltext ' + rollText)
            console.log('got playerj ac ' + JSON.stringify(player))
            let rollDesc = `${weapon.attack}+${mechanics.getProficiency(player)}(player proficiency bonus for level ${player.level}+${mechanics.getModifier(player, weapon.attackmodifier)}`
            console.log('got rollDesc ' + rollDesc)
            let flavour = ``
            let roll = new r().roll(rollText)
            if (params && params.length > 0) {
                if (params[0].toLowerCase() == weapon.name.toLowerCase() && params.length > 1) {
                    params = params.slice(1)
                }
                if (params.length > 0) {
                    flavour = ` ${params.join(' ')}`
                }
            }
            console.log('got flavour ' + flavour)
            let result = `@${user} made an attack roll (${weapon.name}${flavour}) of _${rollText}_ for and got *${roll.result}* (dice rolled were ${JSON.stringify(roll.rolled)})`
            say(result)
            console.log('get resuilt' + result)
            if (weapon.name != player.lastweaponattackedwith) {
                console.log('writing back')
                db.setPlayer(user, user, 'set', ['lastweaponattackedwith', weapon.name], Date.now(), function (err, settedplayer) {
                    console.log('writing returning after setting ' + weapon.name + ' see ' + settedplayer.lastweaponattackedwith)
                    return
                })
            } else {

                return
            }
        }

    })
}

module.exports.damage = function (msg, params, say) {
    let db = require('./db')(require('./persist')(msg._slapp.client, { token: msg.meta.app_token, schema: 'dnd' }))
    let user = msg.body["user_name"]

    db.getPlayer(user, function (err, player) {
        if (err) throw err
        if (player) {
            let weapon = getWeapon(player, [player.lastweaponattackedwith])

            let mechanics = require('./mechanics.js')
            rollText = `${weapon.damage}+${mechanics.getModifier(player, weapon.damagemodifier)}`

            let flavour = ``
            let roll = new r().roll(rollText)
            if (params && params.length > 0) {
                flavour = ` ${params.join(' ')}`
            }
            let result = `@${user} made an damage roll (${weapon.name}${flavour}) of  _${rollText}_ for and got *${roll.result}* (dice rolled were ${JSON.stringify(roll.rolled)})`

            return say(result)

        }
    })
}