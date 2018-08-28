/* eslint-disable no-dupe-keys */
/**
 * Created by leizhao on 2018/6/20.
 */

import React from 'react';
import {WingBlank, WhiteSpace, Flex, List, Button} from 'antd-mobile';
import styles from './success.less';

class Success extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={styles.main}>
                <Flex justify="center" className={styles.flexIcon}>
                    <img className={styles.img} src={this.props.imgSrc}/>
                </Flex>
                <Flex justify="center" className={styles.flexBottom}>
                    <div className={styles.desText}>{this.props.desText}</div>
                </Flex>
                <Flex justify="center">
                    <div className={styles.moneyText}>￥{this.props.moneyText}元</div>
                </Flex>
                <WhiteSpace size="xl"/><WhiteSpace size="xl"/>
                <div className={styles.bankText}>
                    <div className={styles.innerText}>
                        {this.props.arrivalText ? <p>可到账：{this.props.arrivalText}元</p> : ''}
                        <p>银行卡：{this.props.bankName} | 尾号{this.props.tailNo}</p>
                    </div>
                </div>
                <WhiteSpace size="xl"/><WhiteSpace size="xl"/>
                <WingBlank size="lg">
                    <Button className={styles.btnSure}
                            onClick={this.props.backFn}
                    >查看账户</Button>
                </WingBlank>
            </div>
        );
    }
}

export default Success;

