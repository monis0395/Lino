import { isMobile } from "../util/browser-util.js";
import { isDescendant } from "../util/dom-util.js";

const fontSettings = document.getElementById("font-settings");

export function fontSettingsInit() {
    const fontSettingsBtn = document.getElementById("font-settings-btn");
    fontSettingsBtn.onclick = (e) => {
        e.preventDefault();
        showFontSettings(fontSettingsBtn);
        window.onclick = function (event) {
            if (event.target !== fontSettingsBtn
                && !isDescendant(fontSettings, event.target)) {
                hideFontSettings();
            }
        };
    }
}

function showFontSettings(fontSettingsBtn) {
    if (isMobile()) { // todo: use css to add a class which makes it visible
        fontSettings.style.bottom = "0";
    } else {
        fontSettings.style.bottom = `${fontSettingsBtn.scrollHeight}px`;
    }
}

function hideFontSettings() {
    fontSettings.style.bottom = "-100vh";
}