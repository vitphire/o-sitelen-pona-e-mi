const visible_glyph_count = 4;
const selected_glyph_index = 1;

const letter_colors = [
    '#A4BF8A', '#A6374B', '#0D688C',
    '#4B4073', '#3A9E7A', '#C26747',
    '#2D4F94', '#BD9A5C', '#6C3570',
]

function mod(n, m) {
    return ((n % m) + m) % m;
}

function get_selected_glyphs() {
    const nameLetters = document.getElementById('glyph-selector')
        .querySelectorAll('.name-letter');
    let nameSelectedGlyphs = [];
    for (let i = 0; i < nameLetters.length; i++) {
        let letter = nameLetters[i];
        let glyphEls = letter.querySelectorAll('.glyph');
        let scroll_pos = parseInt(letter.style.getPropertyValue('--letter-scroll'));
        let glyph = glyphEls[mod(scroll_pos + selected_glyph_index, glyphEls.length)];
        nameSelectedGlyphs.push(glyph.textContent);
    }
    return nameSelectedGlyphs.join(' ');
}

function resize_outline() {
    const nameOutline = document.getElementById('name-outline');
    const nameLetters = document.getElementById('glyph-selector')
        .querySelectorAll('.name-letter');
    nameOutline.textContent = '[' + '  '.repeat(nameLetters.length) + ' ]'
}

scroll_positions = []; // used for setting the scroll position of each letter when the name is changed

function scrollLetterBy(nameLetter, number) {
    const scroll_pos = parseInt(nameLetter.style.getPropertyValue('--letter-scroll'));
    scrollLetterTo(nameLetter, number + scroll_pos);
}

function scrollLetterTo(nameLetter, number) {
    nameLetter.style.setProperty('--letter-scroll', number.toString());
    scroll_positions[parseInt(nameLetter.style.getPropertyValue('--letter-index'))] =
        number;
    on_glyph_selection_change();
}

function set_letters(letters) {
    /**
     * Clear the existing letters and add new ones
     * letters are added to #glyph-selector
     * each letter is formatted like this:
     *
     * <div class="name-letter" style="--letter-index: 0;
     *                                 --letter-bg-color: #A4BF8A;
     *                                 --letter-scroll: 0;
     *                                 --letter-glyph-count: 10;">
     *   <div class="name-letter--scroll">
     *     <div class="glyph">a</div>
     *     <div class="glyph">akesi</div>
     *     ...
     *   </div>
     *   <div class="name-letter--scroll">
     *     <div class="glyph">a</div>
     *     <div class="glyph">akesi</div>
     *     ...
     *   </div>
     * </div>
     *
     * (the second name-letter--scroll is for infinite scrolling)
     * */


    const nameContainer = document.getElementById('glyph-selector');

    // remove existing letters
    let els = nameContainer.querySelectorAll('.name-letter');
    els.forEach(el => el.remove());

    // for each letter
    for (let i = 0; i < letters.length; i++) {
        const letter = letters[i];
        let glyphs = [];

        // get all glyph options that start with the letter
        for (let definition of definitions.entries()) {
            const [glyph, _] = definition;
            if (glyph.startsWith(letter)) {
                glyphs.push(glyph);
            }
        }

        let nameLetter = document.createElement('div');
        let nameLetterScroll = document.createElement('div');

        // for each glyph (option)
        for (let j = 0; j < glyphs.length; j++) {
            let glyph = glyphs[j];
            let glyphElement = document.createElement('div');
            glyphElement.classList.add('glyph');
            glyphElement.textContent = glyph;
            glyphElement.onclick = function () {
                scrollLetterTo(nameLetter, j - selected_glyph_index);
            }
            nameLetterScroll.appendChild(glyphElement);
        }
        nameLetter.appendChild(nameLetterScroll.cloneNode(true));
        nameLetter.appendChild(nameLetterScroll);

        function on_scroll(e) {
            console.log("scrolling")
            e.preventDefault();
            scrollLetterBy(nameLetter, Math.sign(e.deltaY));
        }

        while (scroll_positions.length <= i) {
            // Default scroll position makes the first glyph selected
            scroll_positions.push((-selected_glyph_index).toString());
        }
        nameLetter.classList.add('name-letter');
        nameLetter.style.setProperty('--letter-index', i.toString());
        nameLetter.style.setProperty('--letter-bg-color', letter_colors[i % letter_colors.length]);
        nameLetter.style.setProperty('--letter-scroll', scroll_positions[i]);
        nameLetter.style.setProperty('--letter-glyph-count', glyphs.length.toString());
        //nameLetter.onwheel = on_scroll;
        nameContainer.appendChild(nameLetter);

        nameLetter.addEventListener('wheel', on_scroll);
        console.log(nameLetter)
    }
    console.log(nameContainer)
    resize_outline();
}

function set_noun(s) {
    const noun = document.getElementById('noun');
    noun.textContent = s;
}

function validate_noun(noun) {
    const canvas = validate_noun.canvas ||
        (validate_noun.canvas = document.createElement("canvas"));
    const context = canvas.getContext("2d");
    context.font = "bold 64px sitelen-seli-kiwen-mono--asuki";
    const noun_length = context.measureText(noun).width;
    const ijo_length = context.measureText("ijo").width;
    return noun_length === ijo_length;
}

function validate_word(text) {
    const regex = /^((^[aeiou]|[pksmnl][aeiou]|[jt][aeou]|w[aei])([mn](?![mn]))?)+$/;
    return (text.length > 0
        && text[0] === text[0].toUpperCase()
        && text.substring(1) === text.substring(1).toLowerCase()
        && regex.test(text.toLowerCase()))
}

function set_definitions(selectedGlyphs) {

}

function on_name_change() {
    const textBox = document.getElementById('name-text-box');
    const statusText = document.getElementById('status-text');
    const textBoxContainer = document.getElementById('name-input-container');

    textBox.size = Math.max(4, textBox.value.length);
    const words = textBox.value.split(' ');
    const noun = words[0];
    const noun_valid = validate_noun(noun);
    const letters = words.slice(1).join(' ');
    const letters_valid = validate_word(letters);
    if (letters_valid && noun_valid) {
        statusText.textContent = 'Valid!';
        textBoxContainer.classList.add('valid');
        textBoxContainer.classList.remove('invalid');
    } else {
        statusText.textContent = 'Invalid!';
        textBoxContainer.classList.add('invalid');
        textBoxContainer.classList.remove('valid');
    }
    if (noun_valid) {
        set_noun(noun);
    }
    if (letters_valid) {
        set_letters(letters.toLowerCase());
    }
    if (textBox.value === "") {
        set_letters("sonja");
    }
}

function on_glyph_selection_change() {
    const selectedGlyphs = get_selected_glyphs();
    set_definitions(selectedGlyphs);
    console.log(selectedGlyphs);
}

document.addEventListener('DOMContentLoaded',
    () => setTimeout(() => {
        set_letters("sonja");
        on_name_change();
    }, 20))

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