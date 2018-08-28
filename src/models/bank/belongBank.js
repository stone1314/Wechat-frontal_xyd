import BindCardService from "../../services/bindCardService";
import {Toast} from 'antd-mobile'
import services from "../../services/depositService";
import  bank from  '../../services/bankService';

export default {
    namespace: 'belongBankModel',
    state: {
        bankList: {},
        bindBankList: {}
    },

    subscriptions: {
        setup({dispatch, history}) {  // eslint-disable-line
        },
    },

    effects: {
        * getBankList({payload}, {call, put, select}) {
            const result = yield call(BindCardService.getBankList, payload);
            if (result && result.resCode == "0000") {
                const state = yield select(({belongBankModel}) => (belongBankModel));
                state.bankList = result.data.bankList;
                yield put({type: 'updateState'})
            }
            else {
                Toast.info('加载银行卡列表失败');
            }
        },
        *getBindBankList({payload}, {call, put, select}){
            const result = yield call(services.getBankCard, payload);
            if (result && result.resCode == "0000") {
                const state = yield select(({belongBankModel}) => (belongBankModel));
                state.bindBankList = result.data.bankCardList;
                yield put({type: 'updateState'})
            }
            else {
                Toast.info('加载银行卡列表失败');
            }
        },
        *getMyBankList({payload}, {call, put, select}){
            const cardInfo = yield  call(bank.getCardInfo);
            if (cardInfo && cardInfo.resCode == '0000') {
                yield put({type: 'myBanks', payload: cardInfo})
            } else {
                Toast.info('加载用户银行卡失败异常' + cardInfo.resMsg);
            }
        }
    },

    reducers: {
        updateState(state, action) {
            return {...state, ...action.payload};
        },
        myBanks(state, action){
            return {...state, ...action.payload};
        }
    },

};
