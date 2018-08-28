import TradeService from '../services/tradeService';
import MyLendService from '../services/myLendService';
import {Toast} from 'antd-mobile';
export default {

    namespace: 'lendDetail',

    state: {
        lendInfo:null,
    },

    subscriptions: {
        setup({ dispatch, history }) {  // eslint-disable-line
        },
    },

    effects: {
        *contractExit({ payload }, { call, put,select }) {  // eslint-disable-line
            const result = yield call(TradeService.contractExit, payload);
            let localStorage = window.localStorage;
            localStorage.setItem("operateParam","");
            localStorage.setItem("operateType","");
            if(result){
                if(result.resCode == "0000"){
                    //主动出借成功
                    //获取localStorage
                    let localStorage = window.localStorage;
                    //获取本次的orderNo
                    let orderNo = localStorage.getItem("orderNo");
                    //获取当前token
                    let token = localStorage.getItem("token");
                    let params = {orderNo:orderNo,authToken:token,client_id:"wechat"};
                    yield put({type:'queryAssertInfo',payload:params})
                }else if(result.resCode == '888888'){
                    yield put({type:'contractExit',payload:payload})
                }else{
                    Toast.fail(result.resMsg)
                }
            }else{
                Toast.fail("债转失败，请稍后再试")
            }

        },
        *queryAssertInfo({ payload }, { call, put,select }) {  // eslint-disable-line
            const result = yield call(MyLendService.queryAssertInfo, payload);
            if(result){
                if(result.resCode === '0000'){
                    yield put({type:'updateData',payload:{lendInfo:result.data}})
                }else if(result.resCode === '888888'){
                    //刷新token成功，重新查询数据
                    yield put({type:'queryAssertInfo',payload:payload})
                }else{
                    //获取出借列表详情失败
                    Toast.fail(result.resMsg);
                }
            }else{
                Toast.fail("出借详情查询失败 请稍后再试")
            }

        },
    },

    reducers: {
        updateData(state,action){
            return{...state,...action.payload};
        }
    },

};
