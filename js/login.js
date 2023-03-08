import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

const API = 'https://f111-114-32-150-22.ap.ngrok.io'
const loginApi = `${API}/users/login`;
const userToken = '';
createApp({
    data() {
        return {
            // login
            users: {
                account: '',
                password: '',
            },
            token : ''
        }
    },
    methods: {
        // login
        login() {
            axios
                .post(loginApi, this.users)
                .then((response) => {
                    // console.log(response.data.data);
                    const {userToken} = response.data.data;
                    // console.log(userToken);
                    document.cookie = `userToken = ${userToken}`;
                    window.location = `index.html`;
                })
                .catch((error) => {
                    alert(error);
                })
        }
    }
}).mount('#app');