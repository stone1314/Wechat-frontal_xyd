
import ApiService from '../utils/httpRequest/ApiService';
import Constant from '../constants/requestConstantValue';

class allMoneyService extends ApiService {
    constructor(props) {
        super(props)
    }

    GetAllMoney = () => {
        let authToken = window.localStorage.getItem("token");
        let headers = {"Content-Type": "application/x-www-form-urlencoded"};
        let params = {"authToken": authToken, "client_id": "wechat", "operateType": "8"};
        let needLoading = true;
        return this.post(Constant.API_HOST + Constant.ALLMONEY2, {params, headers, needLoading});
    }
}
export default new allMoneyService();