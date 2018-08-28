/**
 * Created by db on  2018/6/20.
 */
import ApiService from '../utils/httpRequest/ApiService';
import Constant from '../constants/requestConstantValue';

class LoginService extends ApiService {
    constructor(props) {
        super(props);
    }

    /**
     * 验证日切
     * @returns {*}
     */
    getChkTime = () => {
        let headers = {'Content-Type': 'application/x-www-form-urlencoded'};
        let params = {
            'client_id': 'wechat',
            'controlType': '0',
        };
        let needLoading = true;
        return this.post(Constant.API_HOST + Constant.CHECK_TIME, {params, headers, needLoading});
    }

    /*
      * 手动登录
      *  params:参数{searchKey:key}
      * */
     login = (params, needLoading)=> {
        let headers = {'Content-Type':'application/x-www-form-urlencoded'};
        return this.post(Constant.API_HOST + Constant.API_TOKEN, {params,headers, needLoading});
    }
    /*
      * 微信自动登录
      *  params:参数{searchKey:key}
      * */
    autoLoginBind = (params, needLoading)=> {
        let headers = {'Content-Type':'application/x-www-form-urlencoded'};
        return this.post(Constant.API_HOST + Constant.AUTO_LOGIN_BIND, {params,headers, needLoading});
    }
    /**
     * 刷新用户token
     * @param params
     * @param needLoading
     * @returns {*}
     */
    refreshToken = (params, needLoading)=> {
        let headers = {'Content-Type':'application/x-www-form-urlencoded'};
        return this.post(Constant.API_HOST + Constant.API_TOKEN, {params,headers, needLoading});
    }
}

export default new LoginService();

