const Dictionary = {
    /**
     * Returns the definition of a given glyph.
     * @param glyph
     * @returns {string}
     */
    getDefinition(glyph) {
        return this.definitions.get(glyph);
    },

    /**
     * Returns an array of all glyphs that start with the given letter.
     * @param {string} letter
     * @returns {string[]}
     */
    getGlyphs(letter) {
        const glyphs = [];
        for (let definition of this.definitions.entries()) {
            const [glyph, _] = definition;
            if (glyph.startsWith(letter)) {
                glyphs.push(glyph);
            }
        }
        return glyphs;
    },

    // TODO: Linku integration
    definitions: new Map(Object.entries({
        "a": "emphasis particle",
        "akesi2": "reptile, amphibian",
        "ala": "no, not, zero",
        "alasa": "hunt, attempt",
        "ale": "all, everything, 100",
        "anpa": "bottom, under",
        "ante": "different, other",
        "anu": "selection particle (or)",
        "awen": "enduring, staying",
        "e": "direct object particle",
        "en": "subject particle",
        "epiku": "epic",
        "esun": "market, trade",
        "ijo": "thing, object",
        "ike": "bad, negative",
        "ilo": "tool, device",
        "insa": "centre, inside",
        "jaki": "disgusting, unclean",
        "jan": "human being, person",
        "jelo": "yellow",
        "jo": "to have/hold",
        "kala": "fish",
        "kalama": "sound",
        "kama": "arrival, coming, future",
        "kasi": "plant, vegetation",
        "ken": "ability, possibility",
        "kepeken": "via, usage",
        "kijetesantakalu": "raccoons + other Procyonidae",
        "kili": "fruit, vegetable",
        "kin": "too, also",
        "kipisi": "cut, sharp",
        "kiwen": "hard object",
        "ko": "semi-solid",
        "kon": "air, essence",
        "kule": "color",
        "kulupu": "community, group",
        "kute": "ear, to hear",
        "la": "context particle",
        "lanpan": "take, seize",
        "lape": "sleep, rest",
        "laso": "blue, green",
        "lawa": "head, mind, lead",
        "leko": "cube, square",
        "len": "cloth, hidden",
        "lete": "cold",
        "li": "predicate particle",
        "lili": "little, few",
        "linja": "line, cord",
        "lipu": "paper, flat thing",
        "loje": "red, reddish",
        "lon": "truth, existance",
        "luka": "arm, hand",
        "lukin": "eye, see",
        "lupa": "hole, door",
        "ma": "earth, soil",
        "mama": "parent, creator",
        "mani": "money",
        "meli": "woman, female",
        "meso": "midpoint, medium",
        "mi": "I, me, we, us",
        "mije": "man, male",
        "misikeke": "medicine",
        "moku": "to consume, consumable thing",
        "moli": "death",
        "monsi": "back, behind",
        "monsuta": "fear, monster",
        "mu": "moo, oink, bark",
        "mun": "moon, star",
        "musi": "artistic, fun",
        "mute": "many, 20",
        "n": "consideration particle",
        "namako": "spice, extra",
        "nanpa": "number",
        "nasa": "unusual, silly",
        "nasin": "method, road",
        "nena": "bump, hill",
        "ni": "that, this",
        "nimi": "name, word",
        "noka": "foot, leg, bottom",
        "o": "attention particle",
        "oko": "eye",
        "olin": "love",
        "ona": "he, she, it, they",
        "open": "begin, open",
        "pakala": "broken",
        "pali": "work, do",
        "palisa": "rod, stick",
        "pan": "grain, bread",
        "pana": "give, send",
        "pi": "modifier grouping particle",
        "pilin": "heart, feeling",
        "pimeja": "black, dark",
        "pini": "ended, finished, past",
        "pipi": "insect",
        "poka": "hip, side",
        "poki": "container",
        "pona": "good, positive",
        "sama": "same, similar",
        "seli": "heat, fire",
        "selo": "skin, boundary",
        "seme": "what? which?",
        "sewi": "top, above, spiritual",
        "sijelo": "body, form",
        "sike": "ball, circular",
        "sin": "new, fresh",
        "sina": "you",
        "sinpin": "front, wall",
        "sitelen": "symbol, mark",
        "soko": "fungus, fungi",
        "sona": "knowledge",
        "soweli": "animal",
        "suli": "big, important",
        "suno": "sun, light",
        "supa": "horizontal surface",
        "suwi": "sweet, cute",
        "tan": "origin, cause",
        "taso": "only, alone",
        "tawa": "movement",
        "telo": "water, liquid",
        "tenpo": "time",
        "toki": "communication",
        "tomo": "indoor space",
        "tonsi": "non-binary, trans",
        "tu": "two",
        "unpa": "sex",
        "uta": "mouth",
        "utala": "fight",
        "walo": "white",
        "wan": "unique, 1",
        "waso": "bird",
        "wawa": "strength, energy",
        "weka": "absence, away",
        "wile": "want, need",
    })),
}



