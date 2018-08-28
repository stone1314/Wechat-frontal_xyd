/**
 * Created by HaihuaHuang on 2018/7/23.
 */
import React from 'react';
import PropTypes from 'prop-types';
// import ReactModal from 'react-modal';
import {Modal} from 'antd-mobile';
import styles from './ModalMsg.less';
import grayCross from '../../asserts/bankDepository/grayCross.png';


class ModalMsg extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    close() {
        this.props.close();
    }
    handle(){
        this.props.openMsgHandle();
    }

    render() {
        console.log(this.props.isMsgOpen)
        return (
            <Modal
                // popup
                className={styles.ModalMsg}
                transparent={true}
                visible={this.props.isMsgOpen}
                onClose={() => this.close()}
                // wrapClassName={styles.root}
                // maskClosable={true}
                animationType="fade"
            >
                <div className={styles.content}>

                    <label className={styles.contentText}>{this.props.content}</label>

                    <div style={{width: '100%'}}>
                        <button className={styles.btn1} onClick={() => {
                            this.close();
                        }}>取消
                        </button>
                        <button className={styles.btn2} onClick={()=>{
                            this.handle();
                        }}>确定</button>
                    </div>
                </div>
            </Modal>
        );
    }
}

ModalMsg.propTypes = {
    isOpen: PropTypes.bool,
    onClick: PropTypes.func,
};

export default ModalMsg;
