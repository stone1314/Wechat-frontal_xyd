/**
 * created by bingdu 2018.06.14
 */

import React from 'react';
import {connect} from 'dva';
import backHeaderStyle from './backHeader.less';
import Icon from "antd-mobile/es/icon";

/**
 * title:"",//标题--必传
 * titleStyle:'',//头样式
 * rightAction:null,//右侧按钮回调函数func--有右侧按钮需传
 * rightActionText:"",//右侧操作按钮--有右侧按钮需传
 * backType:"0",//0-返回上一个页面；1-返回主页面；'路由'-返回传入的路由页面--必传
 * _this:null,//父页面this--必传
 * */
class BackHeader extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    /**
     *  返回
     */
    backToPage = () => {
        if (this.props.backType == "0") {
            //获取token
            let token = window.localStorage.getItem("token");
            if (token) {
                this.props._this.props.history.goBack();
            } else {
                this.props._this.props.history.push({pathname: '/'})

            }
        } else if (this.props.backType == "1") {
            this.props._this.props.history.push({pathname: '/'})
        } else if (this.props.backType == "2") {//回跳到“我的”
            this.props._this.props.history.push({pathname: '/MyLends'})
        }
        else {
            this.props.history.push({pathname: this.props.backType})
        }
    }
    /**
     * 右侧操作按钮
     */
    rightAction = () => {
        if (!this.props.rightAction) {
            return;
        }
        this.props.rightAction();
    }

    render() {
        return (
            <div className={backHeaderStyle.backBar}>
                {/*<img className={backHeaderStyle.backImg} src={backImg} onClick={this.backToPage.bind(this)}/>*/}
                <Icon size="lg" type="left" style={{width: '29px'}} onClick={this.backToPage.bind(this)}/>
                <div className={backHeaderStyle.backImgText} onClick={this.backToPage.bind(this)}>返回</div>
                <div className={backHeaderStyle.backTitle}>{this.props.title}</div>
                <div className={backHeaderStyle.backPro}
                     onClick={this.rightAction.bind(this)}>{this.props.rightActionText}</div>
            </div>
        )

    }

}

BackHeader.propTypes = {};

export default connect(({backHeader}) => {
    return {
        backHeader
    };
})(BackHeader);
