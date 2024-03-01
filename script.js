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
        let glyphEls = letter.children[0].children;
        let scroll_pos = scroll_positions[i];
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
    const scroll_pos = scroll_positions[parseInt(nameLetter.style.getPropertyValue('--letter-index'))];
    scrollLetterTo(nameLetter, parseInt(scroll_pos) + number);
}

function set_scroll_position_looped(nameLetter, scroll_pos) {
    nameLetter.current_scroll_pos = scroll_pos;
    const scroll_pos_mod = mod(scroll_pos, parseInt(nameLetter.style.getPropertyValue('--letter-glyph-count')));
    nameLetter.style.setProperty('--letter-scroll', scroll_pos_mod);
}

async function scroll_animation(nameLetter) {
    // Thank you t3ssel8r
    // https://youtu.be/KPoeNZZ6H4s

    const letter_index = parseInt(nameLetter.style.getPropertyValue('--letter-index'));
    const f = 5;
    const zeta = 1;
    const r = 0.1;

    const k1 = zeta / (Math.PI * f);
    const k2 = 1 / (4 * Math.PI * Math.PI * f * f);
    const k3 = (r * zeta) / (2 * Math.PI * f);

    const epsilon = 0.001;

    //initialization
    let scroll_pos = nameLetter.current_scroll_pos;
    let scroll_velocity = 0;
    let prev_time = performance.now();
    let prev_x = scroll_pos;

    while (true) {
        const time = performance.now();
        const dt = (time - prev_time) * 0.001;
        prev_time = time;

        const x = scroll_positions[letter_index];
        const dx = x - prev_x;
        prev_x = x;

        scroll_pos += scroll_velocity * dt;
        const scroll_acc = (x + (k3 * dx) - scroll_pos - (k1 * scroll_velocity)) / k2;
        scroll_velocity += scroll_acc * dt;

        set_scroll_position_looped(nameLetter, scroll_pos);

        if (Math.abs(scroll_velocity) < epsilon && Math.abs(scroll_pos - x) < epsilon) {
            set_scroll_position_looped(nameLetter, x);
            break;
        } else {
            await new Promise(r => setTimeout(r, 2));
        }
    }
}

function scrollLetterTo(nameLetter, scroll_pos) {
    const letter_index = parseInt(nameLetter.style.getPropertyValue('--letter-index'));
    scroll_positions[letter_index] = scroll_pos;
    if (!nameLetter.is_scrolling) {
        nameLetter.is_scrolling = true;
        scroll_animation(nameLetter).then(_ => nameLetter.is_scrolling = false);
    }
    on_glyph_selection_change();
}

function scrollLetterToGlyph(nameLetter, glyph) {
    const glyph_count = nameLetter.letter_glyph_count;
    const current_scroll = nameLetter.current_scroll_pos;
    const offset = Math.floor(current_scroll / glyph_count) * glyph_count;

    const glyphs = [].concat(...(Array.from(nameLetter.children)
        .map((el) => [...el.children])));

    const glyph_index = glyphs.indexOf(glyph);
    
    scrollLetterTo(nameLetter, glyph_index - selected_glyph_index + offset);
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

        while (scroll_positions.length <= i) {
            // Default scroll position makes the first glyph selected
            scroll_positions.push((-selected_glyph_index));
        }
        nameLetter.classList.add('name-letter');
        nameLetter.style.setProperty('--letter-index', i.toString());
        nameLetter.letter_index = i;
        nameLetter.style.setProperty('--letter-bg-color', letter_colors[i % letter_colors.length]);
        nameLetter.style.setProperty('--letter-glyph-count', glyphs.length.toString());
        nameLetter.letter_glyph_count = glyphs.length;

        set_scroll_position_looped(nameLetter, scroll_positions[i]);
        nameLetter.is_scrolling = false;
        nameLetter.addEventListener('wheel', on_scroll);

        let nameLetterScroll = document.createElement('div');

        // for each glyph (option)
        for (let j = 0; j < glyphs.length; j++) {
            let glyph = glyphs[j];
            let glyphElement = document.createElement('div');
            glyphElement.classList.add('glyph');
            glyphElement.textContent = glyph;
            nameLetterScroll.appendChild(glyphElement);
        }
        nameLetter.appendChild(nameLetterScroll.cloneNode(true));
        nameLetter.appendChild(nameLetterScroll);

        nameLetter.querySelectorAll('.glyph').forEach(glyph => {
            glyph.onclick = () => {
                scrollLetterToGlyph(nameLetter, glyph);
            }
        });

        function on_scroll(e) {
            e.preventDefault();
            scrollLetterBy(nameLetter, Math.sign(e.deltaY));
        }

        nameContainer.appendChild(nameLetter);

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
    if (text.length === 0) {
        return [false, false];
    }
    const regex_valid = /^((^[aeiou]|[pksmnl][aeiou]|[jt][aeou]|w[aei])([mn](?![mn]))?)+$/i;
    const regex_acceptable = /^[aeiouwpsmnljtk]+$/i;
    const is_capitalized = (text[0] === text[0].toUpperCase()
        && text.substring(1) === text.substring(1).toLowerCase());
    return ([regex_valid.test(text) && is_capitalized, regex_acceptable.test(text)]);
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
    const [letters_valid, letters_acceptable] = validate_word(letters);
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
    if (letters_acceptable) {
        set_letters(letters.toLowerCase());
    }
    if (textBox.value === "") {
        set_letters("sonja");
    }
}

function on_glyph_selection_change() {
    const selectedGlyphs = get_selected_glyphs();
    set_definitions(selectedGlyphs);
    //console.log(selectedGlyphs);
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