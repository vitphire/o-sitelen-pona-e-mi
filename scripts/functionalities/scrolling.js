/**
 * Used for setting the scroll position of each letter when the name is changed.
 *
 * The scroll position is the index of the topmost visible glyph.
 * @type {number[]}
 */
const scrollPositions = [];

/**
 * The index of the selected glyph in the name letter.
 * @param nameLetter {NameLetter} - The name letter element
 * @param scrollPos {number} - The scroll position, can be fractional
 * @returns {number} - The scroll position modulo the number of glyphs
 */
function setScrollPositionLooped(nameLetter, scrollPos) {
    nameLetter.currentScrollPos = scrollPos;
    const scrollPosMod = mod(scrollPos, nameLetter.letterGlyphCount);
    nameLetter.style.setProperty('--letter-scroll', scrollPosMod);
    return scrollPosMod;
}

function scrollLetterTo(nameLetter, scrollPos, animationParams = null) {
    const letterIndex = nameLetter.letterIndex;
    scrollPositions[letterIndex] = Math.round(scrollPos);
    if (!nameLetter.isScrolling) {
        nameLetter.isScrolling = true;
        const f = animationParams?.f;
        const zeta = animationParams?.zeta;
        const r = animationParams?.r;
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

function scrollLetterBy(nameLetter, number, animationParams = null) {
    const scrollPos = scrollPositions[nameLetter.letterIndex];
    scrollLetterTo(nameLetter, scrollPos + number, animationParams);
}

async function  scrollAnimation(nameLetter,
                               f = null,
                               zeta = null,
                               r = null) {
    // Thank you t3ssel8r
    // https://youtu.be/KPoeNZZ6H4s

    const letterIndex = nameLetter.letterIndex;

    const timeScale = 0.001;

    f = f ?? 5;
    zeta = zeta ?? 1;
    r = r ?? 0;

    console.log(f,zeta,r)

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