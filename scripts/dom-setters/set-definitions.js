function setDefinitions(selectedGlyphs) {
    const definitionContainer = document.getElementById('definitions');
    definitionContainer.innerHTML = "";
    selectedGlyphs.forEach((glyph, i) => {
        const definition = Dictionary.getDefinition(glyph);

        const definitionWord = document.createElement('div');
        definitionWord.classList.add('word');
        definitionWord.textContent = glyph;

        const definitionText = document.createElement('div');
        definitionText.classList.add('definition');
        definitionText.textContent = definition;

        const definitionEl = document.createElement('div');
        definitionEl.appendChild(definitionWord);
        definitionEl.appendChild(definitionText);
        definitionEl.classList.add('l-fg-' + (mod(i, COLOR_VARIANTS) + 1).toString());

        definitionContainer.appendChild(definitionEl);
    });
}