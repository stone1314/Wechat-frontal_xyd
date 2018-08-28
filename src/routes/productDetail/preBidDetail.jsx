import React from 'react'
import {connect} from 'dva'
import lpdStyle from './preBidDetail.less'
import backImg from '../../asserts/login/arrowback@2x.png';
import {Icon} from 'antd-mobile'
import ModalInfo from '../../components/modalInfo/ModalInfo'
import accounting from 'accounting'
import Constant from '../../constants/constant'
import {jumpToPage} from '../../utils/util'
import BackHeader from '../../components/backHeader/backHeader'



class LendPro extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isShow:false,//是否显示协议选择框
            isOpen:false,//换框方式说明是否打开
            lendProObj:window.sessionStorage.getItem("preBidDetail"),
        }
    }
    /**
     *  返回
     */
    backToPage = () =>{
        this.props.history.goBack();
    }
    /**
     * 跳转到协议页面
     */
    jumpToPage = ()=>{
        let localStorage = window.localStorage;
        //存储协议查询参数
        let param = {contractId:localStorage.getItem("contractNo"),bizId:JSON.parse(this.state.lendProObj).signature_id,type:"2",client_id:"wechat"};
        localStorage.setItem("agreementParam",JSON.stringify(param));
        localStorage.setItem("agreementTitle","借款协议");
        jumpToPage(this,'./agreementText')
    }

    render(){
        let lpObj = JSON.parse(this.state.lendProObj);
        if(!lpObj){
            return(
                <div className={lpdStyle.lendList}>
                    <BackHeader
                        title="项目详情"
                        backType="0"
                        rightAction={this.jumpToPage.bind(this)}
                        rightActionText="协议"
                        _this={this}
                    ></BackHeader>
                    <div className={lpdStyle.noLendInfo}>未查询到债权详情</div>
                </div>
            )
        }
        return(
            <div className={lpdStyle.lendList}>
                <BackHeader
                    title="项目详情"
                    backType="0"
                    rightAction={this.jumpToPage.bind(this)}
                    rightActionText="协议"
                    _this={this}
                ></BackHeader>
                <div className={lpdStyle.lendProBody}>
                    <div className={lpdStyle.lendPro}>
                        <div className={lpdStyle.lendProLine1}>
                            <div className={lpdStyle.lendProPoint}>
                                <div className={lpdStyle.lendProP}></div>
                            </div>
                            <div className={lpdStyle.lendProText}>
                                <div>{lpObj.borrower_name}</div>
                                <div><nobr>项目编号:{lpObj.borrower_bid_contract_no}</nobr></div>
                            </div>
                            <div className={lpdStyle.lendProLevel}>{lpObj.borrower_credit_level}</div>
                        </div>
                        <div className={lpdStyle.lendProLine2}>
                            <div className={lpdStyle.lendColumn1}>
                                <div className={lpdStyle.money}>
                                    {accounting.formatNumber(lpObj.loan_amt,2,',')}
                                    <div className={lpdStyle.moneyUnit}>元</div>
                                </div>
                                <div className={lpdStyle.lendMoney}>借款金额</div>

                            </div>
                            <div className={lpdStyle.lendColumn2}>
                                <div className={lpdStyle.percent}>
                                    {lpObj.loan_yearly_rate}
                                    <div className={lpdStyle.percentUnit}></div>
                                </div>
                                <div className={lpdStyle.lendPer}>借款利率</div>

                            </div>
                            <div className={lpdStyle.lendColumn3}>
                                <div className={lpdStyle.lendCount}>借款期限:{lpObj.loan_term}{Constant.loan_term_type[lpObj.loan_term_type]}</div>
                                <div className={lpdStyle.lendType}>借款用途:{lpObj.loan_purpose }</div>
                            </div>
                        </div>
                    </div>
                    <div className={lpdStyle.lendTable}>
                        <div className={lpdStyle.lendHead}>借款人信息</div>
                        <div className={lpdStyle.lendBody}>
                            <div className={lpdStyle.lendBodyKey}>所在行业</div>
                            <div className={lpdStyle.lendBodyValue}>{lpObj.borrower_industry}</div>
                        </div>
                        <div className={lpdStyle.lendBody}>
                            <div className={lpdStyle.lendBodyKey}>收入状况</div>
                            <div className={lpdStyle.lendBodyValue}>{lpObj.borrower_income_amt}</div>
                        </div>
                        <div className={lpdStyle.lendBody}>
                            <div className={lpdStyle.lendBodyKey}>负债情况</div>
                            <div className={lpdStyle.lendBodyValue}>{lpObj.borrower_liability}</div>
                        </div>
                        <div className={lpdStyle.lendBody}>
                            <div className={lpdStyle.lendBodyKey}>征信报告逾期情况</div>
                            <div className={lpdStyle.lendBodyValue}>{lpObj.borrower_credit_data}</div>
                        </div>
                        <div className={lpdStyle.lendBody}>
                            <div className={lpdStyle.lendBodyKey}>其他平台借款情况</div>
                            <div className={lpdStyle.lendBodyValue}>{lpObj.other_borrower_issue}</div>
                        </div>
                    </div>
                    <div className={lpdStyle.lendTable}>
                        <div className={lpdStyle.lendHead}>项目信息</div>
                        <div className={lpdStyle.lendBody}>
                            <div className={lpdStyle.lendBodyKey}>项目名称及简介</div>
                            <div className={lpdStyle.lendBodyValue}>{lpObj.borrower_product_name}</div>
                        </div>
                        <div className={lpdStyle.lendBody}>
                            <div className={lpdStyle.lendBodyKey}>借款期限</div>
                            <div className={lpdStyle.lendBodyValue}>{lpObj.loan_term}{Constant.loan_term_type[lpObj.loan_term_type]}</div>
                        </div>
                        <div className={lpdStyle.lendBody}>
                            <div className={lpdStyle.lendBodyKey}>借款用途</div>
                            <div className={lpdStyle.lendBodyValue}>{lpObj.loan_purpose}</div>
                        </div>
                        <div className={lpdStyle.lendBody}>
                            <div className={lpdStyle.lendBodyKey}>还款方式<div className={lpdStyle.quitDateBtn} onClick={() => this.setState({isOpen: true})}>?</div></div>
                            <div className={lpdStyle.lendBodyValue}>{lpObj.loan_pmt_type}</div>
                        </div>
                        <div className={lpdStyle.lendBody}>
                            <div className={lpdStyle.lendBodyKey}>起息日</div>
                            <div className={lpdStyle.lendBodyValue}>{lpObj.loan_value_day}</div>
                        </div>
                        <div className={lpdStyle.lendBody}>
                            <div className={lpdStyle.lendBodyKey}>还款来源</div>
                            <div className={lpdStyle.lendBodyValue}>{lpObj.loan_pmt_source}</div>
                        </div>
                        {lpObj.duecounts_of_loan_person != "逾期"?<div className={lpdStyle.lendBody}>
                            <div className={lpdStyle.lendBodyKey}>还款保障措施</div>
                            <div className={lpdStyle.lendBodyValue}>{lpObj.loan_credit_incr_org}</div>
                        </div>:null}

                    </div>
                </div>
                <ModalInfo
                    isOpen={this.state.isOpen}
                    close={() => this.setState({isOpen: false})}
                    title={'还款方式'}
                    content={'还款方式说明'}
                />
            </div>
        )
    }

}
LendPro.propTypes = {};
export default connect(({lendPro})=>{
    return {
        lendPro
    };
})(LendPro)