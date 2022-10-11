const { ipcRenderer } = require('electron');

ipcRenderer.on('imprimir-fechamento', (event, args) => {
    console.log(args);


    setDatas(args);
    const totalPagamento = setFormasPagto(args.pagtos, args.formasPagto);
    setFundoInicial(args.fundoInicial);
    const totalEC = setTotalEEntradaCaixa(totalPagamento, args.entradaESaida[1].total);
    setTotalSaidas(args.entradaESaida[0].total);
    setTotalGeral(totalEC, args.entradaESaida[0].total);

    setProdutos(args.produtos);
});

function setDatas(args) {
    let dtFechamento = args.dtFechamento.split(' ');
    const dtFechaSplit = dtFechamento[0].split('-');

    dtFechamento = dtFechaSplit[2] + '/' + dtFechaSplit[1] + '/' + dtFechaSplit[0];

    document.getElementById('data').textContent = dtFechamento;

    const horaAbertura = args.dtAbertura.split(' ')[1];
    const horaFechamento = args.dtFechamento.split(' ')[1];

    document.getElementById('hora-abertura').textContent = horaAbertura;
    document.getElementById('hora-fechamento').textContent = horaFechamento;
}

function setFormasPagto(pagamentos, formasPagamento) {
    const pagtos = [];

    let totalQuantidade = 0;
    let totalValor = 0;

    const divFormasPagto = document.getElementById('div-formas-pagamento');

    for (const formaPagamento of formasPagamento) {

        pagtos[formaPagamento.descricao_pagamento] = { cartao: formaPagamento.cartao };

        pagtos[formaPagamento.descricao_pagamento]['total']
            = pagamentos.reduce(
                (sum, p) => p.descricao_pagamento == formaPagamento.descricao_pagamento
                    ? sum + Number(p.valor_pago) : sum, 0
            );
        pagtos[formaPagamento.descricao_pagamento]['quantidade']
            = pagamentos.filter(p => p.descricao_pagamento == formaPagamento.descricao_pagamento).length;

        const div = document.createElement('div');
        div.classList.add = 'div-forma-pagamento';

        div.innerHTML = `
        <span class="label">+ ${formaPagamento.descricao_pagamento.toUpperCase()}</span>
        <span class="quantidade">${pagtos[formaPagamento.descricao_pagamento]['quantidade']}</span>
        <span class="valor">${pagtos[formaPagamento.descricao_pagamento]['total'].toLocaleString('pt-br', { minimumFractionDigits: 2 })}</span>`;

        divFormasPagto.append(div);

        //Somando os totais
        totalValor += pagtos[formaPagamento.descricao_pagamento]['total'];
        totalQuantidade += pagtos[formaPagamento.descricao_pagamento]['quantidade'];


    }

    document.getElementById('total-pagamentos-quantidade').textContent = totalQuantidade;
    document.getElementById('total-pagamentos-valor').textContent = totalValor.toLocaleString('pt-br', { minimumFractionDigits: 2 });

    console.log(pagtos);

    const geralTotal = { quantidade: 0, total: 0 };

    geralTotal.quantidade += pagtos['Dinheiro'].quantidade;
    geralTotal.total += pagtos['Dinheiro'].total;

    document.getElementById('resumoValorDinheiro').textContent
        = typeof pagtos['Dinheiro'] != 'undefined' ? pagtos['Dinheiro'].total.toLocaleString('pt-br', { minimumFractionDigits: 2 }) : '0, 00';


    document.getElementById('resumoDinheiroQuantidade').textContent
        = typeof pagtos['Dinheiro'] != 'undefined' ? pagtos['Dinheiro'].quantidade : '0';


    const pagtoCartao = { quantidade: 0, total: 0 };
    const pagtoTicket = { quantidade: 0, total: 0 };

    for (const i in pagtos) {
        console.log(pagtos[i]);
        if (pagtos[i].cartao == 1) {
            pagtoCartao.quantidade += pagtos[i].quantidade;
            pagtoCartao.total += pagtos[i].total;
        }

        else if (pagtos[i].ticket == 1) {
            pagtoTicket.quantidade += pagtos[i].quantidade;
            pagtoTicket.total += pagtos[i].total;
        }
    }

    document.getElementById('resumoValorCartao').textContent
        = pagtoCartao.total.toLocaleString('pt-br', { minimumFractionDigits: 2 });


    document.getElementById('resumoCartaoQuantidade').textContent
        = pagtoCartao.quantidade;

    document.getElementById('resumoTicketValor').textContent
        = pagtoTicket.total.toLocaleString('pt-br', { minimumFractionDigits: 2 });


    document.getElementById('resumoTicketQuantidade').textContent
        = pagtoTicket.quantidade;

    geralTotal.quantidade += pagtoCartao.quantidade;
    geralTotal.quantidade += pagtoTicket.quantidade;

    geralTotal.total += pagtoCartao.total;
    geralTotal.total += pagtoTicket.total;

    document.getElementById('resumoTotalQuantidade').textContent = geralTotal.quantidade;
    document.getElementById('resumoTotalValor').textContent = geralTotal.total.toLocaleString('pt-br', { minimumFractionDigits: 2 });

    return totalValor;
}

function setFundoInicial(fundoInicial) {
    document.getElementById('fundo-caixa-inicial').textContent = Number(fundoInicial).toLocaleString('pt-br', { minimumFractionDigits: 2 });
}

function setTotalEEntradaCaixa(total, entradas) {
    const t = Number(total) + Number(entradas);

    document.getElementById('totalEentradas').textContent = t.toLocaleString('pt-br', { minimumFractionDigits: 2 });

    return t;
}

function setTotalSaidas(saidas) {

    document.getElementById('totalSaidasValor').textContent = saidas.toLocaleString('pt-br', { minimumFractionDigits: 2 });
}

function setTotalGeral(total, saida) {
    const totalGeral = Number(total) - Number(saida);

    document.getElementById('total-geral-valor').textContent = totalGeral.toLocaleString('pt-br', { minimumFractionDigits: 2 });
}

function setProdutos(produtos) {
    const produtosAgrupados = [];

    //Filtrar os produtos que já foram somados
    const codProdutosSomados = [];

    for (const produto of produtos) {

        if (codProdutosSomados.find(cod => cod == produto.cod_produto)) {
            continue;
        }
        else {
            codProdutosSomados.push(produto.cod_produto);
        }

        const produtoUnico = produtos.filter(p => p.cod_produto == produto.cod_produto);

        let quantidadeAgrupada = 0;

        for (const p of produtoUnico) {
            quantidadeAgrupada = quantidadeAgrupada + p.quantidade;
        }
        console.log(quantidadeAgrupada);

        const produtoAgrupado = produto;

        produtoAgrupado['quantidade'] = quantidadeAgrupada;
        produtoAgrupado['valor'] = produtoAgrupado['valor'] * produtoAgrupado['quantidade'];

        produtosAgrupados.push(produtoAgrupado);
    }

    console.log(produtosAgrupados);

    produtosAgrupados.sort(function (a, b) {
        return (a.cod_grupo > b.cod_grupo) ? 1 : ((b.cod_grupo > a.cod_grupo) ? -1 : 0);
    });

    let codGrupo = 0;

    const divProdutos = document.getElementById('produtos-vendidos');

    const grupos = [];

    let grupoAux = {};

    for (const produto of produtosAgrupados) {
        if (produto.cod_grupo !== codGrupo) {
            if (codGrupo != 0) {
                grupos.push(grupoAux);
            }

            codGrupo = produto.cod_grupo;

            const span = document.createElement('span');
            span.classList.add('grupo-titulo');

            span.textContent = `*** ${produto.grupo} ***`;

            divProdutos.append(span);

            grupoAux = {
                valor: 0,
                quantidade: 0,
                desc: produto.grupo
            };
        }

        grupoAux.valor += produto.valor;
        grupoAux.quantidade += produto.quantidade;

        const divProduto = document.createElement('div');
        divProduto.classList.add = 'produto';
        divProduto.innerHTML = `
        <span class="label">${produto.produto}</span>
        <span class="quantidade">${produto.quantidade}</span>
        <span class="valor">${produto.valor.toLocaleString('pt-br', { minimumFractionDigits: 2 })}</span>
        `;

        divProdutos.append(divProduto);
    }

    const soma = produtosAgrupados.reduce((s, produto) => s + produto.valor, 0);

    document.getElementById('produtos-vendidos-total').textContent
        = 'Total: ' + soma.toLocaleString('pt-br', { minimumFractionDigits: 2 });

    //Adicionando os grupos em faturamento
    const divGrupos = document.getElementById('div-grupos');

    console.log(grupos);
    for (const grupo of grupos) {
        const dGrupo = document.createElement('div');

        dGrupo.classList.add('grupo');

        dGrupo.innerHTML = `
        <span class="label">${grupo.desc}</span> <span class="quantidade">${grupo.quantidade}</span> <span class="valor">${grupo.valor.toLocaleString('pt-br', { minimumFractionDigits: 2 })}</span>
        `;

        divGrupos.append(dGrupo);
    }
}