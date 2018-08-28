/**
 * Created by db on 2018/8/6
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

    }

    render() {
        let props = {...this.props.addBankModel, ...this.state};
        return (
            <AgreementComponent {...props}/>
        )
    }
}

export default connect(({addBankModel}) => ({addBankModel}))(Agreement);