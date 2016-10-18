'use strict'
const express = require('express')
const Slapp = require('slapp')
const BeepBoopConvoStore = require('slapp-convo-beepboop')
const BeepBoopContext = require('slapp-context-beepboop')


const Roll = require('./flows/roll/index.js')

console.log(new Roll().roll('d20').result)

console.log('t:' + process.env.SLACK_VERIFY_TOKEN)

if (!process.env.PORT) throw Error('PORT missing but required')



var slapp = Slapp({
  record: 'out.jsonl',
  convo_store: BeepBoopConvoStore(),
  context: BeepBoopContext()
})

for(var m in slapp._middleware) {
  console.log("key:" + m)
  console.log(slapp._middleware[m])
}

require('beepboop-slapp-presence-polyfill')(slapp, { debug: true })
require('./flows')(slapp)
var app = slapp.attachToExpress(express())

app.get('/', function (req, res) {
  res.send('Hello')
})

app.post("/", function(req,res) {
  console.log(req)
});

console.log('Listening on :' + process.env.PORT)
app.listen(process.env.PORT)
