/**
 * Created by leiz on 2018/7/26.
 */
import ApiService from '../utils/httpRequest/ApiService';
import Constant from '../constants/requestConstantValue';

class BindCardService extends ApiService {
    constructor(props) {
        super(props);
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

    /**
     *  查询所有银行列表
     * */
    getBankList = (params, needLoading) => {
        let headers = {"Content-Type": 'application/x-www-form-urlencoded'};
        params = {...params, ...this.getConfigInfo()};
        needLoading = true;
        return this.post(Constant.API_HOST + Constant.BANK_CARD_LIST, {params, headers, needLoading});
    };
    /**
     * 获取协议
     * @param params
     * @param needLoading
     * @returns {*}
     */
    getAgreement = (params, needLoading) => {
        let headers = {"Content-Type": 'application/x-www-form-urlencoded'};
        params = {...params, ...this.getConfigInfo()};
        needLoading = true;
        return this.post(Constant.API_HOST + Constant.AGREEMENT, {params, headers, needLoading});
    };
    /**
     *  检查图形验证码是否超限
     *  params:参数{searchKey:key}
     * */
    isImageVal = (params, needLoading) => {
        let headers = {"Content-Type": 'application/x-www-form-urlencoded'};
        params = {...params, ...this.getConfigInfo()};
        needLoading = true;
        return this.post(Constant.API_HOST + Constant.QUERY_WINDOW_TYPE, {params, headers, needLoading});
    };
    /**
     *  发送验证码
     *  params:参数{searchKey:key}
     * */
    sendSms = (params, needLoading) => {
        let headers = {"Content-Type": 'application/x-www-form-urlencoded'};
        params = {...params, ...this.getConfigInfo()};
        needLoading = true;
        return this.post(Constant.API_HOST + Constant.SEND_SMS, {params, headers, needLoading});
    };
    /**
     *  校验验证码
     *  params:参数{searchKey:key}
     * */
    validateSms = (params, needLoading) => {
        let headers = {"Content-Type": 'application/x-www-form-urlencoded'};
        params = {...params, ...this.getConfigInfo()};
        needLoading = true;
        return this.post(Constant.API_HOST + Constant.VALIDATE_SMS, {params, headers, needLoading});
    };

    /**
     *  绑卡
     *  params:参数{searchKey:key}
     * */
    bindCard = (params, needLoading) => {
        let headers = {"Content-Type": 'application/x-www-form-urlencoded'};
        params = {...params, ...this.getConfigInfo()};
        needLoading = true;
        return this.post(Constant.API_HOST + Constant.BIND_CARD, {params, headers, needLoading});
    }
}

export default new BindCardService();

