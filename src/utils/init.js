import Vue from "vue";
import store from "@/store";
export function initVuex(){
    store.commit('user/RESET_STATE');
    store.commit('account/RESET_STATE');
    store.commit('device/RESET_STATE');
    store.commit('myClass/RESET_STATE');
    store.commit('result/RESET_STATE');
    store.commit('school/RESET_STATE');
    store.commit('student/RESET_STATE');
}