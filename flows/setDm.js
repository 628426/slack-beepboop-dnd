const store = require('beepboop-persist')()

module.exports = (slapp) => {

    slapp.command('/setdm', /.*/, (msg, text) => {
        let user = msg.body["user_name"]

        store.get("DM", function(err, data) {
            if(err) {
                msg.respond(":sob Sorry, " + err + " occurred")
            }
            var dm = data || "griswold"

            if(dm != user) {
                msg.respond(":sob Sorry, @" + dm + " is currently the dm and is the only player allowed to user the /setdm command" )
            }

            store.set("DM", text, function(err) {
                if(!err) {
                    msg.say(text + " is now the dm, look out")
                }
            }) 
        })

    })
}