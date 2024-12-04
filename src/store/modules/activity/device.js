import { reqGetDevicePageInfo,reqAddDevice,reqUpdateDevice,reqClearBindWithClass,reqDeleteDevice,reqGetDeviceNumber } from "@/api/activity/device";

const getDefaultState=()=>{
    return {
        devicePageInfo:[],
        total:null,
        deviceNumber:null,
    };
}

const state=getDefaultState();

const mutations={
    RESET_STATE: (state) => {
        Object.assign(state, getDefaultState())
    },
    SET_DEVICE_PAGE_INFO:(state,devicePageInfo)=>{
        state.devicePageInfo=devicePageInfo;
    },
    SET_TOTAL:(state,total)=>{
        state.total=total;
    },
    SET_DEVICE_NUMBER:(state,deviceNumber)=>{
        state.deviceNumber=deviceNumber;
    }
};

const actions={
    async getDevicePageInfo({commit},pageInfo){
        const {schoolId,inUse,input,currentPage,pageSize,type}=pageInfo;
        let result = await reqGetDevicePageInfo(schoolId,inUse,input,currentPage,pageSize,type);
        if(result.code==200){
            commit('SET_DEVICE_PAGE_INFO',result.data['records']);
            commit('SET_TOTAL',result.data['total']);
            return 'ok';
        }
        else return Promise.reject(new Error(result.msg));
    },
    async addDevice({commit},deviceInfo){
        let result=await reqAddDevice(deviceInfo);
        if(result.code==200){
            return 'ok';
        }
        else return Promise.reject(new Error(result.msg));
    },
    async updateDevice({commit},deviceInfo){
        let result = await reqUpdateDevice(deviceInfo);
        if(result.code==200){
            return 'ok';
        }
        else return Promise.reject(new Error(result.msg));
    },
    async clearBindWithClass({commit},deviceId){
        let result=await reqClearBindWithClass(deviceId);
        if(result.code==200){
            return 'ok';
        }
        else{
            return Promise.reject(new Error(result.msg));
        }
    },
    async deleteDevice({commit},deviceId){
        let result=await reqDeleteDevice(deviceId);
        if(result.code==200){
            console.log("hhh");
            return 'ok';
        }
        else{
            return Promise.reject(new Error(result.msg));
        }
    },
    async getDeviceNumber({commit},selectInfo){
        const {schoolId,classId}=selectInfo;
        let result = await reqGetDeviceNumber(schoolId,classId);
        if(result.code==200){
            commit('SET_DEVICE_NUMBER',result.data);
            return 'ok';
        }
        else return Promise.reject(new Error(result.msg));
    }
};

export default{
    state,
    mutations,
    actions,
    namespaced: true
}
