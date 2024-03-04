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
    r = r ?? 0;

    //initialization
    let prevTime = performance.now();
    const sOD =
        new SecondOrderDynamics(f, zeta, r, nameLetter.currentScrollPos);

    while (true) {
        const time = performance.now();
        const dt = (time - prevTime) * timeScale;
        prevTime = time;

        const x = scrollPositions[letterIndex];

        setScrollPositionLooped(nameLetter, sOD.update(dt, x));

        if (sOD.isConverged()) {
            scrollPositions[letterIndex] =
                setScrollPositionLooped(nameLetter,
                    setScrollPositionLooped(nameLetter, x));
            break;
        } else {
            await new Promise(r => setTimeout(r, 1));
        }
    }
}

class SecondOrderDynamics {
    xp; // previous input
    y; yd; // current position and velocity
    k1; k2; k3; // dynamics constants
    tCritical; // critical stable time step
    epsilon; // convergence threshold

    constructor(f, zeta, r, x0) {
        this.k1 = zeta / (Math.PI * f);
        this.k2 = 1 / (2 * Math.PI * f) ^ 2;
        this.k3 = r * zeta / (2 * Math.PI * f);

        this.tCritical = 0.8 * (Math.sqrt(4 * this.k2 + this.k1 * this.k1) - this.k1);
        this.epsilon = 0.001;

        this.xp = x0;
        this.y = this.xp;
        this.yd = 0;
    }

    /**
     * update the state of the system
     * @param T - the time difference since the last step
     * @param x - the "target" position
     * @param xd - the "target" velocity
     */
    update(T, x, xd = null) {
        if (xd === null) {
            xd = (x - this.xp) / T;
            this.xp = x;
        }
        const iterations = Math.ceil(T / this.tCritical);
        const dt = T / iterations;
        for (let i = 0; i < iterations; i++) {
            this.y = this.y + dt * this.yd
            const acc = (x + this.k3 * xd - this.y - this.k1 * this.yd) / this.k2;
            this.yd += dt * acc;
        }
        return this.y;
    }

    isConverged() {
        return Math.abs(this.yd) < this.epsilon;
    }
}