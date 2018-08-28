/**
 * Created by abrahamchen on 2018/6/26.
 */
import React from 'react';
import {connect} from 'dva';
import {Button, Toast, List} from 'antd-mobile';
import styles from './commonProductDetail.less';
import HistoryBar from '../../components/historyBar/historyBar';
import IInfoCell from '../../components/introduceInfoCell/introduceInfoCell';
//  import LoginService from '../../../services/LoginService';

const Item = List.Item;
const Brief = Item.Brief;

class CommonProductDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.percent = "0";//已售百分比
    }

    componentWillMount() {
        switch (this.props.type) {
            case 'newUsr':
                this.props.dispatch({type: 'newUsrProductDetail/getProductDetail', payload: {pid: '10016'}})
                break;
            default:
        }
    }

    // 跳转至具体详情
    jumpToDetail() {
        switch (this.props.type) {
            case 'lecai':
                this.props.dispatch({type: 'lecaiProductDetail/jumpToDetail', payload: {}})
                break;
            case 'newUsr':
                this.props.dispatch({type: 'newUsrProductDetail/jumpToDetail', payload: {}})
                break;
            default:
        }
    }

    //跳转至拟投资者列表
    jumpToInvestorList() {
        switch (this.props.type) {
            case 'lecai':
                this.props.dispatch({type: 'lecaiProductDetail/jumpToInvestorList', payload: {}})
                break;
            case 'newUsr':
                this.props.dispatch({type: 'newUsrProductDetail/jumpToInvestorList', payload: {}})
                break;
            default:
        }
    }

    /**
     * 跳转到出借人列表页面
     */
    jumpToPeopleList(){
        this.props.history.push({pathname:"/lendPeople"});
    }

    // 跳转至支付页面
    nextStep() {
        if(this.props.type == 'lecai'){
            let answers = this.props.lecaiProductSelect.answers;
            let selected = false;
            for(let answer of answers){
                selected = selected || answer.selected
            }
            if(!selected){
                Toast.info('请先选择一个答案');
                return;
            }
        }
        let localStorage = window.localStorage;
        let param = {};
        switch (this.props.type) {
            case 'lecai':
                param.productTypeId = this.props.LPDData.productDetail.productTypeId;
                param.type = "lecai";
                localStorage.setItem("paymentPageParam",JSON.stringify(param));
                // this.props.dispatch({
                //     type: 'lecaiProductSelect/nextStep',
                //     payload: {productTypeId: this.props.LPDData.productDetail.productTypeId, type: "lecai"}
                // });
                // this.props.dispatch({type:'lecaiProductDetail/nextStep',payload:{}})
                break;
            case 'newUsr':
                param.productTypeId = this.props.NUPDData.productDetail.productTypeId;
                param.type = "newUsr";
                localStorage.setItem("paymentPageParam",JSON.stringify(param));
                // this.props.dispatch({
                //     type: 'lecaiProductSelect/nextStep',
                //     payload: {productTypeId: this.props.NUPDData.productDetail.productTypeId, type: "newUsr"}
                // });
                // this.props.dispatch({type:'newUsrProductDetail/nextStep',payload:{}})
                break;
            default:
        }
        this.props.history.push({pathname:'paymentPage',state:{}}); // eslint-disable-line
    }

    render() {
        let proDetail = null;
        if (this.props.type == "lecai") {
            proDetail = this.props.LPDData.productDetail;
        } else {
            proDetail = this.props.NUPDData.productDetail;
        }
        if (!proDetail) {
            return (<div></div>)
        }
        //计算已售百分比
        if (proDetail.raiseState == "1") {
            //1:募集中 热销状态时
            this.percent = Math.floor((proDetail.sum / proDetail.realeaseLimitAmt * 100) < 0.5
            && (proDetail.sum / proDetail.realeaseLimitAmt * 100) > 0
                ? (proDetail.sum / proDetail.realeaseLimitAmt * 100) + 1 :
                (proDetail.sum / proDetail.realeaseLimitAmt * 100));

        }
        return (
            <div className={styles.scrollDiv}>
                <div className={styles.titleView}>
                    <div className={styles.rateContainer}>
                        <label className={styles.rate} addPercent={"+" + proDetail.subsidyRate + "%"}>
                            {proDetail.preProfitRateDisplay.split("~")[0]}
                            <label className={styles.ratePercent}>{" %～"}</label>
                            {proDetail.preProfitRateDisplay.split("~")[1]}
                            <label className={styles.ratePercent}>{" %"}</label>
                        </label>
                    </div>
                    <div className={styles.rateIntroduce}>
                        历史年化收益率+猜中“加息”
                    </div>
                    <div className={styles.buyProgressContainer}>
                        <div className={styles.buyProgress} relWidth={100}>
                            <div
                                className={styles.buyProgressBody}
                                style={{
                                    width: this.percent + '%'
                                }}/>
                        </div>
                        {`已售${ this.percent}%`}
                    </div>
                    <div className={styles.buyInfoContainer}>
                        <div className={styles.buyInfoCell}
                             valueTitle='剩余可投(元)'>{proDetail.realeaseLimitAmt - proDetail.sum}</div>
                        <div className={styles.buyInfoCell} valueTitle='锁定期(天)'>{proDetail.singlePeriod}</div>
                        <div className={styles.buyInfoCell} valueTitle='起投金额(元)'>{proDetail.lowestAmt}</div>
                    </div>
                </div>
                {proDetail.productProp == '1'?
                    <HistoryBar
                        style={{marginBottom: `${ 15 / 37.5}rem`}}
                        prodDetail={proDetail}
                        buyDate={proDetail.buyDate}
                        buyDateText={"购买当日起息"}
                        lockDate={proDetail.lockDueDate}
                        endDate={"申请债权转让"}/>:
                    <HistoryBar
                        style={{marginBottom: `${ 15 / 37.5}rem`}}
                        prodDetail={proDetail}
                        buyDate={proDetail.buyDate}
                        buyDateText={"购买日"}
                        interestDate={proDetail.interestDate}
                        interestDateText={proDetail.interestDate}
                        endDate={proDetail.lockDueDate}/>
                }

                <IInfoCell onClick={() => {
                    this.jumpToDetail()
                }} style={{marginBottom: `${15 / 37.5}rem`, height: `${44 / 37.5}rem`}} title='产品描述' arrowIco={true}/>
                <IInfoCell style={{marginBottom: `${15 / 37.5}rem`, height: `${72 / 37.5}rem`}} titlePrompt={true}
                           title='退出方式' subTitle={proDetail.qiutDescribe}/>
                <IInfoCell style={{marginBottom: `${15 / 37.5}rem`, height: `${119 / 37.5}rem`}} titlePrompt={true}
                           title='资金回款' subTitle={proDetail.repatmentDescribe}/>
                <IInfoCell style={{marginBottom: `${15 / 37.5}rem`, height: `${94 / 37.5}rem`}} titlePrompt={true}
                           title='出借咨询费' subTitle={proDetail.boughtWard}/>
                <IInfoCell onClick={this.jumpToPeopleList.bind(this)} style={{height: `${44 / 37.5}rem`}} title='出借人数' endText={proDetail.count} arrowIco={true}/>
                <IInfoCell onClick={() => {
                    this.jumpToInvestorList()
                }} style={{height: `${44 / 37.5}rem`,marginBottom:`${44 / 25}rem`}} title='拟投借贷项目' arrowIco={true}/>
                <Button
                    className={styles.nextButton}
                    onClick={() => this.nextStep()}
                    disabled={false}>
                    开始出借
                </Button>
            </div>
        );
    }
}

CommonProductDetail.propTypes = {};

export default CommonProductDetail;