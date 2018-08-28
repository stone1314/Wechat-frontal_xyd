/**
 * created by bingdu 2018.06.14
 */

import  React from 'react';
import {connect} from 'dva';
import styles from './chooseBank.less';
import {Toast} from 'antd-mobile';
import BackHeader from '../../components/backHeader/backHeader'
import BankList from '../../components/bankList/bankList'



class ChooseBank extends React.Component{
    constructor(props){
        super(props);
        this.state = {
        };
    }
    componentWillMount() {
        this.props.dispatch({type: 'depositModel/getBankList'});
    }
    /**
     * 选择银行卡回调
     * @param cardInfo 银行卡信息
     */
    onClickCard = (cardInfo) =>{
        this.props.dispatch({type:'depositModel/reData',payload:{bankInfo:cardInfo}});
    }
    /**
     * 点击添加银行卡回调
     */
    onClickAdd = () =>{
        this.props.history.push('/addBankCard');
    }

    render(){
        let cardInfos = null;
        if(this.props.depositModel.bankList){
            cardInfos = this.props.depositModel.bankList;
        }
        return(
            <div className={styles.main}>
                <BackHeader
                    title="我的银行卡"
                    backType="0"
                    _this={this}
                ></BackHeader>
                <div className={styles.bodyDiv}>
                    <BankList
                        cardInfos = {cardInfos}
                        onClickCard = {this.onClickCard.bind(this)}
                        onClickAdd = {this.onClickAdd.bind(this)}
                    />
                </div>

            </div>
        )

    }

}
ChooseBank.propTypes = {};

export default connect(({chooseBank,depositModel}) => {
    return {
        chooseBank,depositModel
    };
})(ChooseBank);
