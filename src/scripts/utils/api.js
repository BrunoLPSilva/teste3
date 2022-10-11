const SERVER = 'http://restaurantes.soliinformatica.com.br'


/**
 * Faz uma requisição a partir do axios
 * @param {string} route Rota da API a ser consumida ex: /aluno 
 * @param {string} method Método a ser acionado (GET, POST, PATCH, PUT ou DELETE) 
 * @param {object} params Parametros a colocar na requisição
 * @returns 
 */
async function api(route, method = 'get', params = null) {

    let contentType = 'application/x-www-form-urlencoded';

    console.log(params);

    return axios(SERVER + route,
        {

            method,
            data: params,
            withCredentials: false

        }
    )
        .then(res => {
            return res.data;
        })


}

export default api;