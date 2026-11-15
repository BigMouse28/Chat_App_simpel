
const countries = [
    {
        name: "Indonesia",
        code: "+62",
        flag: '<rect width="24" height="8" fill="#e31b23"/><rect y="8" width="24" height="8" fill="#fff"/>'
    },
    {
        name: "Australia",
        code: "+61",
        flag: '<rect width="24" height="16" fill="#00008b"/><path d="M0 0 10 6M10 0 0 6" stroke="#fff" stroke-width="2"/><path d="M0 0 10 6M10 0 0 6" stroke="#c8102e" stroke-width=".8"/><path d="M5 0v6M0 3h10" stroke="#fff" stroke-width="2"/><path d="M5 0v6M0 3h10" stroke="#c8102e" stroke-width=".8"/><circle cx="17" cy="4" r="1" fill="#fff"/><circle cx="20" cy="9" r="1" fill="#fff"/><circle cx="15" cy="12" r="1" fill="#fff"/><circle cx="21" cy="14" r="1" fill="#fff"/>'
    },
    {
        name: "Amerika Serikat",
        code: "+1",
        flag: '<rect width="24" height="16" fill="#fff"/><path d="M0 0h24v1.23H0zm0 2.46h24v1.23H0zm0 2.46h24v1.23H0zm0 2.46h24v1.23H0zm0 2.46h24v1.23H0zm0 2.46h24v1.23H0zm0 2.46h24v1.23H0z" fill="#b22234"/><rect width="10.5" height="8.6" fill="#3c3b6e"/><g fill="#fff"><circle cx="2" cy="1.5" r=".45"/><circle cx="5" cy="1.5" r=".45"/><circle cx="8" cy="1.5" r=".45"/><circle cx="3.5" cy="3.5" r=".45"/><circle cx="6.5" cy="3.5" r=".45"/><circle cx="2" cy="5.5" r=".45"/><circle cx="5" cy="5.5" r=".45"/><circle cx="8" cy="5.5" r=".45"/><circle cx="3.5" cy="7.5" r=".45"/><circle cx="6.5" cy="7.5" r=".45"/></g>'
    },
    {
        name: "Britania Raya",
        code: "+44",
        flag: '<rect width="24" height="16" fill="#012169"/><path d="m0 0 24 16M24 0 0 16" stroke="#fff" stroke-width="4"/><path d="m0 0 24 16M24 0 0 16" stroke="#c8102e" stroke-width="1.5"/><path d="M12 0v16M0 8h24" stroke="#fff" stroke-width="5"/><path d="M12 0v16M0 8h24" stroke="#c8102e" stroke-width="2.5"/>'
    },
    {
        name: "Singapura",
        code: "+65",
        flag: '<rect width="24" height="8" fill="#ed2939"/><rect y="8" width="24" height="8" fill="#fff"/><circle cx="5" cy="4" r="2" fill="#fff"/><circle cx="5.8" cy="3.5" r="1.7" fill="#ed2939"/><g fill="#fff"><circle cx="8" cy="2" r=".45"/><circle cx="9.5" cy="3.2" r=".45"/><circle cx="9" cy="5" r=".45"/><circle cx="7" cy="5" r=".45"/><circle cx="6.5" cy="3.4" r=".45"/></g>'
    },
    {
        name: "Malaysia",
        code: "+60",
        flag: '<rect width="24" height="16" fill="#fff"/><path d="M0 0h24v1.8H0zm0 3.2h24V5H0zm0 3.2h24V8H0zm0 3.2h24v1.8H0zm0 3.2h24V16H0z" fill="#c8102e"/><rect width="11" height="8" fill="#010066"/><circle cx="4.3" cy="4" r="2.6" fill="#ffcc00"/><circle cx="5.1" cy="3.5" r="2.1" fill="#010066"/><path d="m8 1.8.6 1.4 1.5.1-1.1 1 .3 1.5L8 5l-1.3.8L7 4.3l-1.1-1 1.5-.1z" fill="#ffcc00"/>'
    },
    {
        name: "Jepang",
        code: "+81",
        flag: '<rect width="24" height="16" fill="#fff"/><circle cx="12" cy="8" r="4.5" fill="#bc002d"/>'
    },
    {
        name: "Korea Selatan",
        code: "+82",
        flag: '<rect width="24" height="16" fill="#fff"/><path d="M12 3.5a4.5 4.5 0 0 1 0 9 2.25 2.25 0 0 0 0-4.5 2.25 2.25 0 0 1 0-4.5" fill="#cd2e3a"/><path d="M12 12.5a4.5 4.5 0 0 1 0-9 2.25 2.25 0 0 0 0 4.5 2.25 2.25 0 0 1 0 4.5" fill="#0047a0"/><path d="m3 3 3 1.5m-3 0L6 3m12 9 3 1.5m-3 0 3-1.5" stroke="#111" stroke-width="1"/>'
    },
    {
        name: "Tiongkok",
        code: "+86",
        flag: '<rect width="24" height="16" fill="#de2910"/><path d="m5 2 .8 2.1L8 4.2 6.3 5.5l.6 2.1L5 6.4l-1.9 1.2.6-2.1L2 4.2l2.2-.1z" fill="#ffde00"/><g fill="#ffde00"><circle cx="10" cy="2.5" r=".7"/><circle cx="12" cy="4.5" r=".7"/><circle cx="12" cy="7" r=".7"/><circle cx="10" cy="9" r=".7"/></g>'
    },
    {
        name: "India",
        code: "+91",
        flag: '<rect width="24" height="5.33" fill="#ff9933"/><rect y="5.33" width="24" height="5.34" fill="#fff"/><rect y="10.67" width="24" height="5.33" fill="#138808"/><circle cx="12" cy="8" r="2" fill="none" stroke="#000080" stroke-width=".6"/><path d="M12 6v4m-2-2h4m-3.4-1.4 2.8 2.8m0-2.8-2.8 2.8" stroke="#000080" stroke-width=".35"/>'
    },
    {
        name: "Filipina",
        code: "+63",
        flag: '<rect width="24" height="8" fill="#0038a8"/><rect y="8" width="24" height="8" fill="#ce1126"/><path d="M0 0v16l12-8z" fill="#fff"/><circle cx="3.2" cy="8" r="1.4" fill="#fcd116"/><circle cx="1" cy="3" r=".6" fill="#fcd116"/><circle cx="1" cy="13" r=".6" fill="#fcd116"/><circle cx="9" cy="8" r=".6" fill="#fcd116"/>'
    },
    {
        name: "Thailand",
        code: "+66",
        flag: '<rect width="24" height="16" fill="#a51931"/><rect y="2.67" width="24" height="10.66" fill="#fff"/><rect y="5.33" width="24" height="5.34" fill="#2d2a4a"/>'
    },
    {
        name: "Vietnam",
        code: "+84",
        flag: '<rect width="24" height="16" fill="#da251d"/><path d="m12 3 1.2 3.5 3.7.1-3 2.2 1.1 3.6-3-2.1-3 2.1 1.1-3.6-3-2.2 3.7-.1z" fill="#ff0"/>'
    },
    {
        name: "Selandia Baru",
        code: "+64",
        flag: '<rect width="24" height="16" fill="#00247d"/><path d="M1 1 9 6M9 1 1 6" stroke="#fff" stroke-width="1.6"/><path d="M1 1 9 6M9 1 1 6" stroke="#cf142b" stroke-width=".6"/><path d="M5 1v5M1 3.5h8" stroke="#fff" stroke-width="2"/><path d="M5 1v5M1 3.5h8" stroke="#cf142b" stroke-width=".8"/><path d="m17 3 .5 1.2 1.3.1-1 .8.4 1.3-1.2-.7-1.1.7.4-1.3-1-.8 1.3-.1zM20 9l.4 1 1.1.1-.8.7.3 1.1-1-.6-1 .6.3-1.1-.8-.7 1.1-.1zM15 11l.4 1 1.1.1-.8.7.3 1.1-1-.6-1 .6.3-1.1-.8-.7 1.1-.1z" fill="#cf142b" stroke="#fff" stroke-width=".4"/>'
    },
    {
        name: "Jerman",
        code: "+49",
        flag: '<rect width="24" height="5.33" fill="#000"/><rect y="5.33" width="24" height="5.34" fill="#d00"/><rect y="10.67" width="24" height="5.33" fill="#ffce00"/>'
    },
    {
        name: "Prancis",
        code: "+33",
        flag: '<rect width="8" height="16" fill="#002395"/><rect x="8" width="8" height="16" fill="#fff"/><rect x="16" width="8" height="16" fill="#ed2939"/>'
    },
    {
        name: "Belanda",
        code: "+31",
        flag: '<rect width="24" height="5.33" fill="#ae1c28"/><rect y="5.33" width="24" height="5.34" fill="#fff"/><rect y="10.67" width="24" height="5.33" fill="#21468b"/>'
    },
    {
        name: "Uni Emirat Arab",
        code: "+971",
        flag: '<rect width="24" height="16" fill="#fff"/><rect width="6" height="16" fill="#f00"/><rect x="6" width="18" height="5.33" fill="#00732f"/><rect x="6" y="10.67" width="18" height="5.33" fill="#000"/>'
    },
    {
        name: "Arab Saudi",
        code: "+966",
        flag: '<rect width="24" height="16" fill="#006c35"/><path d="M5 10h14m-13-1h12" stroke="#fff" stroke-width="1.1" stroke-linecap="round"/><path d="m7 11 1-.7 1 .7 1-.7 1 .7 1-.7 1 .7 1-.7 1 .7" fill="none" stroke="#fff" stroke-width=".6"/>'
    },
    {
        name: "Mauritius",
        code: "+230",
        flag: '<rect width="24" height="4" fill="#ea2839"/><rect y="4" width="24" height="4" fill="#1a206d"/><rect y="8" width="24" height="4" fill="#ffd500"/><rect y="12" width="24" height="4" fill="#00a551"/>'
    }
];

const picker = document.querySelector(".country-picker");
const countryList = document.querySelector(".country-list");
const selectedFlag = document.querySelector(".selected-country-flag");
const selectedCode = document.querySelector(".selected-country-code");
const countryCodeInput = document.querySelector("#kode-negara");

function createFlag(country) {
    const flag = document.createElement("span");
    flag.className = "country-flag";
    flag.setAttribute("aria-hidden", "true");
    flag.innerHTML = `<svg viewBox="0 0 24 16" xmlns="http://www.w3.org/2000/svg">${country.flag}</svg>`;
    return flag;
}

function selectCountry(country, returnFocus = true) {
    selectedFlag.replaceChildren(createFlag(country));
    selectedCode.textContent = country.code;
    countryCodeInput.value = country.code;
    picker.open = false;
    if (returnFocus) {
        picker.querySelector("summary").focus();
    }
}

for (const country of countries) {
    const option = document.createElement("button");
    option.type = "button";
    option.className = "country-option";
    option.setAttribute("aria-label", `${country.name}, ${country.code}`);

    const name = document.createElement("span");
    name.className = "country-name";
    name.textContent = country.name;

    const code = document.createElement("span");
    code.className = "country-option-code";
    code.textContent = country.code;

    option.append(createFlag(country), name, code);
    option.addEventListener("click", () => selectCountry(country));
    countryList.append(option);
}

selectCountry(countries[0], false);

document.addEventListener("click", (event) => {
    if (!picker.contains(event.target)) {
        picker.open = false;
    }
});

picker.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && picker.open) {
        picker.open = false;
        picker.querySelector("summary").focus();
    }
});