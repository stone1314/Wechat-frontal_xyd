/**
 * Created by abrahamchen on 2018/6/28.
 */
import React from 'react';
import {connect} from 'dva';
import {Button, Calendar, List,Modal,Toast} from 'antd-mobile';
import zhCN from 'antd-mobile/lib/calendar/locale/zh_CN';
import styles from './paymentPage.less';
import checkIco from '../../asserts/payment/check@2x.png';
import jrjsq from '../../asserts/payment/jrjsq@2x.png'
import DeductionTicket from '../../components/deductionTicket/deductionTicket';
import ExperienceCash from '../../components/experienceCash/experienceCash';
import BackHeader from '../../components/backHeader/backHeader'
import MyLendService from '../../services/myLendService'
import accounting from 'accounting'
import AgreementComponent from '../../components/agreement/agreementTpl'


//  import LoginService from '../../../services/LoginService';

const Item = List.Item;
const Brief = Item.Brief;

class PaymentPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isCalendarOpen:false,
            isTicketOpen:false,
            isCashOpen:false,
            tyjCount:"0",//使用体验金数额
            isShowDate:false,//是否显示日期选择
            isShowDateModal:false,//是否展示选中为节假日时的弹出框
            selectDate : "",//选中的预约退出日
            holdDays:"",//持有天数
            lendBtnText:"立即出借",//出借按钮文本
        };
        this.openCalendar = this.openCalendar.bind(this);
        this.numChanged = this.numChanged.bind(this)
        this.ticketClose=this.ticketClose.bind(this);
        this.cashColse = this.cashColse.bind(this);
        this.lendCount = 0;
        this.tyjInfo = "";//存储用户选中的体验金
        this.dkqInfo = "";//存储用户选中的抵扣券
        this.dkqAcc = "0";//用户使用的抵扣券金额
        this.tyjAcc = "0";//用户使用的体验金金额
        this.tyjDays = "0";//用户使用的体验金有效天数
        this.now = new Date();
        this.now1 = new Date();
        this.afterDays = new Date(this.now1.setDate(this.now.getDate() + 450));
        this.newQuitDate = null;
        this.holiday = "";
        this.selectDateTemp = "";//选中的预约退出日临时值
        this.bankAcc = 0;//需要银行卡代扣金额
    }

    numChanged(){
        if(!this.props.lecaiProductSelect.userAccInfo){
            Toast.fail("用户没有虚户信息");
            return;
        }
        //获取可用余额
        let availAssets =  this.props.lecaiProductSelect.userAccInfo.availAssets;

        this.lendCount = Number(this.refs.lendCount.value);
        if(this.lendCount >= 1000){
            this.controlDkqAndTyj(this.lendCount);
        }
        this.props.dispatch({type:'paymentPage/showOrHidModal',payload:{availAssets:availAssets,lendCount:this.lendCount}});

        if(this.lendCount > availAssets){
            let bankAcc = this.lendCount-availAssets;
            this.bankAcc = accounting.formatNumber(bankAcc,2,',');
            this.props.dispatch({type:'paymentPage/showOrHidModal',payload:{bankAcc:bankAcc}});
            let txt = "余额不足，银行卡支付"+this.bankAcc+"元";
            this.setState({
                lendBtnText:txt,
            })
        }else{
            this.setState({
                lendBtnText:"立即出借",
            })
        }
    }

    /**
     * 控制抵扣券和体验金展示
     * @param count 用户输入的金额
     */
    controlDkqAndTyj = (count)=>{
        //体验金信息
        let tyjInfo = this.props.lecaiProductSelect.tyjInfo;
        //选中的体验金信息
        let tyjChoosed = this.props.lecaiProductSelect.tyjChoosed;
        if(tyjInfo && tyjInfo.length != 0){
            if(tyjChoosed == ""){
                let obj = tyjInfo[0];
                this.tyjAcc = obj.parValue;
                this.tyjDays = obj.activeDays;
                tyjChoosed = obj.id;
                this.props.dispatch({type:'lecaiProductSelect/resData',payload:{tyjChoosed:tyjChoosed}});
            }else{
                for(let i=0;i<tyjInfo.length;i++){
                    let obj = tyjInfo[i];
                    if(this.props.lecaiProductSelect.tyjChoosed == obj.id){
                        this.tyjAcc = obj.parValue;
                        this.tyjDays = obj.activeDays;
                        tyjChoosed = obj.id;
                        break;
                    }
                }
            }
        }
        //抵扣券信息
        let dkqInfo = this.props.lecaiProductSelect.dkqInfo;
        //选中的体验金信息
        let dkqChoosed = this.props.lecaiProductSelect.dkqChoosed;
        if(dkqInfo && dkqInfo.length != 0){
            let addDkq = 0;
            let dkqAcc = 0;
            for(let i=0;i<dkqInfo.length;i++){
                let obj = dkqInfo[i];
                addDkq = addDkq + Number(obj.singleInvestDown);
                if(count > addDkq){
                    if(dkqChoosed == ""){
                        dkqChoosed = obj.id+"";
                    }else{
                        dkqChoosed = dkqChoosed+","+obj.id;
                    }
                    dkqAcc = dkqAcc + Number(obj.parValue);
                }
            }
            this.dkqAcc = dkqAcc;
            this.props.dispatch({type:'lecaiProductSelect/resData',payload:{dkqChoosed:dkqChoosed}});
        }



        // //体验金信息
        // let tyjInfo = this.props.lecaiProductSelect.tyjInfo;
        // //抵扣券信息
        // let dkqInfo = this.props.lecaiProductSelect.dkqInfo;
        // if(tyjInfo && tyjInfo.length != 0){
        //     this.tyjAcc = tyjInfo[0].parValue;
        //     this.tyjDays = tyjInfo[0].activeDays;
        // }
        // if(dkqInfo && dkqInfo.length !=0){
        //     console.log(dkqInfo);
        // }
    }
    /**
     * 清除选中的体验金和抵扣券
     */
    cancelDkqAndTyj = () =>{

    }

    /**
     * 验证用户输入是否符合要求
     * param flag 0-使用体验金 1-使用抵扣券
     */
    validateNum = (flag) =>{
        //获取用户输入的值
        let num = this.lendCount;
        let numStr = num.toString();
        if(num < 1000){
            Toast.fail("起投金额为1000元");
            return;
        }
        if(numStr.indexOf(".") !== -1){
            Toast.fail("出借金额不能是小数");
            return;
        }
        if(num%100 != 0){
            Toast.fail("出借金额必须是100的整数倍");
            return;
        }
        if(flag == "0"){
            //选择体验金
            this.selectCash();
        }else{
            //选择抵扣券
            this.selectDTicket();
        }
    }
    openCalendar(){
        document.getElementsByTagName('body')[0].style.overflowY = 'hidden';
        this.setState({
            isCalendarOpen:true,
        })

    }

    onCancel(){
        this.setState({
            isCalendarOpen:false,
        })
    }

    onConfirm(startTime, endTime){
        this.setState({
            isCalendarOpen:false,
        })

    }

    cashColse(){
        this.setState({
            isCashOpen:false,
        })
    }

    ticketClose(){
        this.setState({
            isTicketOpen:false,
        })
    }

    selectCash(){
        this.setState({
            isCashOpen:true,
        })
    }

    selectDTicket(){
        this.setState({
            isTicketOpen:true,
        })
    }

    protocol(type){
        switch(type){
            case 'risk':
                //风险提示函
                // this.props.history.push({pathname:'/referencePage',state:{url:'http://www.baidu.com'}});
                this.props.dispatch({type:'addBankModel/getAgreementNormal',payload:{client_id:"wechat",agreementCode:"risk_identification",agreementType:"1"}});
                break;
            case 'service':
                //出借咨询和服务协议
                // this.props.history.push({pathname:'/referencePage',state:{url:'http://www.163.com'}});
                this.props.dispatch({type:'addBankModel/getAgreementNormal',payload:{client_id:"wechat",agreementCode:this.props.lecaiProductSelect.productDetail.pid,agreementType:"2"}});
        }
    }

    nextStep(){
        //获取用户输入的值
        let num = this.lendCount;
        let numStr = num.toString();
        if(num < 1000){
            Toast.fail("起投金额为1000元");
            return;
        }
        if(numStr.indexOf(".") !== -1){
            Toast.fail("出借金额不能是小数");
            return;
        }
        if(num%100 != 0){
            Toast.fail("出借金额必须是100的整数倍");
            return;
        }
        //获取用户信息
        let userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
        if(userInfo.isOpenLmAccount == "0"){
            //用户未开户
            let param = {
                isShow:true,//是否展示弹框
                modalTitle:"开户提示",//弹框标题
                modalText:"您还未开户，请去开户",//弹框内容
                modalType:"5",//弹框类型 0-授权提示弹框 1-风险测评弹框 2-余额不足弹框 3-预约退出日是否重选 4-短信验证码 5-用户未开户
                btnNum:"1",//按钮数量0-单按钮 1- 双按钮
                btnOneText:"取消",//按钮1内容
                btnTwoText:"去开户",//按钮2内容
            }
            window.G_dispatch({type:'paymentPage/showOrHidModal',payload:param});
            return;
        }


        if(this.props.depositModel.bankList && this.props.depositModel.bankList.length == 0){
            //用户未绑卡
            let param = {
                isShow:true,//是否展示弹框
                modalTitle:"绑卡提示",//弹框标题
                modalText:"您还未绑卡，请去绑卡",//弹框内容
                modalType:"6",//弹框类型 0-授权提示弹框 1-风险测评弹框 2-余额不足弹框 3-预约退出日是否重选 4-短信验证码 5-用户未开户 6-用户未绑卡
                btnNum:"1",//按钮数量0-单按钮 1- 双按钮
                btnOneText:"取消",//按钮1内容
                btnTwoText:"去绑卡",//按钮2内容
            }
            window.G_dispatch({type:'paymentPage/showOrHidModal',payload:param});
            return;
        }

        this.props.dispatch({type:'lecaiProductSelect/checkBeforeTrade',payload:{investMoney:this.refs.lendCount.value,
            reserverExitDate:this.props.lecaiProductSelect.productDetail.lockDueDate,
            userAccInfo:this.props.lecaiProductSelect.userAccInfo,
        }})

    }
    //弹框确定按钮回调
    modalOk = () =>{
        //获取弹窗类型0-授权提示弹框 1-风险测评弹框 2-余额不足弹框 3-预约退出日是否重选 4-短信验证码 5-用户未开户
        let modalType = this.props.paymentPage.modalType;
        //获取按钮个数0-单按钮 1- 双按钮
        let btnNum = this.props.paymentPage.btnNum;
        if(modalType == "0"){
            //跳转到授权页面
            Toast.info("跳转到授权页面");
        }else if(modalType == "1"){
            //跳转到风险测评页面
            Toast.info("跳转到风险测评页面");
            this.props.history.push({pathname:"/riskEvaluation"});
        }else if(modalType == "2"){
            //跳转到充值页面
            Toast.info("跳转到充值页面");
            this.props.history.push({pathname:"/deposit"});
        }else if(modalType == "3"){
            //同意预约退出日顺延
            Toast.info("同意预约退出日顺延");
        }else if(modalType == "4"){
            //获取用户答案
            let answerId = "";
            let guessId  = "";
            if(this.props.lecaiProductSelect.answers){
                let answers = this.props.lecaiProductSelect.answers;
                for(let i=0;i<answers.length;i++){
                    let obj = answers[i];
                    if(obj.selected){
                        answerId = obj.serialNum;
                        guessId = obj.guessId;
                        break;
                    }
                }
            }
            //获取体验金和抵扣券使用状态
            let isUseRed = "0";
            if(this.dkqInfo == "" && this.tyjInfo == ""){
                isUseRed = "0";//不使用抵扣券和体验金
            }else if(this.dkqInfo == "" && this.tyjInfo !== ""){
                isUseRed = "2";//新手体验金
            }else if(this.dkqInfo !== "" && this.tyjInfo == ""){
                isUseRed = "4";//使用大额抵扣券券和10抵扣券
            }else if(this.dkqInfo !== "" && this.tyjInfo !== ""){
                isUseRed = "5";//体验金与抵扣券混合使用
            }
            //短信验证码确认 执行出借
            this.props.dispatch({type:'lecaiProductSelect/invest',
                payload:{...this.props.lecaiProductSelect.productDetail,
                    txAmt:this.refs.lendCount.value,
                    validateCode:this.refs.yan.value,
                    selectDate:this.state.selectDate,
                    answerId:answerId,
                    guessId:guessId,
                    isUseRed:isUseRed,
                    idList:this.dkqInfo,
                    idTyList:this.tyjInfo}})
        }else if(modalType == "5"){
            //用户未开户跳转到恒丰开户页面
            this.props.history.push({pathname: '/bankDepositoryPage'});
        }else if(modalType == "6"){
            //用户未绑卡跳转到绑卡页面
            this.props.history.push({pathname: '/addBankCard'});
        }
        let param = {
            isShow:false,//是否展示弹框
        };
        this.props.dispatch({type:'paymentPage/showOrHidModal',payload:param});
    }

    //弹框取消按钮回调
    modalCancel = () =>{
        //获取弹窗类型0-授权提示弹框 1-风险测评弹框 2-余额不足弹框 3-预约退出日是否重选 4-短信验证码 5-用户未开户
        let modalType = this.props.paymentPage.modalType;
        //获取按钮个数0-单按钮 1- 双按钮
        let btnNum = this.props.paymentPage.btnNum;
        if(modalType === "1"){
            //继续出借
            //跳转到支付页面
            window.G_history.push({pathname:'/bankPay'});
        }else if(modalType === "3"){
            //重选预约退出日
            Toast.info("重选预约退出日")
        }
        // else{
            // this.props.history.push({pathname: './paymentPage',payload:false});
        // }
        let param = {
            isShow:false,//是否展示弹框
        };
        this.props.dispatch({type:'paymentPage/showOrHidModal',payload:param});
    }
    /**
     * 收集用户选中的体验金信息
     * @param tyj
     */
    saveTYJInfo = (tyj) =>{
        if(tyj.id == this.props.lecaiProductSelect.tyjChoosed){
            this.tyjAcc = 0;
            this.tyjDays = 0;
            this.tyjInfo = "";
            this.props.dispatch({type:'lecaiProductSelect/resData',payload:{tyjChoosed:""}});
        }else{
            this.tyjAcc = tyj.parValue;
            this.tyjDays = tyj.activeDays;
            this.tyjInfo = tyj.id+"";
            this.props.dispatch({type:'lecaiProductSelect/resData',payload:{tyjChoosed:tyj.id}});
        }

        // console.log(this.tyjInfo);
    }
    /**
     * 收集用户选中的抵扣券信息
     * @param flag "add"新增抵扣券 "del"取消选择抵扣券
     * @param dkq
     * @param dkqAcc用户使用的抵扣券金额
     */
    saveDKQInfo = (flag,dkq,dkqAcc) =>{
        //选中的体验金信息
        let dkqChoosed = this.props.lecaiProductSelect.dkqChoosed;
        if(flag === "add"){
            if(dkqChoosed == ""){
                dkqChoosed = dkq.id+"";
            }else{
                dkqChoosed = dkqChoosed+","+dkq.id;
            }

        }else{
            if(dkqChoosed.split(",").length == 1){
                dkqChoosed = "";
            }else{
                dkqChoosed = dkqChoosed.split(","+dkq.id).join("");
            }

        }
        this.props.dispatch({type:'lecaiProductSelect/resData',payload:{dkqChoosed:dkqChoosed}});
        // this.props.dispatch({type:'paymentPage/showOrHidModal',payload:{dkqAcc:dkqAcc}});
        this.dkqAcc = dkqAcc;
    }
    /**
     * 判断是否节假日
     */
    checkDate = (time) =>{
        let selectDate = time.getFullYear()+"-"+(time.getMonth()+1)+"-"+time.getDate();
        this.selectDateTemp = selectDate;
        this.newQuitDate = selectDate;
        let param = {authToken:window.localStorage.getItem("token"),
            client_id:"wechat",
            reserverExitDate:selectDate};
        MyLendService.tradeReserverExitDateCheck(param).then((res)=>{
            //选中日期不是节假日
            if(res.resCode === '0000'){
                this.setState({
                    selectDate :selectDate,//选中的预约退出日
                })
                this.hideDate();
            }else if(res.resCode === '0103'){
                // this.hideDate();
                this.holiday = res.resMsg;
                this.showDateModal();
            }else if(res.resCode === '888888'){
                //刷新token成功，重新查询数据
                this.checkDate();
            }else{
                Toast.fail(res.resMsg);
            }
        }).catch((err)=>{
            console.log(err);
        })
    }
    /**
     * 展示日期输入弹框
     */
    showDateModal = () =>{
        this.setState({
            isShowDateModal:true,
        })
    }
    /**
     * 隐藏日期输入弹框
     */
    hidDateModal = () =>{
        this.setState({
            isShowDateModal:false,
        })
    }
    /**
     * 预约退出日为节假日，并选择确定时
     */
    sureQuitDate = () =>{
        this.hidDateModal();
        this.hideDate();
        this.setState({
            selectDate :this.selectDateTemp,//选中的预约退出日
        })
    }
    /**
     * 显示协议选择框
     */
    showDate = () =>{
        this.setState({
            isShowDate:true
        })
    }
    /**
     * 隐藏协议选择框
     */
    hideDate = () =>{
        this.setState({
            isShowDate:false
        })
    }
    /**
     * 修改日期选择控件显示状态
     */
    isShowDate=()=>{
        //获取当前日期
        let nowDate = new Date();
        let year = nowDate.getFullYear();
        let month = (nowDate.getMonth()+1)<10?"0"+(nowDate.getMonth()+1):(nowDate.getMonth()+1);
        let day = nowDate.getDate()<10?"0"+nowDate.getDate():nowDate.getDate();
        nowDate = ""+year+month+day;
        //获取预约退出日
        let quitDate = this.props.lecaiProductSelect.productDetail.lockDueDate;
        quitDate = quitDate.split("-").join("");
        // if(quitDate - nowDate <=7){
        //     Toast.fail("距退出时间小于7天，暂无法修改");
        //     return;
        // }
        this.showDate();
    }
    getDateDiff = (startDate,endDate) =>{
        var startTime = new Date(Date.parse(startDate)).getTime();
        var endTime = new Date(Date.parse(endDate)).getTime();
        var dates = Math.abs((startTime - endTime))/(1000*60*60*24);
        return  dates;
    }

    componentWillMount(){
        this.props.dispatch({type: 'depositModel/getBankList', payload: {}});
        let obj = this.props.lecaiProductSelect.productDetail;
        this.setState({
            selectDate :obj.lockDueDate,
            holdDays:this.getDateDiff(obj.interestDate,obj.lockDueDate)+1
        })
        let param = JSON.parse(window.localStorage.getItem("paymentPageParam"));
        this.props.dispatch({type: 'lecaiProductSelect/nextStep',payload: param});
    }
    componentWillUpdate(){

    }
    //隐藏协议
    hideAgreements() {
        this.props.dispatch({
            type: 'addBankModel/closeAgreement'
        });
    }
    render() {
        let quitD = new Date(this.props.lecaiProductSelect.productDetail.lockDueDate.replace(/-/,"/"));
        // let quitD = this.props.lecaiProductSelect.productDetail.lockDueDate;
        return (
            <div className={styles.root}>
                <BackHeader
                    title="乐猜宝"
                    backType="0"
                    _this={this}
                ></BackHeader>
                <div className={styles.scrollDiv}>
                    <div className={styles.titleView}>
                        {this.props.lecaiProductSelect.productDetail.productName}
                        <div className={styles.usableNum}>
                            {`可投金额：10,000.00元`}
                        </div>
                    </div>
                    <div className={styles.numAndTime}>
                        <List >
                            <Item multipleLine  >
                                <div className={styles.item}>
                                    出借金额
                                    <input ref="lendCount" className={styles.itemInput} onChange={this.numChanged} placeholder='1000起投 100递增'/>
                                    元
                                </div>
                            </Item>
                            {/*<Item arrow="horizontal" multipleLine  onClick={this.isShowDate.bind(this)} >*/}
                                {/*<div className={styles.content}>*/}
                                    {/*<label className={styles.commonFont}>{"预约 "}<label className={styles.colorFont}>{this.state.selectDate}</label>{" 退出"}</label>*/}
                                    {/*<label className={styles.extra}>持有{this.state.holdDays}天</label>*/}
                                {/*</div>*/}
                            {/*</Item>*/}
                            {/*<Item  multipleLine onClick={() => {}} style={{backgroundColor:'#eeeeee',height:`${42/37.5}rem`}}>*/}
                                {/*<div className={styles.content}>*/}
                                    {/*<label className={styles.commonFont2}>{"最少持有天数 "}<label>380</label>{" 天"}</label>*/}
                                    {/*<div className={styles.extra1}><div className={styles.extra2}>{'? '}</div>{' 预约退出时间'}</div>*/}
                                {/*</div>*/}
                            {/*</Item>*/}



                            <Item  multipleLine onClick={() => {}} style={{backgroundColor:'#eeeeee',height:`${65/37.5}rem`,overflow:'visible'}}>
                                <div className={styles.content} style={{overflow:'visible'}}>
                                    <div style={{display:'flex'}}>
                                        <img src ={jrjsq} style={{width:`${14/37.5}rem`,height:`${17/37.5}rem`}}/>
                                        <div className={styles.tqsyl}>
                                            同期历史收益
                                            <div style={{color:'#AFACAC',fontSize:`${10/37.5}rem`,marginTop:`${5.5/37.5}rem`}}>(按历史年化收益计算)</div>
                                        </div>
                                    </div>
                                    <label className={styles.commonFont3}>{"56.00 "}<label className={styles.commonFont4}>～</label>{" 69.00"}<label className={styles.commonFont4}>天</label></label>
                                </div>
                            </Item>
                        </List>
                        <List style={{marginBottom:`${15/37.5}rem`}}>
                            <Item arrow="horizontal" multipleLine onClick={this.validateNum.bind(this,"0")} >
                                <div className={styles.content}>
                                    <label className={styles.commonFont}>{"使用体验金"}</label>
                                    <label className={styles.extra}>{this.tyjAcc}元({this.tyjDays}天)</label>
                                </div>
                            </Item>
                        </List>
                        <List style={{marginBottom:`${15/37.5}rem`}}>
                            <Item arrow="horizontal" multipleLine onClick={this.validateNum.bind(this,"1")} >
                                <div className={styles.content}>
                                    <label className={styles.commonFont}>{"使用抵扣券"}</label>
                                    <label className={styles.extra3}>{this.dkqAcc}元</label>
                                </div>
                            </Item>
                        </List>
                        <List style={{marginBottom:`${15/37.5}rem`}}>
                            <Item arrow="horizontal" multipleLine onClick={() => {}} >
                                <div className={styles.content}>
                                    <label className={styles.commonFont}>{"可用余额 "}<label className={styles.colorFont}>{this.props.lecaiProductSelect.userAccInfo?this.props.lecaiProductSelect.userAccInfo.availAssets:"0"}</label>元</label>
                                    <label className={styles.extra}>默认使用</label>
                                </div>
                            </Item>
                        </List>
                    </div>
                    <div className={styles.riskInfo}>
                        <div className={styles.checkContainer}><img className={styles.check} src={checkIco}/></div>
                        <label>
                            我已阅读并同意
                            <label onClick={()=>this.protocol('service')} className={styles.highlight}>《出借咨询和服务协议》</label>
                            且我已知晓
                            <label  onClick={()=>this.protocol('risk')} className={styles.highlight}>《风险提示函》</label>
                            所述风险
                        </label>
                    </div>
                    <Button
                        className={styles.nextButton}
                        onClick={()=>this.nextStep()}
                        disabled={false}>
                        {this.state.lendBtnText}
                    </Button>
                </div>
                <ExperienceCash
                    isOpen ={this.state.isCashOpen}
                    close ={this.cashColse}
                    tickets = {this.props.lecaiProductSelect.tyjInfo}
                    chooseTicket = {this.props.lecaiProductSelect.tyjChoosed}
                    count = {this.lendCount}
                    saveTYJInfo = {this.saveTYJInfo.bind(this)}
                />
                <DeductionTicket
                    isOpen ={this.state.isTicketOpen}
                    close ={this.ticketClose}
                    tickets = {this.props.lecaiProductSelect.dkqInfo}
                    chooseTicket = {this.props.lecaiProductSelect.dkqChoosed}
                    count = {this.lendCount}
                    saveDKQInfo = {this.saveDKQInfo.bind(this)}
                />

                <Calendar
                    renderHeader={() => <div style={{color: '#a29494', padding: 15, fontWeight: 'bold', textAlign: 'left'}}
                                             onClick={this.hideDate.bind(this)}>关闭</div>}
                    style={{textAlign: 'center', color: '#ff7800'}}
                    visible={this.state.isShowDate}
                    type="one"
                    defaultValue = {[quitD,quitD]}
                    minDate={quitD}
                    initalMonths="18"
                    maxDate={this.afterDays}
                    onConfirm={this.checkDate.bind(this)}
                ></Calendar>
                <Modal
                    visible={this.state.isShowDateModal}
                    transparent
                    maskClosable={false}
                    // onClose={this.onClose('modal1')}
                    footer={
                        [
                            { text: '重选', onPress: this.hidDateModal.bind(this) },
                            { text: '确定', onPress: this.sureQuitDate.bind(this) }
                        ]
                    }
                >
                    <div className={styles.dateText}>
                        {this.holiday}
                    </div>
                </Modal>
                <Modal
                    visible={this.props.paymentPage.isShow}
                    transparent
                    maskClosable={false}
                    title={this.props.paymentPage.modalTitle}
                    // className={styles.modal}
                    // wrapClassName={styles.modal}
                    footer={this.props.paymentPage.btnNum == "0"?
                        [
                            { text: this.props.paymentPage.btnOneText, onPress: this.modalOk.bind(this) }
                        ]
                        :
                        [
                            { text: this.props.paymentPage.btnOneText, onPress: this.modalCancel.bind(this) },
                            { text: this.props.paymentPage.btnTwoText, onPress: this.modalOk.bind(this) }
                        ]
                    }>
                    {this.props.paymentPage.modalType == "4"?
                        <div>
                            <div className={styles.checkPwd}>
                                <input ref="yan" className={styles.checkPwdText} maxLength={6} placeholder="请输入短信验证码" type="tel"/>
                            </div>
                        </div>
                        :
                        this.props.paymentPage.modalText
                    }
                </Modal>
                {/*显示协议：此方式打开协议，返回后，不刷新页面，输入数据会保留*/}
                <AgreementComponent {...this.props.addBankModel} isShow={this.props.addBankModel.isShowAgreement}
                                    onClose={this.hideAgreements.bind(this)}/>
            </div>
        );
    }
}

PaymentPage.propTypes = {};

export default connect(({paymentPage,lecaiProductSelect,depositModel,addBankModel}) => {
    return {paymentPage,lecaiProductSelect,depositModel,addBankModel};
})(PaymentPage);

