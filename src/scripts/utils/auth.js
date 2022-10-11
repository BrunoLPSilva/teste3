const setAuth = (token, cod, nome) => {
    localStorage.setItem('login', JSON.stringify({ token, cod, nome }));
}

const getAuth = () => {
    const obj = JSON.parse(localStorage.getItem('login'));

    return obj == null || typeof obj.cod == 'undefined' ? null : obj;
}

const removeAuth = () => {
    localStorage.removeItem('login');
}

export { setAuth, getAuth, removeAuth };