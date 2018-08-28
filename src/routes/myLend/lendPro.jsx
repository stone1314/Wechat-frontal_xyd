import React from 'react'
import {connect} from 'dva'
import lpStyle from './lendPro.less'
import ModalInfo from '../../components/modalInfo/ModalInfo'
import MyLendService from '../../services/myLendService'
import {Toast} from 'antd-mobile'
import accounting from 'accounting'
import Constant from '../../constants/constant'
import {jumpToPage} from '../../utils/util'
import BackHeader from '../../components/backHeader/backHeader'

class LendPro extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isShow:false,//是否显示协议选择框
            lendProInfo:null,//存储债权列表信息
            isOpen:false,//是否显示风险评级提示框
        }
    }
    /**
     *  返回
     */
    backToPage = () =>{
        this.props.history.goBack();
    }

    /**
     * 跳转至债权列表页面
     */
    jumpToPage =(obj)=>{
        let localStorage = window.localStorage.setItem("lendProObj",JSON.stringify(obj));
        jumpToPage(this,'./lendProDetail');
    }
    componentWillMount(){
        this.creditorRightsV();
    }

    /**
     * 债权列表查询
     * @returns
     */
    creditorRightsV = () =>{
        let localStorage = window.localStorage;
        let params = {authToken:localStorage.getItem("token"),client_id:"wechat",finPactshowNo:localStorage.getItem("contractNo")}
        // let params = {authToken:localStorage.getItem("token"),client_id:"wechat",finPactshowNo:"MP120001268673"}
        MyLendService.creditorRightsV(params,true).then((res)=>{
            if(res.resCode === '0000'){
                this.setState({
                    lendProInfo : res.data.asset_list,
                })
            }else if(res.resCode === '888888'){
                //刷新token成功，重新查询数据
                this.creditorRightsV();
            }else{
                Toast.fail(res.resMsg);
            }
        }).catch((err)=>{

        })
    }

    showTost = (event) =>{
        event.stopPropagation();
        this.setState({isOpen: true})
    }

    renderPro = () =>{
        let lpInfo = this.state.lendProInfo;
        if(!lpInfo){
            return(<div className={lpStyle.noLendInfo}>没有债权信息</div>);
        }
        let arr = [];
        for(let i=0;i<lpInfo.length;i++){
            let lpObj = lpInfo[i];
            arr.push(
                <div key={i} className={lpStyle.lendPro} onClick={this.jumpToPage.bind(this,lpObj)}>
                    <div className={lpStyle.lendProLine1}>
                        <div className={lpStyle.lendProPoint}>
                            <div className={lpStyle.lendProP}></div>
                        </div>
                        <div className={lpStyle.lendProText}>
                            <div>{lpObj.borrower_name}</div>
                            <div><nobr>项目编号:{lpObj.borrower_bid_contract_no}</nobr></div>
                        </div>
                        <div className={lpStyle.lendProLevel} onClick={this.showTost.bind(this)}>{lpObj.borrower_credit_level}</div>
                    </div>
                    <div className={lpStyle.lendProLine2}>
                        <div className={lpStyle.lendColumn1}>
                            <div className={lpStyle.money}>
                                {accounting.formatNumber(lpObj.loan_amt,2,',')}
                                <div className={lpStyle.moneyUnit}>元</div>
                            </div>
                            <div className={lpStyle.lendMoney}>借款金额</div>

                        </div>
                        <div className={lpStyle.lendColumn2}>
                            <div className={lpStyle.percent}>
                                {lpObj.loan_yearly_rate}
                                <div className={lpStyle.percentUnit}></div>
                            </div>
                            <div className={lpStyle.lendPer}>借款利率</div>

                        </div>
                        <div className={lpStyle.lendColumn3}>
                            <div className={lpStyle.lendCount}>借款期限:{lpObj.loan_term}{Constant.loan_term_type[lpObj.loan_term_type]}</div>
                            <div className={lpStyle.lendType}>借款用途:{lpObj.loan_purpose }</div>
                        </div>
                    </div>
                </div>
            )
        }
        return arr;
    }

    render(){
        return(
            <div className={lpStyle.lendList}>
                <BackHeader
                    title="项目列表"
                    backType="0"
                    _this={this}
                ></BackHeader>
                <div className={lpStyle.lendProBody}>
                    {this.renderPro()}
                </div>
                <ModalInfo
                    isOpen={this.state.isOpen}
                    close={() => this.setState({isOpen: false})}
                    title={'风险评级'}
                    content={"借款人申请借款时的风险评级等级"}
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