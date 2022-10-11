import api from "../utils/api.js";
export default class {


    //Código do pedido essencial para as queries
    codPedido = 0;

    generate() {
        return `
    <h1 class="h1Estado">Estado do pedido</h1>

    <div class="alerta-bloco">
        <div class="input-form">
            <label form="estado">Estado</label>
            <select name="estado" id="estado">
                <option value="">Selectione o estado!</option>
                <option value="CANCELADO">CANCELADO</option>
                <option value="AGUARDANDO">AGUARDANDO</option>
                <option value="INICIADO">INICIADO</option>
                <option value="SAIU_PARA_ENTREGA">SAIU PARA A ENTREGA</option>
                <option value="FINALIZADO">FINALIZADO</option>
            </select>
        </div>

        <div class="div-btns">
            <button id='btn-remover'>sair</button>
            <button id='btn-atualizar'>Atualizar</button>
        </div>
    </div>
    `
    }

    init(codPedido, removerSubJanela, carregar) {
        console.log(codPedido);
        this.codPedido = codPedido;

        document.getElementById('btn-atualizar').addEventListener('click', async () => {
            const estado = document.getElementById('estado').value

            const form = new FormData();
            form.append('estado', estado);
            form.append('cod', this.codPedido);

            console.log(form);

            await api('/teste_API/APIpedido/alterarEstado.php', 'POST', form);

            removerSubJanela();
            carregar();
        });

        document.getElementById('btn-remover').addEventListener('click', () => { removerSubJanela() });
    }

}