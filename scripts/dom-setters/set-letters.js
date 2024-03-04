function setNoun(text) {
    const noun = document.getElementById('noun');
    noun.textContent = text;
}

function resizeOutline() {
    const nameOutline = document.getElementById('name-outline');
    const nameLetters = document.getElementById('glyph-selector')
        .querySelectorAll('.name-letter');
    nameOutline.textContent = '[' + '  '.repeat(nameLetters.length) + ' ]'
}

function setLetters(letters) {
    const nameContainer = document.getElementById('glyph-selector');

    nameContainer.querySelectorAll('.name-letter')
        .forEach(el => el.remove());

    // for each letter
    for (let i = 0; i < letters.length; i++) {
        const letter = letters[i];
        let glyphs = Dictionary.getGlyphs(letter);

        let nameLetter = document.createElement('div');
        nameLetter.classList.add('name-letter');

        while (scrollPositions.length <= i) {
            // Default scroll position makes the first glyph selected
            scrollPositions.push(glyphs.length - SELECTED_GLYPH_INDEX);
        }
        nameLetter.style.setProperty('--letter-index', i.toString());
        nameLetter.letterIndex = i;
        nameLetter.style.setProperty('--letter-glyph-count', glyphs.length.toString());
        nameLetter.letterGlyphCount = glyphs.length;

        nameLetter.classList.add('l-bg-' + (mod(i, COLOR_VARIANTS) + 1).toString());

        setScrollPositionLooped(nameLetter, scrollPositions[i]);
        nameLetter.isScrolling = false;

        let nameLetterScroll = document.createElement('div');
        for (let j = 0; j < glyphs.length; j++) {
            let glyph = glyphs[j];
            let glyphElement = document.createElement('div');
            glyphElement.classList.add('glyph');
            glyphElement.textContent = glyph;
            nameLetterScroll.appendChild(glyphElement);
        }

        for (let j = 0; j < VISIBLE_GLYPH_COUNT; j += glyphs.length) {
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

        nameLetter.addEventListener('wheel', onScroll);

        // Dragging for mobile
        let isDragging = false;
        let lastY = 0;
        nameLetter.addEventListener('touchstart', (e) => {
            isDragging = true;
            lastY = e.touches[0].clientY;
        });
        nameLetter.addEventListener('touchmove', (e) => {
            if (isDragging) {
                e.preventDefault();
                const dy = e.touches[0].clientY - lastY;
                const glyphHeight = e.target.clientHeight;
                console.log(glyphHeight);
                if (Math.abs(dy) > glyphHeight * 0.5) {
                    scrollLetterBy(nameLetter, -Math.sign(dy));
                    lastY = lastY + Math.sign(dy) * glyphHeight;
                }
            }
        });
        nameLetter.addEventListener('touchend', () => {
            isDragging = false;
        });

        nameContainer.appendChild(nameLetter);
    }
    resizeOutline();
    onGlyphSelectionChange();
}