/**
 * Created by HaihuaHuang on 2018/7/2.
 */

import  allMoneyService from '../services/allMoneyService'

export default {
    namespace: 'allMoney',
    state: {},
    subscriptions: {},
    effects: {
        *GetAllMoney({payload}, {call, put, select}){
            const result = yield  call(allMoneyService.GetAllMoney)
            console.log('资产信息：', result);
            yield  put({type: 'allmoney', payload: result});
        }
    },
    reducers: {
        allmoney(state, action){
            return {...state, ...action.payload};
        }
    }
}