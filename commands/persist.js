function checkOrCreateChannel(slack, token, requestedChannel, cb) {
    slack.channels.info({ token: token, channel: channel }, function (err, channel) {
        if (err && err == 'Error: channel_not_found') {
            console.log('creating channel:'+requestedChannel)
            slack.channels.create({ token: token, name: requestedChannel }, function (errr, channel) {
                if (errr) return cb('channels.create::' + errr)
                return cb()
            })
        } else if (err) {
            return cb('channels.info::' + err)
        } else {
            return cb(null)
        }
    })
}


function setData(slack, token, schema, channel, key, value, cb) {
    slack.files.upload({ token: token, content: JSON.stringify(value, null, 4), filetype: 'json', filename: schema + '.' + key + '.json' }, function (err, file) {
        if (err) return cb('files.upload::' + err)
        value.updated = file.updated
        return cb(null, value)
    })
}

module.exports = function (slack, opts) {
    if(!opts) opts = {}
    if (!opts.schema) {
        throw `No schema passed, try require('slack-persist')(slack, {schema: 'YourAppName'})`
    }
    if (!opts.token) {
        throw `No token passed, try require('slack-persist')(slack, {token: 'VALLID TOKEN'})`
    }
    if (!opts.channel) {
        opts.channel = 'data'
    }
    let persistance = {}

    persistance.set = function (key, value, cb) {
        if (!this.channelCreated) {
            console.log('about to check channel ' + opts.channel + ' is created')
            checkOrCreateChannel(slack, opts.token, opts.channel, function (err) {
                if (err) return cb('checkOrCreateChannel::' + err)
                this.channelCreated = true;
                
                setData(slack, opts.token, opts.schema, opts.channel, key, function (err, savedValue) {
                    if (err) return cb('setData::' + err)
                    return cb(null, savedValue)
                })
            })
        } else {
            setData(slack, opts.token, opts.schema, opts.channel, key, function (err, savedValue) {
                if (err) return cb('setData::' + err)
                return cb(null, savedValue)
            })
        }
    }
    persistance.get = function (key, cb) {
        if (!this.channelCreated) {

        }
    }
    persistance.del = function (token, key, cb) {
        if (!this.channelCreated) {

        }
    }

    return persistance
}