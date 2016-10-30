const v = require('./validation')
const store = require('beepboop-persist')()


module.exports = function (keyword, msg, args, say) {
    require('./persist')(msg._slapp.client, { token: msg.meta.app_token, schema: 'dnd' }).get("DM", function (err, output) {
        if (err) {
            return say(`:sob: Sorry, ${err} occurred`)
        }
        if(!output) {
            return say('There is no dm.  Use /setdm to set the current dm')
        }
         else {
             return say(`@${output} is the dm, look out`)
         }
    })
}