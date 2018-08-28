/**
 * Created by abrahamchen on 2017/9/29.
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
  apiToken = ({params, headers,needLoading})=> {
    return this.post(Constant.API_HOST + Constant.API_TOKEN, {params, headers, needLoading});
  }
}

export default new CSServices();

