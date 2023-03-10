import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

const API = 'https://af97-114-32-150-22.ap.ngrok.io'
const loginApi = `${API}/users/login`;

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
                .post(loginApi, this.users)
                .then((response) => {
                    // console.log(response.data.data);
                    const account = response.data.data.account;
                    const userToken = response.data.data.token;
                    // console.log(account,userToken);
                    document.cookie = `userToken = ${userToken};`;
                    window.location = `index.html`;
                })
                .catch((error) => {
                    alert(error);
                })
        }
    }
}).mount('#app');