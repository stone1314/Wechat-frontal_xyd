/* eslint-disable no-dupe-keys */
/**
 * Created by abrahamchen on 2018/5/30.
 */
import React from 'react';
import {connect} from 'dva';
import {Route} from 'dva/router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import GlobalLoading from '../src/components/globalLoading';
import titleValue from './constants/titleConstantValue';

import MainTab from './routes/mainTab/mainTab';
import DemoPage from './routes/demoPage/demoPage';

//登录注册
import Login from './routes/login/login';
import Register from './routes/register/register';
import ForgetPwd from './routes/register/forgetPwd';

//托管开户,设置密码
import BankDepositoryPage from './routes/bankDepository/bankDepositoryPage';
import BankDepositoryResultPage from './routes/bankDepository/bankDepositoryResultPage';

import  XydBankDepositoryPage from './routes/bankDepository/xydBankDepositoryPage';
import XydBankPwdResult from './routes/bankDepository/xydBankPwdResult';

//个人信息，资金详情
import RecordListPage from './routes/recordPage/listPage/recordListPage';
import  RecordDetailPage  from './routes/recordPage/detailPage/recordDetailPage';
import AllMoneyPage from './routes/allMoney/allMoneyPage';

//产品详情
import LecaiProductSelect from './routes/productDetail/lecaiProductDetail/lecaiProductSelect';
import LecaiProductDetail from './routes/productDetail/lecaiProductDetail/lecaiProductDetail';
import NewUsrProductDetail from './routes/productDetail/newUsrProductDetail/newUsrProductDetail';
import PreBidListPage from './routes/productDetail/preBidListPage';
import PreBidDetail from './routes/productDetail/preBidDetail';

//引用协议页
import ReferencePage from './routes/referencePage/referencePage';

import PaymentPage from './routes/payment/paymentPage';
import PaymentResult from './routes/paymentResult/paymentResult';

//充值、提现
import Deposit from './routes/money/deposit/deposit';
import SelectBindBank from './routes/money/deposit/selectBindBank'
import WithDraw from './routes/money/withdraw/withdraw';
import DepositWithdrawSuccess from './routes/money/tipPage/success';
import DepositWithdrawFailure from './routes/money/tipPage/failure';
import PospResult from './routes/posp/pospPage';
import PospCallBack from './routes/posp/pospCallBack';
import MyBankPage from './routes/bankDepository/myBankPage';

//风险评估
import RiskEvaluation from './routes/riskEvaluation/riskEvaluation';
import RiskEvaluationResult from './routes/riskEvaluation/riskEvaluationResult';

import style from './tranFade.less';

//协议页面
import AgreementText from './routes/agreement/agreementText'
import AgreementImg from './routes/agreement/agreementImg'
import Agreement from './routes/agreement/agreement'

//我的出借
import LendList from './routes/myLend/lendList';//我的出借列表
import LendDetail from './routes/myLend/lendDetail';//我的出借列表详情
import LendPro from './routes/myLend/lendPro';//我的出借项目列表
import LendProDetail from './routes/myLend/lendProDetail';//我的出借项目列表详情
import LendPeople from './routes/productDetail/lendPeople';//出借人列表

//绑卡
import AddBankCard from './routes/bank/addBankCard';
import BelongBank from './routes/bank/belongBank';
import AgreementBank from './routes/bank/agreement'
import AddBankResult from './routes/bank/addBankResult'

//产品出借
import BankPay from './routes/payment/bankPay';//银行卡支付
import ChooseBank from './routes/payment/chooseBank';//选择银行卡页面


class rootRoute extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {
        window.G_dispatch = this.props.dispatch;
        window.G_history = this.props.history;
        document.body.style.margin = '0px';
        this.isWeixin = this.isWeixin();

        // document.body.addEventListener('touchmove', (ev) => {
        //   ev.preventDefault();
        // });
    }

    //判断是否在微信浏览器中
    isWeixin() {
        const ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/micromessenger/i) == 'micromessenger') {
            return true;
        } else {
            return false;
        }
    }

    creatTitle() {
        let titleIndex = this.props.history.location.pathname;
        let title = titleValue[titleIndex];
        if (title) {
            document.title = title;
        } else {
            const index = titleIndex.lastIndexOf('/');
            titleIndex = titleIndex.substring(0, index);
            title = titleValue[titleIndex];
            if (title) {
                document.title = title;
            }
        }
    }

    render() {
        // if (!this.isWeixin) {
        //   return (
        //     <div style={{ margin: '30px', marginTop: '70px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', color: '#999999', fontSize: '30px' }}>
        //       请使用手机微信打开本页面
        //     </div>
        //   );
        // }
        const {action} = this.props.history;
        let tranStyle = 'tranRight';
        if (action === 'POP' || action === 'REPLACE') {
            tranStyle = 'tranLeft';
        }
        this.creatTitle();
        let key = this.props.location.pathname;
        // console.log(`keyvalue is ${key}`)
        // if(key && key.match('/main/')){
        //   key = 'mian/'
        // }
        {/*<ReactCSSTransitionGroup*/}
            {/*transitionName={tranStyle}*/}
            {/*className={style[tranStyle]}*/}
            {/*transitionEnterTimeout={300}*/}
            {/*transitionLeaveTimeout={300}*/}
        {/*>*/}
        {/*</ReactCSSTransitionGroup>*/}

        return (
            <div>

                    <div style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, display: 'flex'}} key={key}
                         location={this.props.location}>

                        <Route exact path="/" component={MainTab}/>
                        <Route exact path="/MyLends" component={MainTab}/>
                        <Route path="/demoPage" component={DemoPage}/>
                        <Route path="/login" component={Login}/>
                        <Route path="/recordListPage" component={RecordListPage}/>
                        <Route path="/recordDetailPage" component={RecordDetailPage}/>
                        <Route path="/allMoneyPage" component={AllMoneyPage}/>
                        <Route path="/bankDepositoryPage" component={BankDepositoryPage}/>
                        <Route path="/bankDepositoryResultPage" component={BankDepositoryResultPage}/>
                        <Route path="/myBankPage" component={MyBankPage}/>
                        <Route path="/xydBankDepositoryPage" component={XydBankDepositoryPage}/>
                        <Route path="/deposit" component={Deposit}/>
                        <Route path="/withDraw" component={WithDraw}/>
                        <Route path="/depositWithdrawSuccess/:pageType" component={DepositWithdrawSuccess}/>
                        <Route path="/depositWithdrawFailure/:pageType/:msg" component={DepositWithdrawFailure}/>
                        <Route path="/pospResult" component={PospResult}/>
                        <Route path="/pospCallBack" component={PospCallBack}/>
                        <Route path="/riskEvaluation" component={RiskEvaluation}/>
                        <Route path="/riskEvaluationResult" component={RiskEvaluationResult}/>
                        <Route path="/register" component={Register}/>
                        <Route path="/forgetPwd" component={ForgetPwd}/>
                        <Route path="/lecaiProductSelect" component={LecaiProductSelect}/>
                        <Route path="/lecaiProductDetail" component={LecaiProductDetail}/>
                        <Route path="/newUsrProductDetail" component={NewUsrProductDetail}/>
                        <Route path="/paymentPage" component={PaymentPage}/>
                        <Route path="/paymentResult" component={PaymentResult}/>
                        <Route path="/lendList" component={LendList}/>
                        <Route path="/lendDetail" component={LendDetail}/>
                        <Route path="/referencePage" component={ReferencePage}/>
                        <Route path="/lendPro" component={LendPro}/>
                        <Route path="/lendProDetail" component={LendProDetail}/>
                        <Route path="/preBidListPage" component={PreBidListPage}/>
                        <Route path="/agreementText" component={AgreementText}/>
                        <Route path="/agreementImg" component={AgreementImg}/>
                        <Route path="/addBankCard" component={AddBankCard}/>
                        <Route path="/xydBankPwdResult" component={XydBankPwdResult}/>
                        <Route path="/belongBank" component={BelongBank}/>
                        <Route  path="/selectBindBank" component={SelectBindBank}/>
                        <Route path="/agreementBank/:category" component={AgreementBank}/>
                        <Route path="/addBankResult" component={AddBankResult}/>
                        <Route path="/chooseBank" component={ChooseBank}/>
                        <Route path="/bankPay" component={BankPay}/>
                        <Route path="/agreement" component={Agreement}/>
                        <Route path="/lendPeople" component={LendPeople}/>
                        <Route path="/preBidDetail" component={PreBidDetail}/>

                    </div>
                {this.props.globalData.isLoading ? <GlobalLoading /> : null}
            </div>
        );
    }
}

rootRoute.propTypes = {};

export default connect(({globalData}) => {
    return {globalData};
})(rootRoute);
