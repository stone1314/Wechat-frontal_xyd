/* eslint-disable no-dupe-keys */
/**
 * Created by leizhao on 2018/6/20.
 */

import React from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router'
import {NavBar, Icon, List, WingBlank, WhiteSpace, InputItem, Button, Modal, Toast} from 'antd-mobile'
import styles from './deposit.less';
import imgCoin from '../../../asserts/money/coin@2x.png';
import * as Util from '../../../utils/util';
import Config from '../../../constants/constant';
import BackHeader from '../../../components/backHeader/backHeader';
import accounting from 'accounting';
import BankLine from '../../../components/bankList/bankLine'
import AgreementPayModal from '../../../components/agreementPayModal/agreementPayModal';

const Item = List.Item;
const ImgCoin = () => (<div className={styles.thumbCoinDiv}><img className={styles.thumbIcon} src={imgCoin}/></div>);


class Deposit extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.props.depositModel;
        this.userInfo = window.localStorage.getItem('userInfo') ? JSON.parse(window.localStorage.getItem('userInfo')) : {};
        this.selectedBankList = this.props.location.state;
    }

    componentDidMount() {
        this.props.dispatch({type: 'depositModel/initDepositPage', payload: {}});
    }

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
    }

    messageTips = (minCharge) => (
        Modal.alert('', <div className={styles.modalBody}>充值金额最少{minCharge}元</div>, [
            {text: <div className={styles.modalBtn}>我知道了</div>, onPress: () => console.log('知道了')}
        ])
    );

    //需要协议验证码回调方法

    //充值
    submit = (e) => {
        console.log('选中的银行',this.selectedBankList);
        let minCharge = this.selectedBankList ? this.selectedBankList.minCharge : this.props.depositModel.bankCardList.minCharge;
        if (isNaN(this.state.inputMoney)) {
            Toast.info("请输入正确的充值金额");
            return;
        }
        if (parseFloat(this.state.inputMoney) < parseFloat(minCharge)) {
            this.messageTips(minCharge);
            return;
        }
        //数据校验通过，保存充值信息
        //记录操作动作
        window.localStorage.setItem('operateType', Config.OPERATE_ENUM.DISPOSIT_KEY);
        localStorage.setItem(Config.OPERATE_ENUM.DISPOSIT_KEY, JSON.stringify({
            bankCardId: this.selectedBankList ? this.selectedBankList.id :this.props.depositModel.bankCardList.id,
            chargeAmt: this.state.inputMoney,
        }));

        //校验是否开通协议支付
        this.props.dispatch({
            type: 'depositModel/isSignedPay',
            payload: {
                client_id: "wechat",
                authToken: window.localStorage.getItem("token"),
                bankCardId: this.selectedBankList ? this.selectedBankList.id :this.props.depositModel.bankCardList.id
            }
        });
    };

    imgBankIcon = (bankIconUrl) => {
        return (
            <div className={styles.thumbBankDiv}>
                <img className={styles.thumbIcon} src={bankIconUrl}/>
            </div>
        )
    };

    //协议支付申请、发送验证码
    signedPayApply() {
        console.log('申请支付协议，发送验证码');
        this.props.dispatch({
            type: 'depositModel/signedPayApply',
            payload: {
                bankCardId: this.selectedBankList ? this.selectedBankList.id :this.props.depositModel.bankCardList.id
            }
        });
    }

    //协议支付确认
    signedPayConfirm(yzmText) {
        console.log('支付协议确认');
        console.log('交易编号', this.props.depositModel.tradeNo);
        this.props.dispatch({
            type: 'depositModel/signedPayConfirm',
            payload: {
                bankCardId: this.selectedBankList ? this.selectedBankList.id :this.props.depositModel.bankCardList.id,
                identifyingCode: yzmText,
                originTradeNo: this.props.depositModel.tradeNo
            }
        });
    }

    //内部验证，发送验证码
    sendTradeSms() {
        console.log('发送内部验证码')
        this.props.dispatch({
            type: 'depositModel/sendTradeSms',
            payload: {
                mobile: this.userInfo.mobile,
                type: Config.API_SEND_SMS_TYPE.TRADE_SMS,
                resType: Config.API_SMS_RES_TYPE.TEXT
            }
        });
    }

    validateSms(yzmText) {
        console.log('验证内部验证码' + yzmText);
        this.props.dispatch({
            type: 'depositModel/validateSms',
            payload: {
                mobile: this.userInfo.mobile,
                type: Config.API_SEND_SMS_TYPE.TRADE_SMS,
                resType: Config.API_SMS_RES_TYPE.TEXT,
                validateCode: yzmText
            }
        });
    }

    render() {
        let {bankCardList, availableAmt, agreementPayShow, isAgreementPay} = this.props.depositModel;
        let selectedBankList = this.props.location.state;
        const bankIconUrl = selectedBankList ? selectedBankList.iconUrl : bankCardList.iconUrl;
        const bankName = selectedBankList ? selectedBankList.bankName : bankCardList.bankName;
        const tailNo = selectedBankList ? selectedBankList.tailNo : bankCardList.tailNo;
        const deal = selectedBankList ? selectedBankList.deal : bankCardList.deal;
        const limit = selectedBankList ? selectedBankList.limit : bankCardList.limit;
        const minCharge = selectedBankList ? selectedBankList.minCharge : bankCardList.minCharge;
        const fuzzyBankMobile = selectedBankList ? selectedBankList.fuzzyBankMobile : bankCardList.fuzzyBankMobile;
        return (
            <div className={styles.deposit}>
                <BackHeader title="充值" backType="2" _this={this}/>
                <List className={styles.listBody}>
                    <Item className={styles.listItem}
                          arrow='horizontal'
                          onClick={() => {
                              Util.setBackUrl('selectBindBank');
                              this.props.history.push('/selectBindBank')
                          }}
                          thumb={this.imgBankIcon(bankIconUrl)} multipleLine>
                        <span className={styles.title}>{bankName}</span>
                        <Item.Brief style={{marginTop: '-3px'}}>
                            <span className={styles.subtitle}>尾号{tailNo} {deal}万/笔 {limit}万/日</span>
                        </Item.Brief>
                    </Item>
                    <Item className={styles.listItem} thumb={<ImgCoin/>} multipleLine>
                        <span className={styles.title}>可用余额 <span
                            className={styles.moneyColor}>{accounting.formatNumber(availableAmt, 2, ',', '.')}</span>元</span>
                    </Item>
                </List>
                <WhiteSpace size="xl"/>
                <List>
                    <InputItem className={styles.inputItem}
                               onChange={this.inputChange}
                               type="digit"
                               clear
                               placeholder={`最低${minCharge}元起`}
                    >充值金额</InputItem>
                </List>
                <WhiteSpace size="xl"/><WhiteSpace size="xl"/>
                <WingBlank size="lg">
                    <Button className={styles.btnSure}
                            disabled={this.state.disabledBtn}
                            onClick={this.submit.bind(this)}
                    >确认</Button>
                </WingBlank>
                {/*<WhiteSpace size="xl"/>*/}
                {/*<div className={styles.question} onClick={this.goQuestion.bind(this)}>*/}
                {/*<p className={styles.qMark}>?</p>*/}
                {/*<p className={styles.qText}>遇到问题</p>*/}
                {/*</div>*/}
                {agreementPayShow ?
                    <AgreementPayModal
                        visible={agreementPayShow}
                        isAgreementPay={isAgreementPay}
                        mobile={isAgreementPay ? fuzzyBankMobile : Util.formatMobile(this.userInfo.mobile)}
                        onSendVcode={isAgreementPay ? this.signedPayApply.bind(this) : this.sendTradeSms.bind(this)}
                        onClose={() => {
                            // this.setState({agreementPayShow: false});
                            this.props.dispatch({type: 'depositModel/agreementPayShowSwitch', payload: {isShow: false}})
                        }}
                        callBack={(yzm) => {
                            if (yzm) {
                                isAgreementPay ? this.signedPayConfirm(yzm) : this.validateSms(yzm);
                            }
                        }}/> : ''}
            </div>
        );
    }
}

Deposit.propTypes = {};

export default connect(({depositModel}) => ({depositModel}))(Deposit);

