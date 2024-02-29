const visible_glyph_count = 4;
const selected_glyph_index = 1;
/*let scrolling = 0;*/

const letter_colors = [
    '#A4BF8A', '#A6374B', '#0D688C',
    '#4B4073', '#3A9E7A', '#C26747',
    '#2D4F94', '#BD9A5C', '#6C3570',
]

function mod(n, m) {
    return ((n % m) + m) % m;
}

/*
function show_outline_letters() {
    const nameOutline = document.getElementById('name-outline');
    const nameLetters = document.getElementById('glyph-selector')
        .querySelectorAll('.name-letter');
    let nameOutlineText = "";
    for (let i = 0; i < nameLetters.length; i++) {
        let letter = nameLetters[i];
        let glyphEls = letter.querySelectorAll('.glyph');
        let scroll_pos = parseInt(letter.style.getPropertyValue('--letter-scroll'));
        let glyph = glyphEls[scroll_pos + selected_glyph_index];
        nameOutlineText += glyph.textContent + ' ';
    }
    nameOutline.textContent = '[' + nameOutlineText + ']';
}
*/

function resize_outline() {
    const nameOutline = document.getElementById('name-outline');
    const nameLetters = document.getElementById('glyph-selector')
        .querySelectorAll('.name-letter');
    nameOutline.textContent = '[' + '  '.repeat(nameLetters.length) + ' ]'
}

function scrollLetter(nameLetter, number) {
    let selected = parseInt(nameLetter.style.getPropertyValue('--letter-scroll'));
    const option_count = parseInt(nameLetter.style.getPropertyValue('--letter-glyph-count'));
    let scroll_from, scroll_to;
    if (number >= 0) {
        scroll_from = mod(selected, option_count);
        scroll_to = scroll_from + number;
    } else {
        scroll_to = mod(selected + number, option_count);
        scroll_from = scroll_to - number;
    }
    if (scroll_from !== selected) {
        nameLetter.style.setProperty('--anim-multiplier', '0');
        nameLetter.style.setProperty('--letter-scroll', scroll_from.toString());
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                nameLetter.style.setProperty('--anim-multiplier', '1');
                nameLetter.style.setProperty('--letter-scroll', scroll_to.toString());
            });
        });
    } else {
        nameLetter.style.setProperty('--letter-scroll', scroll_to.toString());
    }


    resize_outline();
    /*
    scrolling++;
    setTimeout(() => {
        scrolling--;
        if (scrolling === 0) {
            show_outline_letters();
        }
    }, 200);
    */
}

function set_letters(letters) {
    const nameContainer = document.getElementById('glyph-selector');

    // remove existing letters
    let els = nameContainer.querySelectorAll('.name-letter');
    els.forEach(el => {
        el.remove();
    });

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

        // add padding for infinite scroll
        const padding = visible_glyph_count - 1;
        const glyph_count = glyphs.length;
        for (let j = 0; j < padding * 2; j++) {
            glyphs.push(glyphs[mod(j, glyph_count)]);
        }

        let nameLetter = document.createElement('div');
        let nameLetterScroll = document.createElement('div');
        nameLetter.appendChild(nameLetterScroll);
        // for each glyph (option)
        for (let j = 0; j < glyphs.length; j++) {
            let glyph = glyphs[j];
            let glyphElement = document.createElement('div');
            glyphElement.classList.add('glyph');
            glyphElement.textContent = glyph;
            glyphElement.onclick = function () {
                let scroll_pos = parseInt(nameLetter.style.getPropertyValue(
                    '--letter-scroll'));
                scrollLetter(nameLetter, j - scroll_pos - selected_glyph_index);
            }
            nameLetterScroll.appendChild(glyphElement);
        }
        nameLetter.classList.add('name-letter');
        nameLetter.style.setProperty('--letter-index', i.toString());
        nameLetter.style.setProperty('--letter-bg-color', letter_colors[i % letter_colors.length]);
        nameLetter.style.setProperty('--letter-scroll', padding.toString());
        nameLetter.style.setProperty('--letter-glyph-count', glyph_count.toString());
        nameLetter.onwheel = function (e) {
            e.preventDefault();
            scrollLetter(nameLetter, Math.sign(e.deltaY));
        }
        nameContainer.appendChild(nameLetter);
    }

    /*show_outline_letters();*/
    resize_outline();
}

function set_noun(s) {
    const noun = document.getElementById('noun');
    noun.textContent = s;
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
        return [false, 0];
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
        set_noun(textBox.value.substring(0, length));
        set_letters(textBox.value.substring(length).toLowerCase());
    } else {
        statusText.textContent = 'Invalid!';
        textBoxContainer.classList.add('invalid');
        textBoxContainer.classList.remove('valid');
        console.log(textBox.value);
        if (textBox.value === "") {
            set_letters("sonja");
        }
    }
}

document.addEventListener('DOMContentLoaded', onInputChange);

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