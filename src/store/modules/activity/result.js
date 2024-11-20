import { reqGetResultInfo,reqUpdateResultInfo,reqGetYesResultTime,reqGetResultStatus } from "@/api/activity/result";

const getDefaultState=()=>{
    return {
        resultInfo:[],
        yesResultTime:null,
        resultStatus:[],
    }
}

const state=getDefaultState();

const mutations={
    RESET_STATE: (state) => {
        Object.assign(state, getDefaultState())
    },
    SET_RESULT_INFO:(state,resultInfo)=>{
        state.resultInfo=resultInfo;
    },
    SET_YES_RESULT_TIME:(state,yesResultTime)=>{
        state.yesResultTime=yesResultTime;
    },
    SET_RESULT_STATUS:(state,resultStatus)=>{
        state.resultStatus=resultStatus;
    }
};

const actions={
    async getResultInfo({commit},selectInfo){
        const {selectClass,selectSchool,select,input}=selectInfo;
        let result = await reqGetResultInfo(selectClass,selectSchool,select,input);
        if(result.code==200){
            commit('SET_RESULT_INFO',result.data);
            return 'ok';
        }
        else return Promise.reject(new Error(result.msg));
    },
    async updateResultInfo({commit},changedResult){
        let result = await reqUpdateResultInfo(changedResult);
        if(result.code==200){
            return 'ok';
        }
        else return Promise.reject(new Error(result.msg));
    },
    async getYesResultTime({commit},info){
        const{schoolId,classId,timeStart,timeEnd}=info;
        let result = await reqGetYesResultTime(schoolId,classId,timeStart,timeEnd);
        if(result.code==200){
            commit('SET_YES_RESULT_TIME',result.data);
            return 'ok';
        }
        else return Promise.reject(new Error(result.msg));
    },
    async getResultStatus({commit},info){
        const {schoolId,classId,timeStart,timeEnd}= info;
        let result = await reqGetResultStatus(schoolId,classId,timeStart,timeEnd);
        if(result.code==200){
            commit('SET_RESULT_STATUS',result.data);
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