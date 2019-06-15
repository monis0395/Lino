const templates = {
    username: `
        <div id ="username-input" class="input-field col s12 username">
            <input id="username" type="text" class="validate" required>
            <label class="active" for="username">Username</label>
        </div>`,
    password: `
        <div id ="password-input" class="input-field col s12 password">
            <input id="password" type="password" class="validate" required>
            <label class="active" for="password">Password</label>
        </div>`,
    email: `
        <div id ="email-input" class="input-field col s12 email">
            <input id="email" type="password" class="validate" required>
            <label class="active" for="email">Email</label>
        </div>`,
};

function attachTemplatesToDom(elementsList) {
    const submitButton = document.getElementById('submit');
    if (Array.isArray(elementsList)) {
        elementsList.forEach(function (value) {
            if (templates[value]) {
                const container = document.createElement('div');
                container.innerHTML = templates[value];
                submitButton.parentElement.insertBefore(container, submitButton)
            }
        });
    }
    submitButton.classList.remove('hide');
}

function clearCredentials() {
    const submitButton = document.getElementById('submit');
    submitButton.classList.add('hide');
    Object.keys(templates).forEach(function (value) {
        const element = document.getElementById(value + '-input');
        if (element) {
            const containerDiv = element.parentElement;
            containerDiv.parentElement.removeChild(containerDiv);
        }
    });
}

export { attachTemplatesToDom, clearCredentials };