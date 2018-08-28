/**
 * Created by db on 2018/6/29.
 */
import ApiService from '../utils/httpRequest/ApiService';
import Constant from '../constants/requestConstantValue';

class RegisterService extends ApiService {
    constructor(props) {
        super(props);
    }


    /*
      *  忘记密码时修改密码
      *  params:参数{searchKey:key}
      * */
    resetLoginPassword = (params, needLoading)=> {
        let headers = {"Content-Type":'application/x-www-form-urlencoded'};
        return this.post(Constant.API_HOST + Constant.RESET_LOGIN_PWD, {params,headers,needLoading});
    }
    /**
     * 获取用户信息
     * @param params
     * @param needLoading
     * @returns {*}
     */
    queryUserDetail = (params, needLoading)=> {
        let headers = {"Content-Type":'application/x-www-form-urlencoded'};
        return this.post(Constant.API_HOST + Constant.QUERY_USER_DETAIL, {params,headers,needLoading});
    }
    /*
      *  发送短信验证码
      *  params:参数{searchKey:key}
      * */
    sendSms = (params, needLoading)=> {
        let headers = {"Content-Type":'application/x-www-form-urlencoded'};
        return this.post(Constant.API_HOST + Constant.SEND_SMS, {params,headers,needLoading});
    }
    /*
      *  校验短信验证码
      *  params:参数{searchKey:key}
      * */
    validateSms = (params, needLoading)=> {
        let headers = {"Content-Type":'application/x-www-form-urlencoded'};
        return this.post(Constant.API_HOST + Constant.VALIDATE_SMS, {params,headers,needLoading});
    }
    /*
      *  注册
      *  params:参数{searchKey:key}
      * */
    registerFWX = (params, needLoading)=> {
        let headers = {"Content-Type":'application/x-www-form-urlencoded'};
        return this.post(Constant.API_HOST + Constant.REGISTER_FWX, {params,headers,needLoading});
    }
}

export default new RegisterService();

