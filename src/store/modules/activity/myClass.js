import { reqGetClassInfoList,reqGetClassPageInfo,reqAddClass,reqUpdateClass,reqDeleteClass, reqClearTeacher,reqGetClassInfoById } from "@/api/activity/myClass";

const getDefaultState=()=>{
    return {
        classInfoList:[],
        classInfo:[],
        classPageInfo:[],
        total:"",
    }
}

const state=getDefaultState();

const mutations={
    RESET_STATE: (state) => {
        Object.assign(state, getDefaultState())
    },
    SET_CLASS_INFO_LIST:(state,classInfoList)=>{
        state.classInfoList=classInfoList
    },
    SET_CLASS_PAGE_INFO:(state,classPageInfo)=>{
        state.classPageInfo=classPageInfo;
    },
    SET_TOTAL:(state,total)=>{
        state.total=total;
    },
    SET_CLASS_INFO:(state,classInfo)=>{
        state.classInfo=classInfo;
    }
};

const actions={
    async getClassInfoList({commit},schoolId){
        let result = await reqGetClassInfoList(schoolId);
        if(result.code==200){
            commit('SET_CLASS_INFO_LIST',result.data);
            return 'ok';
        }
        else return Promise.reject(new Error(result.msg));
    },
    async getClassPageInfo({commit},pageInfo){
        const {schoolId,input,currentPage,pageSize}=pageInfo;
        let result = await reqGetClassPageInfo(schoolId,input,currentPage,pageSize);
        if(result.code==200){
            commit('SET_CLASS_PAGE_INFO',result.data['records']);
            commit('SET_TOTAL',result.data['total']);
            return 'ok';
        }
        else return Promise.reject(new Error(result.msg));
    },
    async addClass({commit},classInfo){
        let result=await reqAddClass(classInfo);
        if(result.code==200){
            return 'ok';
        }
        else return Promise.reject(new Error(result.msg));
    },
    async updateClass({commit},classInfo){
        let result=await reqUpdateClass(classInfo);
        if(result.code==200){
            return 'ok';
        }
        else return Promise.reject(new Error(result.msg));
    },
    async deleteClass({commit},deleteInfo){
        const{schoolId,classId}=deleteInfo;
        let result=await reqDeleteClass(schoolId,classId);
        if(result.code==200){
            return 'ok';
        }
        else return Promise.reject(new Error(result.msg));
    },
    async clearTeacher({commit},classId){
        let result=await reqClearTeacher(classId);
        if(result.code==200){
            return 'ok';
        }
        else return Promise.reject(new Error(result.msg));
    },
    async getClassInfoById({commit},classId){
        let result = await reqGetClassInfoById(classId);
        if(result.code==200){
            commit('SET_CLASS_INFO',result.data);
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