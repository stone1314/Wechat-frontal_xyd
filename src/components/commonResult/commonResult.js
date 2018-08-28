/**
 * Created by leiz on 2018/7/25
 */

import React from 'react';
import {WingBlank, WhiteSpace, Flex, Button} from 'antd-mobile';
import styles from './commonResult.less';

const  AddBankResultComponent = (props) => {

    return (
        <div className={styles.main}>
            <Flex justify="center" className={styles.flexIcon}>
                <img className={styles.img} src={props.imgSrc}/>
            </Flex>
            <Flex justify="center" className={styles.flexBottom}>
                <div className={styles.desText}>{props.msg}</div>
            </Flex>

            <WhiteSpace size="xl"/><WhiteSpace size="xl"/>
            <WingBlank size="lg">
            <Button className={styles.btnSure}
                    onClick={props.backFn}
            >返回</Button>
        </WingBlank>
        </div>
    );
};

AddBankResultComponent.propTypes = {};

export default AddBankResultComponent;