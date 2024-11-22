import { reqGetStudentInfoList,reqAddStudent,reqUpdateStudent,reqDeleteStudent,reqGetStudentNumberAndStatus } from "@/api/activity/student";
import {reqGetHomeWorkInfoList} from "@/api/activity/homework";
const getDefaultState=()=>{
    return{
        homeworkInfoList:[],
    }
}

const state=getDefaultState();

const mutations={
    RESET_STATE: (state) => {
        Object.assign(state, getDefaultState())
    },
    SET_HOMEWORK_INFO_LIST:(state,homeworkInfoList)=>{
        state.homeworkInfoList=homeworkInfoList;
    },
};

const actions={
    async getHomeWorkInfoList({commit},homeworkTotalInfo){
        const {teacherId,input} = homeworkTotalInfo;
        let result=await reqGetHomeWorkInfoList(teacherId,input);
        if(result.code===200){
            commit('SET_HOMEWORK_INFO_LIST',result.data);
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
