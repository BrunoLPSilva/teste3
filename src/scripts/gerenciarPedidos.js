const { ipcRenderer } = require('electron');

import api from './utils/api.js';
import subJanela from './utils/subJanela.js';
import AlterarPagamento from './subTelas/alterarPagamento.js';
import AlterarStatus from './subTelas/alterarStatus.js';
import SelecionarEntregador from './subTelas/selecionarEntregador.js';
import PedidoDetalhes from './subTelas/PedidoDetalhes.js';
import ConfirmarEntrega from './subTelas/confirmarEntrega.js';
import SelecionarImpressora from './subTelas/SelecionarImpressora.js';


import confirmarAcao from './utils/confirmarAcao.js';
import { getCaixa, removeCaixa } from './utils/caixa.js';
import { getPrinter } from './utils/printer.js';

class GerenciarPedidos {
    //Necessário para fazer controle de atualização de pedidos novos
    countPedidos = 0;


    init() {

        //Verifica se o caixa está aberto
        if (getCaixa() == null) {

            window.location.href = '../views/welcome.html';
        }

        this.infoAbertura();
        this.infoImpressora();

        this.carregar();

        //aciona o botão de fechar caixa
        this.deslogar();

        // document.getElementById('btnConferencia').addEventListener('click', () => {
        //     const { cod } = getCaixa();

        //     window.location.href = '../views/conferencia.html?cod=' + cod;
        // });


        let segundos = 0;
        //Atualiza os pedidos com o tempo de cinco em cinco segundos
        setInterval(async () => {
            const contagemPedidos = await api('/teste_API/APIpedido/getPedidoCount.php', 'GET');
            console.log(contagemPedidos);

            if ((this.countPedidos != 0 && this.countPedidos !== contagemPedidos) || segundos == 80) {
                this.carregar();
                segundos = 0;
            }
            else {
                segundos += 5;
            }

            this.countPedidos = contagemPedidos;


        }, 5000);

        document.getElementById('btn-alterar-pagamento')
            .addEventListener('click', this.clickAlterarPagamento.bind(this));

        document.getElementById('btn-status-pedido')
            .addEventListener('click', this.clickStatusPedido.bind(this));

        document.getElementById('btn-selecionar-entregador')
            .addEventListener('click', this.clickSelecionarEntregador.bind(this));

        document.getElementById('btn-confirma-entrega')
            .addEventListener('click', this.clickConfirmarEntrega.bind(this));

        document.getElementById('btn-selecionar-impressora')
            .addEventListener('click', this.clickSelecionarImpressora.bind(this));

        document.getElementById('btn-imprimir-cupom').addEventListener('click', async () => {
            const codPedido = this.getSelecionado();

            if (codPedido !== 0) {

                const pedido = await api('/teste_API/APIpedido/getPedidoCupom.php?cod=' + codPedido);

                pedido.impressora = getPrinter();

                ipcRenderer.invoke('imprimir', pedido);
            }


        });
        document.getElementById('btn-recibo-entregador').addEventListener('click', async () => {
            const codPedido = this.getSelecionado();

            if (codPedido !== 0) {

                const pedido = await api('/teste_API/APIentrega/getCupomEntrega.php?cod=' + codPedido);

                pedido.impressora = getPrinter();

                ipcRenderer.invoke('impressao', pedido);
            }


        });

        document.getElementById('btnMovimentacao').addEventListener('click', () => {
            window.location.href = '../views/movimentacao.html';
        });
    }

    clickSelecionarEntregador() {
        const codPedido = this.getSelecionado();

        if (codPedido == 0) {
            return;
        }

        const se = new SelecionarEntregador();

        subJanela(se.generate(), 'main');

        se.init(codPedido, this.removerSubJanela, this.carregar);
    }

    clickConfirmarEntrega() {
        const ce = new ConfirmarEntrega();

        subJanela(ce.generate(), 'main');

        ce.init(this.removerSubJanela, this.carregar);
    }

    clickAlterarPagamento() {
        const codPedido = this.getSelecionado();

        if (codPedido !== 0) {

            const ap = new AlterarPagamento();
            subJanela(ap.generateAlterarPagamento(), 'main', { remove: this.removerSubJanela });

            document.getElementById('btn-remover').addEventListener('click', () => { this.removerSubJanela() });
            ap.initAlterarPagamento(codPedido);


            ap.AlterarPagamento(this.removerSubJanela, this.carregar);
        }
    }

    clickSelecionarImpressora() {
        const ap = new SelecionarImpressora();
        subJanela(ap.generate(), 'main');

        document.getElementById('btn-remover').addEventListener('click', () => { this.removerSubJanela() });


        ap.setup(this.removerSubJanela);
    }

    async clickStatusPedido() {
        if (this.getSelecionado() != 0) {
            const alterarStatus = new AlterarStatus();

            subJanela(alterarStatus.generate(), 'main', { remove: this.removerSubJanela });
            alterarStatus.init(this.getSelecionado(), this.removerSubJanela, this.carregar);
        }

    }

    removerSubJanela() {
        const alerta = document.getElementById('alerta');

        alerta.remove();
    }

    /**
     * 
     * @returns 0 para caso não haja item selecionado, de resto um número significando o código do pedido
     */
    getSelecionado() {
        const s = document.getElementsByClassName('selected');

        let codPedido = 0;

        if (s.length > 0) {
            const selected = document.getElementsByClassName('selected')[0];
            codPedido = selected.firstChild.nextSibling.textContent;
        }

        return codPedido;
    }

    carregarPedidoDetalhes() {
        const codPedido = this.getSelecionado();

        const pd = new PedidoDetalhes();

        subJanela(pd.generate(), 'main');

        pd.init(codPedido, this.removerSubJanela.bind(this), this.carregar.bind(this));
    }

    async carregar() {
        document.getElementById('body-pedidos').innerHTML = '';

        const pedidos = await api('/teste_API/APIpedido/listPedidoAll.php');

        console.log(pedidos);

        if (pedidos != null) {
            for (const pedido of pedidos) {

                pedido.total = Number(pedido.total).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });

                const now = new Date();
                const dtPedido = new Date(pedido.dt_pedido);

                const diff = now.getTime() - dtPedido.getTime();

                let contagemSec = Math.floor(diff / 1000);

                let contagemHora = Math.floor(contagemSec / 60 / 60);
                let contagemMinuto = Math.floor(contagemSec / 60 % 60);

                pedido.dt_pedido = pedido.dt_pedido.split(' ')[1];

                //const pedido.telefone = "00000000000";
                const ddd = pedido.telefone.substring(0, 2);
                const numero = pedido.telefone.substring(2, 7);
                const final = pedido.telefone.substring(7, 11);
                const numeroCompleto = '(' + ddd + ')' + numero + '-' + final;


                const linha = document.createElement('div');

                linha.classList.add('linha');

                linha.innerHTML = `
                <div class="celula">${pedido.cod}</div>
                <div class="celula">${pedido.operador}</div>
                <div class="celula">${pedido.dt_pedido}</div>
                <div class="celula" id=duracao-${pedido.cod}>${contagemHora > 9 ? contagemHora : '0' + contagemHora}:${contagemMinuto > 9 ? contagemMinuto : '0' + contagemMinuto}</div>
                <div class="celula">${pedido.nome.toUpperCase()} | ${pedido.endereco === null ? 'Retirar no local' : pedido.endereco.toUpperCase()}</div>
                <div class="celula">${numeroCompleto}</div>
                <div class="celula-estado 
                         ${pedido.estado_pedido === 'FINALIZADO' ? 'entreguePedido' :
                        pedido.estado_pedido === 'CANCELADO' ? 'canceladoPedido' :
                            pedido.estado_pedido === 'INICIADO' ? 'inicioPedido' :
                                pedido.estado_pedido === 'AGUARDANDO' ? 'aguardePedido' :
                                    pedido.estado_pedido === 'INICIADO' ? 'iniciadoPedido' :
                                        pedido.estado_pedido === 'SAIU_PARA_ENTREGA' ? 'entregaDoPedido' : ''}">${pedido.estado_pedido.split('_').join(' ')}</div>
                <div class="celula">${pedido.total}</div>
                <div class="celula">${pedido.descricao_pagamento.toUpperCase()}</div>
                <div class="celula">${pedido.entregador === null ? 'Aguardando entregador' : pedido.entregador.toUpperCase()}</div>
                <div class="celula">${pedido.observacao === null ? '' : pedido.observacao.toUpperCase()}</div>`;

                document.getElementById('body-pedidos').append(linha);

                linha.addEventListener('click', () => {
                    const selected = document.getElementsByClassName('selected')[0];

                    if (linha.classList.contains('selected')) {
                        this.carregarPedidoDetalhes();
                    }
                    else if (typeof selected !== 'undefined') {
                        selected.classList.remove('selected');
                    }

                    linha.classList.add('selected');
                });
            }
        }

        const quantidadePedidos = pedidos != null ? pedidos.length : 0;

        document.getElementById('num-pedidos').textContent = quantidadePedidos;
    }

    infoAbertura() {
        const { data } = getCaixa();

        //[0000-00-00, 00:00:00]
        const dtHoraSplit = data.split(' ');
        //[0000, 00, 00]
        const datasSplit = dtHoraSplit[0].split('-');
        //00/00/00 00:00:00
        const dtHora = datasSplit[2] + '/' + datasSplit[1] + '/' + datasSplit[0] + ' ' + dtHoraSplit[1]

        document.getElementById('span-abertura').textContent =
            `
        Abertura atual de caixa: ${dtHora}
        `
    }

    infoImpressora() {
        const impressora = getPrinter();

        document.getElementById('span-impressora').textContent =
            `
        Impressora: ${impressora}
        `
    }



    deslogar() {
        document.getElementById('btnEncerrarCaixa').addEventListener('click', () => {
            const { cod } = getCaixa();

            confirmarAcao(
                (cod) => {
                    const form = new FormData();
                    form.append('cod_caixa', cod);

                    api('/teste_API/APIaberturaCaixa/insertFechamento.php', 'POST', form)
                        .then(() => {
                            ('Caixa fechado, faça a conferência do caixa antes de reabrir')
                            //removeCaixa();
                            window.location.href = '../views/conferencia.html?cod=' + cod;
                        });
                },
                'main',
                'Tem certeza que deseja fechar o caixa? Após fechado, este não pode ser reaberto.',
                'Confirmação',
                cod
            );

        });
    }

}

const gp = new GerenciarPedidos();
gp.init();