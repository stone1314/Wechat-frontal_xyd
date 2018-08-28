/* eslint-disable no-dupe-keys */
/**
 * Created by leizhao on 2018/6/20.
 */

import React from 'react';
import {connect} from 'dva';
import queryString from 'query-string'
import imgShaLou from '../../../asserts/money/shalou@2x.png'
import imgTick from '../../../asserts/money/tick@2x.png';
import Success from '../../../components/depositWithdraw/success'

const EnumPageType = {
    DEPOSIT_PROCESSING: 'dp',
    DEPOSIT_SUCCESS: 'ds',
    WITHWRAW_PROCESSING: 'wp',
    WITHWRAW_SUCCESS: 'ws'
}

class DepositWithdrawSuccess extends React.Component {
    constructor(props) {
        super(props);
        const {match} = props;
        this.state = {
            pageType: match.params ? match.params.pageType : '',
            depositWithdrawInfo: queryString.parse(props.location.search),//JSON.parse(localStorage.getItem("depositWithdrawInfo")),
            showProps: {}
        };
    }

    showDepositProps = (depositWithdrawInfo) => {
        return {
            imgSrc: depositWithdrawInfo.imgSrc,
            desText: depositWithdrawInfo.desText,
            moneyText: depositWithdrawInfo.chargeAmt,
            bankName: depositWithdrawInfo.bankName,
            tailNo: depositWithdrawInfo.tailNo,
            backFn: () => {
                window.parent.G_history.push('/MyLends'); //跳出iframe
            }
        }
    }

    showWithdrawProps = (depositWithdrawInfo) => {
        return {
            imgSrc: depositWithdrawInfo.imgSrc,
            desText: depositWithdrawInfo.desText,
            moneyText: depositWithdrawInfo.chargeAmt,
            arrivalText: depositWithdrawInfo.chargeAmt,
            bankName: depositWithdrawInfo.bankName,
            tailNo: depositWithdrawInfo.tailNo,
            backFn: () => {
                window.parent.G_history.push('/MyLends');//跳出iframe
            }
        }
    }

    handle = () => {
        switch (this.state.pageType) {
            case EnumPageType.DEPOSIT_PROCESSING:
                this.state.showProps = this.showDepositProps({
                    desText: '充值处理中',
                    imgSrc: imgShaLou,
                    ...this.state.depositWithdrawInfo
                });
                break;
            case EnumPageType.DEPOSIT_SUCCESS:
                this.state.showProps = this.showDepositProps({
                    desText: '恭喜你,充值成功',
                    imgSrc: imgTick,
                    ...this.state.depositWithdrawInfo
                });
                break;
            case EnumPageType.WITHWRAW_PROCESSING:
                this.state.showProps = this.showWithdrawProps({
                    desText: '提现处理中',
                    imgSrc: imgShaLou,
                    ...this.state.depositWithdrawInfo
                });
                break;
            case EnumPageType.WITHWRAW_SUCCESS:
                this.state.showProps = this.showWithdrawProps({
                    desText: '恭喜你,提现成功',
                    imgSrc: imgTick,
                    ...this.state.depositWithdrawInfo
                });
                break;
            default:
                break;
        }
        return this.state.showProps;

    };

    render() {
        return (
            <Success {...this.handle()}/>
        );
    }
}

DepositWithdrawSuccess.propTypes = {};

export default connect()(DepositWithdrawSuccess);

