/**
 * Created by abrahamchen on 2018/6/21.
 */
import React from 'react';
import {connect} from 'dva';
import {Button, Toast} from 'antd-mobile';
import logo from '../../asserts/bankDepository/logo@2x.png'
import styles from './riskEvaluationResult.less';
import BackHeader from '../../components/backHeader/backHeader'
import REService from '../../services/riskEvaluationServices';

class RiskEvaluationResult extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            result: {},
        };
    }

    componentWillMount() {
        if (this.props.location.state) {
            this.setState({
                result: this.props.location.state,
            })
        }
    }

    renderwhy() {
        let dataArray = [
            {
                question: '为什么要做评估？',
                answer: '为保障投资人的利益，投资人在投资前需要进行风险承受能力评估。'
            }, {
                question: '评估结果有什么用？',
                answer: '评测结果适用才米公社上所有产品，为了为你提供更好的资产选择，请认真作答。'
            }, {
                question: '多久做一次评估？',
                answer: '本风险承受能力评估有效期为一年，请及时更新评估。'
            }];
        return dataArray.map((item, index) => {
            return <div key={index} className={styles.QAcontainer}>
                <div className={styles.QAQ}>{item.question}</div>
                <div className={styles.QAA}>{item.answer}</div>
            </div>

        })
    }

    nextStep() {
        this.props.history.replace({pathname: '/riskEvaluation'})
    }

    render() {
        let now = new Date().getTime();
        let timestamp = new Date(parseInt(this.state.result.timestamp));
        timestamp.setMonth(timestamp.getMonth() + 6);
        let overTime = false;
        if (timestamp < now) {
            overTime = true;
        }
        let overTimeDate = new Date(timestamp).toLocaleDateString();
        overTimeDate = overTimeDate.replace(/\//g, '.');
        console.log(overTimeDate);

        return (
            <div className={styles.root}>
                <BackHeader
                    title="我的风险评估结果"
                    backType="2"
                    _this={this}
                    style={{width:'100%'}}
                ></BackHeader>
                <div className={styles.promptContainer}>
                    <div className={styles.picturePromptContainer}>
                        <label className={styles.PPCTitle}>
                            您的风险评估结果为
                        </label>
                        <label className={styles.PPCResult}>
                            {this.state.result.level}
                        </label>
                        <label className={styles.PPCResultSmall}>
                            {this.state.result.hint}
                        </label>
                        <div className={styles.PPCResultTimeC}>
                            <label className={styles.PPCResultTime}>
                                {`本评测有效期至${overTimeDate}`}
                                {overTime
                                    ? <label className={styles.PPCResultOut}>{"已过期"}</label>
                                    : null}
                            </label>
                            <div className={styles.reEvaBtn} onClick={() => this.nextStep()}>
                                重新评测
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className={styles.introduce}>风险承受能力评估说明：</div>
                    <div className={styles.sep}></div>
                    {this.renderwhy()}
                </div>
            </div>
        );
    }
}

RiskEvaluationResult.propTypes = {};

export default connect(({RiskEvaluationResult}) => {
    return {RERData: RiskEvaluationResult};
})(RiskEvaluationResult);