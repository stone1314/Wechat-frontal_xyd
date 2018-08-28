import ApiService from '../utils/httpRequest/ApiService'
import Constant from '../constants/requestConstantValue';

class WxService extends ApiService{
    constructor(props) {
        super(props);
    }
    /*
      * 获取微信code
      *  params:参数{searchKey:key}
      * */
    getWxCode = ()=> {
        let headers = {'Content-Type':'application/x-www-form-urlencoded'};
        let params = "?appid=wxe0e8b48e1fb55cd5&redirect_uri=http%3a%2f%2fwangch.tunnel.qydev.com%2fapi%2fwechat%2foauthCallBack%3fclient_id%3dwechat%26grant_type%3dpassword%26client_secret%3d000000&response_type=code&scope=snsapi_base&state=1#wechat_redirect"
        return this.wxget("https://open.weixin.qq.com/connect/oauth2/authorize"+params);
        // return this.post(Constant.API_HOST + Constant.QUERY_CAN_USED_COUPONS_LIST, {params, headers, needLoading});
    }
}export default new WxService()