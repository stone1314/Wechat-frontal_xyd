import services from '../services/withdrawService';
import DepositService from '../services/depositService'
import {Toast} from 'antd-mobile'
import Config from "../constants/constant";
import BindCardService from "../services/bindCardService";

const codes = "WITHDRAW_DAY_MAX_NUM,WITHDRAW_NOTICE,WITHDRAW_MIN_ASSETS,WITHDRAW_HF_NOTICE";
let removeWithdrawInfo = () => {
    //提现结束，清除充值信息
    window.localStorage.removeItem('TRADE_VALIDATE_CODE');//移除TRADE_VALIDATE_CODE
    window.localStorage.removeItem('operateType');//operateType
    window.localStorage.removeItem(Config.OPERATE_ENUM.WITHDRAW_KEY);//移除Config.OPERATE_ENUM.WITHDRAW_KEY
};
export default {
    namespace: 'withdrawModel',
    state: {
        bankCardList: {},
        pageShowInfo: {},
        agreementPayShow: false,
    },

    subscriptions: {
        setup({dispatch, history}) {  // eslint-disable-line
        },
    },

    effects: {
        * initWithdrawPage({payload}, {call, put, select}) {
            const bankResult = yield call(services.getBankCard, payload);
            const sysConfigResult = yield call(services.getSysConfig, {...payload, codes});
            const withdrawInfoResult = yield call(services.getWithdrawInfo, payload);
            console.log("接口返回数据银行卡==>", bankResult);
            console.log("接口返回数据提现配置==>", sysConfigResult);
            console.log("接口返回数据提现信息==>", withdrawInfoResult);
            if (bankResult && bankResult.resCode != '0000' && bankResult.resCode != '888888') {
                Toast.info(bankResult.resMsg);
                return;
            }
            if (sysConfigResult && sysConfigResult.resCode != '0000' && bankResult.resCode != '888888') {
                Toast.info(sysConfigResult.resMsg);
                return;
            }
            if (withdrawInfoResult && withdrawInfoResult.resCode != '0000' && bankResult.resCode != '888888') {
                Toast.info(withdrawInfoResult.resMsg);
                return;
            }
            //显示设置的提现卡
            let bankCardList = {};
            if(bankResult) {
                for (let item in bankResult.data.bankCardList) {
                    let list = bankResult.data.bankCardList[item];
                    if (list.isWithdrawCard == '1') {
                        bankCardList = list;
                    }
                }
            }
            if (sysConfigResult && withdrawInfoResult) {
                //提现配置
                let maxWithdrawNum = sysConfigResult.data[0];   //提现每人每天最多可以提现的次数
                let noticeContent = sysConfigResult.data[1];  //提现注意事项的文案
                let minWithdrawAssets = sysConfigResult.data[2];   //提现最低金额
                let pageBottomNotice = sysConfigResult.data[3];  //提现页面最下方的文案提示 超过5万不允许
                //提现信息
                let withdrawAssets = withdrawInfoResult.data.withdrawAssets; //可提现余额
                let withdrawNum = withdrawInfoResult.data.withdrawNum; //已提现的次数,默认0次
                const state = yield select(({withdrawModel}) => withdrawModel);
                state.pageShowInfo.withdrawAssets = withdrawAssets;
                state.pageShowInfo.minWithdrawAssets = minWithdrawAssets;
                state.pageShowInfo.noticeContent = noticeContent;
                state.pageShowInfo.pageBottomNotice = pageBottomNotice;
                if (withdrawNum <= (maxWithdrawNum - 1)) {
                    state.pageShowInfo.cashBtnName = `立即提现`;
                    state.pageShowInfo.noticeTitle = `今天可提现${maxWithdrawNum - withdrawNum}次`;
                    state.pageShowInfo.initDisabledBtn = false;
                } else {
                    state.pageShowInfo.cashBtnName = `今天提现次数已满`;
                    state.pageShowInfo.noticeTitle = `今天提现次数已满，请于明天再试，查看原因`;
                    state.pageShowInfo.initDisabledBtn = true;
                }
            }
            yield put({
                type: 'updateState', payload: {
                    bankCardList
                }
            });
        },
        //获取短信验证开关
        * getTradeSmsValidateSwitch({payload}, {call, put, select}) {
            const sysConfigResult = yield call(DepositService.getTradeSmsValidateSwitch, {
                ...payload,
                codes: 'TRADE_SMS_VALIDATE_SWITCH'
            });
            console.log('获取短信验证开关结果', sysConfigResult)
            if (sysConfigResult) {
                //1：开，0：关
                if (sysConfigResult.resCode == '0000') {
                    if (sysConfigResult.data[0] == '0') {
                        yield put({type: 'hfPasswordCheck', payload: {}});//校验交易密码
                    } else {
                        //打开短信内部验证
                        yield put({type: 'updateState', payload: {agreementPayShow: true}});
                    }
                } else {
                    Toast.info(sysConfigResult.resMsg);
                }
            }
        },
        * agreementPayShowSwitch({payload}, {call, put, select}) {
            yield put({type: 'updateState', payload: {agreementPayShow: payload.isShow}});
        },
        /*
         * 发送短信验证码
         */
        * sendTradeSms({payload}, {call, put, select}) {
            console.log('发短信参数', payload);
            const data = yield call(DepositService.sendTradeSms, {...payload});
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
        /*
         * 校验短信验证码
         */
        * validateSms({payload}, {call, put, select}) {
            console.log(payload)
            const data = yield call(BindCardService.validateSms, payload);
            console.log(data);
            if (data) {
                if (data.resCode == '0000') {
                    //短信验证码校验成功，跳转恒丰交易密码页面
                    yield put({type: 'hfPasswordCheck', payload: {}});
                    yield put({type: 'agreementPayShowSwitch', payload: {isShow: false}});//关闭弹框
                    //保存验证码，提现接口会用到
                    window.localStorage.setItem('TRADE_VALIDATE_CODE', payload.validateCode);
                } else {
                    Toast.info(data.resMsg)
                }
            }
        },
        * hfPasswordCheck({payload}, {call, put, select}) {
            const result = yield call(DepositService.hfPasswordCheck, {});
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
        * checkWorkTime({payload}, {call, put, select}) {
            console.log(payload)
            const result = yield call(services.checkWorkTime, payload);
            payload.callBack(result);
            // yield put({type: 'updateState', payload})
        },
        * withdraw({payload}, {call, put, select}) {
            let validateCode = window.localStorage.getItem('TRADE_VALIDATE_CODE') || '';
            const result = yield call(services.withdraw, {...payload,validateCode});
            console.log('提现结果：', result);
            if (result) {
                if (result.resCode == '0106') {
                    //成功：跳转成功页面
                    let bankInfo = result.data;
                    let bankCardNoLast4 = bankInfo.bankCardNo.substring(bankInfo.bankCardNo.length-4); //后四位
                    window.G_history.push({
                        pathname: '/depositWithdrawSuccess/ws',
                        search: `?bankName=${bankInfo.bankName}&tailNo=${bankCardNoLast4}&chargeAmt=${bankInfo.amount}`
                    })
                }
                else if (result.resCode == '0107') {
                    //处理中：跳转处理中页面
                    let bankInfo = result.data;
                    let bankCardNoLast4 = bankInfo.bankCardNo.substring(bankInfo.bankCardNo.length-4); //后四位
                    window.G_history.push({
                        pathname: '/depositWithdrawSuccess/wp',
                        search: `?bankName=${bankInfo.bankName}&tailNo=${bankCardNoLast4}&chargeAmt=${bankInfo.amount}`
                    })
                } else {
                    console.log('提现未知返回信息', result)
                    window.G_history.push(`/depositWithdrawFailure/wf/${result.resMsg}`)
                }
            }
            else {
                //失败：跳转失败页面
                window.G_history.push(`/depositWithdrawFailure/wf/未知错误`)
            }
            removeWithdrawInfo();
        }
    },

    reducers: {
        updateState(state, {payload}) {
            return {...state, ...payload}
        }
    },

};
