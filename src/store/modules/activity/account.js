import { reqGetAccountPageInfo,reqUpdateAccountStatus,reqAddAccount,reqUpdateAccount,reqDeleteAccount,reqGetTeacherNumber } from "@/api/activity/account";

const getDefaultState=()=>{
    return {
        total:null,
        accountInfo:[],
        teacherNumber:null,
    }
}

const state = getDefaultState();
const mutations = {
    RESET_STATE: (state) => {
        Object.assign(state, getDefaultState())
    },
    SET_ACCOUNT_INFO:(state,accountInfo)=>{
        state.accountInfo=accountInfo;
    },
    SET_TOTAL:(state,total)=>{
        state.total=total;
    },
    SET_TEACHER_NUMBER:(state,teacherNumber)=>{
        state.teacherNumber=teacherNumber;
    }
};
const actions = {
    async getAccountPageInfo({commit},pageInfo){
        const {auth,input,currentPage,pageSize,schoolId} = pageInfo;
        let result = await reqGetAccountPageInfo(auth,input,currentPage,pageSize,schoolId);
        if(result.code==200){
            commit('SET_ACCOUNT_INFO',result.data['records']);
            commit('SET_TOTAL',result.data['total']);
        }
        else return Promise.reject(new Error(result.msg));
    },
    async updateAccountStatus({commit},userId){
        let result=await reqUpdateAccountStatus(userId);
        if(result.code==200){
            return 'OK';
        }
        else return Promise.reject(new Error(result.msg));
    },
    async addAccount({commit},accountInfo){
        let result=await reqAddAccount(accountInfo);
        if(result.code==200){
            return 'OK';
        }
        else return Promise.reject(new Error(result.msg));
    },
    async updateAccount({commint},accountInfo){
        let result=await reqUpdateAccount(accountInfo);
        if(result.code==200){
            return 'OK';
        }
        else return Promise.reject(new Error(result.msg));
    },
    async deleteAccount({commit},accountId){
        let result =await reqDeleteAccount(accountId);
        if(result.code==200){
            return 'ok';
        }
        else return Promise.reject(new Error(result.msg));
    },
    async getTeacherNumber({commit},selectInfo){
        const {schoolId,classId}=selectInfo;
        let result = await reqGetTeacherNumber(schoolId,classId);
        if(result.code==200){
            commit('SET_TEACHER_NUMBER',result.data);
            return 'ok';
        }
        else return Promise.reject(new Error(result.msg));
    }
};

export default{
    namespaced: true,
    state,
    mutations,
    actions
}