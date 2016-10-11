'use strict'
const os = require('os')

module.exports = (slapp) => {

    slapp.command('/roll', /.*/, (msg, text) => {
        var rolltext = msg.body.text;

        if (!msg.body || !msg.body.text) {
            msg.respond(":sob Sorry, I didn't understand you.  Try something like 2d6 or d20 or 3d6+4.  See https://github.com/troygoode/node-roll for more advanced examples");
        } else {
            try {               
    
                msg.respond(new require('roll')().roll(msg.body.text).result)
            } catch(e) {
                msg.response(e);
            }
            
        }
    })
}