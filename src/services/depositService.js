/**
 * Created by leiz on 2018/6/25.
 */
import ApiService from '../utils/httpRequest/ApiService';
import Constant from '../constants/requestConstantValue';

class DepositService extends ApiService {
    constructor() {
        super();
    }

    getConfigInfo() {
        let authToken = window.localStorage.getItem("token");
        return {
            authToken: authToken,
            sysId: 'qWechat',
            client_id: 'wechat',
            appVersion: '1.0'
        }
    }

    /**
     *  params:参数{searchKey:key}
     **/
    getBankCard = (params, needLoading = true) => {
        let headers = {'Content-Type': 'application/x-www-form-urlencoded'};
        params = {...params, ...this.getConfigInfo()};
        return this.post(Constant.API_HOST + Constant.QUERY_BANK_CARD, {params, headers, needLoading});
    }


    /**
     *  params:参数{searchKey:key}
     **/
    getAvaiableAmt = (params, needLoading = true) => {
        let headers = {'Content-Type': 'application/x-www-form-urlencoded'};
        params = {...params, ...this.getConfigInfo()};
        return this.post(Constant.API_HOST + Constant.QUERY_AVAIABLE_AMT, {params, headers, needLoading});
        // return this.get('http://172.16.37.29:3001/api/getAvaiableAmt', {params, needLoading})
    }
    //校验交易密码
    hfPasswordCheck = (params, needLoading = true) => {
        let headers = {'Content-Type': 'application/x-www-form-urlencoded'};
        params = {...params, ...this.getConfigInfo()};
        return this.post(Constant.API_HOST + Constant.HF_PASSWORD_CHECK, {params, headers, needLoading});
    };
    /*充值*/
    deposit = (params, needLoading = true) => {
        let headers = {'Content-Type': 'application/x-www-form-urlencoded'};
        params = {...params, ...this.getConfigInfo()};
        return this.post(Constant.API_HOST + Constant.DEPOSIT_AMT, {params, headers, needLoading});
    };
    /*协议支付申请*/
    signedPayApply = (params, needLoading = true) => {
        let headers = {'Content-Type': 'application/x-www-form-urlencoded'};
        params = {...params, ...this.getConfigInfo()};
        return this.post(Constant.API_HOST + Constant.SIGNED_PAY_APPLY, {params, headers, needLoading});
    };
    /*协议支付确认*/
    signedPayConfirm = (params, needLoading = true) => {
        let headers = {'Content-Type': 'application/x-www-form-urlencoded'};
        params = {...params, ...this.getConfigInfo()};
        return this.post(Constant.API_HOST + Constant.SIGNED_PAY_CONFIRM, {params, headers, needLoading});
    };
    /*获取控台配置交易短信验证码开关*/
    getTradeSmsValidateSwitch = (params, needLoading = true) => {
        let headers = {'Content-Type': 'application/x-www-form-urlencoded'};
        params = {...params, ...this.getConfigInfo()};
        return this.post(Constant.API_HOST + Constant.WITHDRAW_CONFIG, {params, headers, needLoading});
    };
    /*发送交易短信*/
    sendTradeSms = (params, needLoading = true) => {
        let headers = {'Content-Type': 'application/x-www-form-urlencoded'};
        params = {...params, ...this.getConfigInfo()};
        return this.post(Constant.API_HOST + Constant.SEND_TRADE_SMS, {params, headers, needLoading});
    };
}

export default new DepositService();

