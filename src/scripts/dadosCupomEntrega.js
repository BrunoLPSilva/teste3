const { ipcRenderer } = require('electron');

ipcRenderer.on('enviar-pedido', (event, args) => {
    console.log(args);

    const data = dataFormatada(args.dt_pedido);
    const hora = horaFormatada(args.dt_pedido);

    document.getElementById('nome').textContent = 'Nome: ' + args.cliente;
    document.getElementById('endereco').textContent = 'Endereco: ' + args.endereco;
    document.getElementById('telefone').textContent = 'Telefone: ' + args.cliente_telefone;
    document.getElementById('data').textContent = 'Data: ' + data;
    document.getElementById('hora').textContent = 'Hora: ' + hora;
    generateItens(args.pedido_itens);
    document.getElementById('total').textContent = 'valor total: ' + args.total;

    function generateItens(itens) {
        const div = document.getElementById('div-itens');

        for (const item of itens) {
            const divItem = document.createElement('div');

            divItem.innerHTML = `
            <p class='item'>${item.quantidade} -                ${item.nome}
            `;

            div.append(divItem);
        }
    }

    function dataFormatada(dt_pedido) {
        let data = new Date(dt_pedido),
            dia = data.getDate().toString(),
            diaF = (dia.length == 1) ? '0' + dia : dia,
            mes = (data.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro começa com zero.
            mesF = (mes.length == 1) ? '0' + mes : mes,
            anoF = data.getFullYear();

        return diaF + "/" + mesF + "/" + anoF;


    }
    function horaFormatada(dt_pedido) {


        let d = new Date(dt_pedido);
        const hora1 = d.getHours(),
            minuto = d.getMinutes(),
            segundos = d.getSeconds();
        return hora1 + ":" + minuto + ":" + segundos

    }


});