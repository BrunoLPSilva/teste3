
/**
 * Mascara na qual decora o value de elementos do jeito que for configurado no construtor
 */
class Mascara {

    element;
    mask;
    options;

    input;
    blur = null;

    /**
        * Função feita para mascarar um elemento
        * @param {string} mask A máscara na qual o campo será feito
        * @param {string} elementoId O id do elemento
        * @param {Object} options Opções a se mudar a máscara
    */
    constructor(mask, elementoId, options = null) {
        this.element = document.getElementById(elementoId);
        this.mask = mask;
        this.options = options;

        this.element.addEventListener('input', this.input = this.mascarar.bind(this));

        if (options !== null) {
            if (options['data']) {
                this.element.addEventListener('blur', this.blur = this.mascaraBlur.bind(this));
            }
        }

        this.mascarar();
    }

    remover() {
        this.element.removeEventListener('input', this.input);
        if (this.options !== null) {
            this.element.removeEventListener('blur', this.blur);
        }
    }


    /**
     * Mascara o elemento
     */
    mascarar() {
        const value = this.element.value
        const len = value.length;

        let mask = this.mask;

        let valueMascarado = '';

        for (let i = 0; i < len; i++) {
            if (isNaN(mask[i]) && value[i] !== mask[i]) {

                valueMascarado += mask[i] + value[i];
                mask = mask.slice(0, i) + mask.slice(i + 1, mask.length);
            }

            else if ((!isNaN(value[i]) && value[i] !== ' ') || value[i] === mask[i]) {
                valueMascarado += value[i];
            }

        }
        this.element.value = valueMascarado;
    }

    mascaraBlur() {
        const dataPedacos = this.element.value.split('/');

        if (dataPedacos.length == 3) {
            if (dataPedacos[2].length == 2) {
                dataPedacos[2] = '20' + dataPedacos[2];

                this.element.value = dataPedacos.join('/');
            }

        }


    }

}

export default Mascara;