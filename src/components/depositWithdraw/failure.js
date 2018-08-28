/* eslint-disable no-dupe-keys */
/**
 * Created by leizhao on 2018/6/20.
 */

import React from 'react';
import {WingBlank, WhiteSpace, Flex, List, Button} from 'antd-mobile';
import styles from './failure.less';

class Failure extends React.Component {
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
                    <div className={styles.desText}>{this.props.msg}</div>
                </Flex>

                <WhiteSpace size="xl"/><WhiteSpace size="xl"/>
                <WingBlank size="lg">
                    <Button className={styles.btnSure}
                            onClick={this.props.backFn}
                    >返回</Button>
                </WingBlank>
            </div>
        );
    }
}

export default Failure;

