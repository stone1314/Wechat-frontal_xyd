import ApiService from '../utils/httpRequest/ApiService';
import Constant from '../constants/requestConstantValue';

class RecordDetailService extends ApiService {
    constructor(props) {
        super(props)
    }

    getDetailMoney = () => {
        let token = window.localStorage.getItem("token");
        let headers = {"Content-Type": "application/x-www-form-urlencoded"};
        let params = {
            "authToken": token,
            "client_id": "wechat",
            "paymentNo": "201806211456107531"
        };
        let needLoading = true;
        return this.post(Constant.API_HOST + Constant.WITHDRAWRECORD, {params, headers, needLoading});
    }

}

export default new RecordDetailService()