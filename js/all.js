import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
const API = 'https://fed2-114-32-150-22.ngrok-free.app';

// 表單驗證 必填
VeeValidate.defineRule('required', VeeValidateRules['required']);
// 讀取外部的資源
VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

// Activate the locale
VeeValidate.configure({
    generateMessage: VeeValidateI18n.localize('zh_TW'),
    validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

// 用戶車籍
const getMembersApi = `${API}/member/memberInfo`;
let memberModal = null;
let delMemberModal = null;

// 使用者
const getUsersApi = `${API}/users/userInfo`;
let userModal = null;
let delUserModal = null;

const app = Vue.createApp({
    data() {
        return {
            // 表單驗證
            validateMember: {
                company_name: '',
                user_name: '',
                contract: '',
                plate: '',
                type: '',
                empty_weight: '',
                date_end: '',
                phone: '',
                personnelcode: ''
            },
            // loginCheck
            loginCheckData: {
                id: '',
                account: '',
                token: '',
            },
            // 用戶車籍
            members: [],
            tempMember: {},
            isNewMember: false, // 用來確認是新增或是編輯用戶車籍
            // searchResult: [], //搜尋結果陣列，初始預設為空陣列
            searchdata: '', //搜尋關鍵字，初始預設為空字串
            // 使用者
            users: [],
            tempUser: {},
            updateUserCheckData: {
                account: '',
                password: '',
            },

            isNewUser: false, //用來確認是新增或編輯使用者

            // 紀錄查詢
            // records: [
            //     {
            //         "name": "人員1",
            //         "plate": "ABC-0001",
            //         "type": "採購車",
            //         "enter_time": "2023-03-13 12:12:12",
            //         "enter_weight": 8500,
            //         "depart_time": "2023-09-13 15:52:13",
            //         "depart_weight": 9500,
            //     },
            //     {
            //         "name": "人員2",
            //         "plate": "ABC-0002",
            //         "type": "採購車",
            //         "enter_time": "2023-03-13 12:12:12",
            //         "enter_weight": 8500,
            //         "depart_time": "2023-09-13 15:52:13",
            //         "depart_weight": 9500,
            //     },
            //     {
            //         "name": "人員3",
            //         "plate": "ABC-0003",
            //         "type": "採購車",
            //         "enter_time": "2023-03-13 12:12:12",
            //         "enter_weight": 8500,
            //         "depart_time": "2023-09-13 15:52:13",
            //         "depart_weight": 9500,
            //     }
            // ],

        }
    },
    methods: {
        // 確認登入
        loginCheck(loginCheckData) {
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

            // 判斷哪一個使用者登入了
            const username = getCookie('userToken');
            if (username) {
                this.loginCheckData.id = username.split(':')[0];
                this.loginCheckData.account = username.split(':')[1];
                this.loginCheckData.token = username.split(':')[2];
            }

            const loginCheckApi = `${API}/users/loginCheck`;

            axios
                .post(loginCheckApi, { target: this.loginCheckData })
                .then((response) => {
                    // console.log(this.loginCheckData);
                    // console.log(response);
                    if (this.loginCheckData.token != '') {
                        this.updateUserCheckData.account = this.loginCheckData.account;
                        this.getMembers();
                        this.getUsers();
                    } else {
                        alert("尚未登入，請重新登入");
                        window.location = `login.html`;
                    }
                })
                .catch((error) => {
                    alert(error);
                    window.location = `login.html`;
                })
        },
        // logout
        logout() {
            const logoutApi = `${API}/users/logout`;
            axios
                .post(logoutApi)
                .then(() => {
                    document.cookie = "userToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
                    window.location = `login.html`;
                })
                .catch((error) => {
                    alert(error.message);
                })

        },
        // 驗證電話
        isPhone(value) {
            const phoneNumber = /^(09)[0-9]{8}$/
            return phoneNumber.test(value) ? true : '請確認聯絡電話格式'
        },
        deleteSearch() {
            this.getMembers();
            const cantFindArea = document.querySelector('.cantFind-Area');
            this.members.length > 0
                ? cantFindArea.classList.remove('block')
                : cantFindArea.classList.add('block');
            console.log(this.members);
        },
        // 取得用戶車籍資料 (members)
        getMembers() {
            axios
                .get(getMembersApi)
                .then((response) => {
                    // console.log(response.data);
                    this.members = response.data;
                }).catch((error) => {
                    alert(error);
                })
        },
        // 開啟新增/編輯用戶車籍(member) modal
        openMemberModal(status, member) {
            if (status === 'create') {
                memberModal.show();
                this.isNewMember = true;
                // 新增時會帶入初始資料
                this.tempMember = {};
            } else if (status === 'edit') {
                memberModal.show();
                this.isNewMember = false;
                // 編輯的話，會帶入當前要編輯的原資料
                this.tempMember = Object.assign({}, member);
            }
        },
        // 開啟刪除用戶車籍 modal
        openDelMemberModal(member) {
            delMemberModal.show();
            this.tempMember = { ...member };
        },
        // 新增/編輯用戶車籍
        updateMember() {
            let updateMemberApi = `${API}/member/createMember`;
            let method = 'post';
            if (!this.isNewMember) {
                updateMemberApi = `${API}/member/updateMember/${this.tempMember.userId}`;
                method = 'put';
            }
            axios
            [method](updateMemberApi, { target: this.tempMember })
                .then((response) => {
                    alert(response.data.message); //若車牌已存在，則跳出警告，無法新增
                    this.getMembers(); //新增後重新取得用戶車籍列表
                    memberModal.hide();
                })
                .catch((error) => {
                    alert(error)
                })
        },
        // 刪除用戶車籍
        deleteMember() {
            const deleteMemberApi = `${API}/member/deleteMember/${this.tempMember.userId}`;
            axios
                .patch(deleteMemberApi, { target: this.tempMember.userId })
                .then(() => {
                    this.getMembers(); //刪除後重新取得用戶車籍列表
                    delMemberModal.hide();
                })
                .catch((error) => {
                    alert(error);
                })
        },
        // 搜尋用戶車籍
        searchMember(searchdata) {
            const searchMemberApi = `${API}/member/searchMember`;
            const cantFindArea = document.querySelector('.cantFind-Area');
            axios
                .post(searchMemberApi, { target: { searchdata: this.searchdata } })
                .then((response) => {
                    // console.log(response.data);
                    // console.log(this.searchdata);
                    this.members = response.data;
                    // console.log(this.members.length);
                    this.members.length > 0
                        ? cantFindArea.classList.remove('block')
                        : cantFindArea.classList.add('block');
                })
                .catch((error) => {
                    alert(error);
                })
        },
        // 取得使用者資料
        getUsers() {
            axios
                .get(getUsersApi)
                .then((response) => {
                    // console.log(response.data);
                    this.users = response.data;
                })
                .catch((error) => {
                    alert(error);
                })

        },
        // 開啟新增/修改使用者 (user) modal
        openUserModal(status, user) {
            if (status === 'create') {
                userModal.show();
                this.isNewUser = true;
                // 新增時會帶入初始資料
                this.tempUser = {};
            } else if (status === 'edit') {
                userModal.show();
                this.isNewUser = false;
                // 編輯的話，會帶入當前要編輯的原資料
                this.tempUser = { ...user };
                // console.log(this.tempUser);
            }
        },
        // 開啟刪除使用者 (user) modal
        openDelUserModal(user) {
            delUserModal.show();
            this.tempUser = { ...user };
        },
        // 新增/修改使用者
        updateUser() {
            let updateUserApi = `${API}/users/createUser`;
            let method = 'post';
            if (!this.isNewUser) {
                updateUserApi = `${API}/users/updateUser/${this.tempUser.id}`;
                method = 'put';
                // console.log(this.tempUser);
            };
            axios
            [method](updateUserApi, { target: this.tempUser })
                .then((response) => {
                    if (method === 'put') {
                        alert(response.data.message);
                        userModal.hide();
                    } else if (method === 'post') {
                        alert(response.data.message);
                        userModal.hide();
                    };
                    this.getUsers(); //新增後重新取得用戶車籍列表
                })
                .catch((error) => {
                    alert(error)
                })
        },
        // 確認修改使用者原密碼
        updatePasswordCheck(updateUserCheckData) {
            const checkUserApi = `${API}/users/checkUser`;
            axios
                .post(checkUserApi, { target: this.updateUserCheckData })
                .then((response) => {
                    this.updateUserCheckData.account = this.loginCheckData.account;
                    // console.log(this.updateUserCheckData.account, this.updateUserCheckData.password);
                    if (response.data.message === "密碼錯誤") {
                        alert("原密碼輸入錯誤，請確認原密碼");
                        return;
                    } else {
                        this.updatePassword();
                    }
                })
                .catch((response) => {
                    alert(response.message)
                })
        },
        // 
        // 修改使用者密碼
        updatePassword() {
            const updatePasswordApi = `${API}/users/updatePassword/${this.loginCheckData.id}`
            // console.log(updatePasswordApi);
            if (this.updateUserCheckData.password === this.tempUser.newPassword) {
                alert("新密碼不得與原密碼相同！")
            }
            else if (this.tempUser.newPassword === '' || this.tempUser.newPasswordCheck === '') {
                alert('密碼不得為空');
            } else if (this.tempUser.newPassword !== this.tempUser.newPasswordCheck) {
                alert('新密碼輸入不一致');
            } else {
                // console.log(this.tempUser.newPassword);
                this.updateUserCheckData.password = this.tempUser.newPassword;
                // console.log("updateUserCheckData: ", this.updateUserCheckData);
                axios
                    .put(updatePasswordApi, { target: this.updateUserCheckData })
                    .then((response) => {
                        alert("修改成功～請重新登入");
                        // console.log(response);
                        // console.log(this.updateUserCheckData);
                        document.cookie = "userToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
                        window.location = `login.html`;
                        this.tempUser = {};
                        this.getUsers(); //新增後重新取得用戶車籍列表
                    })
                    .catch((error) => {
                        alert(error)
                    })
            }
        },
        // 驗證修改使用者密碼
        // Example starter JavaScript for disabling form submissions if there are invalid fields
        checkUpdatePasswordForm() {
            'use strict'
            // Fetch all the forms we want to apply custom Bootstrap validation styles to
            var forms = document.querySelectorAll('.needs-validation')

            // Loop over them and prevent submission
            Array.prototype.slice.call(forms)
                .forEach(function (form) {
                    form.addEventListener('submit', function (event) {
                        if (!form.checkValidity()) {
                            event.preventDefault()
                            event.stopPropagation()
                        }
                        form.classList.add('was-validated')
                    }, false)
                })
        },
        // 刪除使用者
        deleteUser() {
            const deleteUserApi = `${API}/users/deleteUser/${this.tempUser.id}`;
            axios
                .patch(deleteUserApi, { target: this.tempUser.id })
                .then(() => {
                    this.getUsers(); //刪除後重新取得使用者資料列表
                    delUserModal.hide();
                    if (this.tempUser.account === this.loginCheckData.account) {
                        alert("已刪除，請重新登入")
                        this.logout();
                    }else{
                        alert("刪除成功～");
                    }
                })
                .catch((error) => {
                    alert(error);
                })
        },
    },

    mounted() {
        // axios.default.headers.common['Authorization'] = mitwitToken;
        this.loginCheck();
        // 讀取 Cookie 的函數
        setTimeout(() => {
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
            // 驗證過期，如果沒有 token ，則直接跳轉到 login 頁
            const username = getCookie('userToken');
            if (!username) {
                alert("已自動登出");
                window.location = `login.html`;
            }
        }, 600000)
        // 初始化 bootstrap modal
        memberModal = new bootstrap.Modal('#memberModal');
        delMemberModal = new bootstrap.Modal('#delMemberModal');

        userModal = new bootstrap.Modal('#userModal');
        delUserModal = new bootstrap.Modal('#delUserModal');
    }
});



app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);

app.mount('#app');