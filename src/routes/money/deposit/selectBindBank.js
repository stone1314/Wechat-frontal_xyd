/**
 * Created by leiz on 2018/7/25
 */
import React from 'react';
import {connect} from 'dva';
import {WhiteSpace} from 'antd-mobile'
import BackHeader from '../../../components/backHeader/backHeader';
import BankList from '../../../components/bankList/bankList'

class SelectBindBank extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.dispatch({type: 'belongBankModel/getBindBankList'});
    }

    getBankInfo(info) {
        console.log(info);
        this.props.history.push({
            pathname: '/deposit',
            state: info
        })
    }

    gotoAddBankCard() {
        this.props.history.push('/addBankCard');
    }

    render() {
        return (
            <div>
                <BackHeader title='选择付款银行卡' backType='0' _this={this}/>
                <BankList
                    cardInfos={this.props.belongBankModel.bindBankList}
                    onClickCard={this.getBankInfo.bind(this)}
                    onClickAdd={this.gotoAddBankCard.bind(this)}/>
            </div>
        )
    }
}

export default connect(({belongBankModel}) => ({belongBankModel}))(SelectBindBank);