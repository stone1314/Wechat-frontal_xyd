import React from 'react';
import {connect} from 'dva';
import style from './allMoneyPage.less';
import {List} from 'antd-mobile';
import  accounting from  'accounting';
import BackHeader from '../../components/backHeader/backHeader'

const Item = List.Item;

class AllMoneyPage extends React.Component {
    constructor(props) {
        super(props);
        console.log('AllMoneyPage');
    }


    componentDidMount() {
        this.props.dispatch({type: 'allMoney/GetAllMoney'});
    }

    title() {
        return (
            <BackHeader
                title=""
                backType="2"
                _this={this}
            ></BackHeader>
        )
    }

    content() {
        let data = {};
        if (this.props.allMoney && this.props.allMoney.data) {
            data = this.props.allMoney.data;
        }

        return (
            <div className={style.content}>
                <div className={style.detailTitle}>
                    <div
                        className={style.detailNum}> {accounting.formatNumber(data.hfAssets, 2, ',', '.')}</div>
                    <div>总资产(元)</div>
                </div>
                <List className="my-list">
                    <Item extra={accounting.formatNumber(data.availAssets, 2, ',', '.')}>可用金额（元）</Item>
                    <Item extra={ accounting.formatNumber(data.withdrawAssets, 2, ',', '.')}>可提金额（元）</Item>
                    <Item extra={accounting.formatNumber(data.freezeAssets, 2, ',', '.')}>冻结金额（元）</Item>
                </List>
            </div>
        )
    }

    render() {
        console.log('==========')
        return (
            <div className={style.root}>
                {this.title()}
                {this.content()}
            </div>
        )
    }
}


AllMoneyPage.propTypes = {};

export default connect(({allMoney}) => {
    return {
        allMoney
    };
})(AllMoneyPage);

