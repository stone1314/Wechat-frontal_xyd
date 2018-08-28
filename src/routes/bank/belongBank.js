/**
 * Created by leiz on 2018/7/25
 */
import React from 'react';
import {connect} from 'dva';
import BackHeader from '../../components/backHeader/backHeader';
import BankList from '../../components/bankList/bankList'

class BelongBank extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.dispatch({type: 'belongBankModel/getBankList'});
    }

    getBankInfo(info) {
        console.log(info);
        this.props.history.push({
            pathname: '/addBankCard',
            state: info
        })
    }

    render() {
        return (
            <div>
                <BackHeader title='选择所属银行' backType='0' _this={this}/>
                <BankList cardInfos={this.props.belongBankModel.bankList} onClickCard={this.getBankInfo.bind(this)} isShow={false}/>
            </div>
        )
    }
}

export default connect(({belongBankModel}) => ({belongBankModel}))(BelongBank);