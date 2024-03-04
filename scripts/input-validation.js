/**
 * Checks if the given noun produces a ligature the same size as "ijo"
 * @param noun {string} - The noun to check
 * @returns {boolean}
 */
function validateNoun(noun) {
    const canvas = validateNoun.canvas ||
        (validateNoun.canvas = document.createElement("canvas"));
    const context = canvas.getContext("2d");
    context.font = "bold 64px sitelen-seli-kiwen-mono--asuki";
    const nounLength = context.measureText(noun).width;
    const ijoLength = context.measureText("ijo").width;
    return nounLength === ijoLength;
}

/**
 * Checks if the given text is a valid proper adjective in toki pona
 * @param text {string} - The text to check
 * @returns {[boolean, boolean]}
 */
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