const store = require('beepboop-persist')()

module.exports = (slapp) => {

    slapp.command('/setdm', /.*/, (msg, text) => {
        let user = msg.body["user_name"]
        if(!text){
            msg.respond(":sob: Sorry, I couldn't understand you, you need to tell me a players name to make dm")
            return;
        }

        store.get("DM", function(err, data) {
            if(err) {
                msg.respond(":sob: Sorry, " + err + " occurred")
                return;
            }
            var dm = data || "griswold"

            if(dm != user) {
                msg.respond(":sob: Sorry, @" + dm + " is currently the dm and is the only player allowed to use the /setdm command" )
                return;
            }

            store.set("DM", text, function(err) {
                if(!err) {
                    msg.say("@" + text + " is now the dm, look out")
                }
            }) 
        })

    })
}