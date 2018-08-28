/**
 * Created by leiz on 2018/7/25
 */
import React from 'react';
import {connect} from 'dva';
import {Toast} from 'antd-mobile';
import AgreementComponent from '../../components/agreement/agreementTpl';
import Config from '../../constants/constant';

class Agreement extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            _this: this
        };
    }

    componentWillMount() {
        //请求接口读取协议信息
        let category = this.props.match.params.category;
        let agreementCode = '';
        if (category == 'kj') {
            agreementCode = Config.AGREEMENTCODE.kuaiJieDoc;
        }
        if (category == 'wt') {
            agreementCode = Config.AGREEMENTCODE.delegateDoc;
        }
        if (category == 'depositoryDoc') {
            agreementCode = Config.AGREEMENTCODE.depositoryDoc;
        }
        this.props.dispatch({
            type: 'addBankModel/getAgreement',
            payload: {
                agreementCode: agreementCode
            }
        })
    }

    render() {
        let props = {...this.props.addBankModel, ...this.state};
        return (
            <AgreementComponent {...props}/>
        )
    }
}

export default connect(({addBankModel}) => ({addBankModel}))(Agreement);