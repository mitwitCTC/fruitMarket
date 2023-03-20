import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

const API = 'https://30ef-114-32-150-22.ap.ngrok.io'
const loginApi = `${API}/users/login`;

let loginCheckData = {};

createApp({
    data() {
        return {
            // login
            users: {
                account: '',
                password: '',
            },
        }
    },
    methods: {
        // login
        login() {
            axios
                .post(loginApi, {target: this.users})
                .then((response) => {
                    // console.log(response.data.data);
                    loginCheckData.account = response.data.data.account;
                    loginCheckData.userToken = response.data.data.token;
                    loginCheckData.id = response.data.data.id;
                    // console.log(loginCheckData.account, loginCheckData.id, loginCheckData.userToken);
                    document.cookie =`userToken = ${loginCheckData.id}:${loginCheckData.account}:${loginCheckData.userToken};`;
                    window.location = `index.html`;
                })
                .catch((error) => {
                    alert(error);
                })
        }
    }
}).mount('#app');