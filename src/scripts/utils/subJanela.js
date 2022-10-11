
/**
 * Gera uma sub janela para abrir um setor como uma sub página.
 * @param {string} html O HTML que vai ser gerado na tela
 * @param {string} idCorpo O id do corpo da página principal a incorporar a sub janela a tal
 * @param {*} args Argumentos a enviar no contentWindow do Iframe
 * @param {boolean} slim Caso a sub janela seja ainda menor
 */
export default function subJanela(html, idCorpo = 'main', args = null, slim = false) {
    const URL_PRINCIPAL = 'http://localhost:5500/';

    const alerta = document.createElement('section');

    alerta.id = 'alerta';

    if (slim === true) {
        alerta.className = 'slim';
    }
    else if (slim === 'medium') {
        alerta.className = 'medium';
    }

    alerta.innerHTML = html;

    const corpo = document.getElementById(idCorpo);

    corpo.append(alerta);

    //frame.contentWindow.args = args;

}