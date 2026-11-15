
const flagAssets = `
    ad ae af ag ai al am ao aq ar arab as asean at au aw ax az
    ba bb bd be bf bg bh bi bj bl bm bn bo bq br bs bt bv bw by bz
    ca cc cd cefta cf cg ch ci ck cl cm cn co cp cr cu cv cw cx cy cz
    de dg dj dk dm do dz eac ec ee eg eh er es es-ct es-ga es-pv et eu
    fi fj fk fm fo fr ga gb gb-eng gb-nir gb-sct gb-wls gd ge gf gg gh gi
    gl gm gn gp gq gr gs gt gu gw gy hk hm hn hr ht hu ic id ie il im in
    io iq ir is it je jm jo jp ke kg kh ki km kn kp kr kw ky kz la lb lc
    li lk lr ls lt lu lv ly ma mc md me mf mg mh mk ml mm mn mo mp mq mr
    ms mt mu mv mw mx my mz na nc ne nf ng ni nl no np nr nu nz om pa pc
    pe pf pg ph pk pl pm pn pr ps pt pw py qa re ro rs ru rw sa sb sc sd
    se sg sh sh-ac sh-hl sh-ta si sj sk sl sm sn so sr ss st sv sx sy sz
    tc td tf tg th tj tk tl tm tn to tr tt tv tw tz ua ug um un us uy uz
    va vc ve vg vi vn vu wf ws xk xx ye yt za zm zw
`.trim().split(/\s+/);

const dialingCodes = Object.fromEntries(`
    ad:+376 ae:+971 af:+93 ag:+1268 ai:+1264 al:+355 am:+374 ao:+244 ar:+54
    as:+1684 at:+43 au:+61 aw:+297 ax:+358 az:+994 ba:+387 bb:+1246 bd:+880
    be:+32 bf:+226 bg:+359 bh:+973 bi:+257 bj:+229 bl:+590 bm:+1441 bn:+673
    bo:+591 bq:+599 br:+55 bs:+1242 bt:+975 bv:+47 bw:+267 by:+375 bz:+501
    ca:+1 cc:+61 cd:+243 cf:+236 cg:+242 ch:+41 ci:+225 ck:+682 cl:+56
    cm:+237 cn:+86 co:+57 cr:+506 cu:+53 cv:+238 cw:+599 cx:+61 cy:+357
    cz:+420 de:+49 dj:+253 dk:+45 dm:+1767 do:+1 dz:+213 ec:+593 ee:+372
    eg:+20 eh:+212 er:+291 es:+34 et:+251 fi:+358 fj:+679 fk:+500 fm:+691
    fo:+298 fr:+33 ga:+241 gb:+44 gd:+1473 ge:+995 gf:+594 gg:+44 gh:+233
    gi:+350 gl:+299 gm:+220 gn:+224 gp:+590 gq:+240 gr:+30 gs:+500 gt:+502
    gu:+1671 gw:+245 gy:+592 hk:+852 hn:+504 hr:+385 ht:+509 hu:+36 id:+62
    ie:+353 il:+972 im:+44 in:+91 io:+246 iq:+964 ir:+98 is:+354 it:+39
    je:+44 jm:+1876 jo:+962 jp:+81 ke:+254 kg:+996 kh:+855 ki:+686 km:+269
    kn:+1869 kp:+850 kr:+82 kw:+965 ky:+1345 kz:+7 la:+856 lb:+961 lc:+1758
    li:+423 lk:+94 lr:+231 ls:+266 lt:+370 lu:+352 lv:+371 ly:+218 ma:+212
    mc:+377 md:+373 me:+382 mf:+590 mg:+261 mh:+692 mk:+389 ml:+223 mm:+95
    mn:+976 mo:+853 mp:+1670 mq:+596 mr:+222 ms:+1664 mt:+356 mu:+230 mv:+960
    mw:+265 mx:+52 my:+60 mz:+258 na:+264 nc:+687 ne:+227 nf:+672 ng:+234
    ni:+505 nl:+31 no:+47 np:+977 nr:+674 nu:+683 nz:+64 om:+968 pa:+507
    pe:+51 pf:+689 pg:+675 ph:+63 pk:+92 pl:+48 pm:+508 pn:+64 pr:+1 ps:+970
    pt:+351 pw:+680 py:+595 qa:+974 re:+262 ro:+40 rs:+381 ru:+7 rw:+250
    sa:+966 sb:+677 sc:+248 sd:+249 se:+46 sg:+65 sh:+290 si:+386 sj:+47
    sk:+421 sl:+232 sm:+378 sn:+221 so:+252 sr:+597 ss:+211 st:+239 sv:+503
    sx:+1721 sy:+963 sz:+268 tc:+1649 td:+235 tf:+262 tg:+228 th:+66 tj:+992
    tk:+690 tl:+670 tm:+993 tn:+216 to:+676 tr:+90 tt:+1868 tv:+688 tw:+886
    tz:+255 ua:+380 ug:+256 um:+1 us:+1 uy:+598 uz:+998 va:+39 vc:+1784
    ve:+58 vg:+1284 vi:+1340 vn:+84 vu:+678 wf:+681 ws:+685 xk:+383 ye:+967
    yt:+262 za:+27 zm:+260 zw:+263
    aq:+672 dg:+246 hm:+672 ic:+34 es-ct:+34 es-ga:+34 es-pv:+34
    gb-eng:+44 gb-nir:+44 gb-sct:+44 gb-wls:+44 sh-ac:+247 sh-hl:+290 sh-ta:+290
`.trim().split(/\s+/).map((entry) => entry.split(":")));

const specialCountryNames = {
    arab: "Liga Arab",
    asean: "ASEAN",
    cefta: "CEFTA",
    eac: "Komunitas Afrika Timur",
    eu: "Uni Eropa",
    "es-ct": "Katalonia",
    "es-ga": "Galicia",
    "es-pv": "Negeri Basque",
    "gb-eng": "Inggris",
    "gb-nir": "Irlandia Utara",
    "gb-sct": "Skotlandia",
    "gb-wls": "Wales",
    ic: "Kepulauan Kanari",
    pc: "Komunitas Pasifik",
    un: "Perserikatan Bangsa-Bangsa",
    xx: "Wilayah tidak diketahui"
};
const regionNames = new Intl.DisplayNames(["id"], { type: "region" });

const countries = flagAssets.map((flag) => ({
    name: specialCountryNames[flag] ?? (flag.length === 2 ? regionNames.of(flag.toUpperCase()) : flag),
    code: dialingCodes[flag] ?? "",
    flag
}));

const form = document.querySelector(".registration-form");
const countryButton = document.querySelector("#btn-negara");
const countryDropdown = document.querySelector("#daftar-negara");
const countrySearch = document.querySelector("#cari-negara");
const countryOptions = document.querySelector("#isi-negara");
const selectedFlag = document.querySelector("#bendera-terpilih");
const selectedCode = document.querySelector("#kode-terpilih");
const phoneInput = document.querySelector("#hp");
const passwordInput = document.querySelector("#sandi");
const confirmationInput = document.querySelector("#konfirmasi-sandi");

const countryCodeInput = document.createElement("input");
countryCodeInput.type = "hidden";
countryCodeInput.name = "kode_negara";
form.append(countryCodeInput);

phoneInput.name = "hp";
passwordInput.name = "sandi";
confirmationInput.name = "konfirmasi_sandi";
confirmationInput.required = true;

function flagSource(country) {
    return `../assets/img/flags/${country.flag}.svg`;
}

function setCountryDropdown(open) {
    countryDropdown.hidden = !open;
    countryButton.setAttribute("aria-expanded", String(open));
    if (open) {
        countrySearch.focus();
    }
}

function selectCountry(country, returnFocus = true) {
    selectedFlag.src = flagSource(country);
    selectedFlag.alt = "";
    selectedCode.textContent = country.code;
    countryCodeInput.value = country.code;
    setCountryDropdown(false);
    if (returnFocus) {
        countryButton.focus();
    }
}

function renderCountries(query = "") {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    const matches = countries.filter(({ name, code }) =>
        `${name} ${code}`.toLocaleLowerCase().includes(normalizedQuery)
    );

    countryOptions.replaceChildren();

    if (matches.length === 0) {
        const emptyState = document.createElement("li");
        emptyState.className = "negara-kosong";
        emptyState.textContent = "Negara tidak ditemukan";
        countryOptions.append(emptyState);
        return;
    }

    for (const country of matches) {
        const item = document.createElement("li");
        const option = document.createElement("button");
        option.type = "button";
        option.className = "opsi-negara";
        option.disabled = !country.code;
        option.setAttribute("role", "option");
        option.setAttribute(
            "aria-label",
            `${country.name}, ${country.code || "kode telepon tidak tersedia"}`
        );

        const flag = document.createElement("img");
        flag.className = "bendera-opsi";
        flag.src = flagSource(country);
        flag.alt = "";

        const name = document.createElement("span");
        name.className = "nama-negara";
        name.textContent = country.name;

        const code = document.createElement("span");
        code.className = "kode-negara";
        code.textContent = country.code || "—";

        option.append(flag, name, code);
        option.addEventListener("click", () => selectCountry(country));
        item.append(option);
        countryOptions.append(item);
    }
}

function showError(input, errorId, message) {
    const error = document.querySelector(`#${errorId}`);
    error.textContent = message;
    input.setCustomValidity(message);

    if (message) {
        input.setAttribute("aria-invalid", "true");
    } else {
        input.removeAttribute("aria-invalid");
    }
}

function validatePhone() {
    const digitCount = phoneInput.value.replace(/\D/g, "").length;
    const message = digitCount < 6 || digitCount > 15
        ? "Masukkan nomor HP dengan 6 sampai 15 angka."
        : "";
    showError(phoneInput, "error-hp", message);
    return !message;
}

function validatePassword() {
    const valid = passwordInput.value.length >= 8
        && /[a-z]/i.test(passwordInput.value)
        && /\d/.test(passwordInput.value);
    const message = valid
        ? ""
        : "Kata sandi harus minimal 8 karakter dan terdiri dari huruf serta angka.";
    showError(passwordInput, "error-sandi", message);
    return valid;
}

function validateConfirmation() {
    const message = confirmationInput.value === passwordInput.value
        ? ""
        : "Kata sandi ulang tidak sama.";
    showError(confirmationInput, "error-konfirmasi-sandi", message);
    return !message;
}

countryButton.addEventListener("click", () => {
    setCountryDropdown(countryDropdown.hidden);
});

countrySearch.addEventListener("input", () => {
    renderCountries(countrySearch.value);
});

countryDropdown.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        setCountryDropdown(false);
        countryButton.focus();
    }
});

document.addEventListener("click", (event) => {
    if (!countryDropdown.contains(event.target) && !countryButton.contains(event.target)) {
        setCountryDropdown(false);
    }
});

for (const toggle of document.querySelectorAll(".lihat")) {
    toggle.setAttribute("aria-pressed", "false");
    toggle.addEventListener("click", () => {
        const input = document.querySelector(`#${toggle.dataset.target}`);
        const isVisible = input.type === "text";
        input.type = isVisible ? "password" : "text";
        toggle.textContent = isVisible ? "Lihat" : "Sembunyikan";
        toggle.setAttribute("aria-pressed", String(!isVisible));
    });
}

phoneInput.addEventListener("input", validatePhone);
passwordInput.addEventListener("input", () => {
    validatePassword();
    if (confirmationInput.value) {
        validateConfirmation();
    }
});
confirmationInput.addEventListener("input", validateConfirmation);

form.addEventListener("submit", (event) => {
    const isPhoneValid = validatePhone();
    const isPasswordValid = validatePassword();
    const isConfirmationValid = validateConfirmation();
    const isValid = isPhoneValid && isPasswordValid && isConfirmationValid;
    if (!isValid) {
        event.preventDefault();
        form.reportValidity();
    }
});

renderCountries();
selectCountry(countries.find(({ flag }) => flag === "id"), false);