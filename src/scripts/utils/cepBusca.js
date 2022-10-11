export default (cep) => {
    return axios('https://viacep.com.br/ws/' + cep + '/json/',
        {

            method: 'GET',
            withCredentials: false

        }
    )
        .then(res => {
            return res.data;
        });
}