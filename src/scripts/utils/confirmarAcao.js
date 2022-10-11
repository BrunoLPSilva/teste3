/**
 * Página feita para servir como alerta estilizado, apenas inclua ela e use a função
 *  para criar a notificação.
 * 
 *  Para estilizar basta usar a classe .notificacao-bloco para o bloco todo,
 *  .notificacao-titulo para o título, .notificacao-mensagem para estilizar o texto da mensagem,
 *  .notificacao-botao para o botão.
 * @param {function} acao Função que será executada na confirmação da tela
 * @param {string} idCorpo Id do corpo principal da página, na qual a notificação será adicionada
 * @param {string} mensagem Mensagem da notificação
 * @param {string} titulo Título da notificação
 */
function confirmarAcao(acao, idCorpo = 'main', mensagem = "Notificação teste", titulo = null, acaoParams = null) {

    let html = `<section id="alerta">
             <div class="notificacao-bloco">`;

    if (typeof titulo !== null) {
        html += `<span class = 'notificacao-titulo'>${titulo}</span>`;
    }

    html += `<p class = 'notificacao-mensagem'>${mensagem}</p>
         
             <button class="notificacao-botao" id="btn-confirmar">Confirmar</button>
             <button class="notificacao-botao" id="btn-cancelar">Cancelar</button>
         </div>
     </section>`;


    const corpo = document.getElementById(idCorpo);

    corpo.innerHTML += html;

    let btnAlerta = document.getElementById("btn-confirmar");

    btnAlerta.onclick = () => {
        acao(acaoParams);
        let alerta = document.getElementById("alerta");
        alerta.remove();
    };

    let btnCancelar = document.getElementById('btn-cancelar');

    btnCancelar.addEventListener('click', (ev) => {
        let alerta = document.getElementById('alerta');

        alerta.remove();
    });

}

export default confirmarAcao;