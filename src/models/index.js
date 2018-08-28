/**
 * Created by abrahamchen on 2018/5/30.
 */
import globalData from './globalData';
import loginData from './login';
import bankDepositoryResultPage from './bankDepositoryResultPage';
import bankDepositoryPage from './bankDepositoryPage';
import registerData from './register';
import forgetPwdData from './forgetPwd';
import depositModel from './depositModel'
import withdrawModel from './withdrawModel'

import  xydBank from  './xydBankModel';
import main from './main';
import recordList from './recordList';
import allMoney from './allMoney';
import recordDetail from './recordDetail';
import lecaiProductSelect from './lecaiProductSelect';
import lecaiProductDetail from './lecaiProductDetail';
import newUsrProductDetail from './newUsrProductDetail';
import paymentPage from './paymentPage';
//绑卡
import addBankCard from './bank/addBankCard';
import belongBank from './bank/belongBank';
import lendDetail from './lendDetail';


export default function registerModels(app) {
    app.model(globalData);
    app.model(loginData);
    app.model(bankDepositoryResultPage);
    app.model(bankDepositoryPage);
    app.model(lecaiProductSelect);
    app.model(lecaiProductDetail);
    app.model(newUsrProductDetail);
    app.model(paymentPage);
    app.model(registerData);
    app.model(forgetPwdData);
    app.model(depositModel);
    app.model(withdrawModel);
    app.model(main);
    app.model(recordList);
    app.model(allMoney);
    app.model(recordDetail);
    app.model(xydBank);
    app.model(addBankCard);
    app.model(belongBank);
    app.model(lendDetail);


}
