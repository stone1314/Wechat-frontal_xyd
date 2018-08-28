import React from 'react';
import PropTypes from 'prop-types';
import {Modal} from 'antd-mobile';
import styles from './ModalImg.less';
import grayCross from '../../asserts/bankDepository/grayCross.png';
import dikouquan from '../../asserts/user/dikouquan@2x.png';
import  del from '../../asserts/main/X@2x.png';


class ModalImg extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }
     handleVal(){
        this.props.redirect(false);
    }

    render() {
        return (
            <Modal
                transparent={true}
                maskClosable={true}
                visible={this.props.isImgOpen}
                wrapProps={{onTouchStart: this.onWrapTouchStart}}
                onClose={() => this.handleVal()}
                style={{width: '400px'}}
                wrapClassName={styles.root}
            >
                <div style={{height: '356px', width: '330px'}} onClick={() => this.handleVal()}>
                    <div style={{textAlign:'right'}}><img className={styles.ximg}  src={del}></img></div>
                    <img className={styles.grayCross} src={dikouquan}/>
                </div>
            </Modal>
        );
    }
}

ModalImg.propTypes = {
    isImgOpen: PropTypes.bool,
    onClick: PropTypes.func,
};

export default ModalImg;
