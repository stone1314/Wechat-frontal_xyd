/**
 * Created by leiz on 2018/6/25.
 */
import ApiService from '../utils/httpRequest/ApiService';
import Constant from '../constants/requestConstantValue';

class WithdrawService extends ApiService {
    constructor() {
        super();
    }

    getConfigInfo() {
        let authToken = window.localStorage.getItem("token");
        return {
            authToken: authToken,
            sysId: 'qIOS',
            client_id: 'wechat',
            appVersion: '1.0'
        }
    }

    /*获取银行卡信息*/
    getBankCard = (params, needLoadsing) => {
        let headers = {'Content-Type': 'application/x-www-form-urlencoded'};
        let needLoading = true;
        params = {...params, ...this.getConfigInfo()};
        return this.post(Constant.API_HOST + Constant.QUERY_BANK_CARD, {params, headers, needLoading});
    }
    /*获取控台配置提现数据*/
    getSysConfig = (params, needLoading) => {
        let headers = {'Content-Type': 'application/x-www-form-urlencoded'};
        params = {...params, ...this.getConfigInfo()};
        return this.post(Constant.API_HOST + Constant.WITHDRAW_CONFIG, {params, headers, needLoading});
    }
    /*获取提现信息*/
    getWithdrawInfo = (params, needLoading) => {
        let headers = {'Content-Type': 'application/x-www-form-urlencoded'};
        params = {...params, ...this.getConfigInfo()};
        return this.post(Constant.API_HOST + Constant.WITHDRAW_ASSETS, {params, headers, needLoading});
    }
    /*判断是否是工作日*/
    checkWorkTime = (params, needLoading = true) => {
        let headers = {'Content-Type': 'application/x-www-form-urlencoded'};
        params = {...params, ...this.getConfigInfo()};
        return this.post(Constant.API_HOST + Constant.WITHDRAW_CHECK_WORKTIME, {params, headers, needLoading});
    }
    /*提现*/
    withdraw = (params, needLoading = true) => {
        let headers = {'Content-Type': 'application/x-www-form-urlencoded'};
        params = {...params, ...this.getConfigInfo()};
        return this.post(Constant.API_HOST + Constant.WITHDRAW_AMT, {params, headers, needLoading});
    }

}

export default new WithdrawService();

