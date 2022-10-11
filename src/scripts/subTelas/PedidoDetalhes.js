import api from "../utils/api.js";
export default class {

    //Código do pedido essencial para as queries
    codPedido = 0;

    generate() {
        return `
        <main id="sub-tela">
    <h1>Detalhes do pedido</h1>

   

    <div id="detalhes-entrega">
        <span class='span-grid'>Endereço: <span id='span-endereco'>Endereço</span></span>
        <span class='span-grid'>Número: <span id='span-numero'>0</span></span>
        <span class='span-grid'>Bairro: <span id='span-bairro'>Bairro</span></span>
        <span class='span-grid'>CEP: <span id='span-cep'>CEP</span></span>
        <span class='span-grid'>Referência: <span id='span-referencia'></span></span>
        <span class='span-grid'>Complemento: <span id='span-complemento'></span></span>

        <span class='span-grid'>Entregador: <span id='span-entregador'>Don Juan</span></span>
        <span class='span-grid'>Comissão a pagar: <span id='span-comissao'>R$ 0,00</span></span>
        <span class='span-grid'>Telefone 1: <span id='span-telefone-entregador'>(11) 1212-1212</span></span>
        <span class='span-grid'>Telefone 2: <span id='span-telefone-entregador-2'>(22) 1212-1212</span></span>
        <span class='span-grid'>Contato adicional: <span id='span-contato-entregador'></span></span>
    </div>

    <div class="bruno2" id="detalhes-cliente">
        <span class='span-grid'>Nome do cliente: <span id='span-cliente'>Nome</span></span>
        <span class='span-grid'>Email: <span id='span-email'>cliente@email.com</span></span>
        <span class='span-grid'>Telefone do cliente: <span id='span-telefone'>(11) 1111-1111</span></span>
    </div>

    <div id="detalhes-itens-pedido">
        <div>
        <span>Observação:</span>
        </div>
    </div>
    </main>
   
    <button class="sairClick2" id='btn-remover'>sair</button>
    `
    }

    init(codPedido, removerSubJanela, atualizar) {
        console.log(codPedido);
        this.codPedido = codPedido;

        let pedido = {};

        api('/teste_API/APIpedido/getPedido.php?cod=' + this.codPedido)
            .then(res => {
                pedido = res;
                console.log(res);

                // document.getElementById('span-dt-pedido').textContent = pedido.dt_pedido;
                // document.getElementById('span-valor').textContent = pedido.total;
                // document.getElementById('span-valor-pago').textContent = pedido.valor_pago;
                // document.getElementById('span-troco').textContent = pedido.valor_troco;
                // document.getElementById('span-taxa-entrega').textContent = pedido.taxa_entrega_valor;
                // document.getElementById('span-forma-pagamento').textContent = pedido.descricao_pagamento;

                document.getElementById('span-endereco').textContent = pedido.endereco;
                document.getElementById('span-numero').textContent = pedido.numero;
                document.getElementById('span-bairro').textContent = pedido.bairro;
                document.getElementById('span-cep').textContent = pedido.cep;
                document.getElementById('span-referencia').textContent = pedido.referencia;
                document.getElementById('span-complemento').textContent = pedido.complemento;

                document.getElementById('span-entregador').textContent = pedido.entregador;
                document.getElementById('span-comissao').textContent = pedido.comissao + pedido.valor_fixo;
                document.getElementById('span-telefone-entregador').textContent = pedido.fone1;
                document.getElementById('span-telefone-entregador-2').textContent = pedido.fone2;
                document.getElementById('span-contato-entregador').textContent = pedido.contato;

                document.getElementById('span-cliente').textContent = pedido.cliente;
                document.getElementById('span-email').textContent = pedido.cliente_email;
                document.getElementById('span-telefone').textContent = pedido.cliente_telefone;

                for (const item of pedido.pedido_itens) {
                    const div = document.createElement('div');
                    div.classList.add('item-pedido');

                    div.innerHTML = `
                    
                        <span class="produto-nome">${item.nome}</span>
                        <span class="produto-quantidade">${item.quantidade}</span>
                        <span class="produto-valor">${Number(item.valor * item.quantidade).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</span>
                    `;

                    document.getElementById('detalhes-itens-pedido').prepend(div);
                }


                const div = document.createElement('div');
                div.classList.add('item-pedido');

                div.innerHTML = `
                    
                        <span class="produto-nome">Nome</span>
                        <span class="produto-quantidade">Quantidade</span>
                        <span class="produto-valor">Valor</span>
                    `;

                document.getElementById('detalhes-itens-pedido').prepend(div);


            });

        document.getElementById('btn-remover').addEventListener('click', () => {
            removerSubJanela();
        });

    }
}