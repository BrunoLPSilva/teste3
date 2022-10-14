
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


