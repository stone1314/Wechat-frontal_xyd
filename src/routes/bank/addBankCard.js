/**
 * Created by leiz on 2018/7/23 14:00.
 */
import React from 'react';
import {connect} from 'dva';
import {List, Button, InputItem, Checkbox, WhiteSpace, WingBlank, Toast, Modal} from 'antd-mobile';
import BackHeader from '../../components/backHeader/backHeader'
import styles from './addBankCard.less';
import * as Util from '../../utils/util'
import Constant from "../../constants/requestConstantValue";
import Config from '../../constants/constant';
import AgreementComponent from '../../components/agreement/agreementTpl';

const Item = List.Item;
const AgreeItem = Checkbox.AgreeItem;

class AddBankCard extends React.PureComponent {
    constructor(props) {
        super(props);
        //银行卡实体
        this.cardInfo = this.props.location.state;
        this.state = {
            name: window.localStorage.getItem('userInfo') ? JSON.parse(window.localStorage.getItem('userInfo')).identificationOwnerName : '',
            vcodeText: '获取验证码',
            isSendVcode: false,
            bankCardNo: '',
            bankMobile: '',
            validateCode: '',
            isGettingVoice: false,  //是否成功获取到语音验证码
            showImgVcode: false,
            imgValidateCode: '',
            isAgree: true,
            yzmType: Config.API_SMS_RES_TYPE.TEXT,
            showAgreement: false,
            ...this.cardInfo
        };
    }

    inputChange(type, value) {
        value = typeof(value) == 'string' ? value.replace(/ /g, '') : '';
        console.log(type, value)
        if (type == 'bankCard') {
            this.setState({
                bankCardNo: value
            })
        }
        if (type == 'phone') {
            this.setState({
                bankMobile: value
            })
        }
        if (type == 'yzm') {
            this.setState({
                validateCode: value
            })
        }
        if (type == 'imgVcode') {
            this.setState({
                imgValidateCode: value
            })
        }
    }

    //发送验证码
    sendVcode() {
        if (!Util.isPhoneCorrect(this.state.bankMobile)) {
            Toast.info('请填写正确的手机号');
            return;
        }
        //需要图形验证码
        this.setState({showImgVcode: true, yzmType: Config.API_SMS_RES_TYPE.TEXT});
        this.refreshImgVcode();
        return;
        //调接口发送短信
        // this.props.dispatch({
        //     type: 'addBankModel/sendSms',
        //     payload: {
        //         mobile: this.state.bankMobile,
        //         type: Config.API_SEND_SMS_TYPE.BIND_CARD,
        //         resType: Config.API_SMS_RES_TYPE.TEXT,
        //         callBack: (result) => {
        //             this.sendVcodeCallBack(result);
        //         }
        //     }
        // });
    }

    sendVcodeCallBack(result) {
        console.log('短信返回结果', result)
        if (result.resCode == '0000') {
            //成功
            let waitTime = 60;
            let timer = setInterval(() => {
                waitTime--;
                this.setState({vcodeText: '获取验证码'});
                if (waitTime > 0) {
                    this.setState({
                        vcodeText: `${waitTime}秒后重发`,
                        isSendVcode: true
                    });
                }
                else {
                    this.setState({
                        vcodeText: '获取验证码',
                        isSendVcode: false
                    });
                    clearInterval(timer);
                }
            }, 1000);
        }
        // if (result.resCode == '0359') {
        //     //需要图形验证码
        //     this.setState({showImgVcode: true, yzmType: Config.API_SMS_RES_TYPE.TEXT});
        //     this.refreshImgVcode();
        // }
    }

    //语音验证码
    sendVoiceVcode() {
        if (this.state.isGettingVoice) {
            return;
        }
        if (!Util.isPhoneCorrect(this.state.bankMobile)) {
            Toast.info('请填写正确的手机号');
            return;
        }
        let voiceParams = {
            mobile: this.state.bankMobile,
            type: Config.API_SEND_SMS_TYPE.BIND_CARD
        };
        let imgCallBack = (result) => {
            console.log(result)
            if (result.data.isImage == '1') {
                //需要图形验证码
                this.setState({showImgVcode: true, yzmType: Config.API_SMS_RES_TYPE.VOICE});
                this.refreshImgVcode();     // 弹出图形验证码，验证通过，发送语音验证码
            } else {
                //不弹出图形验证码，直接发送验证码
                this.props.dispatch({
                    type: 'addBankModel/sendSms',
                    payload: {
                        mobile: this.state.bankMobile,
                        type: Config.API_SEND_SMS_TYPE.BIND_CARD,
                        resType: Config.API_SMS_RES_TYPE.VOICE,
                        callBack: (result) => {
                            this.sendVoiceCallBack(result);
                        }
                    }
                });
            }
        };
        this.props.dispatch({
            type: 'addBankModel/isImageVal',
            payload: {...voiceParams, imgCallBack}
        });
    }

    sendVoiceCallBack(result) {
        console.log('发送语音验证码结果', result);
        if (result.resCode == '0000') {
            let waitTime = 30;
            let timer = setInterval(() => {
                waitTime--;
                this.setState({isGettingVoice: true});
                if (waitTime > 0) {
                    this.setState({isGettingVoice: true});
                }
                else {
                    this.setState({isGettingVoice: false});
                    clearInterval(timer);
                }
            }, 1000);
        }
    };

    //校验图形验证码
    checkImgVcode(imgYzm) {
        //TODO 调用接口 验证验证码是否正确
        this.props.dispatch({
            type: 'addBankModel/validateSms',
            payload: {
                mobile: this.state.bankMobile,
                type: Config.API_SEND_SMS_TYPE.BIND_CARD,
                validateCode: imgYzm.toUpperCase(),
                resType: Config.API_SMS_RES_TYPE.IMAGE,
                callBack: (result) => {
                    console.log('校验图形验证码结果', result);
                    // 正确：1、关闭对话框；
                    this.setState({showImgVcode: false})
                    if (this.state.yzmType == Config.API_SMS_RES_TYPE.TEXT) {   //发送短信
                        console.log('发送文本验证码', imgYzm);
                        //发送短信接口
                        this.props.dispatch({
                            type: 'addBankModel/sendSms',
                            payload: {
                                mobile: this.state.bankMobile,
                                type: Config.API_SEND_SMS_TYPE.BIND_CARD,
                                imgCode: imgYzm,
                                resType: Config.API_SMS_RES_TYPE.TEXT,
                                callBack: (result) => {
                                    this.sendVcodeCallBack(result);
                                }
                            }
                        });
                    }
                    if (this.state.yzmType == Config.API_SMS_RES_TYPE.VOICE) {    //发送语音短信
                        console.log('发送语音验证码', imgYzm);
                        //发送语音接口
                        this.props.dispatch({
                            type: 'addBankModel/sendSms',
                            payload: {
                                mobile: this.state.bankMobile,
                                type: Config.API_SEND_SMS_TYPE.BIND_CARD,
                                imgCode: imgYzm,
                                resType: Config.API_SMS_RES_TYPE.VOICE,
                                callBack: (result) => {
                                    this.sendVoiceCallBack(result);
                                }
                            }
                        });
                    }
                }
            }
        });
    }

    //刷新图形验证码
    refreshImgVcode() {
        let imgUrl = `${Constant.API_HOST}${Constant.REFRESH_IMG}?mobile=${this.state.bankMobile}&type=${Config.API_SEND_SMS_TYPE.BIND_CARD}&resType=${Config.API_SMS_RES_TYPE.IMAGE}&client_id=wechat&rnd=${Math.random()}`;
        this.setState({
            imgSrc: imgUrl,
        })
    }

    //绑卡提交
    submit() {
        //检查字段输入
        if (!this.checkData()) {
            return;
        }
        //TODO 绑卡操作
        //1、校验验证码是否正确
        this.props.dispatch({
            type: 'addBankModel/validateSms',
            payload: {
                mobile: this.state.bankMobile,
                type: Config.API_SEND_SMS_TYPE.BIND_CARD,
                validateCode: this.state.validateCode,
                resType: this.state.yzmType,
                callBack: (result) => {
                    if (result.resCode == '0000') {
                        this.bindCard(result);
                    }
                }
            }
        });
    }

    //开始绑卡
    bindCard(result) {
        this.props.dispatch({
            type: 'addBankModel/bindCard',
            payload: {
                bankCardNo: this.state.bankCardNo,
                bankId: this.state.bankId,
                bankName: this.state.bankName,
                bankMobile: this.state.bankMobile,
                callBack: (result) => {
                    if (result.resCode == '0000') {
                        //跳转成功页面
                        this.props.history.push({
                            pathname: '/addBankResult',
                            state: {
                                isBindSuccess: true,
                                msg: '操作成功'
                            }
                        });
                    } else {
                        //跳转失败页面，并显示失败原因
                        this.props.history.push({
                            pathname: '/addBankResult',
                            state: {
                                isBindSuccess: false,
                                msg: `操作失败[${result.resMsg}]`
                            }
                        });
                    }
                }
            }
        })
    }

    checkData() {
        if (!this.state.bankId) {
            Toast.info("请选择所属银行!");
            return false;
        }
        if (!this.state.bankCardNo) {
            Toast.info('请输入正确的银行卡号');
            return false;
        }
        if (!this.state.bankMobile && !Util.isPhoneCorrect(this.state.bankMobile)) {
            Toast.info('请输入正确的手机号');
            return false;
        }
        if (!this.state.validateCode) {
            Toast.info('请先输入验证码');
            return false;
        }
        if (!this.state.isAgree) {
            Toast.info('请先同意快捷支付服务协议');
            return false;
        }
        return true;
    }
    //展示协议
    showAgreements(atype) {
        console.log(atype)
        let agreementCode = '';
        if (atype == 'kj') {
            agreementCode = Config.AGREEMENTCODE.kuaiJieDoc;
        }
        if (atype == 'wt') {
            agreementCode = Config.AGREEMENTCODE.delegateDoc;
        }
        this.props.dispatch({
            type: 'addBankModel/getAgreement',
            payload: {
                agreementCode: agreementCode
            }
        });
    }
    //隐藏协议
    hideAgreements() {
        this.props.dispatch({
            type: 'addBankModel/closeAgreement'
        });
    }

    render() {
        return (
            <div className={styles.main}>
                <BackHeader title="添加银行卡" backType="0" _this={this}/>
                <WhiteSpace size='lg'/>
                <List>
                    <InputItem
                        value={this.state.name}
                        editable={false}
                    >持卡人</InputItem>
                    <Item arrow='horizontal' onClick={() => {
                        this.props.history.push('/belongBank');
                    }}>
                        所属银行
                        {
                            this.state.iconUrl ?
                                <span className={styles.bankChoseName}>
                            <img className={styles.bankChoseImg} src={this.state.iconUrl}/>{this.state.bankName}
                            </span> : ''
                        }
                    </Item>
                    <InputItem
                        type="bankCard"
                        maxLength="23"
                        clear
                        onChange={this.inputChange.bind(this, 'bankCard')}
                        placeholder="请输入储蓄卡号"
                    >卡号</InputItem>
                    <InputItem
                        type="phone"
                        clear
                        onChange={this.inputChange.bind(this, 'phone')}
                        placeholder="请输入银行预留手机号"
                    >手机号</InputItem>
                    <InputItem
                        type="number"
                        maxLength="6"
                        clear
                        onChange={this.inputChange.bind(this, 'yzm')}
                        placeholder="请输入验证码"
                        extra={
                            !this.state.isSendVcode ?
                                <div className={styles.vcodeText}
                                     onClick={this.sendVcode.bind(this)}>{this.state.vcodeText}</div> :
                                <div className={styles.vcodeTextDisabled}>{this.state.vcodeText}</div>
                        }
                    >验证码</InputItem>
                </List>
                {this.state.isSendVcode ?
                    <div className={styles.vcodeSendTip}>
                        <span>已向{this.state.bankMobile}发送验证码，请注意查收</span>
                    </div> : ''}
                <WhiteSpace/>
                <div className={styles.agreement}>
                    <AgreeItem data-seed="logId" defaultChecked
                               onChange={e => this.setState({isAgree: e.target.checked})}>
                        <div className={styles.text}>
                            我已阅读并同意
                            <a onClick={(e) => {
                                e.preventDefault();
                                this.showAgreements('kj')
                                // this.props.history.push(`/agreementBank/kj`);
                            }}><span className={styles.color}>《快捷支付服务协议》</span></a>
                            与
                            <a onClick={(e) => {
                                e.preventDefault();
                                this.showAgreements('wt')
                                // this.props.history.push(`/agreementBank/wt`);
                            }}><span className={styles.color}>《委托划扣服务协议》</span></a>
                        </div>
                    </AgreeItem>
                </div>
                <WhiteSpace size="lg"/><WhiteSpace size="lg"/>
                <WingBlank size="lg">
                    <Button className={styles.btnSure}
                            disabled={false}
                            onClick={this.submit.bind(this)}
                    >确认</Button>
                </WingBlank>
                <WhiteSpace/>
                <div className={styles.voiceMsg} onClick={this.sendVoiceVcode.bind(this)}>
                    {!this.state.isGettingVoice ?
                        <p>短信收不到?点此接收语音验证码</p> :
                        <p className={styles.qText}>电话拨打中…请留意接听</p>
                    }
                </div>
                {/*图形验证码*/}
                <Modal
                    visible={this.state.showImgVcode}
                    transparent
                    maskClosable={false}
                    onClose={() => {
                    }}
                    title="请输入图形验证码"
                    footer={[
                        {
                            text: '取消', onPress: () => {
                                this.setState({showImgVcode: false})
                            }
                        },
                        {
                            text: '确定', onPress: () => {
                                let imgYzm = this.refs.yzmText.value;
                                if (imgYzm) {
                                    //校验图形验证码
                                    this.checkImgVcode(imgYzm);
                                }
                            }
                        }
                    ]}>
                    <div className={styles.toastContent}>
                        <div className={styles.toastCon}>
                            <input ref="yzmText" autoComplete="off" type="text" maxLength="4" placeholder={'验证码'}
                                   className={styles.conText}/>
                            <img id="yzmImg" src={this.state.imgSrc} className={styles.conImg}
                                 onClick={this.refreshImgVcode.bind(this)}/>
                        </div>
                    </div>
                </Modal>
                {/*显示协议：此方式打开协议，返回后，不刷新页面，输入数据会保留*/}
                <AgreementComponent {...this.props.addBankModel} isShow={this.props.addBankModel.isShowAgreement}
                                    onClose={this.hideAgreements.bind(this)}/>
            </div>
        )
    }
}

AddBankCard.propTypes = {};

export default connect(({addBankModel}) => ({addBankModel}))(AddBankCard);