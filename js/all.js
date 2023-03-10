import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

const API = 'https://af97-114-32-150-22.ap.ngrok.io';

// 用戶車籍
const getMembersApi = `${API}/member/memberInfo`;
let memberModal = null;
let delMemberModal = null;

// 使用者
const getUsersApi = `${API}/users/userInfo`;
let userModal = null;
let delUserModal = null;

createApp({
    data() {
        return {
            today: new Date().toLocaleString(),
            // loginData: {
            //     account: '',
            //     token: ''
            // },
            // 用戶車籍
            members: [],
            tempMember: {},
            isNewMember: false, // 用來確認是新增或是編輯用戶車籍
            // searchResult: [], //搜尋結果陣列，初始預設為空陣列
            searchdata: '', //搜尋關鍵字，初始預設為空字串
            // 使用者
            users: [],
            tempUser: {},
            isNewUser: false //用來確認是新增或編輯使用者
        }
    },
    methods: {
        // 確認登入
        // loginCheck(account, userToken) {
        //     const loginCheckApi = `${API}/user/loginCheck`;
        //     axios
        //         .post(`${loginCheckApi}`)
        //         .then((response) => {
        //             console.log(response);
        //             this.getMembers();
        //         })
        //         .catch((error) => {
        //             alert(error);
        //             // window.location = `login.html`;
        //         })
        // },

        // logout
        loginOut() {
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
                .then(() => {
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
            axios
                .post(searchMemberApi, { target: { searchdata: this.searchdata } })
                .then((response) => {
                    // console.log(response.data);
                    // console.log(this.searchdata);
                    this.members = response.data;
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
                if (this.tempUser.newPassword !== this.tempUser.newPasswordCheck) {
                    alert("新密碼輸入不一致");
                    return;
                } else {
                    this.tempUser.password = this.tempUser.newPassword;
                }
                // console.log(this.tempUser);
            };
            axios
            [method](updateUserApi, { target: this.tempUser })
                .then((response) => {
                    if (method === 'put') {
                        alert("修改成功～請重新登入");
                        document.cookie = "userToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
                        window.location = `login.html`;
                    };
                    alert(response.data.message);
                    userModal.hide();
                    this.getUsers(); //新增後重新取得用戶車籍列表
                })
                .catch((error) => {
                    alert(error)
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
                    document.cookie = "userToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
                    window.location = `login.html`;
                })
                .catch((error) => {
                    alert(error);
                })
        }
        // 使用者
    },
    mounted() {
        // axios.default.headers.common['Authorization'] = userToken;
        // this.loginCheck();
        this.getMembers();
        this.getUsers();
        // 初始化 bootstrap modal
        memberModal = new bootstrap.Modal('#memberModal');
        delMemberModal = new bootstrap.Modal('#delMemberModal');
        userModal = new bootstrap.Modal('#userModal');
        delUserModal = new bootstrap.Modal('#delUserModal');
    }
}).mount('#app');