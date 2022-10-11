import { toFloat } from './numerico.js';


/**
 * Classe especializada para tratar inputs com valores monetários, feita para a TabelaGrid, mas
 *  usável fora desta.
 */
export default class {

    input;


    /**
     * Construtor habilita um input, seja pertencente a uma TabelaGrid ou não, a tratar um input
     * com valor monetário
     * @param {Element} input Elemento input que receberá tratamento como um input monetário
     */
    constructor(input, autoAcionar = true) {
        this.input = input;

        if (autoAcionar) {
            this.acionarMascara();
        }

    }

    /**
     * Método que mascara o input escolhido com valor monetário
     */
    mascarar(ev) {

        let novoValor = this.input.value;

        let virgula = 0;
        let posVirgula = 0;
        let posicaoVirgula = 0;


        //Filtrando valores que não sejam números, com exceção de vírgula
        novoValor = novoValor.split('').filter((c) => (!isNaN(c) && c != ' ') || c == ',');

        for (let i = 0; i < novoValor.length; i++) {

            //Verifica quantas vírgulas estão presentes
            if (novoValor[i] === ',') {
                virgula++;

                //Caso haja uma vírgula a mais, esta deve ser removida
                if (virgula > 1) {
                    novoValor =
                        [
                            ...novoValor.slice(0, i),
                            ...novoValor.slice(i + 1, novoValor.length)
                        ];
                }

                //Caso seja a primeira vírgula, precisamos de sua posição
                else {
                    posicaoVirgula = i;
                }
            }

            //Caso a vírgula seja presente, quer dizer que o valor está após a vírgula
            else if (virgula > 0) {
                posVirgula++;
            }

        }

        //Checando se há valor duas casas após a vírgula, estes devem ser removidos
        if (posVirgula > 2) {

            const redirecionar = posVirgula - 1;

            novoValor = [
                ...novoValor.slice(0, posicaoVirgula),
                ...novoValor.slice(posicaoVirgula + 1, novoValor.length - redirecionar),
                ',',
                ...novoValor.slice(novoValor.length - redirecionar, novoValor.length)
            ];

        }

        //Verificando se precisa adicionar um ou dois zeros pós vírgula
        else if (virgula > 0 && posVirgula < 2) {
            const zeros = 2 - posVirgula;

            novoValor =
                [
                    ...novoValor.slice(0, posicaoVirgula - zeros),
                    ',',
                    ...novoValor.slice(posicaoVirgula - zeros, posicaoVirgula),
                    ...novoValor.slice(posicaoVirgula + 1, novoValor.length)
                ];
        }

        //Removendo os zeros a esquerda
        while (novoValor[0] === '0') {
            novoValor.shift();
        }

        let split = novoValor;



        const size = split.length;

        let union = '';

        //Sequência para adicionar os pontos no número
        for (let i = 1; i <= size; i++) {

            union += split[i - 1];
            if (size - i > (virgula > 0 ? 3 : 2) && (size - i) % 3 === (virgula > 1 ? 3 : 0)) { union += '.'; }
        }

        //Casos abaixo de não deixar o valor em branco ou fora de formatação
        if (union.length === 0) {
            union += '0';
        }

        if (virgula === 0) {
            union += ',00';
        }

        if (split[0] === ',') {
            union = '0' + union;
        }

        this.input.value = 'R$ ' + union;


    }

    getValor() {
        return new Number(
            this.input
                .value
                .split('')
                .filter((c) => (!isNaN(c) && c != ' ') || c == ',')
                .join('')
                .replace(',', '.')
        );
    }

    desmascarar() {
        $(this.input).off('input');
        $(this.input).val($(this.input).val().replace('R$ ', ''));
    }

    acionarMascara() {
        this.input.addEventListener('input', this.mascarar.bind(this));
        this.mascarar();
    }

}