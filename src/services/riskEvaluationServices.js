/**
 * Created by abrahamchen on 2018/7/2.
 */
import ApiService from '../utils/httpRequest/ApiService';
import Constant from '../constants/requestConstantValue';

class REServices extends ApiService {
  constructor(props) {
    super(props);
  }


  /*
    *
    *  params:参数{searchKey:key}
    * */
   riskAssessment = ({params, headers,needLoading})=> {
    return this.post(Constant.API_HOST + Constant.RISK_ASSESSMENT, {params, headers, needLoading});
  }


  /*
    *
    *  params:参数{searchKey:key}
    * */
   riskCapacity = ({params, headers,needLoading})=> {
    return this.post(Constant.API_HOST + Constant.RISK_CAPACITY, {params, headers, needLoading});
  }





  
}

export default new REServices();