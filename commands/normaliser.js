var synonyms = [
    ['strength', 'str'],
    ['intelligence', 'int'],
    ['charisma', 'cha'],
    ['dexterity', 'dex'],
    ['constitution', 'con'],
    ['wisdom', 'wis'],
    ['animalhandling', 'animal','handling','animal_handling'],
    ['sleightofhand', 'sleight','sleight_of_hand'],
    ['intimidation','intimidate'],
    ['performance','perform'],
    ['persuasion','persuade'],
    ['investigation','investigate'],
    ['proficiencies', 'prof', 'proficencies'],
    ['hitpoints', 'hp'],
    ['experience','exp','xp'],
    ['ac','armor','armour']
]

var toNormalForm = function (s) { 
    try {
    if(s) {
        s = s.toLowerCase()
        for (var synset in synonyms) {
            for (var syn in synonyms[synset]) {
                if (synonyms[synset][syn] == s.toLowerCase()) {
                    return synonyms[synset][0]
                }
            }
        }
    }
    } catch(e) {
        throw `Could not get normal form of [${s}] because of ${e}\r\n ${e.stack}`
    }
    return s;
}

var getOtherForms = function (s) {
    let otherForms = []
    let n = toNormalForm(s)
    for (var synset in synonyms) {
        if (synonyms[synset][0] == n) {
            let pof = synonyms[synset].slice(1)
            for(var ofi in pof) {
                otherForms.push(pof[ofi])

            }
            break;
        }
    }
    return otherForms;
}

module.exports.getOtherForms = function(s) {
    return getOtherForms(s)
}


module.exports.getAllForms = function (s) {
    let otherForms = getOtherForms(s)
    otherForms.push(toNormalForm(s))
    return otherForms
}

module.exports.toNormalForm = function (s) {
    return toNormalForm(s)
}