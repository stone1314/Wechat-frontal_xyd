/* eslint-disable no-dupe-keys */
/**
 * Created by leizhao on 2018/6/20.
 */

import React from 'react';
import {connect} from 'dva';
import {NavBar, Icon, List, WingBlank, WhiteSpace, InputItem, Button, Modal, Toast} from 'antd-mobile'
import styles from '../deposit/deposit.less';
import imgCoin from '../../../asserts/money/coin@2x.png'
import imgNotice from '../../../asserts/money/notice.png'
import ModalInfo from '../../../components/modalInfo/ModalInfo'
import Config from '../../../constants/constant';
import BackHeader from '../../../components/backHeader/backHeader';
import AgreementPayModal from '../../../components/agreementPayModal/agreementPayModal';
import accounting from 'accounting';
import * as Util from "../../../utils/util";

const Item = List.Item;
const alert = Modal.alert;
const ImgCoin = () => (<div className={styles.thumbCoinDiv}><img className={styles.thumbIcon} src={imgCoin}/></div>);

class Withdraw extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputMoney: '',
            disabledBtn: true,
            noticeModel: {
                isOpen: false,
                title: '提现次数',
                content: '',
                close: () => {
                    this.showNotice();
                }
            }
        };
        this.userInfo = window.localStorage.getItem('userInfo') ? JSON.parse(window.localStorage.getItem('userInfo')) : {};
    }

    componentWillMount() {
        if (this.userInfo.isWithdrawCard == '0') {
            const alertInstance =
                alert('', <div style={{
                    fontSize: `${17 / 37.5}rem`,
                    color: 'black',
                    marginTop: `${30 / 37.5}rem`,
                    marginBottom: `${30 / 37.5}rem`
                }}>您还未设置提现银行卡</div>, [
                    {
                        text: '取消', onPress: () => {
                            this.props.history.push('/MyLends');
                        }
                    },
                    {
                        text: '去绑定', onPress: () => {
                            this.props.history.push('/myBankPage');
                        }
                    },
                ]);
        } else {
            this.props.dispatch({type: 'withdrawModel/initWithdrawPage', payload: {}});
        }
    };

    goBack = () => {
        this.props.history.go(-1);
    };


    inputChange = (value) => {
        if (value === '') {
            this.setState({
                disabledBtn: true,
                inputMoney: ''
            })
        } else {
            this.setState({
                disabledBtn: false,
                inputMoney: value
            })
        }
    };

    submit = (e) => {
        let initInfo = this.props.withdrawModel.pageShowInfo;
        if (isNaN(this.state.inputMoney)) {
            Toast.info("请输入正确的提现金额");
            return;
        }
        if (parseFloat(this.state.inputMoney) < parseFloat(initInfo.minWithdrawAssets)) {
            this.messageTips(``, `提现金额最少${initInfo.minWithdrawAssets}元`, `我知道了`);
            return;
        }
        if (parseFloat(this.state.inputMoney) > parseFloat(initInfo.withdrawAssets)) {
            this.messageTips(``, `提现金额不能大于可提金额`, `我知道了`);
            return;
        }
        //信雅达无此校验
        // if (Number(this.state.inputMoney) > Number(50000)) {
        //     // 工作日的9：00 - 17：00  不出现弹框
        //     // 提现超额时的提示信息
        //     const callBack = (result) => {
        //         console.log(result)
        //         if (result) {
        //             if (result.resCode == "0000") {
        //                 //开始提现
        //                 this.startWithdraw();
        //             } else {
        //                 let content = result.resMsg ? result.resMsg : this.props.withdrawModel.pageShowInfo.pageBottomNotice;
        //                 this.messageTips(`提现限制`, content, `我知道了`);
        //             }
        //         }
        //     };
        //     this.props.dispatch({
        //         type: 'withdrawModel/checkWorkTime', payload: {callBack}
        //     })
        // }
        // else {
        //开始提现
        this.startWithdraw();
        // }
    };

    //开始提现
    startWithdraw() {
        console.log('开始提现>>>');
        //数据校验通过，保存充值信息
        //记录操作动作
        window.localStorage.setItem('operateType', Config.OPERATE_ENUM.WITHDRAW_KEY);
        localStorage.setItem(Config.OPERATE_ENUM.WITHDRAW_KEY, JSON.stringify({
            bankCardId: this.props.withdrawModel.bankCardList.id,
            txAmt: this.state.inputMoney,
        }));
        this.props.dispatch({
            type: 'withdrawModel/getTradeSmsValidateSwitch',
            payload: {}
        });
    }

//内部验证，发送验证码
    sendTradeSms() {
        console.log('发送内部验证码')
        this.props.dispatch({
            type: 'withdrawModel/sendTradeSms',
            payload: {
                mobile: this.userInfo.mobile,
                type: Config.API_SEND_SMS_TYPE.TRADE_SMS,
                resType: Config.API_SMS_RES_TYPE.TEXT
            }
        });
    }

//内部验证，校验验证码
    validateSms(yzmText) {
        console.log('验证内部验证码' + yzmText);
        this.props.dispatch({
            type: 'withdrawModel/validateSms',
            payload: {
                mobile: this.userInfo.mobile,
                type: Config.API_SEND_SMS_TYPE.TRADE_SMS,
                resType: Config.API_SMS_RES_TYPE.TEXT,
                validateCode: yzmText
            }
        });
    }

//提示框
    messageTips = (tipTitle, tipContent, btnText) => (
        Modal.alert(tipTitle, <div className={styles.modalBody}>{tipContent}</div>, [
            {text: <div className={styles.modalBtn}>{btnText}</div>, onPress: () => console.log('我知道了')}
        ])
    );
//显示提现注意事项
    showNotice = () => {
        this.setState({
            noticeModel: Object.assign({}, this.state.noticeModel, {
                isOpen: !this.state.noticeModel.isOpen,
                content: this.props.withdrawModel.pageShowInfo.noticeContent
            })
        });
    };
//全部提现
    allWithdraw = () => {
        this.setState({
            inputMoney: this.props.withdrawModel.pageShowInfo.withdrawAssets,
            disabledBtn: false,
        })
    };
    imgBankIcon = (bankIconUrl) => {
        return (
            <div className={styles.thumbBankDiv}>
                <img className={styles.thumbIcon} src={bankIconUrl}/>
            </div>
        )
    };

    render() {
        const {bankCardList, pageShowInfo, agreementPayShow} = this.props.withdrawModel;
        const bankIconUrl = bankCardList.iconUrl;
        const bankName = bankCardList.bankName;
        const tailNo = bankCardList.tailNo;
        const withdrawAssets = pageShowInfo.withdrawAssets;
        const minWithdrawAssets = pageShowInfo.minWithdrawAssets;
        // const noticeContent = pageShowInfo.noticeContent;
        const pageBottomNotice = pageShowInfo.pageBottomNotice;
        const cashBtnName = pageShowInfo.cashBtnName;
        const noticeTitle = pageShowInfo.noticeTitle;
        const disabledBtn = this.state.disabledBtn || pageShowInfo.initDisabledBtn || this.userInfo.isWithdrawCard == '0';
        return (
            <div className={styles.deposit}>
                <BackHeader title="提现" backType="2" _this={this}/>
                <List className={styles.listBody}>
                    <Item className={styles.listItem} thumb={<ImgCoin/>} multipleLine>
                    <span className={styles.title}>可提余额 <span
                        className={styles.moneyColor}>{accounting.formatNumber(withdrawAssets, 2, ',', '.')}</span>元</span>
                    </Item>
                    <Item className={styles.listItem}
                          thumb={this.imgBankIcon(bankIconUrl)} multipleLine>
                        <span className={styles.title}>{bankName}</span>
                        <Item.Brief style={{marginTop: '-3px'}}>
                            <span className={styles.subtitle}>尾号{tailNo}</span>
                        </Item.Brief>
                    </Item>
                </List>
                <div className={styles.tips} onClick={this.showNotice}>
                    <img src={imgNotice} className={styles.tipMark}/>
                    <span className={styles.tipText}>{noticeTitle}</span>
                </div>
                <List>
                    <InputItem className={styles.inputItem}
                               onChange={this.inputChange}
                               value={this.state.inputMoney}
                               type="digit"
                               placeholder={`${minWithdrawAssets}元起提现`}
                               clear
                               onExtraClick={this.allWithdraw}
                               extra={<div className={styles.allWithdrawText}>全部提现</div>}
                               moneyKeyboardAlign="left"
                    >提现金额</InputItem>
                </List>
                <WhiteSpace size="xl"/><WhiteSpace size="xl"/>
                <WingBlank size="lg">
                    <Button className={styles.btnSure}
                            disabled={disabledBtn}
                            onClick={this.submit}
                    >{cashBtnName}</Button>
                </WingBlank>
                <div className={styles.noticeBottom}>
                    <img src={imgNotice}/>
                    <div className={styles.noticeBottomText}>
                        {pageBottomNotice}
                    </div>
                </div>

                {agreementPayShow ?
                    <AgreementPayModal
                        visible={agreementPayShow}
                        isAgreementPay={false}
                        mobile={Util.formatMobile(this.userInfo.mobile)}
                        onSendVcode={this.sendTradeSms.bind(this)}
                        onClose={() => {
                            this.props.dispatch({
                                type: 'withdrawModel/agreementPayShowSwitch',
                                payload: {isShow: false}
                            })
                        }}
                        callBack={(yzm) => {
                            if (yzm) {
                                this.validateSms(yzm);
                            }
                        }}/> : ''}
                <ModalInfo {...this.state.noticeModel}/>
            </div>
        );
    }
}

Withdraw.propTypes = {};

export default connect(({withdrawModel}) => ({withdrawModel}))(Withdraw);
