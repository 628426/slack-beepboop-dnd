module.exports = function(keyword, msg, text, say) {
    if(!text) {
        return say(":sob: Sorry I couldn't understand you, you'll have to try harder. Try something like /setplayer fug level 1")
    }
    var args = msg.split(' ')
    if(arg.length % 2 != 0) {
        return say(":sob: Oddly, I couldn't understand you, you'll have to try harder. Try something like /setplayer fug level 1")
    }    
    
}