const SELECTED_GLYPH_INDEX = 1;
const VISIBLE_GLYPH_COUNT = 4;
const COLOR_VARIANTS = 9;

function openSettings() {
    alert('Settings are not implemented yet');
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
        textBoxContainer.classList.remove('valid');
        textBoxContainer.classList.add('uncommon');
        textBoxContainer.classList.remove('invalid');
    } else {
        textBoxContainer.classList.remove('valid');
        textBoxContainer.classList.remove('uncommon');
        textBoxContainer.classList.add('invalid');
    }
    if (nounValid) setNoun(noun);
    if (lettersAcceptable) setLetters(letters.toLowerCase());
    if (textBox.value === "") setLetters("sonja");
}

function onGlyphSelectionChange() {
    const selectedGlyphs = getSelectedGlyphs();
    setDefinitions(selectedGlyphs);
}

document.addEventListener('DOMContentLoaded',
    () => setTimeout(() => {
        setLetters("sonja");
        onNameChange();
    }, 20))