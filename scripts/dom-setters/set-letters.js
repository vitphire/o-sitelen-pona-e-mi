/**
 * Set the noun text (does not validate)
 * @param {string} text - The noun text
 */
function setNoun(text) {
    const noun = document.getElementById('noun');
    noun.textContent = text;
}

/**
 * Resize the name outline to match the number of letters.
 */
function updateOutlineSize() {
    const nameOutline = document.getElementById('name-outline');
    const nameLetters = document.getElementById('glyph-selector')
        .querySelectorAll('.name-letter');
    nameOutline.textContent = '[' + '  '.repeat(nameLetters.length) + ' ]'
}

/**
 * Create the letter scroller based on the given letters.
 * @param letters {string} - The letters to display
 */
function setLetters(letters) {
    const nameContainer = document.getElementById('glyph-selector');

    nameContainer.querySelectorAll('.name-letter')
        .forEach(el => el.remove());

    // for each letter
    for (let i = 0; i < letters.length; i++) {
        const letter = letters[i];
        let glyphs = Dictionary.getGlyphs(letter);
        let nameLetter = new NameLetter(i, glyphs);
        nameContainer.appendChild(nameLetter);
    }
    updateOutlineSize();
    onGlyphSelectionChange();
}

/**
 * Class that represents a letter scroller.
 */
class NameLetter extends HTMLDivElement {
    letterIndex;
    letterGlyphCount;
    isScrolling;
    currentScrollPos;

    onScroll(e) {
        scrollLetterBy(this, Math.sign(e.deltaY));
        e.preventDefault();
    }

    constructor(index, glyphs) {
        super();
        this.classList.add('name-letter');
        while (scrollPositions.length <= index) {
            // Default scroll position makes the first glyph selected
            scrollPositions.push(glyphs.length - SELECTED_GLYPH_INDEX);
        }
        this.letterIndex = index;
        this.style.setProperty('--letter-index', this.letterIndex.toString());
        this.letterGlyphCount = glyphs.length;
        this.style.setProperty('--letter-glyph-count', this.letterGlyphCount.toString());

        this.classList.add('l-bg-' + (mod(index, COLOR_VARIANTS) + 1).toString());
        setScrollPositionLooped(this, scrollPositions[index]);
        this.isScrolling = false;

        let nameLetterScroll = document.createElement('div');
        glyphs.forEach(glyph => {
            let glyphElement = document.createElement('div');
            glyphElement.classList.add('glyph');
            glyphElement.textContent = glyph;
            nameLetterScroll.appendChild(glyphElement);
        });
        for (let i = 0; i < VISIBLE_GLYPH_COUNT; i += glyphs.length) {
            this.appendChild(nameLetterScroll.cloneNode(true));
        }
        this.appendChild(nameLetterScroll);

        this.querySelectorAll('.glyph').forEach(glyph => {
            glyph.onclick = () => {
                scrollLetterToGlyph(this, glyph);
            }
        });

        this.addEventListener('wheel', this.onScroll);
    }
}

customElements.define('name-letter', NameLetter, {extends: 'div'});