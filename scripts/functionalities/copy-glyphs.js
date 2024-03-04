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