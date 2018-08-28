import BindCardService from '../../services/bindCardService'
import {Toast} from 'antd-mobile';
import Config from '../../constants/constant'

export default {
    namespace: 'addBankModel',
    state: {
        agreementTitle: '',
        agreementDoc: '',
        isShowAgreement:false
    },
    subscriptions: {
        setup({dispatch, history}) {  // eslint-disable-line
            // history.listen((location) => {
            //     console.log('location is: %o', location);
            //     console.log('重定向接收参数：%o', location.state)
            //     // 调用 effects 属性中的 query 方法，并将 location.state 作为参数传递
            //     dispatch({
            //         type: 'updateState',
            //         payload: location.state,
            //     })
            // });
        },
    },
    effects: {
        * getAgreement({payload}, {call, put, select}) {
            const agreementType = Config.AGREEMENT.NORMAL;
            const result = yield call(BindCardService.getAgreement, {...payload, agreementType});
            if (result && result.resCode != '0000') {
                Toast.info('协议数据传输错误');
                return;
            }
            else {
                const state = yield select(({addBankModel}) => (addBankModel));
                state.agreementDoc = result.data.docDetails;
                if (payload.agreementCode == Config.AGREEMENTCODE.kuaiJieDoc) {
                    state.agreementTitle = "快捷支付服务协议";
                }
                if (payload.agreementCode == Config.AGREEMENTCODE.delegateDoc) {
                    state.agreementTitle = "委托划扣授权书";
                }
                if (payload.agreementCode == Config.AGREEMENTCODE.depositoryDoc) {
                    state.agreementTitle = "资金存管委托协议";
                }
                //显示协议内容
                yield put({type: 'updateState',payload:{isShowAgreement:true}});
            }
        },
        *closeAgreement({},{put}){
            //关闭协议内容
            yield put({type: 'updateState',payload:{isShowAgreement:false}});
        },
        * getAgreementNormal({payload}, {call, put, select}) {
            const result = yield call(BindCardService.getAgreement, {...payload});
            if (result && result.resCode != '0000') {
                Toast.info('协议数据传输错误');
                return;
            }
            else {
                let param = {agreementDoc:result.data.docDetails};
                if (payload.agreementCode == Config.AGREEMENTCODE.risk_identification) {
                    param.agreementTitle = "风险提示函";
                }else{
                    param.agreementTitle = "出借咨询和服务协议";
                }
                yield put({type: 'updateState',payload:{...param,isShowAgreement:true}});
                // window.G_history.push({pathname:"/agreement"});
            }
        },
        * isImageVal({payload}, {call, put, select}) {
            console.log(payload);
            const result = yield call(BindCardService.isImageVal, payload);
            if (result) {
                if (result.resCode == '0000') {
                    if (result.data.isReqLimit == '1') {
                        Toast.info('访问次数频繁,请稍候尝试!');
                    }
                    else {
                        payload.imgCallBack(result);
                    }
                } else {
                    Toast.info(result.resMsg);
                }
            } else {
                console.log('是否显示图形验证码返回结果错误');
            }
        },
        * sendSms({payload}, {call, put, select}) {
            console.log('发短信参数', payload);
            // delete payload['callBack'];
            const data = yield call(BindCardService.sendSms, {...payload});
            if (data) {
                if (data.resCode == '0000' || data.resCode == '0359') {
                    payload.callBack(data);
                } else {
                    Toast.info(data.resMsg);
                }
            } else {
                Toast.info("验证码发送失败，请稍后再试！");
            }
        },
        * validateSms({payload}, {call, put, select}) {
            console.log(payload)
            const data = yield call(BindCardService.validateSms, payload);
            if (data) {
                if (data.resCode == '0000') {
                    payload.callBack(data);
                } else {
                    Toast.info(data.resMsg)
                }
            }
        },
        * bindCard({payload}, {call, put, select}) {
            console.log("绑卡入参", payload)
            const data = yield call(BindCardService.bindCard, payload)
            console.log('绑卡出参', data)
            if (data) {
                payload.callBack(data);
                // if (data.resCode == '0000') {
                //     // window.G_history.goBack();
                // } else {
                //     Toast.info(data.resMsg);
                // }
            } else {
                console.log("绑卡出现异常");
            }
        }
    },

    reducers: {
        updateState(state, action) {
            return {...state, ...action.payload};
        },
    },

};
