/**
 * Created by HaihuaHuang on 2018/7/23.
 */

import React from 'react';
import {connect} from 'dva';
import {Button, Toast, Modal} from 'antd-mobile';
import styles from './xydBankDepositoryPage.less';
import BackHeader from '../../components/backHeader/backHeader'
import  banklogo from  '../../asserts/bankDepository/banklogo@2x.png';
import faliureIco from '../../asserts/bankDepository/faliure@2x.png';
import  reg from '../../utils/regUtil';
import  Config from '../../constants/constant';
import  {setPwd} from '../../utils/util';
import AgreementComponent from '../../components/agreement/agreementTpl';

class XydBankDepositoryPage extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state =
            {
                disabled: true,
                name: '',
                cardId: '',
                time: 5, //设置密码后的5秒倒计时,
                faildModal: true,
                successModal: true,

            }
    }

    componentDidMount() {
        if (this.props.xydBankModel && this.props.xydBankModel.resCode == '0000') {
            console.log('componentDidMount');
            //  this.setTime();
        }
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
        console.log(this.props);
        if (nextProps.xydBankModel && nextProps.xydBankModel.resCode == '0000') {
            if (this.state.time == 5) {
                this.setTime();
            }
        }
    }

    picture() {
        return (
            <div className={styles.bank}>
                <img src={banklogo}></img>
            </div>
        );
    }

    getName = (e) => {
        this.setState({name: e.target.value})
        if (this.state.name && this.state.cardId) {
            console.log(this.state.name, this.state.cardId)
            this.setState({disabled: false})
        }
    }
    getCardId = (e) => {
        this.setState({cardId: e.target.value})
        if (this.state.name && this.state.cardId) {
            console.log(this.state.name, this.state.cardId)
            this.setState({disabled: false})
        }
    }

    setTime = () => {
        let timer = setInterval(() => {
            let newTime = this.state.time;
            newTime--;
            console.log(newTime);
            if (newTime > 0) {
                this.setState({time: newTime});
            }
            else if (newTime == 0) {
                setPwd(this);
                clearInterval(timer);
            }
        }, 1000);

    }

    onClose = () => {
        this.setState({modal: false})
    }

    openBank() {
        if (!reg.identityCard.test(this.state.cardId)) {
            Toast.info('请输入正确的身份证号！');
            this.refs.cardId.focus();
            return;
        }
        this.props.dispatch({
            type: 'xydBankModel/openBank',
            payload: {name: this.state.name, cardId: this.state.cardId}
        });
    }

    //展示协议
    showAgreements(atype) {
        console.log(atype)
        let agreementCode = '';

        if(atype=='depositoryDoc'){
            agreementCode=Config.AGREEMENTCODE.depositoryDoc;
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

    content() {
        return (
            <div className={styles.content}>
                <div className={styles.block}>
                    <div className={styles.row}>
                        <div className={styles.title}>姓名</div>
                        <input type="text"
                               ref='name'
                               placeholder="请填写真实姓名"
                               onChange={this.getName.bind(this)}
                               value={this.state.name}
                        />
                    </div>
                    <hr className={styles.itemLeft}/>
                    <div className={styles.row}>
                        <div className={styles.title}>身份证号</div>
                        <input type="text" style={{width: '70%'}}
                               ref='cardId'
                               maxLength={18} placeholder="请填写本人身份证号码"
                               value={this.state.cardId}
                               onChange={this.getCardId.bind(this)}
                        />
                    </div>
                </div>
                <div className={styles.note} onClick={() => {
                    //this.props.history.push(`/agreementBank/depositoryDoc`);
                    this.showAgreements('depositoryDoc')
                }}>
                    <a>资金存管委托协议</a>
                </div>



                <div className={styles.note}>
                    <Button className={styles.nextButton} disabled={this.state.disabled}
                            onClick={() => {
                                //setPwd(this);
                                this.openBank();
                                this.setState({successModal: true})
                                this.setState({faildModal: true})
                            }}>同意以上协议，下一步</Button>
                </div>
            </div>
        );
    }

    modal() {
        console.log(this.props.xydBankModel);
        if (this.props.xydBankModel && this.props.xydBankModel.resCode == '0000') {
            return (
                <Modal
                    className={styles.modalBank}
                    visible={this.state.successModal}
                    transparent
                    maskClosable={false}
                    onClose={this.onClose.bind(this)}
                    title={
                        <div className={styles.scroll}>
                            <div className={styles.bottom}>
                                <button >
                                    <i className={ 'iconfont icon-duigou'}> </i>
                                </button>
                            </div>
                            恭喜您，已成功开通恒丰银行存管账户
                        </div>
                    }
                    footer={[{
                        text: `（${this.state.time}s)设置交易密码`, onPress: () => {
                            setPwd(this);
                            this.setState({successModal: false});
                        }
                    }]}
                >
                    <div className={styles.content}>5s后将进入恒丰银行系统设置交易密码</div>
                </Modal>
            )
        } else if (this.props.xydBankModel && this.props.xydBankModel.resCode && this.props.xydBankModel.resCode != '0000') {

            return (
                <Modal
                    className={styles.modalBank}
                    visible={this.state.faildModal}
                    transparent
                    maskClosable={false}
                    onClose={this.onClose.bind(this)}
                    title={
                        <div>
                            <div><img src={faliureIco}></img></div>
                            开户失败：
                        </div>
                    }
                    footer={[{
                        text: '确定', onPress: () => {
                            this.setState({faildModal: false});
                        }
                    }]}
                >
                    <div className={styles.content}>{this.props.xydBankModel.resMsg}</div>
                </Modal>
            )
        }
    }


    render() {

        return (
            <div className={styles.root}>
                <BackHeader
                    title="开通存管"
                    backType="0"
                    _this={this}
                ></BackHeader>
                {this.picture()}
                {this.content()}
                {this.modal()}
                {/*显示协议：此方式打开协议，返回后，不刷新页面，输入数据会保留*/}
                <AgreementComponent {...this.props.addBankModel} isShow={this.props.addBankModel.isShowAgreement}
                                    onClose={this.hideAgreements.bind(this)}/>
            </div>
        );
    }
}

XydBankDepositoryPage
    .propTypes = {};

export
default

connect(
    ({
         xydBankModel,addBankModel
     }) => {
        return {xydBankModel,addBankModel};
    }
)
(XydBankDepositoryPage);