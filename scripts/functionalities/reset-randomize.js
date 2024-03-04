/**
 * Resets the options to the default.
 */
function resetOptions() {
    for (let nameLetter of document.getElementById('glyph-selector')
        .querySelectorAll('.name-letter')) {
        scrollLetterTo(nameLetter, (nameLetter.letterGlyphCount - SELECTED_GLYPH_INDEX),
            {f: 8, zeta: 1, r: 0});
    }
}

/**
 * Randomizes the options.
 */
function randomizeOptions() {
    for (let nameLetter of document.getElementById('glyph-selector')
        .querySelectorAll('.name-letter')) {
        const glyphCount = nameLetter.letterGlyphCount;
        let scrollBy = Math.floor(Math.random() * glyphCount * 2) + 1;
        if (Math.random() > 0.5) {
            scrollBy *= -1;
        }
        scrollLetterBy(nameLetter, scrollBy, {f: 2, zeta: 1, r: 0});
    }
}