import React from 'react';
import  {connect} from 'dva';
import Icon from "antd-mobile/es/icon";
import  style from './recordDetailPage.less';
import  {mapState} from '../../../utils/util';
import BackHeader from '../../../components/backHeader/backHeader'
import  accounting from  'accounting';

class RecordDetailPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        console.log(this.props);
        //this.props.dispatch({type: 'recordDetail/getRecordDetailMoney'});
    }

    title() {
        return (
            <BackHeader
                title="交易详情"
                backType="0"
                _this={this}
            ></BackHeader>

        )
    }

    content() {
        let data = {};
        if (this.props.location && this.props.location.state) {
            data = this.props.location.state;
        }

        if (data.tradeType == '3' || data.tradeType == '4') {//出借，回款
            return (
                <div>
                    <div className={style.detailTitle}>
                        <div
                            className={style.detailNum}>{data.tradeType == '3' ? '-' : '+'} {accounting.formatNumber(data.amount, 2, ',', '.')}</div>
                        <div>{mapState(data.status)}</div>
                    </div>
                    <div className={style.detailMsg}>
                        <div className={style.type}>交易明细</div>
                        <div className={style.row}>
                            <span className={style.name}>交易类型</span>
                            <span className={style.value}>{data.tradeTypeDesc}</span>
                        </div>
                        <div className={style.row}>
                            <span className={style.name}>产品名称</span>
                            <span className={style.value}>{data.operateTypeDesc}</span>
                        </div>
                        <div className={style.row}>
                            <span className={style.name}>交易日期</span>
                            <span className={style.value}>{data.date}</span>
                        </div>
                        <div className={style.row}>
                            <span className={style.name}>交易流水</span>
                            <span className={style.value + ' ' + style.words}>{data.tradeNo}</span>
                        </div>
                        <div className={style.row}>
                            <span className={style.name}>合同编号</span>
                            <span className={style.value + ' ' + style.words}>{data.contractNo}</span>
                        </div>
                        <br style={{clear: 'both'}}/>
                    </div>
                </div>
            )
        } else if (data.tradeType == '1' || data.tradeType == '2') { //充值， 提现
            return (
                <div>
                    <div className={style.detailTitle}>
                        <div
                            className={style.detailNum}>{data.tradeType == '2' ? '-' : '+'} {accounting.formatNumber(data.amount, 2, ',', '.')}</div>
                        <div>{mapState(data.status)}</div>
                    </div>
                    <div className={style.detailMsg}>
                        <div className={style.type}>交易明细</div>
                        <div className={style.row}>
                            <span className={style.name}>交易类型</span>
                            <span className={style.value}>{data.tradeTypeDesc}</span>
                        </div>
                        <div className={style.row}>
                            <span className={style.name}>{data.tradType == '1' ? '提现至' : '付款方式'}</span>
                            <span className={style.value}>{data.operateTypeDesc}</span>
                        </div>
                        <div className={style.row}>
                            <span className={style.name}>交易日期</span>
                            <span className={style.value}>{data.date}</span>
                        </div>
                        <div className={style.row}>
                            <span className={style.name}>交易流水</span>
                            <span className={style.value + ' ' + style.words}>{data.tradeNo}</span>
                        </div>
                        <br style={{clear: 'both'}}/>
                    </div>
                    <div>
                        <div className={style.note}>
                            <span className={style.noteMsg}>具体到账已银行实际到账为准</span>
                            <span className={style.noteSymbol}></span>
                        </div>
                    </div>
                </div>
            )
        }

    }

    render() {
        return (
            <div className={style.root}>
                {this.title()}
                {this.content()}
            </div>
        )
    }
}

RecordDetailPage.propTypes = {};

export default connect(({RecordDetailPage}) => {
    return {
        RecordDetailPage
    };
})(RecordDetailPage);
