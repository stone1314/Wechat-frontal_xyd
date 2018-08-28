/**
 * Created by abrahamchen on 2017/9/27.
 */
import React from 'react';
import PropTypes from 'prop-types';
// import ReactModal from 'react-modal';
import styles from './topicCell.less';


class TopicCell extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    renderAnswer(questionIndex, answers) {
        return (answers.map((item, answerIndex) => {
                let answerTick = item.isSelected ? styles.answerTick + ' iconfont icon-duigou' : styles.answerTick;
                return <div key={answerIndex} className={styles.answerRow }
                            onClick={() => this.props.selected(questionIndex, answerIndex)}
                            style={item.isSelected ? {backgroundColor: '#f6fafe'} : {backgroundColor: 'white'}}>
                            <div>
                                <button className={styles.answerTick}
                                        style={item.isSelected ? {backgroundColor: '#5696F5',} : {backgroundColor: 'white'}}>
                                    <i style={{fontSize: `${10 / 37.5}rem`}} className={ 'iconfont icon-duigou'}>
                                    </i></button>
                            </div>
                            <label className={styles.answerBody} style={item.isSelected ? {color: "#5696F5"} : {color: '#2D2D2D'}}>
                                {item.answer}
                            </label>
                        </div>
            }
        ))

    }

    render() {
        return (
            <div className={styles.root}>
                <div className={styles.questionRow}>
                    {this.props.questionData.question}
                </div>
                {this.renderAnswer(this.props.questionIndex, this.props.questionData.answers)}
                <div className={styles.blank}/>
            </div>

        );
    }
}

TopicCell.propTypes = {};

export default TopicCell;
