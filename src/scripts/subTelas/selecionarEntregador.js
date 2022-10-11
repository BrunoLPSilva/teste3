import api from "../utils/api.js";
export default class {

    //Código do pedido essencial para as queries
    codPedido = 0;

    generate() {
        return `
    <h1 class="h1SelecionarEntregador">Selecione o entregador</h1>

    <div class='alerta-bloco'>
        <div class="input-form">
            <label form="entregador">Entregador</label>
            <select name="entregador" id="entregador">
                <option value="">Selectione o entregador!</option>
            </select>
        </div>

        <div class="div-btns">
            <button id='btn-remover'>sair</button>
            <button id='btn-seleciona-entregador'>Atualizar</button>
        </div>
    </div>
    `
    }

    init(codPedido, removerSubJanela, atualizar) {
        console.log(codPedido);
        this.codPedido = codPedido;

        let entregadores = [];

        api('/teste_API/APIentregador/listEntregador.php')
            .then(res => {
                entregadores = res;
                console.log(res);


                for (const entregador of entregadores) {

                    const option = document.createElement("option");

                    option.value = entregador.cod;
                    option.textContent = entregador.nome;
                    document.getElementById('entregador').append(option);
                }

            });

        document.getElementById('btn-remover').addEventListener('click', () => {
            removerSubJanela();
        });

        document.getElementById('btn-seleciona-entregador').addEventListener('click', async () => {
            const codEntregador = document.getElementById('entregador').value;

            //Se o código do entregador não for selecionado, não faz a ação
            if (codEntregador == '') {
                return;
            }

            const form = new FormData();
            form.append('cod_entregador', codEntregador);
            form.append('cod_taxa_entrega', 1);
            form.append('cod_pedido', this.codPedido);



            await api('/teste_API/APIentrega/insertSelecioneEntregador.php', 'POST', form);
            removerSubJanela();
            atualizar();
        });
    }
}