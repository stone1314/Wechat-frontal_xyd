import React from 'react'
import {connect} from 'dva'
import aStyle from './agreementText.less'
import backImg from '../../asserts/login/arrowback@2x.png';
import AgreeService from '../../services/agreeService'
import {Toast} from 'antd-mobile'
import BackHeader from '../../components/backHeader/backHeader'



class AgreementText extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            agreementUrl:"",
            isAgreement:true,//是否有相关协议
            title:window.localStorage.getItem("agreementTitle")
        }
    }

    componentWillMount(){
        let localStorage = window.localStorage;
        let param = JSON.parse(localStorage.getItem("agreementParam"));
        // let param = {contractId:"MP120001250737",bizId:"1060",type:"1",client_id:"wechat"};
        if(!param.bizId){
            this.setState({
                isAgreement:false,
            })
            return;
        }
        AgreeService.agreement(param).then((res)=>{
            if(res.resCode === '0000'){
                if(!res.data.viewUrl){
                    this.setState({
                        isAgreement:false,
                    })
                }else{
                    this.setState({
                        agreementUrl:res.data.viewUrl
                    })
                }
            }else{
                Toast.fail(res.resMsg);
            }
        }).catch((err)=>{
            console.log(err);
        })
    }
    render(){
        return(
            <div className={aStyle.lendList}>
                <BackHeader
                    title={this.state.title}
                    backType="0"
                    _this={this}
                ></BackHeader>
                <div className={aStyle.ldContent}>
                    {this.state.isAgreement?<iframe className={aStyle.ldContent} src={this.state.agreementUrl}></iframe>:<div className={aStyle.noLendInfo}>合同协议数据暂未生成，请稍后再试</div>}
                </div>
            </div>
        )
    }

}
AgreementText.propTypes = {};
export default connect(({agreementText})=>{
    return {
        agreementText
    };
})(AgreementText)