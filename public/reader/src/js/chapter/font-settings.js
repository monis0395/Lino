import { loadAnyModal } from "../components/modal.js";

const modal = document.getElementById("font-settings-modal");
const fontSettingsBtn = document.getElementById("font-settings-btn");

export function fontSettingsInit() {
    loadAnyModal(modal, fontSettingsBtn);
}