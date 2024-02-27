function update_name_letters() {
    const nameOutline = document.getElementById('name-outline');
    const nameLetters = document.getElementById('name-container')
        .querySelectorAll('.name-letter');
    let nameOutlineText = '[';
    for (let i = 0; i < nameLetters.length; i++) {
        let letter = nameLetters[i];
        let glyphEls = letter.querySelectorAll('.glyph');
        let selected = parseInt(letter.style.getPropertyValue('--letter-selected'));
        let glyph = glyphEls[selected +1];
        nameOutlineText += glyph.textContent + ' ';
    }
    nameOutlineText += ']';
    nameOutline.textContent = nameOutlineText;
}

function set_letters(letters) {
    const nameContainer = document.getElementById('name-container');
    let els = nameContainer.querySelectorAll('.name-letter');
    els.forEach(el => {
        el.remove();
    });

    for (let i = 0; i < letters.length; i++) {
        const letter = letters[i];
        // create element to hold the letter glyphs
        let nameLetter = document.createElement('div');
        for (let definition of definitions.entries()) {
            const [glyph, _] = definition;
            if (glyph.startsWith(letter)) {
                let glyphElement = document.createElement('div');
                glyphElement.classList.add('glyph');
                glyphElement.textContent = glyph;
                nameLetter.appendChild(glyphElement);
            }
        }
        nameLetter.classList.add('name-letter');
        nameLetter.style.setProperty('--letter-index', i.toString());
        nameLetter.style.setProperty('--letter-color', letter_colors[i % letter_colors.length]);
        nameLetter.style.setProperty('--letter-selected', '0');
        nameContainer.appendChild(nameLetter);
    }

    update_name_letters();
}

function onInputChange() {
    const textBox = document.getElementById('name-text-box');
    const statusText = document.getElementById('status-text');
    const textBoxContainer = document.getElementById('name-input-container');

    textBox.size = Math.max(4, textBox.value.length);
    const [valid, length] = validate_text(textBox.value);
    if (valid) {
        statusText.textContent = 'Valid!';
        textBoxContainer.classList.add('valid');
        textBoxContainer.classList.remove('invalid');
        set_letters(textBox.value.substring(length).toLowerCase());
    } else {
        statusText.textContent = 'Invalid!';
        textBoxContainer.classList.add('invalid');
        textBoxContainer.classList.remove('valid');
    }
}

function validate_text(text) {
    const glyphs = ["a", "a2", "a3", "a4", "a5", "akesi", "akesi2", "ala", "alasa", "ale", "anpa", "ante",
        "anu", "awen", "e", "en", "esun", "ijo", "ike", "ilo", "insa", "jaki", "jan", "jelo", "jo", "kala", "kala2",
        "kalama", "kama", "kasi", "ken", "kepeken", "kili", "kiwen", "ko", "kon", "kule", "kulupu", "kute", "la",
        "lape", "laso", "lawa", "len", "lete", "li", "lili", "linja", "lipu", "loje", "lon", "luka", "lukin", "lupa",
        "ma", "mama", "mani", "mi", "mi2", "moku", "moli", "moli2", "monsi", "mu", "mu2", "mun", "musi", "mute",
        "mute2", "nanpa", "nasa", "nasin", "nena", "ni", "ni2", "ni3", "ni4", "ni5", "ni6", "ni7", "ni8", "nimi",
        "noka", "o", "o2", "olin", "olin1", "olin2", "ona", "ona2", "open", "pakala", "pali", "palisa", "pan",
        "pana", "pi", "pilin", "pimeja", "pini", "pipi", "poka", "poki", "pona", "pu", "sama", "seli", "selo",
        "seme", "sewi", "sewi2", "sijelo", "sike", "sin", "sina", "sina2", "sinpin", "sitelen", "sona", "soweli",
        "suli", "suno", "supa", "suwi", "tan", "taso", "tawa", "telo", "tenpo", "toki", "tomo", "tu", "unpa",
        "uta", "uta2", "utala", "walo", "wan", "waso", "wawa", "weka", "wile", "wile2", "kijetesantakalu", "kin",
        "kin2", "ku", "ku2", "ku3", "ku4", "ku5", "ku6", "ku7", "leko", "meli", "meli2", "meli3", "mije", "mije2",
        "mije3", "monsuta", "n", "n2", "namako", "namako2", "tonsi", "tonsi2", "tonsi3", "epiku", "epiku1", "kipisi",
        "lanpan", "lanpan2", "lanpan3", "meso", "meso2", "misikeke", "misikeke2", "oko", "soko", "soko2", "soko1",
        "ali", "apeja", "jasima", "kiki", "kiki2", "kiki3", "kiki4", "kokosila", "kokosila2", "linluwi", "linluwi2",
        "linluwi3", "linluwi4", "majuna", "majuna2", "nimisin", "oke", "omekapo", "powe", "usawi", "wuwojiti",
        "yupekosi", "isipin", "kamalawala", "kapesi", "kapesi2", "misa", "misa2", "misa3", "misa4", "misa5", "misa6",
        "pake", "puwa", "taki", "taki2", "te", "to", "unu", "wa", "wa2", "jami", "jonke", "konwe", "kulijo",
        "melome", "mijomi", "mulapisu", "nja", "ojuta", "owe", "pika", "pika2", "po", "san", "soto", "sutopatikuna",
        "teje", "wasoweli", "wekama", "alente", "alu", "eliki", "enko", "enko2", "enko3", "ete", "ete2", "je",
        "je2", "jule", "jume", "kalamARR", "kalijopilale", "kan", "ke", "ke2", "kepen", "kese", "ki", "kisa",
        "kosan", "kulu", "kuntu", "likujo", "molusa", "nalanja", "nalanja1", "natu", "nele", "okepuma", "oki",
        "omekalike", "omen", "oni", "oni2", "pa", "pakola", "pakola2", "pasila", "pata", "peta", "peto", "Pingo",
        "pipo", "polinpin", "pomotolo", "poni", "poni2", "sikomo", "slape", "tokana", "tokana2", "tokana3", "tuli",
        "waleja", "wawajete", "we (content word)", "yutu", "ako", "ako2", "kikulo", "kutopoma", "lijokuku",
        "lijokuku2", "mamasi", "mamasina", "masalo", "pipolo", "silapa", "silapa1", "silapa2", "silapa3", "sipije",
        "siwala", "teken", "waken", "aka", "aku", "anta", "apelo", "awase", "eki", "enepi", "ewe", "i", "iki",
        "iki2", "ipi", "ipi2", "itomi", "jaku", "jalan", "jans", "kana", "kapa", "kikolo", "kokoliko", "konsi",
        "kosikosa", "loka", "lokon", "lo", "lu2", "neja", "nowi", "nu2", "nuwa", "olala", "panke", "samu",
        "sapelipope", "sikako", "sipi", "ta", "ten", "ten2", "tona", "umesu", "umesu2", "we1 (particle)", "wi",
        "wi2", "wiwi", "akesiv", "akesiv2", "ana", "ani", "api", "api2", "api3", "api4", "elen", "ene", "eni",
        "epikule", "iseki", "jew", "kalapisituwi", "kijosin", "kolo", "koni", "kulepiku", "lansan", "lato", "masu",
        "matula", "me", "nasin+mani", "opasan", "saja", "sisi", "snoweli", "soni", "sowoli", "su", "su2", "tasun",
        "tasun1", "tasun2", "tasun3", "taasun", "taaasun", "topo", "wiju", "wiki", "wowujiti", "ijo+ni+li+seme",
        "interpunct", "colon"];

    let valid = false;
    let starting_glyph = "";
    for (const glyph of glyphs) {
        if (text.startsWith(glyph + " ")) {
            valid = true;
            starting_glyph = glyph;
            break;
        }
    }
    if (!valid) {
        return false;
    }
    let rest = text.substring(starting_glyph.length + 1);
    const regex = /^((^[aeiou]|[pksmnl][aeiou]|[jt][aeou]|w[aei])([mn](?![mn]))?)+$/;
    return [rest.length > 0
    && rest[0] === rest[0].toUpperCase()
    && rest.substring(1) === rest.substring(1).toLowerCase()
    && regex.test(rest.toLowerCase()),
        starting_glyph.length + 1
    ]
}

document.addEventListener('DOMContentLoaded', onInputChange);

const letter_colors = [
    '#A4BF8A', '#A6374B', '#0D688C',
    '#4B4073', '#3A9E7A', '#C26747',
    '#2D4F94', '#BD9A5C', '#6C3570',
]

const definitions = new Map(Object.entries({
    "a": "(emphasis, emotion or confirmation)",
    "akesi": "reptile, amphibian",
    "ala": "no, not, zero; [~ ala ~] (used to form a yes-no question); nothing",
    "alasa": "to hunt, forage, seek | ALT (pv.) try to, attempt",
    "ale": "all; abundant, countless, bountiful, every, plentiful; abundance, everything, life, universe; one hundr",
    "anpa": "bowing down, downward, humble, lowly, dependent | ALT bottom, lower part, under, below, floor, beneath",
    "ante": "different, altered, changed, other",
    "anu": "or | ALT choose, decide",
    "awen": "enduring, kept, protected, safe, waiting, staying; (pv.) to continue to, to keep",
    "e": "(before the direct object)",
    "en": "(between multiple subjects)",
    "epiku": "epic, cool, awesome, amazing",
    "esun": "market, shop, fair, bazaar, business transaction",
    "ijo": "thing, phenomenon, object, matter",
    "ike": "bad, negative; non-essential, irrelevant | ALT complicated, complex",
    "ilo": "tool, implement, machine, device",
    "insa": "centre, content, inside, between; internal organ, stomach",
    "jaki": "disgusting, obscene, sickly, toxic, unclean, unsanitary",
    "jan": "human being, person, somebody",
    "jelo": "yellow, yellowish",
    "jo": "to have, carry, contain, hold",
    "kala": "fish, marine animal, sea creature",
    "kalama": "to produce a sound; recite, utter aloud",
    "kama": "arriving, coming, future, summoned; (pv.) to become, manage to, succeed in",
    "kasi": "plant, vegetation; herb, leaf",
    "ken": "to be able to, be allowed to, can, may; possible",
    "kepeken": "to use, with, by means of",
    "kijetesantakalu": "superfamily, including raccoons, weasels, otters, skunks, and red pandas",
    "kili": "fruit, vegetable, mushroom",
    "kin": "{see a} | ALT indeed, too, also, as well",
    "kipisi": "split, cut, slice, sever; sharp",
    "kiwen": "hard object, metal, rock, stone",
    "ko": "clay, clinging form, dough, semi-solid, paste, powder",
    "kon": "air, breath; essence, spirit; hidden reality, unseen agent",
    "kule": "colorful, pigmented, painted | ALT of or relating to the LGBT+ community",
    "kulupu": "community, company, group, nation, society, tribe",
    "kute": "ear; to hear, listen; pay attention to, obey",
    "la": "(between the context phrase and the main sentence)",
    "lanpan": "take, seize, catch, receive, get",
    "lape": "sleeping, resting",
    "laso": "blue, green",
    "lawa": "head, mind; to control, direct, guide, lead, own, plan, regulate, rule",
    "leko": "stairs, square, block, corner, cube",
    "len": "cloth, clothing, fabric, textile; cover, layer of privacy",
    "lete": "cold, cool; uncooked, raw",
    "li": "(between any subject except mi alone or sina alone and its verb; also to introduce a new verb for the s",
    "lili": "little, small, short; few; a bit; young",
    "linja": "long and flexible thing; cord, hair, rope, thread, yarn | ALT line, connection",
    "lipu": "flat object; book, document, card, paper, record, website",
    "loje": "red, reddish",
    "lon": "located at, present at, real, true, existing | ALT (affirmative response)",
    "luka": "arm, hand, tactile organ; five | ALT touch/feel physically, interact, press",
    "lukin": "eye; look at, see, examine, observe, read, watch; look for, seek; (pv.) try to",
    "lupa": "door, hole, orifice, window",
    "ma": "earth, land; outdoors, world; country, territory; soil",
    "mama": "parent, ancestor; creator, originator; caretaker, sustainer",
    "mani": "money, cash, savings, wealth; large domesticated animal",
    "meli": "woman, female, feminine person; wife",
    "meso": "midpoint, medium, mediocre; neither one not the other, neither fully is nor isn't",
    "mi": "I, me, we, us",
    "mije": "man, male, masculine person; husband",
    "misikeke": "medicine, medical",
    "moku": "to eat, drink, consume, swallow, ingest",
    "moli": "dead, dying",
    "monsi": "back, behind, rear",
    "monsuta": "fear, dread; monster, predator; threat, danger",
    "mu": "(animal noise or communication) | ALT (non-speech vocalization)",
    "mun": "moon, night sky object, star | ALT glow, glowing light, light in the dark",
    "musi": "artistic, entertaining, frivolous, playful, recreation",
    "mute": "many, a lot, more, much, several, very; quantity | ALT three (or more), 20",
    "n": "(indicates thinking, pondering, recognition, agreement, or humming)",
    "namako": "{see sin} | ALT embellishment, spice; extra, additional",
    "nanpa": "-th (ordinal number); numbers",
    "nasa": "unusual, strange; silly; drunk, intoxicated",
    "nasin": "way, custom, doctrine, method, path, road",
    "nena": "bump, button, hill, mountain, nose, protuberance",
    "ni": "that, this",
    "nimi": "name, word",
    "noka": "foot, leg, organ of locomotion; bottom, lower part",
    "o": "hey! O! (vocative, imperative, or optative)",
    "oko": "{see lukin} | ALT eye, ocular, visual {cf. lukin}",
    "olin": "love, have compassion for, respect, show affection to",
    "ona": "he, she, it, they",
    "open": "begin, start; open; turn on",
    "pakala": "botched, broken, damaged, harmed, messed up | ALT (curse expletive, e.g. fuck!)",
    "pali": "do, take action on, work on; build, make, prepare",
    "palisa": "long hard thing; branch, rod, stick",
    "pan": "cereal, grain; barley, corn, oat, rice, wheat; bread, pasta",
    "pana": "give, send, emit, provide, put, release",
    "pi": "of (used to divide a second noun group that describes a first noun group) | ALT (introduces a genitive ",
    "pilin": "heart (physical or emotional); feeling (an emotion, a direct experience)",
    "pimeja": "black, dark, unlit",
    "pini": "ago, completed, ended, finished, past",
    "pipi": "bug, insect, ant, spider",
    "poka": "hip, side; next to, nearby, vicinity | ALT along with (comitative), beside",
    "poki": "container, bag, bowl, box, cup, cupboard, drawer, vessel",
    "pona": "good, positive, useful; friendly, peaceful; simple",
    "sama": "same, similar; each other; sibling, peer, fellow; as, like",
    "seli": "fire; cooking element, chemical reaction, heat source",
    "selo": "outer form, outer layer; bark, peel, shell, skin; boundary",
    "seme": "what? which?",
    "sewi": "area above, highest part, something elevated; awe-inspiring, divine, sacred, supernatural",
    "sijelo": "body (of person or animal), physical state, torso",
    "sike": "round or circular thing; ball, circle, cycle, sphere, wheel; of one year",
    "sin": "new, fresh; additional, another, extra",
    "sina": "you",
    "sinpin": "face, foremost, front, wall",
    "sitelen": "image, picture, representation, symbol, mark, writing",
    "soko": "fungus, fungi",
    "sona": "know, be skilled in, be wise about, have information on; (pv.) know how to",
    "soweli": "animal, beast, land mammal",
    "suli": "big, heavy, large, long, tall; important; adult",
    "suno": "sun; light, brightness, glow, radiance, shine; light source",
    "supa": "horizontal surface, thing to put or rest something on",
    "suwi": "sweet, fragrant; cute, innocent, adorable",
    "tan": "by, from, because of; origin, cause",
    "taso": "but, however; only",
    "tawa": "going to, toward; for; from the perspective of; moving | ALT (pv.) going to",
    "telo": "water, liquid, fluid, wet substance; beverages",
    "tenpo": "time, duration, moment, occasion, period, situation",
    "toki": "communicate, say, speak, talk, use language, think; hello",
    "tomo": "indoor space; building, home, house, room",
    "tonsi": "non-binary, gender-non-conforming | ALT trans, non-cisgender",
    "tu": "two | ALT separate, cut",
    "unpa": "have sexual relations with",
    "uta": "mouth, lips, oral cavity, jaw",
    "utala": "battle, challenge, compete against, struggle against",
    "walo": "white, whitish; light-coloured, pale",
    "wan": "unique, united; one",
    "waso": "bird, flying creature, winged animal",
    "wawa": "strong, powerful; confident, sure; energetic, intense",
    "weka": "absent, away, ignored",
    "wile": "must, need, require, should, want, wish",
}));