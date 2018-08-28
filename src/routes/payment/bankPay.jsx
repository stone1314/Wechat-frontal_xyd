/**
 * created by bingdu 2018.06.14
 */

import  React from 'react';
import {connect} from 'dva';
import styles from './bankPay.less';
import {Toast,List,Button} from 'antd-mobile';
import BackHeader from '../../components/backHeader/backHeader';
import BankLine from '../../components/bankList/bankLine'
import AgreementPayModal from '../../components/agreementPayModal/agreementPayModal'
import {formatMobile,formatLendParam,setBackUrl} from '../../utils/util';
import  md5 from 'js-md5'
import accounting from 'accounting'

const Item = List.Item;



class BankPay extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            agreementPayShow:false,//是否展示短信验证码弹框
            userInfo:JSON.parse(window.localStorage.getItem("userInfo")),//用户信息
        };
    }
    componentWillMount(){
        // this.props.dispatch({type: 'depositModel/getBankList', payload: {}});
    }
    imgBankIcon = (bankIconUrl) => {
        return (
            <div className={styles.thumbBankDiv}>
                <img className={styles.thumbIcon} src={bankIconUrl}/>
            </div>
        )
    };
    /**
     * 立即出借
     */
    nowLend = () =>{
        let localStorage = window.localStorage;
        //收集出借接口参数
        //用户信息
        let userInfo = JSON.parse(localStorage.getItem("userInfo"));
        //产品信息
        let prod = this.props.lecaiProductSelect.productDetail;
        //银行信息
        let bankInfo = this.props.depositModel.bankInfo;
        //获取体验金和抵扣券
        let dkqInfo = this.props.paymentPage.dkqInfo;
        let tyjInfo = this.props.paymentPage.tyjInfo;
        let isUseRed = "0";
        if(dkqInfo == "" && tyjInfo == ""){
            isUseRed = "0";//不使用抵扣券和体验金
        }else if(dkqInfo == "" && tyjInfo !== ""){
            isUseRed = "2";//新手体验金
        }else if(dkqInfo !== "" && tyjInfo == ""){
            isUseRed = "4";//使用大额抵扣券券和10抵扣券
        }else if(dkqInfo !== "" && tyjInfo !== ""){
            isUseRed = "5";//体验金与抵扣券混合使用
        }



        let param = {
            mobile:userInfo.mobile,
            userNo:userInfo.userNo,
            pid:prod.pid,
            productName:prod.productName,
            channel:"100002",
            txAmt:this.props.paymentPage.lendCount,
            bankId:bankInfo.id,
            isUseRed:isUseRed,
            bankCardNo:bankInfo.bankCardNo,
            chargeAmt:this.props.paymentPage.bankAcc,
            reserveDueDate:prod.lockDueDate,
            authToken:localStorage.getItem("token"),
            client_id:'wechat',
            sysId:'qWechat',
        }

        //判断产品类型0:财富优加计划  1:新手标  2:猜多宝  3:月月续投  4:加油赚  5:节节高 6.季季续投
        if(prod.productProp == '2'){
            //获取答案信息
            let answers = this.props.lecaiProductSelect.answers;
            let answerId = "";
            for(let i =0;i<answers.length;i++){
                let obj = answers[i];
                if(obj.selected){
                    answerId = obj.id;
                    break;
                }
            }
            param.answerId = answerId;
        }
        localStorage.setItem("operateParam",JSON.stringify(param));
        localStorage.setItem("operateType","LEND");
        if(this.props.paymentPage.bankAcc && this.props.paymentPage.bankAcc == "0"){
            //不需要银行卡支付的时候，判断是否需要短信验证码
            this.getTradeSmsValidateSwitch();
        }else{
            //需要银行卡代扣的情况，判断是否协议支付
            this.isSignedPay();

        }
        // this.openAreementPayShow();
    }
    /**
     * 是否协议支付
     */
    isSignedPay = () =>{
        this.props.dispatch({type: 'depositModel/isSignedPay', payload: {client_id:"wechat",authToken:window.localStorage.getItem("token"),bankCardId:this.props.depositModel.bankInfo.id}});
    }
    /**
     * 短信验证开关是否打开
     */
    getTradeSmsValidateSwitch = () =>{
        this.props.dispatch({type: 'depositModel/getTradeSmsValidateSwitch', payload: {}});
    }
    /**
     * 跳转到银行选择页面
     */
    jumpToBankList = () =>{
        setBackUrl('chooseBank');
        this.props.history.push({pathname:'/chooseBank'})
    }
    /**
     * 关闭短信验证码弹框
     */
    closeAreementPayShow = () =>{
        this.props.dispatch({type:'depositModel/reData',payload:{agreementPayShow:false,}});
    }
    /**
     * 打开短信验证码弹框
     */
    openAreementPayShow = () =>{
        this.props.dispatch({type:'depositModel/reData',payload:{agreementPayShow:true,}});
    }
    /**
     * 发送短信验证码
     */
    sendVcode = () =>{
        if(this.props.depositModel.isAgreementPay){
            //true 表示协议支付，发送协议支付短信验证码
            this.props.dispatch({
                type: 'depositModel/signedPayApply',
                payload: {
                    bankCardId: this.props.depositModel.bankInfo.id
                }
            });
        }else{
            //false 不是协议支付，发送内部短信验证码
            //获取用户信息
            let userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
            this.props.dispatch({type:'depositModel/sendTradeSms',payload:{mobile:userInfo.mobile,type:"5",client_id:"wechat"}});
        }

    }
    /**
     * 点击短信验证码弹框确认，验证短信验证码
     */
    lendMony = (yzm) =>{
        formatLendParam(yzm);
        if(this.props.depositModel.isAgreementPay){
            //true 表示协议支付，校验协议支付短信验证码
            this.props.dispatch({
                type: 'depositModel/signedPayConfirm',
                payload: {
                    bankCardId: this.props.depositModel.bankInfo.id,
                    identifyingCode: yzm,
                    originTradeNo: this.props.depositModel.tradeNo
                }
            });
        }else{
            //false 不是协议支付，校验内部短信验证码
            let userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
            this.props.dispatch({type:'depositModel/validateSms',payload:{mobile:userInfo.mobile,type:"5",resType:"1",client_id:"wechat",validateCode:yzm}});
        }

    }
    render(){
        let {agreementPayShow,isAgreementPay,bankInfo,bankList} = this.props.depositModel;
        let cardInfos = bankList;
        let cardInfo = bankInfo;
        let mobile = bankInfo ? bankInfo.fuzzyBankMobile : "";
        // if(bankInfo){
        //     cardInfos = this.props.depositModel.bankList;
        //     cardInfo = this.props.depositModel.bankInfo;
        // }
        return(
            <div className={styles.main}>
                <BackHeader
                    title="支付订单"
                    backType="0"
                    _this={this}
                ></BackHeader>
                <div className={styles.detailLine}>
                    <div className={styles.detailLineOne}>
                        <span>可用余额支付</span>
                        <span>{accounting.formatNumber(this.props.paymentPage.availAssets,2,',')}元</span>
                    </div>
                    <div className={styles.detailLineOne}>
                        <span>使用抵扣券</span>
                        <span>{accounting.formatNumber(this.props.paymentPage.dkqAcc,2,',')}元</span>
                    </div>
                    <div className={styles.detailLineTwo}>
                        <span>银行卡支付</span>
                        <span>{accounting.formatNumber(this.props.paymentPage.bankAcc,2,',')}元</span>
                    </div>
                </div>
                {cardInfos?<BankLine
                    cardInfo = {cardInfo}
                    chooseOrClick = 'more'
                    bothStyle = {styles.bankLineBorder}
                    onClick = {this.jumpToBankList.bind()}
                />:null}
                <div className={styles.btnDiv}>
                    <Button activeClassName={styles.btnC} className={[styles.btnSub,styles.btn]} onClick={this.nowLend.bind(this)}>
                        立即出借
                    </Button>
                </div>
                <AgreementPayModal
                    visible={agreementPayShow}
                    mobile={isAgreementPay?mobile:formatMobile(this.state.userInfo.mobile)}
                    isSendVcode={false}
                    sendVcodeBtnText={"获取验证码"}
                    onSendVcode={this.sendVcode.bind(this)}
                    onClose={this.closeAreementPayShow.bind(this)}
                    callBack={this.lendMony.bind(this)}/>
            </div>
        )

    }

}
BankPay.propTypes = {};

export default connect(({bankPay,depositModel,paymentPage,lecaiProductSelect}) => {
    return {
        bankPay,depositModel,paymentPage,lecaiProductSelect
    };
})(BankPay);
