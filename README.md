# d&d 5e in slack?
----------
slack-beepboop-dnd is a slack bot made to support groups who want to run d&d 5e sessions using slack

The dm can input a character sheet, like so

```irc
/set player fug hp 12
/set player fug wisdom 16
/set player fug proficiencies perception
```

Then at some point later the player can check perception

```irc
/check perception to see if there is anyone hiding behind that curtain
```

to see the result

```irc
You rolled _d20+3_ for a perception check (_see if anyone is hiding behind that curtain_) and got 9 (dice rolled were [6])
```

All your data is stored within your slack team as json snippets uploaded to a new #data channel, and the bot source is available here, giving you full continuity for your session


# License
MIT Copyright (c) 2016
