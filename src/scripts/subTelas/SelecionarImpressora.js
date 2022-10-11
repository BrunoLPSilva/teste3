const { ipcRenderer } = require('electron');

import { setPrinter, getPrinter } from '../utils/printer.js';

export default class {

    generate() {
        return `
    <h1>Selecionar impressora</h1>

    <div class="alerta-bloco">
        <div class="input-form">
            <label form="impressora">Impressora</label>
            <select id="impressora">
            
            </select>
        </div>

        <div class="div-btns">
            <button id='btn-remover'>Sair</button>
            <button id='btn-selecionar'>Selecionar</button>
        </div>
    </div>
    `
    }

    setup(removerSubJanela) {

        ipcRenderer.invoke('get-printers');

        document.getElementById('btn-selecionar').addEventListener('click', () => {
            const impressora = document.getElementById('impressora').value;

            if (impressora === '') {
                return;
            }

            setPrinter(impressora);

            removerSubJanela();
        });

        ipcRenderer.on('receber-impressoras', (event, impressoras) => {
            console.log(impressoras);

            const select = document.getElementById('impressora');

            select.innerHTML = '<option value = "">Selecione uma impressora</option>';

            for (const impressora of impressoras) {
                const option = document.createElement('option');

                option.value = impressora.name;
                option.textContent = impressora.name;

                select.append(option);
            }

            const impressora = getPrinter();

            console.log(impressora);

            if (impressora != null) {
                select.value = impressora;
            }


        });
    }
}