const templates = {
    username: `
        <div class="input-field col s12 l6 username">
            <input id="username" type="text" class="validate" required>
            <label class="active" for="username">Username</label>
        </div>`,
    password: `
        <div class="input-field col s12 l6 password">
            <input id="password" type="password" class="validate" required>
            <label class="active" for="password">Password</label>
        </div>`,
    email: `
        <div class="input-field col s12 l6 email">
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
}

export default attachTemplatesToDom;