/**
 * Created by leiz on 2018/7/25
 */
import React from 'react';
import CommonResultComponent from '../../components/commonResult/commonResult';
import imgTick from '../../asserts/money/tick@2x.png';
import imgFailure from '../../asserts/money/faliure@2x.png';
import {getBackUrl} from "../../utils/util";

class AddBankResult extends React.PureComponent {
    constructor(props) {
        console.log(props)
        super(props)
        this.state = {
            imgSrc: imgFailure,
            msg: '操作异常',
            backFn: () => {
                console.log('返回')
            }
        }
    }

    componentWillMount() {
        let state = this.props.location.state;
        if (state) {
            this.setState({
                imgSrc: state.isBindSuccess ? imgTick : imgFailure,
                msg: state.msg,
                backFn: () => {
                    state.isBindSuccess ? this.goToBack() : this.goToBindCard()
                }
            });
        }
    }

    //成功：从哪里来，返回到哪里
    goToBack() {
        let backUrl = getBackUrl();
        console.log('backUrl', backUrl);
        this.props.history.replace(`/${backUrl}`);
    }

    //失败：回到绑卡页面
    goToBindCard() {
        this.props.history.replace(`/addBankCard`);
    }

    render() {
        return (
            <CommonResultComponent {...this.state} />
        )
    }
}

export default AddBankResult;