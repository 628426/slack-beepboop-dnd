# d&d 5e in slack?
----------
slack-beepboop-dnd is a slack bot made to support groups who want to run d&d 5e sessions using slack

The dm can input a character sheet, like so

```irc
/set player fug hitpoints 12
/set player fug wisdom 16
/set player fug proficiencies perception
```

Then at some point later the player can check perception

```irc
/check perception see if there is anyone hiding behind that curtain
```

to see the result

```irc
You rolled d20+3 for a perception check (see if anyone is hiding behind that curtain) and got 9 (dice rolled were [6])
```

The bot tries to be simple for example the above character sheet can also be entered using shorthand

```irc
/set player fug hp 12
/set player fug wis 16
/set player fug prof perception
```

and then

```irc
/get player fug hitpoints
or
/get player fug hp
```

will both return

```irc
12
```

You can get the full json object

```irc
/get player fug
```

returns

```irc 
{
    "name": "fug",
    "hp": 12,
    "wisdom": 16,
    "proficiencies": "perception"
}
```

The bot also includes an implementation of ([Troy Goode's roll package](https://npmjs.org/package/roll))

```irc
/roll 2d20b1 advantage roll due to inspiration
```

```irc
You rolled 2d20b1 (advantage roll due to inspiration) and got 14 (dice rolled were [14,2])
```

The complete list of supported commands is

```irc
/set 
/get
/roll
/check
```

All your data is stored within your slack team as json snippets uploaded to a new #data channel, and the bot source is available here, giving you full continuity for your session


# License
MIT Copyright (c) 2016
