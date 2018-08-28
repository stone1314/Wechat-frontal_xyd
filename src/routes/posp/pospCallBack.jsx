/* eslint-disable no-dupe-keys */
/**
 * 此页面为后端回调页面,用于处理存管返回结果信息
 * 包括：存管开户、激活、充值、提现等操作
 * Created by leizhao on 2018/7/3.
 */

import React from 'react';
import {connect} from 'dva';
import queryString from 'query-string'
import Config from '../../constants/constant'
import {routerRedux} from "dva/router";

class PospCallBack extends React.PureComponent {
    constructor(props) {
        super(props);
        console.log(props)
        const {orderStatus, errorInfo, token} = queryString.parse(props.location.search);

        console.log('orderStatus', orderStatus);
        console.log('errorInfo', errorInfo);
        this.state = {
            orderStatus: orderStatus,
            errorInfo: errorInfo,
            hfToken: token
        };

        console.log('pospCall',this.state );

        //  const{ tradeStatus,msg}= queryString.parse(props.location.search);
        /*   this.state = {
         tradeStatus: tradeStatus,
         msg: msg
         };*/

    }

    componentWillMount() {
        const operateType = window.localStorage.getItem('operateType');
        console.log('operateType', operateType);
        const enumOperateType = Config.OPERATE_ENUM;
        switch (operateType) {
            case enumOperateType.DISPOSIT_KEY:
                this.goToDeposit();
                break;
            case enumOperateType.WITHDRAW_KEY:
                this.goToWithdraw();
                break;
            case enumOperateType.OPENACCOUNT_KEY:
                this.goToBankDepository();
                break;
            case  enumOperateType.XYD_HFPWD_KEY:
                this.goToXYDPWDBankDepository();
                break;
            case  enumOperateType.LEND:
                this.goToLend();
                break;
            case  enumOperateType.CONTRACT_EXIT:
                this.goContractExit();
                break;
            //加入其它操作处理
            default:
                break;
        }
    }

    /**
     * 去出借
     */
    goToLend(){
        let localStorage = window.localStorage;
        let param = JSON.parse(localStorage.getItem("operateParam"));
        param.hfToken = this.state.hfToken;
        localStorage.setItem("operateParam",JSON.stringify(param));
        if(this.state.orderStatus=='1') {
            window.parent.G_history.push({pathname:'/paymentResult'});
        }else{
            this.props.history.push(`/depositWithdrawFailure/df/${this.state.errorInfo}`)
        }

    }
    /**
     * 主动退出
     */
    goContractExit(){
        let localStorage = window.localStorage;
        let param = JSON.parse(localStorage.getItem("operateParam"));
        param.hfToken = this.state.hfToken;
        localStorage.setItem("operateParam",JSON.stringify(param));
        if(this.state.orderStatus=='1') {
            if(!this.state.hfToken || this.state.hfToken == ""){
                this.props.history.push(`/depositWithdrawFailure/df/${this.state.errorInfo}`)
            }else{
                window.parent.G_history.push({pathname:'/lendDetail'});
            }

        }else{
            this.props.history.push(`/depositWithdrawFailure/df/${this.state.errorInfo}`)
        }

    }

    /**
     * 去充值
     */
    goToDeposit() {
        let dispositInfo = JSON.parse(window.localStorage.getItem(Config.OPERATE_ENUM.DISPOSIT_KEY));
        if(this.state.orderStatus=='1') {
            this.props.dispatch({
                type: 'depositModel/deposit',
                payload: {
                    bankCardId: dispositInfo.bankCardId,
                    chargeAmt: dispositInfo.chargeAmt,
                    hfToken: this.state.hfToken
                }
            })
        }else{
            this.props.history.push(`/depositWithdrawFailure/df/${this.state.errorInfo}`)
        }
    }
    /**
     * 去提现
     */
    goToWithdraw() {
        let withdrawInfo = JSON.parse(window.localStorage.getItem(Config.OPERATE_ENUM.WITHDRAW_KEY));
        if(this.state.orderStatus=='1') {
            this.props.dispatch({
                type: 'withdrawModel/withdraw',
                payload: {
                    bankCardId: withdrawInfo.bankCardId,
                    txAmt: withdrawInfo.txAmt,
                    hfToken: this.state.hfToken
                }
            })
        }else{
            this.props.history.push(`/depositWithdrawFailure/wf/${this.state.errorInfo}`)
        }
    }

    goToBankDepository() {
        this.props.history.push({
            pathname: '/bankDepositoryResultPage',
            state: {tradeStatus: this.state.tradeStatus, tradeMsg: this.state.msg}
        })
    }

    goToXYDPWDBankDepository() {

        this.props.history.push({
            pathname: '/xydBankPwdResult',
            state: {tradeStatus: this.state.orderStatus, tradeMsg: this.state.errorInfo}
        })
    }


    render() {
        return (
            <div>
                loading...
            </div>
        );
    }
}

PospCallBack.propTypes = {};

export default connect(({depositModel}) => ({depositModel}))(PospCallBack);

