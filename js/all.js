import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

const API = 'https://f111-114-32-150-22.ap.ngrok.io';

// 用戶車籍
const getMembersApi = `${API}/member/memberInfo`;
let memberModal = null;
let delMemberModal = null;

createApp({
    data() {
        return {
            today: new Date().toLocaleString(),
            personnelcode: '',
            members: [],
            tempMember: {},
            isNewMember: false, // 用來確認是新增或是編輯
        }
    },
    methods: {
        // 取得用戶車籍資料 (members)
        getMembers() {
            axios
                .get(`${getMembersApi}`)
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
            if (!this.isNewMember){
                updateMemberApi = `${API}/member/updateMember/${this.tempMember.userId}`;
                method = 'put'
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
        deleteMember(userId) {
            let deleteMemberApi = `${API}/member/deleteMember/${this.tempMember.userId}`;
            axios
                .patch(deleteMemberApi, { target: this.tempMember.userId})
                .then((response) => {
                    this.getMembers(); //刪除後重新取得用戶車籍列表
                    delMemberModal.hide();
                    
                })
                .catch((error) => {
                    alert(error);
                })
        },
    },
    mounted() {
        this.getMembers();
        // 初始化 bootstrap modal
        memberModal = new bootstrap.Modal('#memberModal');
        delMemberModal = new bootstrap.Modal('#delMemberModal');
    }
}).mount('#app');