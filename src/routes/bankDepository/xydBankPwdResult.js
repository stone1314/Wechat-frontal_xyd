/**
 * Created by HaihuaHuang on 2018/8/1.
 */

import React from 'react';
import AddBankResultComponent from '../../components/commonResult/commonResult';
import imgTick from '../../asserts/money/tick@2x.png';
import imgFailure from '../../asserts/money/faliure@2x.png'
import {connect} from 'dva';

class xydBankResult extends React.PureComponent {
    constructor(props) {

        super(props)
        console.log(props)
        console.log('xydBankPwd传值：', this.props);

        this.state = {
            dpState: this.props.location.state.tradeStatus,   // ‘1’ 成功  ’2‘失败
            imgSrc: imgFailure,
            msg: this.props.location.state.tradeMsg,
            backFn: () => {
                let location = window.parent.location;
                location.href = `${location.origin}${location.pathname}#/MyLends`;
            }
        }
    }

    componentWillMount() {
        if (this.state.dpState === '1') {
            this.props.dispatch({
                type: 'xydBankModel/setHFPwdNext'})

            this.setState({
                imgSrc: imgTick,
                msg: '设置交易密码成功！',
            });
        } else if (this.state.dpState === '2') {
            this.props.dispatch({
                type: 'xydBankModel/setHFPwdNext'})
            this.setState({
                imgSrc: imgFailure,
                msg: this.state.msg,
            });
        }
    }

    render() {
        return (
            <AddBankResultComponent {...this.state} />
        )
    }
}


export default connect(({xydBankModel}) => {
    return {
        xydBankModel
    };
})(xydBankResult);