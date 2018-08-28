/**
 * Created by db on  2018/6/20.
 */
import ApiService from '../utils/httpRequest/ApiService';
import Constant from '../constants/requestConstantValue';

class MyLendService extends ApiService {
    constructor(props) {
        super(props);
    }

    /*
      * 出借列表查询
      *  params:参数{searchKey:key}
      * */
    getContractList = (params, needLoading)=> {
        let headers = {'Content-Type':'application/x-www-form-urlencoded'};
        return this.post(Constant.API_HOST + Constant.GET_CONTRACT_LIST, {params,headers, needLoading});
    }
    /*
      * 获取出借列表详情(资产交易详情)
      *  params:参数{searchKey:key}
      * */
    queryAssertInfo= (params, needLoading)=> {
        let headers = {'Content-Type':'application/x-www-form-urlencoded'};
        return this.post(Constant.API_HOST + Constant.QUERY_ASSERT_INFO, {params,headers, needLoading});
    }
    /*
      * 判断是否节假日
      *  params:参数{searchKey:key}
      * */
    tradeReserverExitDateCheck= (params, needLoading)=> {
        let headers = {'Content-Type':'application/x-www-form-urlencoded'};
        return this.post(Constant.API_HOST + Constant.TRADE_RESERVER_EXIT_DATE_CHECK, {params,headers, needLoading});
    }
    /*
      * 修改预约退出日，密码校验
      *  params:参数{searchKey:key}
      * */
    validatePwd= (params, needLoading)=> {
        let headers = {'Content-Type':'application/x-www-form-urlencoded'};
        return this.post(Constant.API_HOST + Constant.VALIDATE_PWD, {params,headers, needLoading});
    }
    /*
      * 修改预约退出日
      *  params:参数{searchKey:key}
      * */
    contractReserveExit= (params, needLoading)=> {
        let headers = {'Content-Type':'application/x-www-form-urlencoded'};
        return this.post(Constant.API_HOST + Constant.CONTRACT_RESERVER_EXIT, {params,headers, needLoading});
    }
    /*
      * 债权列表查询
      *  params:参数{searchKey:key}
      * */
    creditorRightsV= (params, needLoading)=> {
        let headers = {'Content-Type':'application/x-www-form-urlencoded'};
        return this.post(Constant.API_HOST + Constant.CREDITOR_RIGHT_V, {params,headers, needLoading});
    }
}

export default new MyLendService();

