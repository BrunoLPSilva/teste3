const setPrinter = (nome) => {
    localStorage.setItem('impressora', nome);
}

const getPrinter = () => {
    const obj = localStorage.getItem('impressora');

    return obj == null || typeof obj == 'undefined' ? null : obj;
}

const removePrinter = () => {
    localStorage.removeItem('impressora');
}

export { setPrinter, getPrinter, removePrinter };