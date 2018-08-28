/**
 * Created by abrahamchen on 2018/7/2.
 */
import ApiService from '../utils/httpRequest/ApiService';
import Constant from '../constants/requestConstantValue';

class PIServices extends ApiService {
  constructor(props) {
    super(props);
  }


  /*
    * 查询产品列表，包含新手标
    *  params:参数{searchKey:key}
    * */
   productDefList = ({params, headers,needLoading})=> {
    return this.get(Constant.API_HOST + Constant.PRODUCT_DefList, {params, headers, needLoading});
  }


 /*
    *竞猜产品详情及题目
    *  params:参数{searchKey:key}
    * */
   productDetail = ({params, headers,needLoading})=> {
    return this.post(Constant.API_HOST + Constant.PRODUCT_DETAIL, {params, headers, needLoading});
  }

/*
    *竞猜产品详情及题目
    *  params:参数{searchKey:key}
    * */
   bidListV = ({params, headers,needLoading})=> {
    return this.post(Constant.API_HOST + Constant.BID_LISTV, {params, headers, needLoading});
  }
}

export default new PIServices();