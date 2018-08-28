import React from 'react';
import PropTypes from 'prop-types';
// import ReactModal from 'react-modal';
import {Modal} from 'antd-mobile';
import styles from './ModalWX.less';
import copy from 'copy-to-clipboard';

class ModalWX extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    close() {
        copy('才米公社');
        this.props.close();
    }

    render() {
        return (
            <Modal
                transparent
                visible={this.props.isOpen}
                maskClosable={true}
                className={styles.wxroot}
                onClose={() => this.close()}
                title="长按复制并关注微信公众号"
                footer={[{
                    text: '复制',
                    onPress: () => {
                        this.close();
                    }
                }]}
                wrapProps={{onTouchStart: this.onWrapTouchStart}}
            >
                <div style={{height: 70, overflow: 'scroll',marginTop:10}}  onClick={() => this.close()}>
                    <div style={{marginTop:'20px'}}>
                        <span  className={styles.wxName}> 才米公社</span>
                    </div>

                </div>
            </Modal>
        );
    }
}

ModalWX.propTypes = {
    isOpen: PropTypes.bool,
    onClick: PropTypes.func,
};

export default ModalWX;
