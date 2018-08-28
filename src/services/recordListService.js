/**
 * Created by HaihuaHuang on 2018/7/3.
 */

import ApiService from '../utils/httpRequest/ApiService';
import Constant from '../constants/requestConstantValue';

class RecordListService extends ApiService {
    constructor(props) {
        super(props)
    }

    getRecords= () => {
        /*     let value = {
         "resCode": "100",
         "resMsg": "交易成功",
         "data": {
         "tradeRecord": {
         "total": 166,
         "recordVoList": [
         {
         "tradeType": "2",
         "tradeTypeDesc": "提现",
         "operateType": "提现至",
         "operateTypeDesc": "招商银行5702",
         "date": "2018-06-21 16:53:12",
         "amount": 118,
         "amountStr": null,
         "status": "0",
         "tradeNo": "10C1210050027201806211653129335887",
         "contractNo": null,
         "month": "06",
         "yearMonth": "2018-06",
         "day": "21",
         "operateDate": 1529571192000
         },
         {
         "tradeType": "2",
         "tradeTypeDesc": "转账",
         "operateType": "提现至",
         "operateTypeDesc": "招商银行5702",
         "date": "2018-06-21 16:53:12",
         "amount": 3000,
         "amountStr": null,
         "status": "1",
         "tradeNo": "10C1210050027201806211653129335887",
         "contractNo": null,
         "month": "06",
         "yearMonth": "2018-06",
         "day": "21",
         "operateDate": 1529571192000
         }
         ]
         }
         },
         "sign": "36C24F01B8D112E660EE731CE199D10D",
         "timestamp": "1530237267305",
         "signType": null
         }
         return value;*/
        let token= window.localStorage.getItem("token");
        let headers = {"Content-Type":"application/x-www-form-urlencoded"};
        let params = {"authToken": token, "client_id": "wechat"};
        let needLoading = true;
        return this.post(Constant.API_HOST + Constant.TRADERECORD, {params, headers, needLoading});
    }
}

export default new RecordListService()