
const { ipcRenderer } = require('electron');

import api from './utils/api.js';
import { getAuth, setAuth } from './utils/auth.js';

//Verifica-se se você já está logado
if (getAuth() != null) {
    window.location.href = '../views/welcome.html';
}

document.getElementById('form-login').addEventListener('submit', async event => {

    event.preventDefault();

    const email = document.getElementById('email').value
    const senha = document.getElementById('senha').value

    const form = new FormData;

    form.append("email", email);
    form.append("senha", senha);

    const { sucesso, token, nome, cod } = await api('/teste_API/loginRetaguarda/login.php', 'POST', form);

    setAuth(token, cod, nome);

    if (sucesso) {

        window.location.href = "../views/welcome.html";
    } else {
        alert("login incorreto")
    }

});

const notification = document.getElementById('notification');
const message = document.getElementById('message');
const restartButton = document.getElementById('restart-button');

ipcRenderer.on('update_available', () => {
    ipcRenderer.removeAllListeners('update_available');
    message.innerText = 'A new update is available. Downloading now...';
    notification.classList.remove('hidden');
});

ipcRenderer.on('update_downloaded', () => {
    ipcRenderer.removeAllListeners('update_downloaded');
    message.innerText = 'Update Downloaded. It will be installed on restart. Restart now?';
    restartButton.classList.remove('hidden');
    notification.classList.remove('hidden');
});

function closeNotification() {
    notification.classList.add('hidden');
} function restartApp() {
    ipcRenderer.send('restart_app');
}

