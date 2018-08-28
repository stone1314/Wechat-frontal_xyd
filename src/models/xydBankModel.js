/**
 * Created by HaihuaHuang on 2018/7/24.
 */
import  bank from  '../services/bankService';
import {Toast} from 'antd-mobile';
import Config from '../constants/constant';

export default {
    namespace: 'xydBankModel',
    state: {},
    subscriptions: {
        setup({dispatch, history}) {  // eslint-disable-line
        },
    },

    effects: {
        //开通恒丰存管
        *openBank({payload}, {call, put}) {  // eslint-disable-line
            let token = window.localStorage.getItem('token');
            let params = {
                authToken: token,
                identificationType: 0,//证件类型，0：身份证
                identificationOwnerName: payload.name,
                identificationNo: payload.cardId,
                'client_id': 'wechat',
            };
            let result = yield  call(bank.openXydHfAccount, {...params, needLoading: true})
            console.log(result);
            if (result && result.resCode == '0000') {
                yield put({type: 'bank', payload: result})
            } else {
                let msg = result ? result.resMsg : '开通恒丰存管接口异常！';
                Toast.info(msg);
            }

        },
        //设置恒丰交易密码
        *setHFPwd({payload}, {call, put}){
            let result = yield  call(bank.setHFPwd)
            console.log(result);
            if (result && result.resCode == '0000') {
                payload.callback(result.data.url, payload.s_this);
            } else {
                let msg = result ? result.resMsg : '设置交易密码接口异常！';
                Toast.info(msg);
            }
        },

        //结果页调用，将数据复制到本地
        *setHFPwdNext({payload}, {call, put}){
            let result = yield  call(bank.setHFPwd)
            console.log('setHFPwdNext', result);
        },

        //设置提现卡
        *setWithdrawCard({payload}, {call, put}){
            console.log(payload);
            let result = yield  call(bank.setWithdrawCard, payload.bankId);
            console.log(result);
            if (result && result.resCode == '0000') {
                payload.callback();
            } else {
                let msg = result ? result.resMsg : '设置提现卡接口异常！';
                Toast.info(msg);
            }
        }
    },
    reducers: {
        bank(state, action){
            return {...state, ...action.payload};
        },

        hfPwd(state, action){
            return {...state, ...action.payload};
        },

        withdraw(state, action){
            return {...state, ...action.payload};
        }
    }
};
