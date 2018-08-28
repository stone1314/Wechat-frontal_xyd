/**
 * Created by leiz on 2018/7/25
 */

import React from 'react';
import styles from './agreementTpl.less';
import {Icon} from 'antd-mobile'

const AgreementComponent = (props) => {
    let backToPage = (e) => {
        props.onClose();
    };
    return (
        <div className={props.isShow?styles.agreementMainShow:styles.agreementMainHide}>
            <div className={styles.backBar}>
                <Icon size="lg" type="left" style={{width: '29px'}} onClick={backToPage.bind(this)}/>
                <div className={styles.backImgText} onClick={backToPage.bind(this)}>返回</div>
                <div className={styles.backTitle}>{props.agreementTitle}</div>
            </div>
            <pre className={styles.userNotice} dangerouslySetInnerHTML={{__html: props.agreementDoc}}>
            </pre>
        </div>
    );
};

AgreementComponent.propTypes = {};

export default AgreementComponent;