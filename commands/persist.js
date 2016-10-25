function checkOrCreateChannel(slack, token, channel, cb) {
    slack.channels.info({ token: token }, function (err, channel) {
        if (err && err == 'channel_not_found') {
            slack.channels.create({ token: token }, function (err, channel) {
                if (err) return cb(err)
                cb()
            })
        } else if (err) {
            return cb(err)
        } else {
            return cb(null)
        }
    })
}


function setData(slack, token, schema, channel, key, value, cb) {
    slack.files.upload({ token: token, content: JSON.stringify(value, null, 4), filetype: 'json', filename: schema + '.' + key + '.json' }, function (err, file) {
        if (err) return cb(err)
        value.updated = file.updated
        cb(null, value)
    })
}

module.exports = function (slack, opts) {
    if (!opts || !opts.schema) {
        throw `No schema passed, try require('slack-persist')(slack, {schema: 'YourAppName'})`
    }
    if (opts && !opts.channel) {
        opts.channel = 'data'
    }
    let persistance = {}

    persistance.set = function (token, key, value, cb) {
        if (!this.channelCreated) {
            checkOrCreateChannel(slack, token, function (err) {
                if(err) return cb(err)
                this.channelCreated = true;
                setData(slack, token, opts.schema, opts.channel, key, function (err, savedValue) {
                    if (err) return cb(err)
                    return cb(null, savedValue)
                })
            })
        } else {
            setData(slack, token, opts.schema, opts.channel, key, function (err, savedValue) {
                if (err) return cb(err)
                return cb(null, savedValue)
            })
        }
    }
    persistance.get = function (token, key, cb) {
        if (!this.channelCreated) {

        }
    }
    persistance.del = function (token, key, cb) {
        if (!this.channelCreated) {

        }
    }

    return persistance
}