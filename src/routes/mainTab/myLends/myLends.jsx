/* eslint-disable no-dupe-keys */
/**
 * Created by abrahamchen on 2018/5/30.
 */

import React from 'react';
import {connect} from 'dva';
import style from './myLends.less';
import Icon from "antd-mobile/es/icon";
import  accounting from  'accounting';
import  ModalWX from '../../../components/modalWX/ModalWX';
import ModalImg from '../../../components/modalImg/ModalImg';
import  Foot from  '../../../components/foot/foot';
import {Modal, Button, Carousel, Toast}from 'antd-mobile';
import  {mapOpenLmAccount, noteHF} from  '../../../utils/util';


class MyLends extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        let token = window.localStorage.getItem('token');
        if (token) {
            this.props.dispatch({type: 'login/getUserInfo', payload: {token: token}});
            this.props.dispatch({type: "main/getMoney"})
            let state = window.localStorage.getItem("ticket");
            console.log('ticket', state);
            if (state && state == "1") {
                this.setState({isImgOpen: true});
            }
        }
    }

    // 判断是否需要身份认证
    jumpTo = () => {
        this.props.history.push({pathname: '/recordListPage'})
    };

    /**
     * 跳转到出借列表页面
     */
    jumpToLend = () => {
        this.props.history.push({pathname: '/lendList'})
    }

    /**
     * 转跳到总资金页面
     */
    jumpToAllMoney = () => {

        this.props.history.push({pathname: '/AllMoneyPage'})

    }

    //获取恒丰页面
    jumpToHF = () => {
        this.props.dispatch({
            type: 'main/getCheckTime', payload: {
                callback: () => {
                    this.props.history.push({pathname: '/xydBankDepositoryPage'});
                }
            }
        })
    }


    //退出系统
    exit = () => {
        this.props.dispatch({type: "main/logout"});
        localStorage.clear();
        //window.location.reload();
        this.props.history.push({pathname: '/login'});
    }


    //个人信息
    userMsg() {
        let value = window.localStorage.getItem("userInfo");
        let userInfo = {};
        let lmAccount = [];
        let icon = [];
        if (value) {
            userInfo = JSON.parse(value);
        } else {
            return null;
        }

        if (userInfo && userInfo.isOpenHfAccount) {
            if (userInfo.isOpenHfAccount == '1') {
                lmAccount.push(<span key={1001} style={{color: '#178A00'}}><i
                    className={'iconfont icon-duigou'}></i>{mapOpenLmAccount(userInfo.isOpenHfAccount)}</span>);
            }
            else if (userInfo.isOpenHfAccount == '0') {
                lmAccount.push(<span key={1001} onClick={() => {
                    this.jumpToHF();
                }}>{mapOpenLmAccount(userInfo.isOpenHfAccount)}</span>);
            }
            else {
                lmAccount.push(<span key={1001}>{mapOpenLmAccount(userInfo.isOpenHfAccount)}</span>);
            }
            if (userInfo.isOpenHfAccount == '0') {
                icon.push(<Icon key={1002} size="md" type="right"/>);
            }
        }
        if (userInfo) {
            return (
                <div className={style.userMsg}>

                    <div className={style.userMsgImg}>
                        <button className={style.wo} type="primary"><i className={ 'iconfont icon-wo'}></i></button>
                    </div>

                    <div className={style.userMsgNumber }>
                        <span >{userInfo.mobile.substring(0, 3) + '****' + userInfo.mobile.substring(7, 11)}</span>
                    </div>
                    <div className={style.userMsgRight + ' ' + style.userMsgIcon} onClick={() => {
                        this.jumpToHF();
                    }}>
                        {icon}
                    </div>
                    <div className={style.userMsgOperate}>
                        {lmAccount}
                    </div>
                </div>
            )
        }

    }

    //用户资产
    userProperty() {
        let {hfAssets, wealthAmt} = this.props.main;
        let hfasset, wealth = {};

        if (hfAssets && hfAssets.data && hfAssets.data.hfAssets) {
            hfasset = hfAssets.data.hfAssets;
        }

        if (wealthAmt && wealthAmt.data && wealthAmt.data.wealthAmt) {
            wealth = wealthAmt.data.wealthAmt;
        }

        return (
            <div>
                <div className={style.interval}></div>
                <div className={style.content}>

                    <div className={style.userMsgPro}>
                        <div onClick={this.jumpToAllMoney.bind(this)}>
                            {accounting.formatNumber(hfasset, 2, ',', '.')}
                        </div>
                        <br/>
                        <div className={style.userMsgPro2}
                             onClick={this.jumpToAllMoney.bind(this)}>总资产（元）
                        </div>
                    </div>
                    <div >
                        <div className={style.userMiddleIco} onClick={this.jumpToAllMoney.bind(this)}>
                            <Icon size="md" type="right"/>
                        </div>
                    </div>
                    <div className={style.userMsgPro} style={{marginLeft: `${15 / 37.5}rem`}}>
                        <div>
                            {accounting.formatNumber(wealth, 2, ',', '.')}
                        </div>
                        <br/>
                        <div className={style.userMsgPro2}>总收益（元）</div>
                    </div>


                    <div className={style.userMsgPro3}>
                        <div className={style.userMsgBtn} onClick={() => {
                            noteHF(this, 'withdraw', () => {
                                this.props.history.push({pathname: '/withdraw'})
                            })
                        }}>
                            <button className={style.btn1} type="primary">提现</button>
                        </div>
                        <div className={style.userMsgBtn2} onClick={() => {
                            noteHF(this, 'deposit', () => {
                                this.props.history.push({pathname: '/deposit'})
                            })
                        }}>
                            <button className={style.btn2} type="primary">充值</button>
                        </div>
                    </div>

                </div>
            </div>
        )
    }

    /**
     * 跳转到出借列表页面
     */
    jumpToLend = () => {
        this.props.history.push({pathname: '/lendList'})
    }

    //用户列表
    userList() {
        return (
            <div>
                <div className={style.interval}></div>
                <div className={style.userList} onClick={this.jumpToLend.bind(this)}>
                    {/* <img className={style.chujie} src={chujie}></img>*/}
                    <i className={style.chujie + ' iconfont icon-woyaochujie'}/>
                    <div><span>我的出借</span></div>
                    <div className={style.userMsgRight}>
                        <Icon size="md" type="right"/>
                    </div>
                </div>
                <div className={style.userList} onClick={() => this.jumpTo()}>
                    <i className={style.chujie + ' iconfont icon-jilu'}/>
                    <div><span>交易记录</span></div>
                    <div className={style.userMsgRight}>
                        <Icon size="md" type="right"/>
                    </div>

                </div>
                <div className={style.interval}></div>
                <div className={style.userList} onClick={() => this.exit()}>
                    <i className={style.chujie + ' iconfont icon-tuichu'}/>
                    <div><span>安全退出</span></div>


                </div>
            </div>
        )
    }

    openPromto() {
        this.setState({isOpen: !this.state.isOpen});
    }

    /**
     * 根据用户的状态判断，该用哪个提示
     * */
    openMsg() {

        this.setState({isMsgOpen: !this.state.isMsgOpen, actionType: 1});

    }

    handleHref(val) {
        window.localStorage.removeItem('ticket');
        this.props.history.push({pathname: '/xydBankDepositoryPage'});
    }


    //底部
    foot() {
        return (
            <div className={style.note}>
                <Foot getWeiXin={this.openPromto.bind(this)}/>
                <ModalWX isOpen={this.state.isOpen}
                         close={() => this.setState({isOpen: false})}
                />
                <ModalImg
                    isImgOpen={this.state.isImgOpen}
                    redirect={this.handleHref.bind(this)}
                />
            </div>
        )
    }

    render() {
        return (
            <div className={style.root}>
                {this.userMsg()}
                {this.userProperty()}
                {this.userList()}
                {this.foot()}
            </div>
        );
    }
}

MyLends.propTypes = {};

export default connect(({main}) => {
    return {
        main
    };
})(MyLends);

