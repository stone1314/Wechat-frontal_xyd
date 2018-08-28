/**
 * Created by HaihuaHuang on 2018/7/3.
 */

import recordlist from '../services/recordListService';


export default {
    namespace: 'recordList',
    state: {},
    subscriptions: {},
    effects: {
        *getRecordList({payload}, {call, put, select}){
            let result = yield call(recordlist.getRecords);
            yield put({type: 'list', payload: result})
        },

    },
    reducers: {
        list(state, action){
            return {...state, ...action.payload};
        }
    }
}