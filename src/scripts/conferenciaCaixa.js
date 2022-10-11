const { ipcRenderer } = require('electron');

import api from './utils/api.js';
import InputMonetario from './utils/InputMonetario.js';
import { getCaixa, removeCaixa } from './utils/caixa.js';
import { getPrinter } from './utils/printer.js';

let imEntrada, imSaida, imTroco,
    entrada, saida, troco, formasPagamento, total = 0;

window.onload = async () => {
    formasPagamento = await api('/teste_API/APIconferencia/listFormaPagto.php');

    console.log(formasPagamento);

    const div = document.getElementById('formas-pagamento');
    const divCaixa = document.getElementById('formas-pagamento-caixa');

    for (const formaPagto of formasPagamento) {
        const divForma = document.createElement('div');

        divForma.classList.add('inputbox');
        divForma.innerHTML = `
        <label for="forma-${formaPagto.cod_forma_pagto}">${formaPagto.forma_pagto.toUpperCase()}</label>
        <input id="forma-${formaPagto.cod_forma_pagto}" required>
        `;

        div.append(divForma);

        formaPagto.input = new InputMonetario(document.getElementById('forma-' + formaPagto.cod_forma_pagto));

        //Colocando a soma total para cada input dinâmico
        document.getElementById('forma-' + formaPagto.cod_forma_pagto).addEventListener('input', () => somar());

        const divFormaCaixa = document.createElement('div');
        divFormaCaixa.classList.add('inputbox');
        divFormaCaixa.innerHTML = `
        <span class="formaSpan"id="forma-span-${formaPagto.cod_forma_pagto}">${formaPagto.forma_pagto.toUpperCase()} </span>
        <input class="inputCaixa" type="text" id="inputCaixa${formaPagto.cod_forma_pagto}" name="inputCaixa">
        <input class="inputDiferenca" type="text" id="inputDiferenca${formaPagto.cod_forma_pagto}" name="inputDiferenca">
        `;

        divCaixa.append(divFormaCaixa);
    }

    //Dando o valor monetário para os inputs de entrada, saída e troco
    imEntrada = new InputMonetario(document.getElementById('in-entrada'));
    imSaida = new InputMonetario(document.getElementById('in-saida'));
    imTroco = new InputMonetario(document.getElementById('in-troco'));

    atualizarData()

    setTotal();

}

async function setEntradaESaida() {
    const data = await api('/teste_API/APIconferencia/listEntradaSaida.php');



    document.getElementById('in-entrada').addEventListener('input', () => somar());
    document.getElementById('in-saida').addEventListener('input', () => somar());

    console.log(data);

    document.getElementById('caixaEntrada').value = Number(data[1].total).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
    document.getElementById('caixaSaida').value = Number(data[0].total).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });

    entrada = data[1].total;
    saida = data[0].total;
}

async function setTroco() {
    const { cod } = getCaixa();

    troco = await api('/teste_API/APIconferencia/getTroco.php?codCaixa=' + cod);

    document.getElementById('caixaTroco').value = Number(troco).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });

    document.getElementById('in-troco').addEventListener('input', () => somar());
}

function somar() {
    total = 0;

    total += imEntrada.getValor();
    total += imSaida.getValor();
    total += imTroco.getValor();

    for (const forma of formasPagamento) {
        console.log(forma);
        total += forma.input.getValor();
    }

    document.getElementById('valor-total').textContent = Number(total).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
}

function subtrairDiferenca() {

    let diferencaEntrada = 0;
    diferencaEntrada = entrada;
    diferencaEntrada -= imEntrada.getValor();

    document.getElementById('diferencaEntrada').value = Math.abs(diferencaEntrada).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });;

    if (diferencaEntrada <= 0) {
        document.getElementById('diferencaEntrada').style.color = 'green';
    }

    let diferencaSaida = 0;
    diferencaSaida = saida;
    diferencaSaida -= imSaida.getValor();

    document.getElementById('diferencaSaida').value = Math.abs(diferencaSaida).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });;

    if (diferencaSaida <= 0) {
        document.getElementById('diferencaSaida').style.color = 'green';
    }

    let diferencaTroco = 0;
    diferencaTroco = troco;
    diferencaTroco -= imTroco.getValor();

    document.getElementById('diferencaTroco').value = Math.abs(diferencaTroco).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });;

    if (diferencaTroco <= 0) {
        document.getElementById('diferencaTroco').style.color = 'green';
    }

    for (const resultadoDiferenca of formasPagamento) {
        let subtrair = 0;
        subtrair = resultadoDiferenca.total;
        subtrair -= resultadoDiferenca.input.getValor();

        document.getElementById('inputDiferenca' + resultadoDiferenca.cod_forma_pagto).value = Number(Math.abs(subtrair)).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });

        if (subtrair <= 0) {
            document.getElementById('inputDiferenca' + resultadoDiferenca.cod_forma_pagto).style.color = 'green';
        }
    }


}

function setTotal() {
    let total = entrada + saida + troco;

    for (const forma of formasPagamento) {
        total += Number(forma.total);
    }

    // document.getElementById('valor-total-caixa').textContent = Number(total).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });

}

async function atualizarData() {
    const { cod } = getCaixa();

    const data = await api('/teste_API/APIaberturaCaixa/getDataCaixa.php?cod_caixa=' + cod)
    const getData = document.getElementById('dataFechamento')

    getData.innerHTML = ``

    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td class="dataCaixaFinal">DATA: ${dataHojeFormatada(data)}</td>`

    getData.append(tr);
}

function dataHojeFormatada(data) {
    const dtHoraSplit = data.dt_fechamento.split(' ');
    //[0000, 00, 00]
    const datasSplit = dtHoraSplit[0].split('-');
    //00/00/00 00:00:00
    const dtHora = datasSplit[2] + '/' + datasSplit[1] + '/' + datasSplit[0] + ' ' + dtHoraSplit[1]
    return dtHora;

}
document.getElementById('btnGravarConferencia').addEventListener('click', async () => {

    //Implementando os valores das formas de pagamento
    for (const forma of formasPagamento) {
        document.getElementById('inputCaixa' + forma.cod_forma_pagto).value = Number(forma.total).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });;
    }

    await setEntradaESaida();
    await setTroco();

    subtrairDiferenca();

    // Conferindo se os valores batem
    if (entrada != imEntrada.getValor()) {
        // alert('Valor de entrada não batem');
        return;
    }

    if (saida != imSaida.getValor()) {
        // alert('Valor de saída não batem');
        return;
    }

    if (troco != imTroco.getValor()) {
        // alert('Valor de troco não batem');
        return;
    }

    for (const forma of formasPagamento) {
        if (forma.total != forma.input.getValor()) {
            alert('Valor de ' + forma.forma_pagto + ' não batem');
            return;

        }
    }

    //Se tudo estiver batendo, o prosseguimento de conferência é efetuado
    const form = new FormData();

    const { cod } = getCaixa();

    form.append('cod_caixa', cod);
    form.append('entrada', imEntrada.getValor());
    form.append('saida', imSaida.getValor());
    form.append('troco', imTroco.getValor());

    const formFormas = [];

    for (const forma of formasPagamento) {
        const novaForma = {
            valor: forma.total,
            cod_forma_pagto: forma.cod_forma_pagto
        };

        formFormas.push(novaForma);
    }

    form.append('formas_pagamento', JSON.stringify(formFormas));


    api('/teste_API/APIconferencia/insertConferencia.php', 'POST', form)
        .then(res => {
            removeCaixa();
            window.location.href = "../views/welcome.html"
        })




})


document.getElementById('btnImprimir').addEventListener('click', async () => {
    const { cod } = getCaixa();

    const relatorio = await api('/teste_API/APIconferencia/getFechamentoData.php?cod=' + cod);
    relatorio['entradaESaida'] = await api('/teste_API/APIconferencia/listEntradaSaida.php');
    relatorio['formasPagto'] = await api('/teste_API/ApiPagto/listPagamento.php');

    relatorio.impressora = getPrinter();

    ipcRenderer.invoke('imprimir-fechamento-caixa', relatorio);

});