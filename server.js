'use strict'
const express = require('express')
const Slapp = require('slapp')
const BeepBoopConvoStore = require('slapp-convo-beepboop')
const BeepBoopContext = require('slapp-context-beepboop')


const Roll = require('./flows/roll/index.js')

console.log(new Roll().roll('d20').result)

console.log('SLACK_VERIFY_TOKEN::' + process.env.SLACK_VERIFY_TOKEN)


var o = {
  name: 'griswold'
}
var aa = require('./commands/validation.js')
aa.applyToObject(o, "set", ['level',1])

console.log(JSON.stringify(o));

aa.applyToObject(o, "set", ['level',1, "feats", "heal"])

aa.applyToObject(o, "add", ['level',1, "feats", "toughness"])

aa.applyToObject(o, "set", ['level',2, "feats", "bless"])

aa.applyToObject(o, "add", ['level',2, "feats", "sanctify"])


require('./commands/validation.js').applyToObject(o, "set", ['equipment', 'backpack', 'sword'])

console.log(JSON.stringify(o));

require('./commands/validation.js').applyToObject(o, "add", ['equipment', 'backpack', 'axe'])

console.log(JSON.stringify(o));

if (!process.env.PORT) throw Error('PORT missing but required')



var slapp = Slapp({
  record: 'out.jsonl',
  convo_store: BeepBoopConvoStore(),
  context: BeepBoopContext()
})


require('beepboop-slapp-presence-polyfill')(slapp, { debug: true })
require('./flows')(slapp)
require('./commands')(slapp)

//slapp.client.users.list()

var app = slapp.attachToExpress(express())

app.get('/', function (req, res) {
  res.send('Hello')
})

app.post("/", function(req,res) {
  console.log(req)
});



console.log('Listening on :' + process.env.PORT)
app.listen(process.env.PORT)
