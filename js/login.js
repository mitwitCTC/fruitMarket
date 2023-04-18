import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

const API = 'https://00cb-114-32-150-22.ngrok-free.app'
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
                    // 判斷帳號密碼是否正確
                    if (response.data.returnCode == 0) {
                        // console.log(response.data.data);
                        loginCheckData.account = response.data.data.account;
                        loginCheckData.userToken = response.data.data.token;
                        loginCheckData.id = response.data.data.id;
                        // console.log(loginCheckData.account, loginCheckData.id, loginCheckData.userToken);
                        // Init
                        document.cookie = `userToken = ${loginCheckData.id}:${loginCheckData.account}:${loginCheckData.userToken}; max-age=3600`;
                        alert(response.data.message);
                        window.location = `index.html`;
                    } else if (response.data.returnCode == 400) {
                        alert(response.data.message);
                    }
                })
            // .catch((message) => {
            //     // alert("帳號或密碼錯誤！請確認");
            //     // alert(message);
            // })
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