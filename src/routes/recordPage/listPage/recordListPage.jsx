import React from 'react';
import {connect} from 'dva';
import style from './recordListPage.less'
import Icon from "antd-mobile/es/icon";
import {List} from 'antd-mobile';
import BackHeader from '../../../components/backHeader/backHeader'
import accounting from  'accounting';

import {jumpToPage} from '../../../utils/util';

const Item = List.Item;
const Brief = Item.Brief;

class recordListPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        console.log(1);
    }

    componentDidMount() {
        this.props.dispatch({type: 'recordList/getRecordList'});
        console.log(2);
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

    JumpToDetail(obj) {
        var path = {
            pathname: '/recordDetailPage',
            state: obj,
        }
        this.props.history.push(path)
    }

    content() {
        let success = React.createElement('span', {className: style.recordSuccess}, '交易成功');
        let faild = React.createElement('span', {className: style.recordFaild}, '交易失败');
        let doing = React.createElement('span', {className: style.recordDoing}, '交易处理中');

        console.log('conent', this.props);
        let items = [];
        if (this.props.recordList.data && this.props.recordList.data.tradeRecord && this.props.recordList.data.tradeRecord.recordVoList) {
            let arr = this.props.recordList.data.tradeRecord.recordVoList;
            arr.map((item, index, value) => {
                let color = {};
                if (item.status == "0") {
                    color = success;
                } else if (item.status == "2") {
                    color = faild;
                } else {
                    color = doing;
                }

                items.push(<Item arrow="horizontal" key={index} extra={color} multipleLine
                                 onClick={
                                     () => {
                                         this.JumpToDetail(item)
                                     }
                                 }
                >
                    {accounting.formatNumber(item.amount, 2, ',', '.')}元
                    <Brief>{item.tradeTypeDesc}</Brief>
                </Item>);
                items.push(<div key={index + 1000}
                                style={{
                                    borderTop: `${15 / 37.5}rem`,
                                    borderTopColor: '#EEEEEE',
                                    borderTopStyle: 'solid'
                                }}/>);

            });
        }

        if (items.length > 0) {
            return (
                <div>
                    <List renderHeader={() => ' '} className={style.listPage}>
                        {items}
                    </List>
                </div>
            )
        } else {
            return (<div className={style.noLendInfo}>无交易记录信息！</div>)
        }
    }


    render() {
        return (
            <div className={style.rlproot}>
                {this.title()}
                {this.content()}
            </div>
        );
    }
}

recordListPage.propTypes = {};

export default connect(({recordList}) => {
    return {
        recordList
    };
})(recordListPage);

