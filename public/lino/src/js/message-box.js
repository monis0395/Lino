const template = `
            <div class="row">
                <div class="col offset-l3 s12 l6 ">
                    <div class="card-panel custom-card message-card z-depth-2 hoverable center">
                        <h5 class="brown-text text-darken-4">{{title}}</h5>
                        <p id="message-{{number}}">Initializing...</p>
                        <div class="progress brown lighten-5">
                            <div class="determinate brown darken-4" style="width: 0" id="progress-{{number}}"></div>
                        </div>
                    </div>
                </div>
            </div>`;

let messageBoxIdCounter = 0;

function addMessageBox(title) {
    const container = document.createElement('div');
    container.classList.add('container');
    container.innerHTML = template.replace(/{{number}}/g, messageBoxIdCounter.toString()).replace(/{{title}}/, title);

    const mainContainer = document.getElementById('main-container');
    mainContainer.appendChild(container);
    return messageBoxIdCounter++;
}

function updateProgress(messageBoxId, percentage, message) {
    const progressBar = document.getElementById(`progress-${messageBoxId}`);
    const messageElement = document.getElementById(`message-${messageBoxId}`);
    progressBar.style.width = percentage + "%";
    messageElement.innerHTML = message;
}

export {addMessageBox, updateProgress};
