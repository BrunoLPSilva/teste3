import api from './utils/api.js';
import InputMonetario from './utils/InputMonetario.js';

const im = new InputMonetario(document.getElementById('valor'));

window.onload = async () => {
    const categorias = await getCategoria();
    document.getElementById('form-movimentacao').addEventListener('submit', submit);

    carregar();
}

async function getCategoria() {
    const categorias = await api('/teste_API/APICategoriaMovimentacao/listCategoria.php');

    const categoriaSelect = document.getElementById('categoria-movimentacao');

    for (const c of categorias) {
        const option = document.createElement('option');

        option.value = c.cod_categoria_movimentacao;
        option.textContent = c.descricao;

        categoriaSelect.append(option);
    }


    return categorias;

}

async function submit() {
    const form = new FormData();

    form.append('cod_categoria_movimentacao', document.getElementById('categoria-movimentacao').value);
    form.append('valor', im.getValor());
    form.append('observacao', document.getElementById('observacao').value);

    await api('/teste_API/APImovimentacao/insertMovimentacao.php', 'POST', form);
    alert("Movimentação realizada com sucesso!")

    document.getElementById('valor').value = '0.00';
    document.getElementById('observacao').value = '';

    carregar();
}

async function carregar() {
    const movimentacoes = await api('/teste_API/APImovimentacao/listMovimentacao.php');

    const tbody = document.getElementById('body-movimentacao');

    tbody.innerHTML = '';




    for (const contato of movimentacoes) {
        const tr = document.createElement('tr');


        tr.innerHTML = `
        <td class="movimentacaoCod"> ${contato.cod}</td>
        <td class="movimentacaoDescricao">${contato.descricao}</td>
        <td class="movimentacaoValor">${Number(contato.valor).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</td >
        <td class="movimentacaoData">${dataAtualFormatada(contato)}</td>
        <td class="movimentacaoObservacao">${contato.observacao}</td>
    `;

        tbody.append(tr);
    }


}
function dataAtualFormatada(contato) {

    const dtHoraSplit = contato.dtMovimentacao.split(' ');
    //[0000, 00, 00]
    const datasSplit = dtHoraSplit[0].split('-');
    //00/00/00 00:00:00
    const dtHora = datasSplit[2] + '/' + datasSplit[1] + '/' + datasSplit[0] + ' ' + dtHoraSplit[1]
    return dtHora;

}

