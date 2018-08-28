/**
 * Created by abrahamchen on 2017/9/27.
 */
import React from 'react';
import PropTypes from 'prop-types';
// import ReactModal from 'react-modal';
import {Modal} from 'antd-mobile';
import styles from './ModalInfo.less';
import grayCross from '../../asserts/bankDepository/grayCross.png';


class ModalInfo extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    close() {
        this.props.close();
    }

    render() {
        console.log(this.props.isOpen)
        return (
            <Modal
                popup
                className ={'Modalinfo'}
                transparent={true}
                visible={this.props.isOpen}
                onClose={() => this.close()}
                wrapClassName={styles.root}
                maskClosable={true}
                animationType="slide-up"
            >
                <div className={styles.content}>
                    <label className={styles.title}>{this.props.title}</label>
                    <div className={styles.sep}/>
                    <label className={styles.contentText}>{this.props.content}</label>
                    <img className={styles.grayCross} src={grayCross} onClick={() => this.close()} alt=""/>
                </div>
            </Modal>
        );
    }
}

ModalInfo.propTypes = {
    isOpen: PropTypes.bool,
    onClick: PropTypes.func,
};

export default ModalInfo;
