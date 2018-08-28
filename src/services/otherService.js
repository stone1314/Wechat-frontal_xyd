/**
 * Created by db on  2018/6/20.
 */
import ApiService from '../utils/httpRequest/ApiService';
import Constant from '../constants/requestConstantValue';

class OtherService extends ApiService {
    constructor(props) {
        super(props);
    }

    /*
      * 字典值查询
      *  params:参数{searchKey:key}
      * */
    sysConfig = (params, needLoading)=> {
        let headers = {'Content-Type':'application/x-www-form-urlencoded'};
        return this.post(Constant.API_HOST + Constant.SYS_CONFIG, {params,headers, needLoading});
    }

}

export default new OtherService();

