/**
 * Created by abrahamchen on 2018/6/21.
 */
import React from 'react';
import {connect} from 'dva';
import {Button, Toast} from 'antd-mobile';
import logo from '../../asserts/bankDepository/logo@2x.png'
import styles from './bankDepositoryPage.less';
import ReactModal from '../../components/modalInfo/ModalInfo'
import BackHeader from '../../components/backHeader/backHeader'
import BankDepositoryServices from '../../services/bankDepositoryServices';
import Config from '../../constants/constant'

class BankDepositoryPage extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            depositoryHtml: "",
        };
    }

    componentWillMount() {
        this.openhfAccount();
    }

    openhfAccount = () => {
        this._isMounted = true;
        // let param = {client_id:"wechat",authToken:window.localStorage.getItem("token")};
        let param = {client_id: "wechat", authToken: window.localStorage.getItem("token")};
        BankDepositoryServices.openhfAccount(param, true).then((res) => {
            console.log('BankDepositoryServices', res);
            if (res.resCode === '0000') {
                window.localStorage.setItem('operateType', Config.OPERATE_ENUM.OPENACCOUNT_KEY)
                if (this._isMounted) {
                    console.log('this._isMounted', this._isMounted);
                    this.setState({
                        depositoryHtml: res.data.result
                    })
                }
            } else if (res.resCode === '888888') {
                //刷新token成功，重新查询数据
                this.openhfAccount();
            } else if (res.resCode === '999999') {
                //刷新token失败，跳转至登录页面
                this.props.history.push({pathname: './login'});
            } else {
                Toast.fail(res.resMsg);
            }
        }).catch((err) => {
            console.log(err);
        })
    }

    componentWillUnmount = () => {
        this._isMounted = false;
    }

    render() {
        let html = null;
        if (this.state.depositoryHtml) {
            html = (<iframe srcDoc={this.state.depositoryHtml}></iframe>);
        }


        console.log('+++++++++++++++++++++++++++++++++++++')
        return (
            <div className={styles.root}>
                <BackHeader
                    title="开通存管"
                    backType="2"
                    _this={this}
                ></BackHeader>
                <div className={styles.ldContent}>
                    {html}
                </div>
            </div>
        );
    }
}

BankDepositoryPage.propTypes = {};

export default connect(({BankDepositoryPage}) => {
    return {BDPData: BankDepositoryPage};
})(BankDepositoryPage);