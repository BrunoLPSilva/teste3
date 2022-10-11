const setCaixa = (cod, data) => {
    localStorage.setItem('caixa', JSON.stringify({ cod, data }));
}

const getCaixa = () => {
    const obj = JSON.parse(localStorage.getItem('caixa'));

    return obj == null || typeof obj.cod == 'undefined' ? null : obj;
}

const removeCaixa = () => {
    localStorage.removeItem('caixa');
}

export { setCaixa, getCaixa, removeCaixa };