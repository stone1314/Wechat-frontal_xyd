import services from '../services/depositService'
import TradeService from '../services/tradeService'
import BindCardService from '../services/bindCardService'
import {Toast} from 'antd-mobile'
import {formatLendParam} from '../utils/util'
import {routerRedux} from "dva/router";
import Config from "../constants/constant";

const codes = "TRADE_SMS_VALIDATE_SWITCH";
let removeDispositInfo = () => {
    //充值结束，清除充值信息
    window.localStorage.removeItem('TRADE_VALIDATE_CODE');//移除TRADE_VALIDATE_CODE
    window.localStorage.removeItem('operateType');//operateType
    window.localStorage.removeItem(Config.OPERATE_ENUM.DISPOSIT_KEY);//移除Config.OPERATE_ENUM.DISPOSIT_KEY
};
export default {
    namespace: 'depositModel',
    state: {
        availableAmt: '',
        disabledBtn: true,
        inputMoney: '',
        bankCardList: {},
        bankList: [],//存储银行卡列表
        bankInfo: null,//显示的银行卡信息
        agreementPayShow: false,//是否展示短信验证码弹框
        tradeNo: '',//协议支付申请返回的交易编号
        isAgreementPay: true,//是否是协议支付
        lendResult: null,//出借返回结果
    },

    subscriptions: {
        setup({dispatch, history}) {  // eslint-disable-line
        },
    },

    effects: {
        * initDepositPage({payload}, {call, put, select}) {
            const bankResult = yield call(services.getBankCard, payload);
            const availResult = yield call(services.getAvaiableAmt, payload);
            console.log(bankResult, availResult);
            if (bankResult && bankResult.resCode != '0000') {
                Toast.info(bankResult.resMsg);
                return;
            }
            if (bankResult && bankResult.resCode == '888888') {
                //token 刷新成功
                yield put({type: 'initDepositPage', payload: {payload}})
                return;
            }

            if (availResult && availResult.resCode != '0000') {
                Toast.info(availResult.resMsg);
                return;
            }
            if (availResult && availResult.resCode == '888888') {
                //token 刷新成功
                yield put({type: 'initDepositPage', payload: {payload}})
                return;
            }
            let bankCardList = bankResult ? bankResult.data.bankCardList[0] : {};
            let availableAmt = availResult ? availResult.data.outMap.account.availAssets : '0';
            yield put({
                type: 'updateState', payload: {
                    bankCardList,
                    availableAmt
                }
            })
        },
        * getBankList({payload}, {call, put, select}) {
            console.log("*********" + JSON.stringify(payload));
            const result = yield call(services.getBankCard, payload);
            if (result && result.resCode == '0000') {
                const state = yield select(({depositModel}) => depositModel);
                if (state.bankInfo) {
                    yield put({
                        type: 'updateState', payload: {
                            bankList: result.data.bankCardList,
                        }
                    })
                } else {
                    yield put({
                        type: 'updateState', payload: {
                            bankList: result.data.bankCardList,
                            bankInfo: result.data.bankCardList[0],
                        }
                    })
                }

                return;
            } else if (result && result.resCode == '888888') {
                //token 刷新成功
                yield put({type: 'getBankList', payload: {payload}})
                return;
            } else if (result) {
                Toast.fail(result.resMsg);
            }


        },
        * hfPasswordCheck({payload}, {call, put, select}) {
            const result = yield call(services.hfPasswordCheck, {})
            console.log('恒丰密码返回结果', result)
            if (result) {
                if (result.resCode == '0000') {
                    // payload.callBack(result.data.url);
                    window.G_history.push({pathname: '/pospResult', state: {pospHtml: result.data.url}})
                } else {
                    Toast.info(result.resMsg)
                }
            }
        },
        * deposit({payload}, {call, put, select}) {
            let validateCode = window.localStorage.getItem('TRADE_VALIDATE_CODE') || '';
            const result = yield call(services.deposit, {...payload, validateCode});
            console.log('充值结果：', result)
            if (result) {
                if (result.resCode == '0106') {
                    //成功：跳转成功页面
                    let bankInfo = result.data;
                    window.G_history.push({
                        pathname: '/depositWithdrawSuccess/ds',
                        search: `?bankName=${bankInfo.bankCardName}&tailNo=${bankInfo.bankCardNoLast4}&chargeAmt=${bankInfo.chargeAmt}`
                    })
                }
                else if (result.resCode == '0107') {
                    //处理中：跳转处理中页面
                    let bankInfo = result.data;
                    window.G_history.push({
                        pathname: '/depositWithdrawSuccess/dp',
                        search: `?bankName=${bankInfo.bankCardName}&tailNo=${bankInfo.bankCardNoLast4}&chargeAmt=${bankInfo.chargeAmt}`
                    })
                } else {
                    console.log('充值未知返回信息', result)
                    window.G_history.push(`/depositWithdrawFailure/df/${result.resMsg}`)
                }
            }
            else {
                //失败：跳转失败页面
                window.G_history.push(`/depositWithdrawFailure/df/未知错误`)
            }
            removeDispositInfo();
        },
        /**
         * 判断是否已开通协议支付
         * @param payload
         * @param call
         * @param put
         * @param select
         */* isSignedPay({payload}, {call, put, select}) {
            const result = yield call(TradeService.isSignedPay, payload);
            console.log(result)
            if (result && result.resMsg == '5007') {
                //协议支付开关关闭
                yield put({type: 'getTradeSmsValidateSwitch', payload: {}})
            } else {
                if (result && result.resCode == '0000') {
                    //已开通协议支付，直接代扣
                    //跳转到恒丰密码页面
                    // setPwd();
                    //只有出借的时候需要格式化参数
                    if (window.localStorage.getItem('operateType') == Config.OPERATE_ENUM.LEND) {
                        formatLendParam();
                    }
                    yield put({type: 'hfPasswordCheck', payload: {}})
                } else if (result && result.resCode == '888888') {
                    //token 刷新成功
                    yield put({type: 'isSignedPay', payload: {payload}})
                    return;
                } else if (result && result.resCode == '5003') {
                    //未开通协议支付，弹框开通协议支付
                    yield put({type: 'updateState', payload: {agreementPayShow: true, isAgreementPay: true}})
                }
                else if (result) {
                    Toast.fail(result.resMsg);
                }
            }
        },
        /**
         * 信雅达出借
         * @param payload
         * @param call
         * @param put
         * @param select
         */* saveTxInfoNew({payload}, {call, put, select}) {
            const result = yield call(TradeService.saveTxInfoNew, payload);
            let localStorage = window.localStorage;
            localStorage.setItem("operateParam", "");
            localStorage.setItem("operateType", "");
            if (result) {
                let obj = result.data;
                //0000 ：成功，0105：失败，0107：处理中，0108：没有返回结果 其他都是发生错误
                if (result.resCode == '0000' || result.resCode == '0107') {
                    obj.resCode = result.resCode;
                    obj.resMsg = result.resMsg;
                    yield put({type: 'updateState', payload: {lendResult: obj}})
                } else {
                    obj.resCode = "0105";
                    obj.resMsg = result.resMsg;
                    yield put({type: 'updateState', payload: {lendResult: obj}})
                }
            } else {
                let obj = {resCode: "0105"};
                obj.resMsg = "未知错误";
                yield put({type: 'updateState', payload: {lendResult: obj}});
            }
        },
        /**
         * 刷新数据
         * @param payload
         * @param put
         */* reData({payload}, {put}) {
            yield put({
                type: 'updateState', payload: payload
            })
        },
        /**
         * 发送短信验证码
         * @param payload
         * @param call
         * @param put
         * @param select
         */* sendTradeSms({payload}, {call, put, select}) {
            console.log('发短信参数', payload);
            const data = yield call(services.sendTradeSms, {...payload});
            if (data) {
                if (data.resCode == '0000') {
                    //发送成功
                    Toast.info("短信验证码发送成功")
                } else {
                    Toast.info(data.resMsg);
                }
            } else {
                Toast.info("验证码发送失败，请稍后再试！");
            }
        },
        /**
         * 校验短信验证码
         * @param payload
         * @param call
         * @param put
         * @param select
         */* validateSms({payload}, {call, put, select}) {
            console.log(payload)
            const data = yield call(BindCardService.validateSms, payload);
            console.log(data);
            if (data) {
                if (data.resCode == '0000') {
                    //短信验证码校验成功，跳转恒丰交易密码页面
                    yield put({type: 'hfPasswordCheck', payload: {}});
                    yield put({type: 'agreementPayShowSwitch', payload: {isShow: false}});//关闭弹框
                    //保存验证码，充值接口会用到
                    window.localStorage.setItem('TRADE_VALIDATE_CODE', payload.validateCode);
                } else {
                    Toast.info(data.resMsg)
                }
            }
        },
        * agreementPayShowSwitch({payload}, {call, put, select}) {
            const state = yield select(({depositModel}) => (depositModel));
            state.agreementPayShow = payload.isShow;
            yield put({type: 'updateState'})
        },
        * signedPayApply({payload}, {call, put, select}) {
            const result = yield call(services.signedPayApply, payload);
            console.log('协议支付申请结果', result)
            const state = yield select(({depositModel}) => (depositModel));
            if (result) {
                if (result.resCode == '0000') {
                    state.tradeNo = result.data.tradeNo
                    yield put({type: 'updateState'})
                } else {
                    Toast.info(result.resMsg);
                }
            }
        },
        * signedPayConfirm({payload}, {call, put, select}) {
            console.log('协议确认入参', payload);
            const result = yield call(services.signedPayConfirm, payload);
            console.log('协议支付确认结果', result)
            if (result) {
                if (result.resCode == '0000') {
                    yield put({type: 'hfPasswordCheck', payload: {}});//校验交易密码
                    yield put({type: 'agreementPayShowSwitch', payload: {isShow: false}});//关闭弹框
                } else {
                    Toast.info(result.resMsg);
                }
            }
        },
        * getTradeSmsValidateSwitch({payload}, {call, put, select}) {
            const sysConfigResult = yield call(services.getTradeSmsValidateSwitch, {...payload, codes});
            console.log('获取短信验证开关结果', sysConfigResult)
            if (sysConfigResult) {
                //1：开，0：关
                if (sysConfigResult.resCode == '0000') {
                    if (sysConfigResult.data[0] == '0') {
                        //只有出借的时候需要格式化参数
                        if (window.localStorage.getItem('operateType') == Config.OPERATE_ENUM.LEND) {
                            formatLendParam();
                        }
                        yield put({type: 'hfPasswordCheck', payload: {}});//校验交易密码
                    } else {
                        //打开短信内部验证
                        yield put({type: 'updateState', payload: {agreementPayShow: true, isAgreementPay: false}});
                    }
                } else {
                    Toast.info(sysConfigResult.resMsg);
                }
            }
        },
    },

    reducers: {
        updateState(state, {payload}) {
            return {...state, ...payload}
        }
    }
};
