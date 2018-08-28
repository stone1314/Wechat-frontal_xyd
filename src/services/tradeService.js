/**
 * Created by db on  2018/6/20.
 */
import ApiService from '../utils/httpRequest/ApiService';
import Constant from '../constants/requestConstantValue';

class TradeService extends ApiService {
    constructor(props) {
        super(props);
    }

    /*
      * 出借前检查
      *  params:参数{searchKey:key}
      * */
    checkBeforeTrade = (params, needLoading) => {
        let headers = {'Content-Type': 'application/x-www-form-urlencoded'};
        return this.post(Constant.API_HOST + Constant.CHECK_BEFORE_TRADE, {params, headers, needLoading});
    }
    /*
      * 产品投资（含充值）出借(懒猫出借)
      *  params:参数{searchKey:key}
      * */
    invest = (params, needLoading) => {
        let headers = {'Content-Type': 'application/x-www-form-urlencoded'};
        return this.post(Constant.API_HOST + Constant.INVEST, {params, headers, needLoading});
    }
    /*
      * 产品投资（含充值）出借(信雅达出借)
      *  params:参数{searchKey:key}
      * */
    saveTxInfoNew = (params, needLoading) => {
        let headers = {'Content-Type': 'application/x-www-form-urlencoded'};
        return this.post(Constant.API_HOST + Constant.SAVE_TXINFO_NEW, {params, headers, needLoading});
    }
    /*
      *虚户资产提现 含用户余额
      *  params:参数{searchKey:key}
      * */
    getAssets = (params, needLoading) => {
        let headers = {'Content-Type': 'application/x-www-form-urlencoded'};
        return this.post(Constant.API_HOST + Constant.GET_ASSERTS, {params, headers, needLoading});
    }
    /*
      *抵扣券查询
      *  params:参数{searchKey:key}
      * */
    queryCanUsedCouponsList = (params, needLoading) => {
        let headers = {'Content-Type': 'application/x-www-form-urlencoded'};
        return this.post(Constant.API_HOST + Constant.QUERY_CAN_USED_COUPONS_LIST, {params, headers, needLoading});
    }
    /*
      *体验金查询
      *  params:参数{searchKey:key}
      * */
    queryCanUsedTYCouponsList = (params, needLoading) => {
        let headers = {'Content-Type': 'application/x-www-form-urlencoded'};
        return this.post(Constant.API_HOST + Constant.QUERY_CAN_USED_TY_COUPONS_LIST, {params, headers, needLoading});
    }
    /*
      *判断是否协议支付
      *  params:参数{searchKey:key}
      * */
    isSignedPay = (params, needLoading = true) => {
        let headers = {'Content-Type': 'application/x-www-form-urlencoded'};
        return this.post(Constant.API_HOST + Constant.IS_SIGNED_PAY, {params, headers, needLoading});
    }
    /**
     * 获取出借用户列表
     * @param params
     * @param needLoading
     * @returns {*}
     */
    getProductSale = (params, needLoading) =>{
        let headers = {'Content-Type':'application/x-www-form-urlencoded'};
        return this.post(Constant.API_HOST + Constant.GET_PRODUCT_SALE, {params,headers, needLoading});
    }
    /**
     * 主动出借
     * @param params
     * @param needLoading
     * @returns {*}
     */
    contractExit = (params, needLoading) =>{
        let headers = {'Content-Type':'application/x-www-form-urlencoded'};
        return this.post(Constant.API_HOST + Constant.CONTRACT_EXIT, {params,headers, needLoading});
    }
}

export default new TradeService();

