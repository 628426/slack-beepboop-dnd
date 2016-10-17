'use strict'
const os = require('os')
const Roll = require('./roll/index.js')


module.exports = (slapp) => {

    slapp.command('/roll', /.*/, (msg, text) => {

        try {
            if (msg.body.text = '') {
                msg.respond(":sob Sorry, I didn't understand you.  Try something like 2d6 or d20 or 3d6+4.  See https://github.com/troygoode/node-roll for more advanced examples");
            } else {
                var r = new Roll().roll(msg.body.text)
                msg.respond(r.result);
            }
        }
        catch (e) {
            msg.respond(e)
        }
    })
}