import React from 'react'
import {connect} from 'dva'
import ldStyle from './lendDetail.less'
import backImg from '../../asserts/login/arrowback@2x.png';
import {Icon,Calendar,Modal,Toast} from 'antd-mobile'
import {jumpToPage}  from '../../utils/util';
import MyLendService from '../../services/myLendService'
import OtherService from '../../services/otherService'
import accounting from 'accounting'
import ModalInfo from '../../components/modalInfo/ModalInfo'
import md5 from 'js-md5'
import {timeToDate} from '../../utils/util'
import BackHeader from '../../components/backHeader/backHeader'
import Constant from '../../constants/constant'


class LendDetail extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isShow:false,//是否显示协议选择框
            lendInfo:null,//出借列表详情
            isOpen:false,//是否打开预约退出日提示
            isShowDate:false,//是否显示日期选择
            // isShowPwd:true,//是否显示密码输入框
            isShowPwd:false,//是否显示密码输入框
            iType:"password",//密码输入框的type
            iTypeImg:" iconfont icon-biyan1",//眼睛图片的样式
            isShowDateModal:false,//是否展示选中为节假日时的弹出框
            quitDateInfo:"预约退出日说明",//预约退出日说明文案
        }
        this.now = new Date();
        this.now1 = new Date();
        this.afterDays = new Date(this.now1.setDate(this.now.getDate() + 450));
        this.newQuitDate = null;
        this.holiday = "";
        this.selectDate = "";//选中的预约退出日
        this.title = "";
    }
    /**
     *  返回
     */
    backToPage = () =>{
        this.props.history.goBack();
    }
    /**
     * 展示协议选择框
     */
    showBottom = () =>{
        this.setState({
            isShow:true,
        })
    }
    /**
     * 隐藏协议选择框
     */
    hiddenBottom = () =>{
        this.setState({
            isShow:false,
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
        let quitDate = this.props.lendDetail.lendInfo.subscribeQuitApplyDate;
        quitDate = quitDate.split("-").join("");
        if(quitDate - nowDate <=7){
            Toast.fail("距退出时间小于7天，暂无法修改");
            return;
        }
        this.showDate();
    }
    /**
     * 跳转页面借款列表
     */
    jumpToPage = () =>{
        //保存当前合同编号
        window.localStorage.setItem("contractNo",this.props.lendDetail.lendInfo.contractNo);
        jumpToPage(this,'./lendPro');
    }
    /**
     * 获取我的出借详情
     */
    queryAssertInfo = () =>{
        //获取localStorage
        let localStorage = window.localStorage;
        //获取本次的orderNo
        let orderNo = localStorage.getItem("orderNo");
        // let orderNo = "201806211526290000084416";
        //获取当前token
        let token = localStorage.getItem("token");
        let params = {orderNo:orderNo,authToken:token,client_id:"wechat"};
        this.props.dispatch({type:'lendDetail/queryAssertInfo',payload:params});
        // MyLendService.queryAssertInfo(params,true).then((res)=>{
        //     if(res.resCode === '0000'){
        //         let lendObj =res.data;
        //         switch (lendObj.quitStatus){
        //             case "0" :
        //                 lendObj.quitStatusT = "募集中";
        //                 this.title = '锁定期结束后可申请债权转让退出。';
        //                 break;
        //             case "4" :
        //                 lendObj.quitStatusT = "锁定中";
        //                 this.title = '锁定期结束后可申请债权转让退出。';
        //                 break;
        //             case "5" :
        //                 lendObj.quitStatusT = "可债转";
        //                 this.title = '锁定期已结束，可申请债权转让；继续持有，持续计息。';
        //                 break;
        //             case "2" :
        //                 lendObj.quitStatusT = "债转中";
        //                 this.title = '申请转让日';
        //                 break;
        //             case "6" :
        //                 lendObj.quitStatusT = "债转中";
        //                 this.title = '申请转让日';
        //                 break;
        //             case "7" :
        //                 lendObj.quitStatusT = "债转中";
        //                 this.title = '申请转让日';
        //                 break;
        //             case "3" :
        //                 lendObj.quitStatusT = "已债转";
        //                 this.title = '债转日';
        //                 break;
        //         }
        //         // lendObj.rateRange = JSON.parse(lendObj.rateRange);
        //         //获取出借列表详情成功
        //         this.setState({
        //             lendInfo:lendObj,
        //         })
        //     }else if(res.resCode === '888888'){
        //         //刷新token成功，重新查询数据
        //         this.queryAssertInfo();
        //     }else{
        //         //获取出借列表详情失败
        //         Toast.fail(res.resMsg);
        //     }
        // }).catch((err)=>{
        //     console.log(err)
        // })
    }

    /**
     * 查询预约退出日提示信息
     */
    sysConfig = ()=>{
        let params = {client_id:"wechat",authToken:window.localStorage.getItem("token"),codes:"CONTRACT_RESERVE_DUE_DATE_DESC"};
        OtherService.sysConfig(params).then((res)=>{
            if(res.resCode === '0000'){
                this.setState({
                    quitDateInfo:res.data[0],
                })
            }else if(res.resCode === '888888'){
                //刷新token成功，重新查询数据
                this.sysConfig();
            }else{
                Toast.fail(res.resMsg);
            }
        }).catch((err)=>{
            console.log(err)
        })
    }

    componentWillMount(){
        //获取我的出借详情
        this.queryAssertInfo();
        //查询预约退出日提示信息
        this.sysConfig();
        //获取操作类型
        let localStorage = window.localStorage;
        let type = localStorage.getItem("operateType");
        if(type == Constant.OPERATE_ENUM.CONTRACT_EXIT){
            //获取主动退出参数
            let param = JSON.parse(localStorage.getItem("operateParam"));
            this.props.dispatch({type:'lendDetail/contractExit',payload:param});
        }
    }


    /**
     * 判断是否节假日
     */
    checkDate = (time) =>{
        let selectDate = time.getFullYear()+"-"+(time.getMonth()+1)+"-"+time.getDate();
        this.selectDate = selectDate;
        this.newQuitDate = selectDate;
        let param = {authToken:window.localStorage.getItem("token"),
                     client_id:"wechat",
                     reserverExitDate:selectDate};
        MyLendService.tradeReserverExitDateCheck(param).then((res)=>{
            //选中日期不是节假日
            if(res.resCode === '0000'){
                this.showPwdModal();
            }else if(res.resCode === '0103'){
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
     * 校验密码
     */
    validatePwd = () =>{
        let pwd = this.refs.yan.value;
        // let reg = regUtil.pwdReg;
        // if(!reg.test(pwd)){
        //     Toast.fail("密码由8~14位字母、字符、数字组成");
        //     return;
        // }
        let param = {authToken:window.localStorage.getItem("token"),
            client_id:"wechat",
            password:md5(pwd).toUpperCase()};
        MyLendService.validatePwd(param).then((res)=>{
            //密码验证通过
            if(res.resCode === '0000'){
                //设置新的预约退出日
                this.changeDate();
            }else if(res.resCode === '888888'){
                //刷新token成功，重新查询数据
                this.validatePwd();
            }else{
                Toast.fail(res.resMsg);
            }
        }).catch((err)=>{
            console.log(err);
        })
    }
    /**
     * 修改预约退出日
     */
    changeDate=()=>{
        let param = {authToken:window.localStorage.getItem("token"),
            client_id:"wechat",
            // orderNo:"201802231414270000075868",
            orderNo:this.props.lendDetail.lendInfo.orderNo,
            quitDate:this.newQuitDate};
        MyLendService.contractReserveExit(param,true).then((res)=>{
            if(res.resCode === '0000'){
                //修改预约退出日成功
                this.hidPwdModal();
                this.hidDateModal();
                this.hideDate();
                Toast.info("修改预约退出日成功");
                this.queryAssertInfo();
            }else if(res.resCode === '888888'){
                //刷新token成功，重新查询数据
                this.changeDate();
            }else{
                //修改预约退出日失败
                Toast.fail(res.resMsg);
            }
        }).catch((err)=>{
            console.log(err);
        })
    }
    /**
     * 点击按钮切换密码明文和密文
     */
    downYan = () =>{
        // this.refs.yan.attr("type","text");
        // this.refs.yan.type="text";
        if(this.state.iType === "text"){
            this.setState({
                iType:"password",
                iTypeImg:" iconfont icon-biyan1"
            })
        }else{
            this.setState({
                iType:"text",
                iTypeImg:" iconfont icon-zhengyan",
            })
        }
    }
    /**
     * 展示密码输入弹框
     */
    showPwdModal = () =>{
        this.setState({
            isShowPwd:true,
        })
    }
    /**
     * 隐藏密码输入弹框
     */
    hidPwdModal = () =>{
        this.setState({
            isShowPwd:false,
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
     * 跳转协议页面
     */
    JumpToAgreementText =()=>{
        let localStorage = window.localStorage;
        //存储协议查询参数
        let param = {contractId:this.props.lendDetail.lendInfo.contractNo,bizId:this.props.lendDetail.lendInfo.productType,type:"1",client_id:"wechat"};
        localStorage.setItem("agreementParam",JSON.stringify(param));
        localStorage.setItem("agreementTitle","出借咨询与服务协议");
        jumpToPage(this,'./agreementText');
    }
    renderLastLine = (lendInfo) =>{
        //募集中 0 锁定中 4 可退出 5 退出中2,6,7 已退出 3
        if(lendInfo.quitStatus == "0" || lendInfo.quitStatus == "4" || lendInfo.quitStatus == "5"){
            return(
                <div className={ldStyle.lendStep}>
                    <div className={ldStyle.lendDate}>
                        <div className={ldStyle.lendDatePoint}>
                            <div className={ldStyle.point}></div>
                        </div>
                        <div className={ldStyle.lendDateTextSmall}>{this.title}</div>
                        <div className={ldStyle.lendDateBtn}>
                        </div>
                    </div>
                    <div className={ldStyle.lendTitleNo}>
                    </div>
                </div>
            )
        }else if(lendInfo.quitStatus == "2" || lendInfo.quitStatus == "6" || lendInfo.quitStatus == "7"){
            let arr = [];
            arr.push(
                <div className={ldStyle.lendStep}>
                    <div className={ldStyle.lendDate}>
                        <div className={ldStyle.lendDatePoint}>
                            <div className={ldStyle.point}></div>
                        </div>
                        <div className={ldStyle.lendDateTextSmall}>{lendInfo.subscribeQuitApplyDate}</div>
                        <div className={ldStyle.lendDateBtn}>
                        </div>
                    </div>
                    <div className={ldStyle.lendTitleNo}>
                        {this.title}
                    </div>
                </div>
            )
            arr.push(
                <div className={ldStyle.lendPrompt}>
                    债权转让时间由债权转让交易撮合情况而定，不排除无法完成转让的可能，转让期间持续计息。
                </div>
            )
            return arr
        }else{
            let arr = [];
            arr.push(
                <div className={ldStyle.lendStep}>
                    <div className={ldStyle.lendDate}>
                        <div className={ldStyle.lendDatePoint}>
                            <div className={ldStyle.point}></div>
                        </div>
                        <div className={ldStyle.lendDateTextSmall}>{lendInfo.lockDueDate}</div>
                        <div className={ldStyle.lendDateBtn}>
                        </div>
                    </div>
                    <div className={ldStyle.lendTitleNo}>
                        {this.title}
                    </div>
                </div>
            )
            arr.push(
                <div className={ldStyle.lendPrompt}>
                    完成债权转让后，本息回款至账户余额；如有体验金收益，回款至银行卡。
                </div>
            )
            return arr
        }

    }
    /**
     * 主动退出
     */
    contractExit = (lendInfo) =>{
        let localStorage = window.localStorage;
        //获取主动出借参数
        let  param = {
            authToken:localStorage.getItem("token"),
            contractNo:lendInfo.contractNo,
            expectQuitDate:timeToDate(new Date().getTime()),
            client_id:'wechat',
            quitType:"1",
        }
        localStorage.setItem("operateParam",JSON.stringify(param));
        localStorage.setItem("operateType",Constant.OPERATE_ENUM.CONTRACT_EXIT);
        this.props.dispatch({type: 'depositModel/hfPasswordCheck', payload: {}});
    }

    render(){
        // let lendInfo = this.state.lendInfo;
        let lendInfo = this.props.lendDetail.lendInfo;
        if(!lendInfo){
            return (
                <div className={ldStyle.lendList}>
                    <div className={ldStyle.backBar}>
                        <img className={ldStyle.backImg} src={backImg} onClick={this.backToPage.bind(this)}/>
                        <div className={ldStyle.backImgText} onClick={this.backToPage.bind(this)}>返回</div>
                        <div className={ldStyle.backTitle}>资产详情</div>
                        <div className={ldStyle.backPro} onClick={this.showBottom.bind(this)}>协议</div>
                    </div>
                    <div className={ldStyle.noLendInfo}>未查询到订单详情</div>
                </div>
            );
        }
        let lendObj =lendInfo;
        switch (lendObj.quitStatus){
            case "0" :
                lendObj.quitStatusT = "募集中";
                this.title = '锁定期结束后可申请债权转让退出。';
                break;
            case "4" :
                lendObj.quitStatusT = "锁定中";
                this.title = '锁定期结束后可申请债权转让退出。';
                break;
            case "5" :
                lendObj.quitStatusT = "可债转";
                this.title = '锁定期已结束，可申请债权转让；继续持有，持续计息。';
                break;
            case "2" :
                lendObj.quitStatusT = "债转中";
                this.title = '申请转让日';
                break;
            case "6" :
                lendObj.quitStatusT = "债转中";
                this.title = '申请转让日';
                break;
            case "7" :
                lendObj.quitStatusT = "债转中";
                this.title = '申请转让日';
                break;
            case "3" :
                lendObj.quitStatusT = "已债转";
                this.title = '债转日';
                break;
        }
        let quitD = new Date(lendInfo.subscribeQuitApplyDate.replace(/-/,"/"));
        this.selectDate = quitD;
        return(
            <div className={ldStyle.lendList}>
                <BackHeader
                    title="资产详情"
                    backType="0"
                    rightAction={this.showBottom.bind(this)}
                    rightActionText="协议"
                    _this={this}
                ></BackHeader>
                <div className={ldStyle.ldContent}>
                    {lendInfo.quitStatus == "2" || lendInfo.quitStatus == "6" || lendInfo.quitStatus == "7"?<div id="hidDiv" className={ldStyle.hidDiv}>
                        债权转让时间由债权转让交易撮合情况而定，不排除无法完成转让的可能，转让期间持续计息。
                    </div>:null}

                    <div className={lendInfo.quitStatus == "0" || lendInfo.quitStatus == "4" || lendInfo.quitStatus == "5"?ldStyle.lendDateStep:ldStyle.lendDateStepH}>
                        <div className={ldStyle.lendline}></div>
                        <div className={ldStyle.lendStep}>
                            <div className={ldStyle.lendDate}>
                                <div className={ldStyle.lendDatePoint}>
                                    <div className={ldStyle.point}></div>
                                </div>
                                <div className={ldStyle.lendDateText}>{lendInfo.txTime.split(' ')[0]}</div>
                                <div className={ldStyle.lendDateBtn}>
                                    <div className={ldStyle.lendDateBtnText}>{lendInfo.quitStatusT}</div>
                                </div>
                            </div>
                            <div className={ldStyle.lendTitle}>
                                出借日
                            </div>
                        </div>
                        <div className={ldStyle.lendStep}>
                            <div className={ldStyle.lendDate}>
                                <div className={ldStyle.lendDatePoint}>
                                    <div className={ldStyle.point}></div>
                                </div>
                                <div className={ldStyle.lendDateText}>{lendInfo.valueDate}</div>
                                <div className={ldStyle.lendDateBtn}>
                                </div>
                            </div>
                            <div className={ldStyle.lendTitle}>
                                计息日
                            </div>
                        </div>
                        <div className={ldStyle.lendStep}>
                            <div className={ldStyle.lendDate}>
                                <div className={ldStyle.lendDatePoint}>
                                    <div className={ldStyle.point}></div>
                                </div>
                                <div className={ldStyle.lendDateText}>{lendInfo.lockDueDate}</div>
                                <div className={ldStyle.lendDateBtn}>
                                </div>
                            </div>
                            <div className={ldStyle.lendTitle}>
                                锁定期结束日
                            </div>
                        </div>
                        {this.renderLastLine(lendInfo)}


                    </div>
                    <div className={ldStyle.lendTable}>
                        <div className={ldStyle.lendHead}>出借明细</div>
                        <div className={ldStyle.lendBody}>
                            <div className={ldStyle.lendBodyKey}>名称</div>
                            <div className={ldStyle.lendBodyValue}>{lendInfo.productName}</div>
                        </div>
                        <div className={ldStyle.lendBody}>
                            <div className={ldStyle.lendBodyKey}>金额</div>
                            <div className={ldStyle.lendBodyValue}>{lendInfo.contractAmt}元</div>
                        </div>
                        {lendInfo.tyAmt == 0?null:<div className={ldStyle.lendBody}>
                            <div className={ldStyle.lendBodyKey}>搭配体验金</div>
                            <div className={ldStyle.lendBodyValue}>{lendInfo.tyAmt}元(享10天收益)</div>
                        </div>}
                        {lendInfo.dkAmt == 0?null:<div className={ldStyle.lendBody}>
                            <div className={ldStyle.lendBodyKey}>使用抵扣券</div>
                            <div className={ldStyle.lendBodyValue}>{lendInfo.dkAmt}元</div>
                        </div>}
                        <div className={ldStyle.lendBody}>
                            <div className={ldStyle.lendBodyKey}>历史年化收益率</div>
                            <div className={ldStyle.lendBodyValue}>{lendInfo.perProfitRateDisplay.split("~")[0]+"%~"+lendInfo.perProfitRateDisplay.split("~")[1]+"%"}</div>
                        </div>
                        <div className={ldStyle.lendBody}>
                            <div className={ldStyle.lendBodyKey}>奖励收益率</div>
                            <div className={ldStyle.lendBodyValue}>{lendInfo.subPreProfitRate}%</div>
                        </div>
                        <div className={ldStyle.lendBody}>
                            <div className={ldStyle.lendBodyKey}>同期历史收益<div className={ldStyle.lendBodyKeyL}>(按历史年化收益率和奖励收益率计算)</div></div>
                            <div className={ldStyle.lendBodyValue}>{lendInfo.subPreProfitRate}%</div>
                        </div>
                    </div>
                    {lendInfo.quitStatus == "3"?<div className={ldStyle.lendTable}>
                        <div className={ldStyle.lendHead}>收益明细</div>
                        <div className={ldStyle.lendBody}>
                            <div className={ldStyle.lendBodyKey}>债权收益</div>
                            <div className={ldStyle.lendBodyValue}>+{accounting.formatNumber(lendInfo.contractAmtprofit,2,',')}</div>
                        </div>
                        <div className={ldStyle.lendBody}>
                            <div className={ldStyle.lendBodyKey}>加息收益</div>
                            <div className={ldStyle.lendBodyValue}>+{accounting.formatNumber(lendInfo.addInterestAmt,2,',')}</div>
                        </div>
                        {lendInfo.tyAmt == 0?null:<div className={ldStyle.lendBody}>
                            <div className={ldStyle.lendBodyKey}>体验金收益</div>
                            <div className={ldStyle.lendBodyValue}>+{accounting.formatNumber(lendInfo.tyOraAmt,2,',')}</div>
                        </div>}
                        <div className={ldStyle.lendBody}>
                            <div className={ldStyle.lendBodyKey}>出借咨询服务费</div>
                            <div className={ldStyle.lendBodyValue}>-{accounting.formatNumber(lendInfo.borrowAmt,2,',')}</div>
                        </div>
                        <div className={ldStyle.lendBody}>
                            <div className={ldStyle.lendBodyKey}>净收益</div>
                            <div className={ldStyle.lendBodyValue}>{accounting.formatNumber(lendInfo.allocatedAmt,2,',')}</div>
                        </div>
                    </div>:null}
                    {lendInfo.productProp == "2"?<div className={ldStyle.lendTable}>
                        <div className={ldStyle.lendHead}>备注</div>
                        <div className={ldStyle.lendBody}>
                            <div className={ldStyle.lendBodyKey}>竞猜问题</div>
                            <div className={ldStyle.lendBodyValue}>{lendInfo.question}</div>
                        </div>
                        <div className={ldStyle.lendBody}>
                            <div className={ldStyle.lendBodyKey}>我的选择</div>
                            <div className={ldStyle.lendBodyValue}>{lendInfo.cusAnswerSerial+"."+lendInfo.cusAnswer}</div>
                        </div>
                        <div className={ldStyle.lendBody}>
                            <div className={ldStyle.lendBodyKey}>正确答案</div>
                            <div className={ldStyle.lendBodyValue}>{lendInfo.rightAnswerSerial+"."+lendInfo.rightAnswer}</div>
                        </div>
                    </div>:null}
                    <div className={ldStyle.zhanwei}></div>
                    {lendInfo.quitStatus == "5"?<div className={ldStyle.lendBottomBtn}  onClick={this.contractExit.bind(this,lendInfo)}>
                        申请债权转让
                    </div>:null}
                    {lendInfo.quitStatus == "2" || lendInfo.quitStatus == "6" ||lendInfo.quitStatus == "7"?<div className={ldStyle.lendBottomBtn}>
                        债权转让中
                    </div>:null}

                </div>
                {this.state.isShow?
                    <div className={ldStyle.lendBlack} onClick={this.hiddenBottom.bind(this)}>
                        <div className={ldStyle.lendBlackOK}>
                            <div className={ldStyle.lendBlackTextBorder} onClick={this.JumpToAgreementText.bind(this)}>出借咨询与服务协议</div>
                            <div className={ldStyle.lendBlackText} onClick={this.jumpToPage.bind(this)}>借款协议</div>
                        </div>
                        <div className={ldStyle.lendBlackCancel}>取消</div>
                    </div>:null}
                <ModalInfo
                    isOpen={this.state.isOpen}
                    close={() => this.setState({isOpen: false})}
                    title={'预约退出时间'}
                    content={this.state.quitDateInfo}
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
                    visible={this.state.isShowPwd}
                    transparent
                    maskClosable={false}
                    // onClose={this.onClose('modal1')}
                    title="请输入登录密码"
                    className={ldStyle.modal}
                    wrapClassName={ldStyle.modal}
                    footer={
                        [
                            { text: '取消', onPress: this.hidPwdModal.bind(this) },
                            { text: '确定', onPress: this.validatePwd.bind(this) }
                        ]
                    }
                >
                    <div>
                        <div className={ldStyle.checkPwd}>
                            <input ref="yan" className={ldStyle.checkPwdText} maxLength={14} placeholder="请输入登录密码" type={this.state.iType}/>
                            <div onClick={this.downYan.bind(this)}>
                                <i className={ldStyle.checkPwdImg + this.state.iTypeImg}/>
                            </div>
                        </div>
                    </div>
                </Modal>
                <Modal
                    visible={this.state.isShowDateModal}
                    transparent
                    maskClosable={false}
                    // onClose={this.onClose('modal1')}
                    className={ldStyle.modal}
                    wrapClassName={ldStyle.modal}
                    footer={
                        [
                            { text: '重选', onPress: this.hidDateModal.bind(this) },
                            { text: '确定', onPress: this.showPwdModal.bind(this) }
                        ]
                    }
                >
                    <div className={ldStyle.dateText}>
                        {this.holiday}
                    </div>
                </Modal>
            </div>
        )
    }

}
LendDetail.propTypes = {};
export default connect(({lendDetail,depositModel})=>{
    return {
        lendDetail,depositModel
    };
})(LendDetail)