/**
 * Created by abrahamchen on 2018/7/2.
 */
import ApiService from '../utils/httpRequest/ApiService';
import Constant from '../constants/requestConstantValue';

class CSServices extends ApiService {
  constructor(props) {
    super(props);
  }


  /*
    *
    *  params:参数{searchKey:key}
    * */
   getUserInfoFromIt = ({params, headers,needLoading})=> {
    return this.post(Constant.API_HOST + Constant.GET_USER_INFO_FROM_IT, {params, headers, needLoading});
  }
    /**
     * 懒猫-恒丰开户
     * @param params
     * @param headers
     * @param needLoading
     * @returns {*}
     */
    openhfAccount = (params,needLoading)=> {
        let headers = {'Content-Type':'application/x-www-form-urlencoded'};
        return this.post(Constant.API_HOST + Constant.OPEN_HF_ACCOUNT, {params, headers, needLoading});
    }


}

export default new CSServices();





