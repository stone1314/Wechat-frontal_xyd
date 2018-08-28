/**
 * Created by db on  2018/6/20.
 */
import ApiService from '../utils/httpRequest/ApiService';
import Constant from '../constants/requestConstantValue';

class Agreement extends ApiService {
    constructor(props) {
        super(props);
    }

    /*
      *   查询出借咨询与服务协议
      *  params:参数{searchKey:key}
      * */
    agreement = (params, needLoading)=> {
        let headers = {'Content-Type':'application/x-www-form-urlencoded'};
        return this.post(Constant.API_HOST + Constant.GET_AGREEMENT_URL, {params,headers, needLoading});
    }
}

export default new Agreement();

