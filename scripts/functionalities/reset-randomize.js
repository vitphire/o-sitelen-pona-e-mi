function resetRandomize() {
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
        if (Math.random() > 0.5) {
            scrollBy *= -1;
        }
        scrollLetterBy(nameLetter, scrollBy, {f: 3, zeta: 1, r: 0.1});
    }
}