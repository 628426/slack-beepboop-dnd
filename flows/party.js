'use strict'
const os = require('os')
const Roll = require('./roll/index.js')

module.exports = (slapp) => {

    slapp.command('/party', /.*/, (msg, text) => {
        let token = msg.meta.bot_token
        let id = msg.body.event.item.ts
        let channel = msg.body.event.item.channel
        slapp.client.usergroups.list({ token }, function (err, data) {
            console.log(process.env.SLACK_TOKEN)
            for (var usergroup in data) {
                console.log(usergroup.name)
                slapp.client.users.list({ token, usergroup }, function (err, data) {
                    slapp.client.users.info({ token, data }, function (err, data) {
                        msg.say(data.name)
                    })
                })
            }
        })

    })
}


