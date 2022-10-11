import api from "../utils/api.js";
export default class {


    //Código do pedido essencial para as queries
    codPedido = 0;

    generateAlterarPagamento() {
        return `
    <h1>Alterar pagamento</h1>

    <div class="alerta-bloco">
        <div class="input-form">
            <label form="formaPagamento">Forma de pagamento</label>
            <select name="formaPagamento" id="formaPagamento">
                <option value="">Selectione a forma de pagamento!</option>

            </select>
        </div>

        <div id='div-adicionar-troco'></div>

        <div class="div-btns">
            <button id='btn-remover'>sair</button>
            <button id='btn-atualizar'>Atualizar</button>
        </div>
    </div>
    `
    }

    initAlterarPagamento(codPedido) {
        console.log(codPedido);
        this.codPedido = codPedido;


        let formas = [];
        api('/teste_API/ApiPagto/listPagamento.php')
            .then(res => {
                formas = res;
                console.log(res);


                for (const forma of formas) {
                    const option = document.createElement("option");
                    option.value = forma.cod_pagto;
                    option.textContent = forma.descricao_pagamento;
                    document.getElementById('formaPagamento').append(option);
                }

                document.getElementById('formaPagamento').addEventListener('change', (ev) => {
                    const text = ev.target.options[ev.target.selectedIndex].text;
                    if (text.toUpperCase() == 'DINHEIRO') {
                        const divTroco = document.createElement('div');
                        divTroco.id = 'div-troco';

                        divTroco.innerHTML = '<label for="troco">Troco: </label><input type="text" id="troco" />';

                        document.getElementById('div-adicionar-troco').append(divTroco);
                    }
                    else {
                        const div = document.getElementById('div-troco');

                        if (div !== null) {
                            div.remove();
                        }

                    }
                });

            });
    }

    AlterarPagamento(removerSubJanela, carregar) {

        document.getElementById('btn-atualizar').addEventListener('click', async () => {
            const cod_forma_pagto = document.getElementById('formaPagamento').value

            const troco = document.getElementById('troco') == null ? 0 : document.getElementById('troco').value;

            const form = new FormData();
            console.log(cod_forma_pagto);
            console.log(this.codPedido);
            form.append('troco', troco);
            form.append('cod_forma_pagto', cod_forma_pagto);
            form.append('cod_pedido', this.codPedido);

            console.log(form);

            await api('/teste_API/ApiPagto/ApiAlteraPagamento.php', 'POST', form);

            removerSubJanela();
            carregar();
        });




    }
}