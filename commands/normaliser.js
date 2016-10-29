var synonyms = [
    ['strength', 'str'],
    ['intelligence', 'int'],
    ['charisma', 'cha'],
    ['dexterity', 'dex'],
    ['constitution', 'con']
    ['wisdom', 'wis']        
]

module.exports.toNormalForm = function(s) {
    for(var synset in synonyms) {
        for(var syn in synonyms[syn]) {
            if(syn == s.toLowerCase) {
                return synset[0]
            }
        }
    }
    return null;
}