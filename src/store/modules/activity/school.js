import { reqGetSchoolInfo ,reqAddSchool,reqDeleteSchool,reqUpdateSchool,reqGetSchoolInfoList} from "@/api/activity/school";

const getDefaultState=()=>{
    return {
        total:'',
        schoolInfo:[],
        schoolInfoList:[],
    }
}

const state = getDefaultState();

const mutations = {
    RESET_STATE: (state) => {
        Object.assign(state, getDefaultState())
    },
    SET_TOTAL:(state,total)=>{
        state.total=total;
    },
    SET_SCHOOL_INFO:(state,schoolInfo)=>{
        state.schoolInfo=schoolInfo;
    },
    SET_SCHOOL_INFO_LIST:(state,schoolInfoList)=>{
        state.schoolInfoList=schoolInfoList;
    }
};

const actions = {
    async getSchoolInfo({commit},pageInfo){
        const {currentPage,pageSize,input}=pageInfo;
        let result = await reqGetSchoolInfo(currentPage,pageSize,input);
        if(result.code==200){
            commit('SET_TOTAL',result.data['total']);
            commit('SET_SCHOOL_INFO',result.data['records']);
        }
        else return Promise.reject(new Error(result.msg));
    },
    async addSchool({commit},schoolInfo){
        let result = await reqAddSchool(schoolInfo);
        if(result.code==200){
            return 'ok';
        }
        else return Promise.reject(new Error(result.msg));
    } ,
    async updateSchool({commit},schoolDTO){
        let result = await reqUpdateSchool(schoolDTO);
        if(result.code==200){
            return 'ok';
        }
        else{
            return Promise.reject(new Error(result.msg));
        }

    },
    async deleteSchool({commit},schoolId){
        let result = await reqDeleteSchool(schoolId);
        if(result.code==200){
            return 'ok';
        }
        else{
            return Promise.reject(new Error(result.msg));
        }
    },
    async getSchoolInfoList({commit}){
        let result = await reqGetSchoolInfoList();
        if(result.code==200){
            commit('SET_SCHOOL_INFO_LIST',result.data);
            return 'ok';
        }
        else{
            return Promise.reject(new Error(result.msg));
        }
    }
};


export default{
    namespaced: true,
    state,
    mutations,
    actions
}