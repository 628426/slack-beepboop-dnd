function checkOrCreateChannel(slack, token, requestedChannel, cb) {
    slack.channels.info({ token: token, channel: requestedChannel }, function (err, channel) {
        console.log(`${err}]`)
        if (err && err == 'Error: channel_not_found') {
            console.log('creating channel:' + requestedChannel)
            slack.channels.create({ token: token, name: requestedChannel }, function (errr, channel) {
                if (errr && errr != 'Error: name_taken') return cb('channels.create::' + errr)
                return cb()
            })
        } else if (err) {
            return cb('channels.info::' + err)
        } else {
            return cb(null)
        }
    })
}

function getData(slack, token, schema, channel, key, cb) {
    slack.search.files({ token: token, sort: 'timestamp', count: 1, query: schema + '.' + key + '.json' }, function (err, results) {
        if (err) return cb('search.files:' + err)
        if (!results || !results.files || !results.files.total) return cb(`search.files returned ${JSON.stringify(results)}`)
        let id = results.files.matches[0].id
        slack.files.info({ token: token, file: id, count: 1 }, function (errr, file) {
            if (errr) return cb('files.info:' + errr)
            if (!file) return cb(`files.info returned null`)
            return JSON.parse(file.file.content)
        })
    })
}

function setData(slack, token, schema, channel, key, value, cb) {
    slack.files.upload({ token: token, content: JSON.stringify(value, null, 4), filetype: 'json', filename: schema + '.' + key + '.json', channels: channel }, function (err, file) {
        console.log(`${JSON.stringify(file)}]`)
        if (err) return cb('files.upload::' + err)
        value.updated = file.updated
        return cb(null, value)
    })
}

module.exports = function (slack, opts) {
    if (!opts) opts = {}
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
            checkOrCreateChannel(slack, opts.token, opts.channel, function (err) {
                if (err) return cb('checkOrCreateChannel::' + err)
                this.channelCreated = true;

                setData(slack, opts.token, opts.schema, opts.channel, key, value, function (errr, savedValue) {
                    if (errr) return cb('setData::' + errr)
                    return cb(null, savedValue)
                })
            })
        } else {
            setData(slack, opts.token, opts.schema, opts.channel, key, value, function (err, savedValue) {
                if (err) return cb('setData::' + err)
                return cb(null, savedValue)
            })
        }
    }
    persistance.get = function (key, cb) {
        if (!this.channelCreated) {
            checkOrCreateChannel(slack, opts.token, opts.channel, function (err) {
                if (err) return cb('checkOrCreateChannel::' + err)
                this.channelCreated = true;

                getData(slack, opts.token, opts.schema, opts.channel, key, function (errr, savedValue) {
                    if (errr) return cb('setData::' + errr)
                    return cb(null, savedValue)
                })
            })
        } else {
            getData(slack, opts.token, opts.schema, opts.channel, key, function (err, savedValue) {
                if (err) return cb('setData::' + err)
                return cb(null, savedValue)
            })
        }
    }
    persistance.del = function (token, key, cb) {
        if (!this.channelCreated) {

        }
    }

    return persistance
}