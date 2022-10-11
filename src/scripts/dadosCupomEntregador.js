const { ipcRenderer } = require('electron');

ipcRenderer.on('enviar-pedido', (event, args) => {
    console.log(args);

    const data = dataFormatada(args.dt_pedido);
    const hora = horaFormatada(args.dt_pedido);

    document.getElementById('cod').textContent = 'Codigo do pedido: ' + args.cod_pedido;
    document.getElementById('nome').textContent = 'Nome: ' + args.cliente;
    document.getElementById('cep').textContent = 'CEP: ' + args.cep;
    document.getElementById('endereco').textContent = 'Endereco: ' + args.endereco;
    document.getElementById('numero').textContent = 'Numero da residencia: ' + args.numero;
    document.getElementById('bairro').textContent = 'Bairro: ' + args.bairro;
    document.getElementById('cidade').textContent = 'Cidade: ' + args.cidade;
    document.getElementById('observacao').textContent = 'Observação endereço: ' + args.observacao;
    document.getElementById('telefone').textContent = 'Telefone: ' + args.cliente_telefone;
    document.getElementById('data').textContent = 'Data: ' + data;
    document.getElementById('hora').textContent = 'Hora: ' + hora;
    document.getElementById('total').textContent = 'valor total: ' + args.total;



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
        const hora1 = d.getHours().toString(),
            horaF = (hora1.length == 1) ? '0' + hora1 : hora1,

            minuto = d.getMinutes().toString(),
            minutoF = (minuto.length == 1) ? '0' + minuto : minuto,

            segundos = d.getSeconds().toString(),
            segundosF = (segundos.length == 1) ? '0' + segundos : segundos;



        return horaF + ":" + minutoF + ":" + segundosF

    }


});