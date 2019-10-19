import { isMobile } from "../util/browser-util.js";
import { isDescendant } from "../util/dom-util.js";

const fontSettings = document.getElementById("font-settings");

export function fontSettingsInit() {
    const fontSettingsBtn = document.getElementById("font-settings-btn");
    fontSettingsBtn.onclick = (e) => {
        e.preventDefault();
        showFontSettings();
        window.onclick = function (event) {
            if (event.target !== fontSettingsBtn
                && !isDescendant(fontSettings, event.target)) {
                hideFontSettings();
            }
        };
    }
}

function showFontSettings() {
    if (isMobile()) { // todo: use css to add a class which makes it visible
        fontSettings.style.bottom = "0";
    } else {
        fontSettings.style.bottom = "50px";
    }
}

function hideFontSettings() {
    fontSettings.style.bottom = "-100vh";
}