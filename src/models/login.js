import LoginService from '../services/loginService';
import  RegisterService from  '../services/registerService';
import BankInfo from'../services/bankService';
import {Button, Toast} from 'antd-mobile';

export default {
    namespace: 'login',
    state: {
        isLogin: false,
    },
    subscriptions: {},
    effects: {
        *changeLogin({payload}, {call, put}){
            console.log(payload);
            yield put({type: 'login', payload: payload})
        },
        *login({payload}, {call, put}){
            const result = yield call(LoginService.login(payload));
            console.log('login', result);
            yield put({type: 'login', payload: result})
        },
        *getUserInfo({payload}, {call, put}){
            let params = {
                sysId: 'qIOS',
                appVersion: '',
                appBuildVersion: '',
                client_id: 'wechat',
                authToken: payload.token
            };
            let user = null;
            const userInfo = yield  call(RegisterService.queryUserDetail, params)

            const cardInfo = yield  call(BankInfo.getCardInfo);

            if (cardInfo && cardInfo.data && cardInfo.resCode === '0000' && cardInfo.data.bankCardList &&
                userInfo && userInfo.data && userInfo.resCode && userInfo.resCode === '0000') {
                user = userInfo.data;
                let cards = cardInfo.data.bankCardList;
                if (cards.length > 0) {
                    user.isBindCard = '1';
                    user.isWithdrawCard = '0';
                    for (let card of  cards) {
                        if (card.isWithdrawCard == '1') {
                            user.isWithdrawCard = '1';
                            break;
                        }
                    }
                } else {
                    user.isBindCard = '0';
                    user.isWithdrawCard = '0';
                }
            } else {
                let cardInfo = cardInfo ? cardInfo.resMsg : '个人银行卡信息异常！';
                let userInfo = userInfo ? userInfo.resMsg : '个人信息异常！';
                //Toast.fail(cardInfo);
                //Toast.fail(userInfo);
                console.log(cardInfo);
                console.log(userInfo);
            }
            yield put({type: 'userInfo', payload: JSON.stringify(user)})
        }


    },
    reducers: {
        login(state, action){
            return {...state, ...action.payload};
        },
        userInfo(state, action){
            window.localStorage.setItem('userInfo', action.payload);
            return {...state, ...action.payload};
        }


    }
}