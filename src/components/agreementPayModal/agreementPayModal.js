/**
 * Created by leiz on 2018/7/25
 */

import React from 'react';
import {Modal} from 'antd-mobile';
import styles from './agreementPayModal.less';

/**
 *  visible: this.props.visible,   //弹框是否可见
 *  mobile: this.props.mobile,     //显示的手机号
 *  isAgreementPay: this.props.isAgreementPay, //是否是协议支付
 *  onSendVcode: this.props.onSendVcode,  //发送验证码事件
 *  onClose: this.props.onClose,   //关闭弹框事件
 *  callBack: this.props.callBack  //确定回调事件
 */
class AgreementPayModal extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isSendVcode: false,
            sendVcodeBtnText: '获取验证码'
        }
    }

    //关闭弹窗
    closeModal() {
        this.props.onClose();
    }

    sendVcode() {
        this.props.onSendVcode();
        let waitTime = 60;
        let timer = setInterval(() => {
            waitTime--;
            this.setState({sendVcodeBtnText: '获取验证码'});
            if (waitTime > 0) {
                this.setState({
                    sendVcodeBtnText: `${waitTime}秒后重发`,
                    isSendVcode: true
                });
            }
            else {
                this.setState({
                    sendVcodeBtnText: '获取验证码',
                    isSendVcode: false
                });
                clearInterval(timer);
            }
        }, 1000);
    }

    render() {
        return (
                <Modal
                    visible={this.props.visible}
                    transparent
                    maskClosable={false}
                    onClose={this.closeModal.bind(this)}
                    className={styles.customModal}
                    closable
                    title={
                        <div className={styles.title}>
                            <div className={styles.titleDesc}>验证码已发送至您的手机</div>
                            <div className={styles.titleTel}>{this.props.mobile}</div>
                        </div>
                    }
                    footer={[
                        {
                            text: '确定', onPress: () => {
                                let imgYzm = this.refs.yzmText.value;
                                if (imgYzm) {
                                    //校验验证码
                                    this.props.callBack(imgYzm)
                                }
                            }
                        }
                    ]}>
                    <div className={styles.toastContent}>
                        <div className={styles.toastCon}>
                            <input ref="yzmText" autoComplete="off" type="tel" maxLength="6" placeholder={'验证码'}
                                   className={styles.conText}/>
                            {
                                !this.state.isSendVcode ?
                                    <a onClick={this.sendVcode.bind(this)}>{this.state.sendVcodeBtnText}</a> :
                                    <div className={styles.vcodeTextDisabled}>{this.state.sendVcodeBtnText}</div>
                            }
                        </div>
                    </div>
                    {
                        this.props.isAgreementPay ?
                            <div className={styles.bottomTips}>
                                温馨提示：短信验证码由银行发送，将为您开通宝
                                付支付协议，支付安全便捷
                            </div> : ''
                    }
                </Modal>
        )
    }
};

AgreementPayModal.propTypes = {};

export default AgreementPayModal;