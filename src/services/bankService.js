/**
 * Created by HaihuaHuang on 2018/7/24.
 */

import ApiService from '../utils/httpRequest/ApiService';
import Constant from '../constants/requestConstantValue';


class BankService extends ApiService {
    constructor(props) {
        super(props);
    }

    /**
     * 懒猫-恒丰开户
     * @param params
     * @param headers
     * @param needLoading
     * @returns {*}
     */
    openhfAccount = (params, needLoading) => {
        let headers = {'Content-Type': 'application/x-www-form-urlencoded'};
        return this.post(Constant.API_HOST + Constant.OPEN_HF_ACCOUNT, {params, headers, needLoading});
    }

    /**
     * 信雅达-恒丰开户
     * @param params
     * @param needLoading
     * @returns {*}
     */
    openXydHfAccount = (params, needLoading) => {
        let headers = {'Content-Type': 'application/x-www-form-urlencoded'};
        console.log('openXydHfAccount', params);
        return this.post(Constant.API_HOST + Constant.OPEN_XYD_HF_ACCOUNT, {params, headers, needLoading});
    }


    /**
     * 设置恒丰交易密码
     * @returns {*}
     */
    setHFPwd = () => {
        let headers = {'Content-Type': 'application/x-www-form-urlencoded'};
        let params = {'authToken': window.localStorage.getItem('token'), 'client_id': 'wechat'};
        let needLoading = true;
        return this.post(Constant.API_HOST + Constant.SET_HF_PWD, {params, headers, needLoading});
    }

    /**
     * 获取绑卡信息
     * @returns {*}
     */
    getCardInfo = () => {
        let headers = {'Content-Type': 'application/x-www-form-urlencoded'};
        let params = {
            'authToken': window.localStorage.getItem('token'),
            'appVersion': '1',
            'sysId': 'wechat',
            'client_id': 'wechat'
        };
        let needLoading = true;
        return this.post(Constant.API_HOST + Constant.GET_BANK_INFO, {params, headers, needLoading});
    }

    setWithdrawCard = (cardId) => {
        let headers = {'Content-Type': 'application/x-www-form-urlencoded'};
        let params = {
            'authToken': window.localStorage.getItem('token'),
            'bankCardId': cardId,
            'client_id': 'wechat'
        };
        let needLoading = true;
        console.log('设置银行卡结果：',params);
        return this.post(Constant.API_HOST + Constant.SET_WITHDRAW_CARD, {params, headers, needLoading});

    }


}

export default new BankService();





