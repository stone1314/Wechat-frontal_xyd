/**
 * Created by abrahamchen on 2018/6/21.
 */
import React from 'react';
import {connect} from 'dva';
import {Button, Toast} from 'antd-mobile';
import faliureIco from '../../asserts/bankDepository/faliure@2x.png';
import shalouIco from '../../asserts/bankDepository/shalou@2x.png';
import tickIco from '../../asserts/bankDepository/tick@2x.png';
import styles from './bankDepositoryResultPage.less';
import BDSService from '../../services/bankDepositoryServices';


class BankDepositoryResultPage extends React.PureComponent {
    constructor(props) {
        super(props);
        console.log('BankDepositoryResultPage', this.props);

        this.state = {
            dpState: this.props.location.state.tradeStatus,   //'20'正在拉取中， ‘30’ 成功  ’40‘失败
        };
        console.log('BankDepositoryResultPage-state', this.state);
        this.nextStep = this.nextStep.bind(this);
    }

    nextStep() {
        console.log('nextStep', this.props);
           let location = window.parent.location;
        switch (this.state.dpState) {
            case '20' :
                location.href = `${location.origin}${location.pathname}#/MyLends`;
                break;
            case '30': 
                location.href = `${location.origin}${location.pathname}#/riskEvaluation`;
                break;
            case '40' :
                location.href = `${location.origin}${location.pathname}#/MyLends`;
                break;
            default:
        }
    }

    render() {
        console.log('BankDepositoryResultPage--render', this.props);
        console.log('BankDepositoryResultPage--state', this.state);
        let titleIco = shalouIco;
        let prompt = '操作处理中';
        let btnText = '去查看';
        if (this.state.dpState === '30') {
            titleIco = tickIco;
            prompt = '操作成功，请点击【下一步】完成操作';
            btnText = '下一步'
        } else if (this.state.dpState === '40') {
            titleIco = faliureIco;
            prompt = '操作失败';
            btnText = '返回';
        }

        return (
            <div className={styles.root}>
                <img className={styles.resultIco} src={titleIco} alt=''/>
                <label className={styles.prompt}>{prompt}</label>
                <Button
                    className={styles.nextButton}
                    onClick={() => this.nextStep()}
                    disabled={false}
                >
                    {btnText}
                </Button>
            </div>
        );
    }
}

BankDepositoryResultPage.defaultProps = {
    BDRPData: {prompt: '操作成功，请点击【下一步】完成操作', btnText: '下一步',}
}

BankDepositoryResultPage.propTypes = {};

export default BankDepositoryResultPage;
// connect(({ BankDepositoryResultPage }) => {
//   return { BDRPData: BankDepositoryResultPage };
// })(BankDepositoryResultPage);