import { reqGetStudentInfoList,reqAddStudent,reqUpdateStudent,reqDeleteStudent,reqGetStudentNumberAndStatus } from "@/api/activity/student";

const getDefaultState=()=>{
    return{
        studentInfoList:[],
        studentNumber:null,
        studentSightStatus:[],
    }
}

const state=getDefaultState();

const mutations={
    RESET_STATE: (state) => {
        Object.assign(state, getDefaultState())
    },
    SET_STUDENT_INFO_LIST:(state,studentInfoList)=>{
        state.studentInfoList=studentInfoList;
    },
    SET_STUDENT_NUMBER:(state,studentNumber)=>{
        state.studentNumber=studentNumber;
    },
    SET_STUDENT_SIGHT_STATUS:(state,studentSightStatus)=>{
        state.studentSightStatus=studentSightStatus;
    }
};

const actions={
    async getStudentInfoList({commit},studentTotalInfo){
        const {classId,name,userId} = studentTotalInfo;
        let result=await reqGetStudentInfoList(classId,name,userId);
        if(result.code==200){
            commit('SET_STUDENT_INFO_LIST',result.data);
        }
        else return Promise.reject(new Error(result.msg));
    },
    async addStudent({commit},studentInfo){
        let result = await reqAddStudent(studentInfo);
        if(result.code==200){
            return 'ok';
        }
        else return Promise.reject(new Error(result.msg));
    },
    async updateStudent({commit},studentInfo){
        let result = await reqUpdateStudent(studentInfo);
        if(result.code==200){
            return 'ok';
        }
        else return Promise.reject(new Error(result.msg));
    },
    async deleteStudent({commit},ids){
        let result = await reqDeleteStudent(ids);
        if(result.code==200){
            return 'ok';
        }
        else return Promise.reject(new Error(result.msg));
    },
    async getStudentNumberAndSight({commit},selectInfo){
        const {schoolId,classId}=selectInfo;
        let result = await reqGetStudentNumberAndStatus(schoolId,classId);
        if(result.code==200){
            commit('SET_STUDENT_NUMBER',result.data['studentNumber']);
            commit('SET_STUDENT_SIGHT_STATUS',result.data['studentSightStatus']);
            return 'ok';
        }
        else return Promise.reject(new Error(result.msg));
    },
};

export default{
    namespaced: true,
    state,
    mutations,
    actions
}
