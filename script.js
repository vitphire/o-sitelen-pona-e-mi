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
    "a":"emphasis particle",
    "akesi":"reptile, amphibian",
    "ala":"no, not, zero",
    "alasa":"hunt, attempt",
    "ale":"all, everything, 100",
    "anpa":"bottom, under",
    "ante":"different, other",
    "anu":"selection particle (or)",
    "awen":"enduring, staying",
    "e":"direct object particle",
    "en":"subject particle",
    "epiku":"epic",
    "esun":"market, trade",
    "ijo":"thing, object",
    "ike":"bad, negative",
    "ilo":"tool, device",
    "insa":"centre, inside",
    "jaki":"disgusting, unclean",
    "jan":"human being, person",
    "jelo":"yellow",
    "jo":"to have/hold",
    "kala":"fish",
    "kalama":"sound",
    "kama":"arrival, coming, future",
    "kasi":"plant, vegetation",
    "ken":"ability, possibility",
    "kepeken":"via, usage",
    "kijetesantakalu":"raccoons + other Procyonidae",
    "kili":"fruit, vegetable",
    "kin":"too, also",
    "kipisi":"cut, sharp",
    "kiwen":"hard object",
    "ko":"semi-solid",
    "kon":"air, essence",
    "kule":"color",
    "kulupu":"community, group",
    "kute":"ear, to hear",
    "la":"context particle",
    "lanpan":"take, seize",
    "lape":"sleep, rest",
    "laso":"blue, green",
    "lawa":"head, mind, lead",
    "leko":"cube, square",
    "len":"cloth, hidden",
    "lete":"cold",
    "li":"predicate particle",
    "lili":"little, few",
    "linja":"line, cord",
    "lipu":"paper, flat thing",
    "loje":"red, reddish",
    "lon":"truth, existance",
    "luka":"arm, hand",
    "lukin":"eye, see",
    "lupa":"hole, door",
    "ma":"earth, soil",
    "mama":"parent, creator",
    "mani":"money",
    "meli":"woman, female",
    "meso":"midpoint, medium",
    "mi":"I, me, we, us",
    "mije":"man, male",
    "misikeke":"medicine",
    "moku":"to consume, consumable thing",
    "moli":"death",
    "monsi":"back, behind",
    "monsuta":"fear, monster",
    "mu":"moo, oink, bark",
    "mun":"moon, star",
    "musi":"artistic, fun",
    "mute":"many, 20",
    "n":"consideration particle",
    "namako":"spice, extra",
    "nanpa":"number",
    "nasa":"unusual, silly",
    "nasin":"method, road",
    "nena":"bump, hill",
    "ni":"that, this",
    "nimi":"name, word",
    "noka":"foot, leg, bottom",
    "o":"attention particle",
    "oko":"eye",
    "olin":"love",
    "ona":"he, she, it, they",
    "open":"begin, open",
    "pakala":"broken",
    "pali":"work, do",
    "palisa":"rod, stick",
    "pan":"grain, bread",
    "pana":"give, send",
    "pi":"modifier grouping particle",
    "pilin":"heart, feeling",
    "pimeja":"black, dark",
    "pini":"ended, finished, past",
    "pipi":"insect",
    "poka":"hip, side",
    "poki":"container",
    "pona":"good, positive",
    "sama":"same, similar",
    "seli":"heat, fire",
    "selo":"skin, boundary",
    "seme":"what? which?",
    "sewi":"top, above, spiritual",
    "sijelo":"body, form",
    "sike":"ball, circular",
    "sin":"new, fresh",
    "sina":"you",
    "sinpin":"front, wall",
    "sitelen":"symbol, mark",
    "soko":"fungus, fungi",
    "sona":"knowledge",
    "soweli":"animal",
    "suli":"big, important",
    "suno":"sun, light",
    "supa":"horizontal surface",
    "suwi":"sweet, cute",
    "tan":"origin, cause",
    "taso":"only, alone",
    "tawa":"movement",
    "telo":"water, liquid",
    "tenpo":"time",
    "toki":"communication",
    "tomo":"indoor space",
    "tonsi":"non-binary, trans",
    "tu":"two",
    "unpa":"sex",
    "uta":"mouth",
    "utala":"fight",
    "walo":"white",
    "wan":"unique, 1",
    "waso":"bird",
    "wawa":"strength, energy",
    "weka":"abscence, away",
    "wile":"want, need",
}));