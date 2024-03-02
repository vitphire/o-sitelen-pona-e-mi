const SELECTED_GLYPH_INDEX = 1;
const VISIBLE_GLYPH_COUNT = 4;

const scrollPositions = []; // used for setting the scroll position of each letter when the name is changed

/* Original color set (adjusted for contrast)
    '#A4BF8A', '#A6374B', '#0D688C',
    '#4B4073', '#3A9E7A', '#C26747',
    '#2D4F94', '#BD9A5C', '#6C3570'
 */

const letterBgColors = [
    '#A4BF8A', '#C7576B', '#0E7EAA',
    '#7A6EA7', '#3A9E7A', '#C26747',
    '#4C75C8', '#BD9A5C', '#AE5CB2',
]

const letterColors = [
    '#3C741B', '#A6374B', '#0D688C',
    '#4B4073', '#297056', '#954C32',
    '#2D4F94', '#775F31', '#6C3570',
]

function mod(n, m) {
    return ((n % m) + m) % m;
}

function getSelectedGlyphs() {
    const nameLetters = document.getElementById('glyph-selector')
        .querySelectorAll('.name-letter');
    let nameSelectedGlyphs = [];
    for (let i = 0; i < nameLetters.length; i++) {
        let letter = nameLetters[i];
        let glyphEls = letter.children[0].children;
        let scrollPos = scrollPositions[i];
        let glyph = glyphEls[mod(scrollPos + SELECTED_GLYPH_INDEX, glyphEls.length)];
        nameSelectedGlyphs.push(glyph.textContent);
    }
    return nameSelectedGlyphs;
}

function copyGlyphs() {
    const popup = document.querySelector('#success-popup');
    popup.classList.remove('show');
    const nameSelectedGlyphs = getSelectedGlyphs();
    const noun = document.getElementById('noun').textContent;
    const name = noun + ' [' + nameSelectedGlyphs.join(' ') + ']';
    navigator.clipboard.writeText(name).then(_ => {
    });
    setTimeout(() => popup.classList.add('show'), 1);
    if (!copyGlyphs.eventListenerAdded) {
        popup.addEventListener('animationend', () => {
            popup.classList.remove('show');
        });
        copyGlyphs.eventListenerAdded = true;
    }
}

function resetOptions() {
    for (let nameLetter of document.getElementById('glyph-selector')
        .querySelectorAll('.name-letter')) {
        scrollLetterTo(nameLetter, (nameLetter.letterGlyphCount - SELECTED_GLYPH_INDEX),
            {f: 3, zeta: 1, r: 0.1});
    }
}

function randomizeOptions() {
    // scroll each letter to a random position
    for (let nameLetter of document.getElementById('glyph-selector')
        .querySelectorAll('.name-letter')) {
        const glyphCount = nameLetter.letterGlyphCount;
        let scrollBy = Math.floor(Math.random() * glyphCount * 2) + 1;
        scrollLetterBy(nameLetter, scrollBy, {f: 3, zeta: 1, r: 0.1});
    }
}

function resizeOutline() {
    const nameOutline = document.getElementById('name-outline');
    const nameLetters = document.getElementById('glyph-selector')
        .querySelectorAll('.name-letter');
    nameOutline.textContent = '[' + '  '.repeat(nameLetters.length) + ' ]'
}

function scrollLetterBy(nameLetter, number, animationParams = null) {
    const scrollPos = scrollPositions[nameLetter.letterIndex];
    scrollLetterTo(nameLetter, parseInt(scrollPos) + number, animationParams);
}

function setScrollPositionLooped(nameLetter, scrollPos) {
    nameLetter.currentScrollPos = scrollPos;
    const scrollPosMod = mod(scrollPos, nameLetter.letterGlyphCount);
    nameLetter.style.setProperty('--letter-scroll', scrollPosMod);
    return scrollPosMod;
}

async function scrollAnimation(nameLetter,
                               f = null,
                               zeta = null,
                               r = null) {
    // Thank you t3ssel8r
    // https://youtu.be/KPoeNZZ6H4s

    const letterIndex = nameLetter.letterIndex;

    const timeScale = 0.001;

    f = f ?? 5;
    zeta = zeta ?? 1;
    r = r ?? 0.1;

    const k1 = zeta / (Math.PI * f);
    const k2 = 1 / (4 * Math.PI * Math.PI * f * f);
    const k3 = (r * zeta) / (2 * Math.PI * f);

    const epsilon = 0.001;

    //initialization
    let scrollPos = nameLetter.currentScrollPos;
    let scrollVelocity = 0;
    let prevTime = performance.now();
    let prevX = scrollPos;

    while (true) {
        const time = performance.now();
        const dt = (time - prevTime) * timeScale;
        prevTime = time;

        const x = scrollPositions[letterIndex];
        const dx = x - prevX;
        prevX = x;

        const k2Stable = Math.max(k2, 0.5 * dt * (dt + k1), dt * k1); // clamp k2 to prevent instability

        scrollPos += scrollVelocity * dt;
        const scrollAcc = (x + (k3 * dx) - scrollPos - (k1 * scrollVelocity)) / k2Stable;
        scrollVelocity += scrollAcc * dt;

        setScrollPositionLooped(nameLetter, scrollPos);

        if (Math.abs(scrollVelocity) < epsilon &&
            Math.abs(scrollPos - x) < epsilon) {
            const p = setScrollPositionLooped(nameLetter, x);
            setScrollPositionLooped(nameLetter, p);
            scrollPositions[letterIndex] = p;
            break;
        } else {
            await new Promise(r => setTimeout(r, 1));
        }
    }
}

function scrollLetterTo(nameLetter, scrollPos, animationParams = null) {
    const letterIndex = nameLetter.letterIndex;
    scrollPositions[letterIndex] = scrollPos;
    if (!nameLetter.isScrolling) {
        nameLetter.isScrolling = true;
        const f = animationParams?.f ?? 5;
        const zeta = animationParams?.zeta ?? 1;
        const r = animationParams?.r ?? 0.1;
        scrollAnimation(nameLetter, f, zeta, r).then(_ => nameLetter.isScrolling = false);
    }
    onGlyphSelectionChange();
}

function scrollLetterToGlyph(nameLetter, glyph) {
    const glyphCount = nameLetter.letterGlyphCount;
    const currentScrollPos = nameLetter.currentScrollPos;
    const offset = Math.floor(currentScrollPos / glyphCount) * glyphCount;

    const glyphs = [].concat(...(Array.from(nameLetter.children)
        .map((el) => [...el.children])));

    const glyphIndex = glyphs.indexOf(glyph);

    scrollLetterTo(nameLetter, glyphIndex - SELECTED_GLYPH_INDEX + offset);
}

function setLetters(letters) {
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
        let glyphs = Dictionary.getGlyphs(letter);

        let nameLetter = document.createElement('div');

        while (scrollPositions.length <= i) {
            // Default scroll position makes the first glyph selected
            scrollPositions.push(glyphs.length - SELECTED_GLYPH_INDEX);
        }
        nameLetter.classList.add('name-letter');
        nameLetter.style.setProperty('--letter-index', i.toString());
        nameLetter.letterIndex = i;
        nameLetter.style.setProperty('--letter-bg-color', letterBgColors[i % letterBgColors.length]);
        nameLetter.style.setProperty('--letter-glyph-count', glyphs.length.toString());
        nameLetter.letterGlyphCount = glyphs.length;

        setScrollPositionLooped(nameLetter, scrollPositions[i]);
        nameLetter.isScrolling = false;
        nameLetter.addEventListener('wheel', onScroll);

        let nameLetterScroll = document.createElement('div');

        // for each glyph (option)
        for (let j = 0; j < glyphs.length; j++) {
            let glyph = glyphs[j];
            let glyphElement = document.createElement('div');
            glyphElement.classList.add('glyph');
            glyphElement.textContent = glyph;
            nameLetterScroll.appendChild(glyphElement);
        }
        for (let j = 0; j < VISIBLE_GLYPH_COUNT / glyphs.length; j++) {
            nameLetter.appendChild(nameLetterScroll.cloneNode(true));
        }
        nameLetter.appendChild(nameLetterScroll);

        nameLetter.querySelectorAll('.glyph').forEach(glyph => {
            glyph.onclick = () => {
                scrollLetterToGlyph(nameLetter, glyph);
            }
        });

        function onScroll(e) {
            e.preventDefault();
            scrollLetterBy(nameLetter, Math.sign(e.deltaY));
        }

        nameContainer.appendChild(nameLetter);
    }
    resizeOutline();
    onGlyphSelectionChange();
}

function setNoun(s) {
    const noun = document.getElementById('noun');
    noun.textContent = s;
}

function validateNoun(noun) {
    const canvas = validateNoun.canvas ||
        (validateNoun.canvas = document.createElement("canvas"));
    const context = canvas.getContext("2d");
    context.font = "bold 64px sitelen-seli-kiwen-mono--asuki";
    const nounLength = context.measureText(noun).width;
    const ijoLength = context.measureText("ijo").width;
    return nounLength === ijoLength;
}

function validateWord(text) {
    if (text.length === 0) {
        return [false, false];
    }
    const regexValid = /^((^[aeiou]|[pksmnl][aeiou]|[jt][aeou]|w[aei])([mn](?![mn]))?)+$/i;
    const regexAcceptable = /^[aeiouwpsmnljtk]+$/i;
    const isCapitalized = (text[0] === text[0].toUpperCase()
        && text.substring(1) === text.substring(1).toLowerCase());
    return ([regexValid.test(text) && isCapitalized, regexAcceptable.test(text)]);
}

function setDefinitions(selectedGlyphs) {
    const definitionContainer = document.getElementById('definitions');
    definitionContainer.innerHTML = "";
    selectedGlyphs.forEach((glyph, i) => {
        const definition = Dictionary.getDefinition(glyph);
        const definitionEl = document.createElement('div');
        const definitionWord = document.createElement('div');
        definitionWord.classList.add('word');
        const definitionText = document.createElement('div');
        definitionText.classList.add('definition');
        definitionWord.textContent = glyph;
        definitionText.textContent = definition;
        definitionEl.appendChild(definitionWord);
        definitionEl.appendChild(definitionText);
        definitionEl.style.setProperty('--definition-color', letterColors[i % letterColors.length]);
        definitionContainer.appendChild(definitionEl);
    });
}

function onNameChange() {
    const textBox = document.getElementById('name-text-box');
    const textBoxContainer = document.getElementById('name-input-container');
    const textBoxSizeCalibration = document.getElementById('name-text-box-size-calibration');

    textBoxSizeCalibration.textContent = textBox.value;

    const words = textBox.value.split(' ');
    const noun = words[0];
    const nounValid = validateNoun(noun);
    const letters = words.slice(1).join(' ');
    const [lettersValid, lettersAcceptable] = validateWord(letters);
    if (lettersValid && nounValid) {
        textBoxContainer.classList.add('valid');
        textBoxContainer.classList.remove('uncommon');
        textBoxContainer.classList.remove('invalid');
    } else if (lettersAcceptable && nounValid) {
        textBoxContainer.classList.add('uncommon');
        textBoxContainer.classList.remove('valid');
        textBoxContainer.classList.remove('invalid');
    } else {
        textBoxContainer.classList.add('invalid');
        textBoxContainer.classList.remove('valid');
        textBoxContainer.classList.remove('uncommon');
    }
    if (nounValid) {
        setNoun(noun);
    }
    if (lettersAcceptable) {
        setLetters(letters.toLowerCase());
    }
    if (textBox.value === "") {
        setLetters("sonja");
    }
}

function onGlyphSelectionChange() {
    const selectedGlyphs = getSelectedGlyphs();
    setDefinitions(selectedGlyphs);
    //console.log(selectedGlyphs);
}

document.addEventListener('DOMContentLoaded',
    () => setTimeout(() => {
        setLetters("sonja");
        onNameChange();
    }, 20))