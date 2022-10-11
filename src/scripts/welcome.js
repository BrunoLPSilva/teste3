import api from './utils/api.js';

import { getAuth, removeAuth } from './utils/auth.js';
import { getCaixa, setCaixa } from './utils/caixa.js';

import InputMonetario from './utils/InputMonetario.js';

let im = null;

//Caso não esteja logado, o redirecionamento é feito
if (getAuth() == null) {
    window.location.href = '../views/login.html';
}

//Caso o caixa já esteja aberto, o redirecionamento é feito
const caixa = getCaixa();

if (caixa !== null) {
    window.location.href = '../views/gerenciarPedidos.html';
}

//Setar a data atual na tela e atualizar cada minuto
updateTempo();

setInterval(updateTempo, 1000);

//Setar nome na tela
const { nome, token } = getAuth();

document.getElementById('span-usuario').textContent = nome;

//Dar logoff
document.getElementById('btnLogout').addEventListener('click', () => {

    api('/teste_API/loginRetaguarda/logoff.php?token=' + token, 'PUT')
        .then(() => {
            removeAuth();
            alert('Sessão encerrada')
            window.location.href = '../views/login.html';
        });
});

//Verificador caso o botão já esteja acionado
let aberto = false;

document.getElementById('btnAbrirCaixa').addEventListener('click', event => {

    aberto = !aberto;
    if (aberto) {
        renderTroco();
    }
    else {
        desrenderTroco();
    }

});

function updateTempo() {
    //pegando a data atual e colocando na tela
    const date = new Date();

    document.getElementById('span-data').textContent =
        `
    Data:
    ${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}/${date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}/${date.getFullYear()}`;


    document.getElementById('span-hora').textContent =
        `
    Hora:
    ${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`;


}

function desrenderTroco() {
    document.getElementById('div-troco').innerHTML = '';
    im = null;
}

function renderTroco() {

    const divTroco = document.getElementById('div-troco');

    divTroco.innerHTML = `<form id="formTroco">
    <label for="contato-restaurante">Digite o troco: </label>
    <input  id="btnEnvia" maxlength="14" />

    <button id="btnEnviaTroco" type="submit">Gravar</button>
</form>`;

    im = new InputMonetario(document.getElementById('btnEnvia'));

    //Cadastrar o caixa
    document.getElementById('formTroco').addEventListener('submit', event => {

        event.preventDefault();

        const form = new FormData();

        form.append('valor_troco', im.getValor());


        api('/teste_API/APIaberturaCaixa/insertAbertura.php', 'POST', form)
            .then(res => {

                setCaixa(res.cod_caixa, res.dt_abertura);

                window.location.href = '../views/gerenciarPedidos.html';

            });

    });

}

