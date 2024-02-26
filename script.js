function validateInput() {
    const textBox = document.getElementById('name-text-box');
    const statusText = document.getElementById('status-text');
    const textBoxContainer = document.getElementById('name-input-container');

    textBox.size = Math.max(4, textBox.value.length);

    if (validate_text(textBox.value)) {
        statusText.textContent = 'Valid!';
        textBoxContainer.classList.add('valid');
        textBoxContainer.classList.remove('invalid');
    } else {
        statusText.textContent = 'Invalid!';
        textBoxContainer.classList.add('invalid');
        textBoxContainer.classList.remove('valid');
    }
}

function validate_text(text) {
    const glyphs = ["a", "a2", "a3", "a4", "a5", "akesi", "akesi2", "ala", "alasa", "ale", "anpa", "ante",
        "anu", "awen", "e", "en", "esun", "ijo", "ike", "ilo", "insa", "jaki", "jan", "jelo", "jo", "kala", "kala2",
        "kalama", "kama", "kasi", "ken", "kepeken", "kili", "kiwen", "ko", "kon", "kule", "kulupu", "kute", "la",
        "lape", "laso", "lawa", "len", "lete", "li", "lili", "linja", "lipu", "loje", "lon", "luka", "lukin", "lupa",
        "ma", "mama", "mani", "mi", "mi2", "moku", "moli", "moli2", "monsi", "mu", "mu2", "mun", "musi", "mute",
        "mute2", "nanpa", "nasa", "nasin", "nena", "ni", "ni2", "ni3", "ni4", "ni5", "ni6", "ni7", "ni8", "nimi",
        "noka", "o", "o2", "olin", "olin1", "olin2", "ona", "ona2", "open", "pakala", "pali", "palisa", "pan",
        "pana", "pi", "pilin", "pimeja", "pini", "pipi", "poka", "poki", "pona", "pu", "sama", "seli", "selo",
        "seme", "sewi", "sewi2", "sijelo", "sike", "sin", "sina", "sina2", "sinpin", "sitelen", "sona", "soweli",
        "suli", "suno", "supa", "suwi", "tan", "taso", "tawa", "telo", "tenpo", "toki", "tomo", "tu", "unpa",
        "uta", "uta2", "utala", "walo", "wan", "waso", "wawa", "weka", "wile", "wile2", "kijetesantakalu", "kin",
        "kin2", "ku", "ku2", "ku3", "ku4", "ku5", "ku6", "ku7", "leko", "meli", "meli2", "meli3", "mije", "mije2",
        "mije3", "monsuta", "n", "n2", "namako", "namako2", "tonsi", "tonsi2", "tonsi3", "epiku", "epiku1", "kipisi",
        "lanpan", "lanpan2", "lanpan3", "meso", "meso2", "misikeke", "misikeke2", "oko", "soko", "soko2", "soko1",
        "ali", "apeja", "jasima", "kiki", "kiki2", "kiki3", "kiki4", "kokosila", "kokosila2", "linluwi", "linluwi2",
        "linluwi3", "linluwi4", "majuna", "majuna2", "nimisin", "oke", "omekapo", "powe", "usawi", "wuwojiti",
        "yupekosi", "isipin", "kamalawala", "kapesi", "kapesi2", "misa", "misa2", "misa3", "misa4", "misa5", "misa6",
        "pake", "puwa", "taki", "taki2", "te", "to", "unu", "wa", "wa2", "jami", "jonke", "konwe", "kulijo",
        "melome", "mijomi", "mulapisu", "nja", "ojuta", "owe", "pika", "pika2", "po", "san", "soto", "sutopatikuna",
        "teje", "wasoweli", "wekama", "alente", "alu", "eliki", "enko", "enko2", "enko3", "ete", "ete2", "je",
        "je2", "jule", "jume", "kalamARR", "kalijopilale", "kan", "ke", "ke2", "kepen", "kese", "ki", "kisa",
        "kosan", "kulu", "kuntu", "likujo", "molusa", "nalanja", "nalanja1", "natu", "nele", "okepuma", "oki",
        "omekalike", "omen", "oni", "oni2", "pa", "pakola", "pakola2", "pasila", "pata", "peta", "peto", "Pingo",
        "pipo", "polinpin", "pomotolo", "poni", "poni2", "sikomo", "slape", "tokana", "tokana2", "tokana3", "tuli",
        "waleja", "wawajete", "we (content word)", "yutu", "ako", "ako2", "kikulo", "kutopoma", "lijokuku",
        "lijokuku2", "mamasi", "mamasina", "masalo", "pipolo", "silapa", "silapa1", "silapa2", "silapa3", "sipije",
        "siwala", "teken", "waken", "aka", "aku", "anta", "apelo", "awase", "eki", "enepi", "ewe", "i", "iki",
        "iki2", "ipi", "ipi2", "itomi", "jaku", "jalan", "jans", "kana", "kapa", "kikolo", "kokoliko", "konsi",
        "kosikosa", "loka", "lokon", "lo", "lu2", "neja", "nowi", "nu2", "nuwa", "olala", "panke", "samu",
        "sapelipope", "sikako", "sipi", "ta", "ten", "ten2", "tona", "umesu", "umesu2", "we1 (particle)", "wi",
        "wi2", "wiwi", "akesiv", "akesiv2", "ana", "ani", "api", "api2", "api3", "api4", "elen", "ene", "eni",
        "epikule", "iseki", "jew", "kalapisituwi", "kijosin", "kolo", "koni", "kulepiku", "lansan", "lato", "masu",
        "matula", "me", "nasin+mani", "opasan", "saja", "sisi", "snoweli", "soni", "sowoli", "su", "su2", "tasun",
        "tasun1", "tasun2", "tasun3", "taasun", "taaasun", "topo", "wiju", "wiki", "wowujiti", "ijo+ni+li+seme",
        "interpunct", "colon"];

    let valid = false;
    let starting_glyph = "";
    for (const glyph of glyphs) {
        if (text.startsWith(glyph + " ")) {
            valid = true;
            starting_glyph = glyph;
            break;
        }
    }
    if (!valid) {
        return false;
    }
    let rest = text.substring(starting_glyph.length + 1);
    const regex = /^((^[aeiou]|[pksmnl][aeiou]|[jt][aeou]|w[aei])([mn](?![mn]))?)+$/;
    return (rest.length > 0
        &&rest[0] === rest[0].toUpperCase()
        && rest.substring(1) === rest.substring(1).toLowerCase()
        && regex.test(rest.toLowerCase())
    )
}

document.addEventListener('DOMContentLoaded', validateInput);