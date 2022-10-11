import api from "../utils/api.js";
export default class {

    entregas = [];

    generate() {
        return `
    <h1 class="h1ConfirmarEntrega">Confirmar entregas</h1>

    <div class="alerta-bloco">
        <div class="input-form">
            <label form="entregador">Entregador</label>
            <select class="optionConfirmarEntrega"  name="entregador" id="entregador">
                <option value="">Selectione o entregador!</option>
            </select>
        </div>

        <span id="span-erro"></span>

        <div id="entregas"></div>

        <div class="div-btns">
            <button class="optionConfirmarEntrega" id='btn-remover'>sair</button>
            <button id='btn-seleciona-entregador'>Atualizar</button>
        </div>
    </div>
    `
    }

    init(removerSubJanela, atualizar) {

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


                document.getElementById('entregador').addEventListener('change', async () => {
                    const codEntregador = document.getElementById('entregador').value;

                    this.entregas = await api('/teste_API/APIentregador/getPedidosEntregador.php?codEntregador=' + codEntregador);

                    console.log(this.entregas);

                    if (this.entregas.erro) {
                        document.getElementById('span-erro').textContent = this.entregas.erro;
                        document.getElementById('entregas').innerHTML = '';
                    }
                    else {
                        document.getElementById('span-erro').textContent = '';

                        const divEntregas = document.getElementById('entregas');

                        divEntregas.innerHTML = '';

                        for (const entrega of this.entregas) {
                            const div = document.createElement('div');

                            div.classList.add('div-entrega');

                            div.innerHTML = `
                                <span class='span-cod'>Cod: ${entrega.cod}</span>
                                <span class='span-endereco'>${entrega.endereco}, ${entrega.numero}</span>
                                <span class='span-cliente'>Cliente: ${entrega.nome}</span>
                                <span class='span-valor'>${Number(entrega.valor).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</span>
                                <label class='span-entregue' for='entregue-${entrega.cod}'>Entregue: </label>
                                <input type='checkbox' id='entregue-${entrega.cod}' ${entrega.pedido_entregue == 1 ? 'checked' : ''}/>
                            `;

                            divEntregas.append(div);

                            document.getElementById('entregue-' + entrega.cod).addEventListener('click', () => {
                                entrega.pedido_entregue = document.getElementById('entregue-' + entrega.cod).checked;
                            });
                        }
                    }
                });
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
            form.append('entregas', JSON.stringify(this.entregas));


            await api('/teste_API/APIentrega/confirmarEntrega.php', 'POST', form);
            removerSubJanela();
            atualizar();
        });
    }
}