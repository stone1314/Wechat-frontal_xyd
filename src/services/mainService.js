/**
 * Created by HaihuaHuang on 2018/6/27.
 */

import ApiService from '../utils/httpRequest/ApiService';
import Constant from '../constants/requestConstantValue';

class MainService extends ApiService {
    constructor(props) {
        super(props);
    }


    getProduct = () => {
        let authToken = window.localStorage.getItem("token");
        let productAdd = Constant.DEF_PRODUCT;
        let params = {
            'client_id': 'wechat',
            'channelCode': '100001',
            'sysId': 'wechat'
        };//100002 为微信
        if (authToken != null) {
            params['authToken'] = authToken;
            productAdd = Constant.PRODUCT
        }
        let headers = {'Content-Type': 'application/x-www-form-urlencoded'};
        let needLoading = true;
        return this.post(Constant.API_HOST + productAdd, {params, headers, needLoading});
    }


    getTotalRevenue = () => {
        let authToken = window.localStorage.getItem("token");
        let headers = {'Content-Type': 'application/x-www-form-urlencoded'};
        let params = {
            'authToken': authToken,
            'client_id': 'wechat'
        };
        let needLoading = true;
        return this.post(Constant.API_HOST + Constant.ALLMONEY1, {params, headers, needLoading});
    }

    getTotalAssets = () => {
        let authToken = window.localStorage.getItem("token");
        let headers = {'Content-Type': 'application/x-www-form-urlencoded'};
        let params = {
            'authToken': authToken,
            'client_id': 'wechat',
            'operateType': '8'
        };
        let needLoading = true;
        return this.post(Constant.API_HOST + Constant.ALLMONEY2, {params, headers, needLoading});
    }

    logout = () => {
        let authToken = window.localStorage.getItem("token");
        let headers = {'Content-Type': 'application/x-www-form-urlencoded'};
        let params = {
            'authToken': authToken,
            'client_id': 'wechat',
        };
        let needLoading = true;
        return this.post(Constant.API_HOST + Constant.LOGOUT, {params, headers, needLoading});
    }
}
export default new MainService();