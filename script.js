const selected_glyph_index = 1;
const visible_glyph_count = 4;

/* Original color set (adjusted for contrast)
    '#A4BF8A', '#A6374B', '#0D688C',
    '#4B4073', '#3A9E7A', '#C26747',
    '#2D4F94', '#BD9A5C', '#6C3570'
 */

const letter_bg_colors = [
    '#A4BF8A', '#C7576B', '#0E7EAA',
    '#7A6EA7', '#3A9E7A', '#C26747',
    '#4C75C8', '#BD9A5C', '#AE5CB2',
]

const letter_colors = [
    '#3C741B', '#A6374B', '#0D688C',
    '#4B4073', '#297056', '#954C32',
    '#2D4F94', '#775F31', '#6C3570',
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
    return nameSelectedGlyphs;
}

function copy_glyphs() {
    const popup = document.querySelector('#success-popup');
    popup.classList.remove('show');
    const nameSelectedGlyphs = get_selected_glyphs();
    const noun = document.getElementById('noun').textContent;
    const name = noun + ' [' + nameSelectedGlyphs.join(' ') + ']';
    navigator.clipboard.writeText(name).then(_ => {});
    setTimeout(() => popup.classList.add('show'), 1);
    if (!copy_glyphs.event_listener_added) {
        popup.addEventListener('animationend', () => {
            popup.classList.remove('show');});
        copy_glyphs.event_listener_added = true;
    }
}

function resize_outline() {
    const nameOutline = document.getElementById('name-outline');
    const nameLetters = document.getElementById('glyph-selector')
        .querySelectorAll('.name-letter');
    nameOutline.textContent = '[' + '  '.repeat(nameLetters.length) + ' ]'
}

scroll_positions = []; // used for setting the scroll position of each letter when the name is changed

function scrollLetterBy(nameLetter, number) {
    const scroll_pos = scroll_positions[nameLetter.letter_index];
    scrollLetterTo(nameLetter, parseInt(scroll_pos) + number);
}

function set_scroll_position_looped(nameLetter, scroll_pos) {
    nameLetter.current_scroll_pos = scroll_pos;
    const scroll_pos_mod = mod(scroll_pos, nameLetter.letter_glyph_count);
    nameLetter.style.setProperty('--letter-scroll', scroll_pos_mod);
    return scroll_pos_mod;
}

async function scroll_animation(nameLetter,
                                f = 5,
                                zeta = 1,
                                r = 0.1) {
    // Thank you t3ssel8r
    // https://youtu.be/KPoeNZZ6H4s

    const letter_index = nameLetter.letter_index;

    const time_scale = 0.001;

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
        const dt = (time - prev_time) * time_scale;
        prev_time = time;

        const x = scroll_positions[letter_index];
        const dx = x - prev_x;
        prev_x = x;

        const k2_stable = Math.max(k2, 0.5 * dt * (dt + k1), dt * k1); // clamp k2 to prevent instability

        scroll_pos += scroll_velocity * dt;
        const scroll_acc = (x + (k3 * dx) - scroll_pos - (k1 * scroll_velocity)) / k2_stable;
        scroll_velocity += scroll_acc * dt;

        set_scroll_position_looped(nameLetter, scroll_pos);

        if (Math.abs(scroll_velocity) < epsilon &&
            Math.abs(scroll_pos - x) < epsilon) {
            const p = set_scroll_position_looped(nameLetter, x);
            set_scroll_position_looped(nameLetter, p);
            scroll_positions[letter_index] = p;
            break;
        } else {
            await new Promise(r => setTimeout(r, 1));
        }
    }
}

function scrollLetterTo(nameLetter, scroll_pos) {
    const letter_index = nameLetter.letter_index;
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
        let glyphs = Dictionary.get_glyphs(letter);

        let nameLetter = document.createElement('div');

        while (scroll_positions.length <= i) {
            // Default scroll position makes the first glyph selected
            scroll_positions.push((-selected_glyph_index));
        }
        nameLetter.classList.add('name-letter');
        nameLetter.style.setProperty('--letter-index', i.toString());
        nameLetter.letter_index = i;
        nameLetter.style.setProperty('--letter-bg-color', letter_bg_colors[i % letter_bg_colors.length]);
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
        for (let j = 0; j < visible_glyph_count / glyphs.length; j++) {
            nameLetter.appendChild(nameLetterScroll.cloneNode(true));
        }
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
    }
    resize_outline();
    on_glyph_selection_change();
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
    const definitionContainer = document.getElementById('definitions');
    definitionContainer.innerHTML = "";
    selectedGlyphs.forEach((glyph, i) => {
        const definition = Dictionary.get_definition(glyph);
        const definitionEl = document.createElement('div');
        const definitionWord = document.createElement('div');
        definitionWord.classList.add('word');
        const definitionText = document.createElement('div');
        definitionText.classList.add('definition');
        definitionWord.textContent = glyph;
        definitionText.textContent = definition;
        definitionEl.appendChild(definitionWord);
        definitionEl.appendChild(definitionText);
        definitionEl.style.setProperty('--definition-color', letter_colors[i % letter_colors.length]);
        definitionContainer.appendChild(definitionEl);
    });
}

function on_name_change() {
    const textBox = document.getElementById('name-text-box');
    const textBoxContainer = document.getElementById('name-input-container');
    const textBoxSizeCalibration = document.getElementById('name-text-box-size-calibration');

    textBoxSizeCalibration.textContent = textBox.value;

    const words = textBox.value.split(' ');
    const noun = words[0];
    const noun_valid = validate_noun(noun);
    const letters = words.slice(1).join(' ');
    const [letters_valid, letters_acceptable] = validate_word(letters);
    if (letters_valid && noun_valid) {
        textBoxContainer.classList.add('valid');
        textBoxContainer.classList.remove('uncommon');
        textBoxContainer.classList.remove('invalid');
    } else if (letters_acceptable && noun_valid) {
        textBoxContainer.classList.add('uncommon');
        textBoxContainer.classList.remove('valid');
        textBoxContainer.classList.remove('invalid');
    } else {
        textBoxContainer.classList.add('invalid');
        textBoxContainer.classList.remove('valid');
        textBoxContainer.classList.remove('uncommon');
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