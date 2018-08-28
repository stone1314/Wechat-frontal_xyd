/**
 * Created by HaihuaHuang on 2018/6/27.
 */
import  mainService from   '../services/mainService';
import  loginService from '../services/loginService';
import TradeService from '../services/tradeService';
import  * as util from '../utils/util';
import  {Toast} from 'antd-mobile';

export default {
    namespace: 'main',
    state: {
        hfassets: {},
        wealthAmt: {},
    },
    subscriptions: {},
    effects: {
        *getProduct({payload}, {call, put}){
            const result = yield  call(mainService.getProduct)
            console.log('产品列表：', result);
            yield  put({type: 'products', payload: {product: result}});
        },

        //日切
        *getCheckTime({payload}, {call, put}){
            const result = yield  call(loginService.getChkTime)
            console.log(result);
            if (result && result.resCode === '0000') {
                payload.callback();
            } else if (result && result.resCode === '0105') {
                Toast.info(result.resMsg);
            } else {
                Toast.info(result.resMsg);
            }
        },
        *getMoney({payload}, {call, put, select}){
            const totleAssets = yield call(mainService.getTotalAssets);

            const totalRevenue = yield  call(mainService.getTotalRevenue);

            yield put({
                type: 'getmsg', payload: {
                    hfAssets: totleAssets,
                    wealthAmt: totalRevenue
                }
            })
        },

        *logout({payload}, {call, put, select}){
            const result = yield call(mainService.logout);
            console.log('logout', result);
            yield put({
                type: 'log', payload: {
                    log: result
                }
            });

        },
        *checkBeforeTrade({payload}, {call, put, select}){
            var date = new Date();
            let params = {
                authToken: window.localStorage.getItem("token"),
                investMoney: 0,
                reserverExitDate: date,
                client_id: 'wechat'
            };
            const result = yield call(TradeService.checkBeforeTrade, params);
            console.log(result);
            if (result && result.resCode === '0000') {
                if (result.data && result.data.isPospBlack != undefined && result.data.isPospBlack == '1') {
                    Toast.fail('账户异常，请联系客服');
                    //$scope.alertPlus('账户异常，请联系客服');
                    return;
                }
                // 是否需要评测
                if (result.data.risk && result.data.risk.needAssessment) {
                    let content = '亲，根据最新的政策法规，您需要完成风险承受能力测评后，才可以进行出借业务！'; // 默认值
                    let confirmBtn = '去评测'; // 默认值确定按钮
                    let cancelBtn = '再等等';  // 默认值取消按钮
                    // 没有等级，未评测
                    if (!result.data.risk.level) {
                        content = '亲，根据最新的政策法规，您需要完成风险承受能力测评后，才可以进行出借业务！';
                    } else if (result.data.risk.expired) {    // 是否过期
                        content = '亲，您的风险承受能力测评已过期，根据相关政策法规，请在出借前更新您的评测结果！';
                        confirmBtn = "去更新";
                    } else if (result.data.risk.clUser) {     // 是否是存量用户
                        content = '亲，根据2018年最新政策法规，风险承受能力评测有所更新，请在出借前更新您的评测结果！';
                        confirmBtn = "去更新";
                    } else if (result.data.risk.overLimit) {  // 是否超出上限
                        content = "亲，您的风险承受能力评估结果为" + result.data.risk.level + "，建议您在本平台的出借资金不超过家庭可支配收入的" + result.data.risk.investLimit * 100 + "%。";
                        confirmBtn = '继续出借';
                        cancelBtn = '重新评测';
                    }
                    util.showMsg('', content, cancelBtn, confirmBtn, '/riskEvaluation', this);

                } else {
                    // 不需要评测
                    if (result.data && result.data.handlingAppTx && (result.data.handlingAppTx.code == '10054100' || result.data.handlingAppTx.code == '111')) {
                        //$scope.alert(result.data.handlingAppTx.msg);
                        Toast.info(result.data.handlingAppTx.msg);
                        return;
                    }
                    if (result.data && result.data.reserverMsg) {
                        //$scope.customAlert(result.data.reserverMsg, "", ["重选", "确认"], $scope.prepareOrder, $scope.openDatePicker);
                        Toast.info(result.data.reserverMsg);
                    } else {
                        payload.callback();//回调转跳
                    }
                }
            } else {
                let msg = result ? result.resMsg : "风险评估接口异常！";
                Toast.fail(msg);
            }
        }

    }
    ,
    reducers: {
        /*banner(state, action){
         return {...state, ...action.payload};
         },*/
        getmsg(state, action)
        {
            return {...state, ...action.payload};
        }
        ,
        products(state, action)
        {
            return {...state, ...action.payload};
        }
        ,
        /*   hfaddress(state, action){
         return {...state, ...action.payload};
         },*/
        log(state, action)
        {
            return {...state, ...action.payload};
        }
        ,

    }
}