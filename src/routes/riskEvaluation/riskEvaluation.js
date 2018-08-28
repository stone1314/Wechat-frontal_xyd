/**
 * Created by abrahamchen on 2018/6/21.
 */
import React from 'react';
import {connect} from 'dva';
import {Button, Toast} from 'antd-mobile';
import logo from '../../asserts/bankDepository/logo@2x.png'
import styles from './riskEvaluation.less';
import TopicCell from '../../components/topicCell/topicCell.js';
import questionData from '../../constants/riskQuestion.js';

import REService from '../../services/riskEvaluationServices';
import BackHeader from '../../components/backHeader/backHeader'


class RiskEvaluation extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            questionData: this.initSelect(questionData),
            totalScore: 0,
            answers: '',
            display: true,
        };
        this.authToken = '';
        this.selected = this.selected.bind(this);
    }

    componentWillMount() {
        let token = window.localStorage.getItem("token");
        this.authToken = token;
        let result = this.counterScoreAndAnswer(this.state.questionData);
        this.setState({
            ...result
        });
    }

    initSelect(questionData) {
        for (let qitem of questionData) {
            for (let aitem of qitem.answers) {
                aitem.isSelected = false;
            }
            //qitem.answers[0].isSelected = true;
        }
        return questionData;
    }

    countSelect(questionData) {
        let count = 0;
        for (let qitem of questionData) {
            for (let aitem of qitem.answers) {
                if (aitem.isSelected) {
                    count++;
                }
            }
        }
        if (count == questionData.length) {
            this.setState({display: false})
        }
    }

    convertAnswer(index) {
        var answer = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        return answer.charAt(index);
    }

    counterScoreAndAnswer(questionData) {
        let answers = '';
        let totalScore = 0;
        for (let questionItem of questionData) {
            let item = questionItem.answers;
            for (let ansIndex in item) {
                if (item[ansIndex].isSelected) {
                    answers = answers + this.convertAnswer(ansIndex);
                    totalScore = totalScore + item[ansIndex].score;
                }
            }
        }
        return {answers, totalScore};
    }

    selected(questionIndex, answerIndex) {
        this.setState((preState, props) => {
            let questionData = preState.questionData;
            let questionItem = questionData[questionIndex];
            for (let aitem of questionItem.answers) {
                aitem.isSelected = false;
            }
            questionItem.answers[answerIndex].isSelected = true;
            let result = this.counterScoreAndAnswer(questionData);
            console.log('questionData', questionData);
            console.log('...result', ...result);
            this.countSelect(questionData);
            return {questionData, ...result}
        })
    }

    renderList(questionData) {
        return (
            questionData.map((item, index) =>
                <TopicCell key={index} questionData={item} questionIndex={index}
                           selected={(questionIndex, answerIndex) => this.selected(questionIndex, answerIndex)}/>
            )
        )
    }

    nextStep() {
        let params = {
            authToken: this.authToken,
            score: this.state.totalScore,
            answer: this.state.answers,
            client_id: "wechat"
        };
        let headers = {'Content-Type': 'application/x-www-form-urlencoded'};
        let needLoading = true;
        console.log('params',params);
        REService.riskAssessment({headers, params, needLoading}).then((res) => {
            console.log('riskAssessment', res);
            if (res && res.data) {
                let resData = {...res.data, timestamp: res.timestamp, authToken: this.authToken}
                this.props.history.push({pathname: '/riskEvaluationResult', state: resData})
            }
            console.log(res)
        }).catch((error) => {
            console.log(error);
        })
    }

    render() {
        return (
            <div style={{width:'100%'}}>
                <BackHeader
                    title="风险承受能力评估"
                    backType="0"
                    _this={this}
                ></BackHeader>

                <div className={styles.root}>
                    {this.renderList(this.state.questionData)}
                    <Button
                        className={styles.nextButton}
                        onClick={() => this.nextStep()}
                        disabled={this.state.display}
                    >
                        提交评测
                    </Button>
                </div>
            </div>

        );
    }
}

RiskEvaluation.propTypes = {};

export default connect(({riskEvaluation}) => {
    return {REData: riskEvaluation};
})(RiskEvaluation);