/**
 * created by bingdu 2018.06.14
 */

import  React from 'react';
import {connect} from 'dva';
import styles from './bankList.less';
import { Button,Toast} from 'antd-mobile';
import BankLine from './bankLine'

class BankList extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            bankId:0,
        };
    }
    static defaultProps = {
        cardInfos:null,//银行卡信息数组
        onClickCard:null,//选择银行卡回调方法
        onClickAdd:null,//点击添加银行卡回调方法
        isShow:true,//是否显示添加银行卡
    };

    /**
     * 回调方法
     * @param cardInfo 银行卡信息
     */
    onclick = (cardInfo) =>{
        if(this.props.onClick){
            this.props.onClick(cardInfo);
        }
    }
    renderBankList = () =>{
        let cardInfos = this.props.cardInfos;
        //测试数据
        // let cardInfos = [{
        //     id:50001,
        //     deal:10000,
        //     limit:10000,
        //     tailNo:10001,
        //     bankName:"中国工商银行",
        //     iconUrl:"http://172.16.250.165:6060//img/102qk004078.png"
        // },{
        //     id:50002,
        //     deal:20000,
        //     limit:20000,
        //     tailNo:10002,
        //     bankName:"中国建设银行",
        //     iconUrl:"http://172.16.250.165:6060//img/102qk004078.png"
        // },{
        //     id:50003,
        //     deal:30000,
        //     limit:30000,
        //     tailNo:10003,
        //     bankName:"中国农业银行",
        //     iconUrl:"http://172.16.250.165:6060//img/102qk004078.png"
        // }];
        let arr = [];
        if(cardInfos && cardInfos.length>0){
            for(let i=0;i<cardInfos.length;i++){
                let cardInfo = cardInfos[i];
                if(this.state.bankId == 0){
                    if(i==0){
                        arr.push(
                            <BankLine
                                chooseOrClick = "choose"
                                choosed = {true}
                                cardInfo = {cardInfo}
                                onClick = {this.changeBankId.bind(this)}
                                bodyStyle = {styles.borderBottom}
                                footStyle = {styles.borderBottom}
                            />
                        )
                    }else{
                        arr.push(
                            <BankLine
                                chooseOrClick = "choose"
                                choosed = {false}
                                cardInfo = {cardInfo}
                                onClick = {this.changeBankId.bind(this)}
                                bodyStyle = {styles.borderBottom}
                                footStyle = {styles.borderBottom}
                            />
                        )
                    }
                }else{
                    if(this.state.bankId == cardInfo.id){
                        arr.push(
                            <BankLine
                                chooseOrClick = "choose"
                                choosed = {true}
                                cardInfo = {cardInfo}
                                onClick = {this.changeBankId.bind(this)}
                                bodyStyle = {styles.borderBottom}
                                footStyle = {styles.borderBottom}
                            />
                        )
                    }else{
                        arr.push(
                            <BankLine
                                chooseOrClick = "choose"
                                choosed = {false}
                                cardInfo = {cardInfo}
                                onClick = {this.changeBankId.bind(this)}
                                bodyStyle = {styles.borderBottom}
                                footStyle = {styles.borderBottom}
                            />
                        )
                    }
                }
            }
        }
        return arr;
    }
    /**
     * 选择银行卡回调
     * @param cardinfo
     */
    changeBankId = (cardinfo) =>{
        if(this.props.onClickCard){
            this.props.onClickCard(cardinfo);
        }
        this.setState({
            bankId:cardinfo.id
        })
    }
    /**
     * 点击添加银行卡回调
     */
    onClickAdd = () =>{
        if(this.props.onClickAdd){
            this.props.onClickAdd();
        }
    }
    render(){
        return(
            <div className={styles.main}>
                {this.renderBankList()}
                {this.props.isShow?<div className={styles.bankLine} onClick={this.onClickAdd.bind(this)}>
                <div className={styles.bankImgDiv}>
                        <div className={styles.circleDiv}>+</div>
                    </div>
                    <div className={styles.bankInfo}>
                        添加银行卡
                    </div>
                    <div className={styles.bankBtn}><i className={styles.gengduo + ' iconfont icon-gengduo1'}/></div>
                </div>:null}
            </div>
        )
    }

}

export default connect(({bankList}) => {
    return {
        bankList
    };
})(BankList);
