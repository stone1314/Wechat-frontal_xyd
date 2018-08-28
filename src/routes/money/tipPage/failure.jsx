/* eslint-disable no-dupe-keys */
/**
 * Created by leizhao on 2018/6/20.
 */

import React from 'react';
import {connect} from 'dva';
import imgFailure from '../../../asserts/money/faliure@2x.png'
import Failure from '../../../components/depositWithdraw/failure'

const EnumPageType = {
    DEPOSIT_FAILURE: 'df',
    WITHWRAW_FAILURE: 'wf'
};

class DepositWithdrawSuccess extends React.Component {
    constructor(props) {
        super(props);
        const {match} = props;
        this.state = {
            pageType: match.params ? match.params.pageType : '',
            msg: match.params ? match.params.msg : ''
        };
    }

    goBack = () => {
        this.props.history.go(-1);
    };

    showDepositFailureProps = (msg) => {
        return {
            imgSrc: imgFailure,
            msg: msg,
            backFn: () => {
                window.parent.G_history.push('/deposit');//跳出iframe
            }
        }
    };
    showWithdrawFailureProps = (msg) => {
        return {
            imgSrc: imgFailure,
            msg: msg,
            backFn: () => {
                window.parent.G_history.push('/withDraw');
            }
        }
    };

    handle = () => {
        if (EnumPageType.DEPOSIT_FAILURE === this.state.pageType) {
            return this.showDepositFailureProps(this.state.msg);
        }
        if (EnumPageType.WITHWRAW_FAILURE === this.state.pageType) {
            return this.showWithdrawFailureProps(this.state.msg);
        }
    };

    render() {
        return (
            <Failure {...this.handle()}/>
        );
    }
}

DepositWithdrawSuccess.propTypes = {};

export default connect()(DepositWithdrawSuccess);

