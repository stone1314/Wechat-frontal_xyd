/**
 * created by bingdu 2018.06.14
 */

import  React from 'react';
import {connect} from 'dva';
import styles from './bankLine.less';
import { Button,Toast} from 'antd-mobile';

class BankLine extends React.Component{
    constructor(props){
        super(props);
        this.state = {
        };
    }
    static defaultProps = {
        cardInfo:null,//银行卡信息
        chooseOrClick:'choose',//用来判断行尾图标是选择还是箭头 choose-表示选择 more-表示箭头
        choosed:false,//为选择行时，表示改行是否选中
        bothStyle:"",//整体外部样式
        headStyle:"",//图标样式
        bodyStyle:"",//内容样式
        footStyle:"",//尾部样式
        onClick:null,//回调方法
    };
    /**
     * 绘制尾部
     */
    renderTail = () =>{
        if(this.props.chooseOrClick === "choose"){
            if(this.props.choosed){
                return(<div className={styles.bankBtn +' '+ this.props.footStyle}><i className={styles.duigou + ' iconfont icon-duigou'}/></div>)
            }else{
                return(<div className={styles.bankBtn +' '+ this.props.footStyle}></div>)
            }
        }else if(this.props.chooseOrClick === "more"){
            return(<div className={styles.bankBtn +' '+ this.props.footStyle}><i className={styles.gengduo + ' iconfont icon-gengduo1'}/></div>)
        }else{
            return(<div className={styles.bankBtn +' '+ this.props.footStyle}></div>)
        }
    }
    /**
     * 回调方法
     * @param cardInfo 银行卡信息
     */
    onclick = (cardInfo) =>{
        if(this.props.onClick){
            this.props.onClick(cardInfo);
        }
    }

    render(){
        let cardInfo = this.props.cardInfo;
        if(!cardInfo){
            return(<div className={styles.bankLine}></div>)
        }
        return(
            <div className={styles.bankLine +' '+ this.props.bothStyle} onClick={this.onclick.bind(this,cardInfo)}>
                <div className={styles.bankImgDiv +' '+ this.props.headStyle}>
                    <img className={styles.bankImg} src={cardInfo.iconUrl}/>
                </div>
                <div className={styles.bankInfo +' '+ this.props.bodyStyle}>
                    <div className={styles.bankName}>{cardInfo.bankName}{cardInfo.tailNo?`（尾号${cardInfo.tailNo}）`:''}</div>
                    <div className={styles.bankDetail}>{cardInfo.deal?cardInfo.deal:cardInfo.bankcreditSingle}万/笔 {cardInfo.limit?cardInfo.limit:cardInfo.bankcreditTotal}万/日</div>
                </div>
                {this.renderTail()}
            </div>
        )

    }

}

export default connect(({bankLine}) => {
    return {
        bankLine
    };
})(BankLine);
