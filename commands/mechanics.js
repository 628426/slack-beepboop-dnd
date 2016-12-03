module.exports.getModifier = function(player, attribute) {
    if(!player[attribute]) {
        return 0;
    }
    let value = player[attribute]
    let additional = value - 10
    return Math.floor(additional/2)
}

module.exports.getProficiency = function(player) {
    if(player.level < 4) {
        return 2
    } else {
        return 0
    }
}