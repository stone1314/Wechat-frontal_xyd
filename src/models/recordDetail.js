
import record from '../services/recordDetailService';


export default {
    namespace: 'recordDetail',
    state: {},
    subscriptions: {},
    effects: {
        *getRecordDetailMoney({payload}, {call, put, select}){
            let result = yield call(record.getDetailMoney);
            console.log('getDetailMoney',result);
            yield put({type: 'detailMoney', payload: result})
        },

    },
    reducers: {
        detailMoney(state, action){
            return {...state, ...action.payload};
        },
        detailBuy(state, action){
            return {...state, ...action.payload};
        }
    }
}