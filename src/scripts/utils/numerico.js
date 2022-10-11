/**
 * Pega um número e converte para um formato apresentável
 * @param {number} numero Um número real
 * @returns O número real em formato português (com vírgula no lugar de ponto)
 */
function toString(numero) {
    numero = numero.toFixed(2);

    const numeroString = numero.replace('.', ',');

    return numeroString;
}

/**
 * Pega um número convertido em formato português (com vírgula no lugar de ponto) e muda para o
 * formato padrão
 * @param {string} numeroString Número em formato de texto para converter
 * @returns O número real em formato padrão
 */
function toFloat(numeroString) {
    if (typeof numeroString === 'string') {
        console.log('Numero a mudar: ' + numeroString);
        let numero = parseFloat(numeroString.replace(',', '.'));

        console.log(numero);
        numero = numero.toFixed(2);
        console.log(numero);
        return numero;
    }

    else {
        return numeroString;
    }

}

export { toString, toFloat };