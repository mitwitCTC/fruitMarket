import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

const API = 'https://96ea-114-32-150-22.ap.ngrok.io'
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
                .post(loginApi, { target: this.users })
                .then((response) => {
                    // console.log(response.data.data);
                    loginCheckData.account = response.data.data.account;
                    loginCheckData.userToken = response.data.data.token;
                    loginCheckData.id = response.data.data.id;
                    // console.log(loginCheckData.account, loginCheckData.id, loginCheckData.userToken);
                    // Init
                    document.cookie = `userToken = ${loginCheckData.id}:${loginCheckData.account}:${loginCheckData.userToken}; max-age=3600`;
                    window.location = `index.html`;
                })
                .catch((error) => {
                    alert(error);
                })
        }
    },
    mounted() {
        // 讀取 Cookie 的函數
        function getCookie(name) {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.startsWith(`${name}=`)) {
                    return cookie.substring(name.length + 1);
                }
            }
            return null;
        }

        // 如果有 token ，則直接跳轉到 index 頁
        const username = getCookie('userToken');
        if (username) {
            window.location = `index.html`;
        }
    }
}).mount('#app');