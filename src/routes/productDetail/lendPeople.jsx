/**
 * created by bingdu 2018.08.7
 */

import  React from 'react';
import {connect} from 'dva';
import styles from './lendPeople.less';
import {Toast} from 'antd-mobile';
import BackHeader from '../../components/backHeader/backHeader'



class LendPeople extends React.Component{
    constructor(props){
        super(props);
        this.state = {

        };
    }
    componentWillMount(){
        this.props.dispatch({type:'lecaiProductSelect/getProductSale',payload:{pid:this.props.lecaiProductSelect.productDetail.pid,client_id:"wechat"}})
    }
    renderBody = () =>{
        let arr = [];
        let lendPeoples = this.props.lecaiProductSelect.lendPeoples;
        for(let i=0;i<lendPeoples.length;i++){
            let obj = lendPeoples[i];
            arr.push(
                <div className={styles.line}>
                    <div className={styles.lineOne}><span>{obj.mobile}</span><span>{obj.contractAmt}</span></div>
                    <div className={styles.lineTwo}>{obj.txTime}</div>
                </div>
            )
        }
        return arr;
    }

    render(){
        return(
            <div className={styles.main}>
                <BackHeader
                    title="出借人数"
                    backType="0"
                    _this={this}
                ></BackHeader>
                <div className={styles.body}>
                    {this.renderBody()}
                </div>
            </div>
        )

    }

}
LendPeople.propTypes = {};

export default connect(({lecaiProductSelect}) => {
    return {
        lecaiProductSelect
    };
})(LendPeople);
