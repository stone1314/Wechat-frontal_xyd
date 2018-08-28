/**
 * Created by abrahamchen on 2018/6/28.
 */
import React from 'react';
import PropTypes from 'prop-types';
// import ReactModal from 'react-modal';
import {Modal, List,Toast} from 'antd-mobile';
import styles from './deductionTicket.less';
import accounting from 'accounting'
import {timeToDate} from '../../utils/util'

const Item = List.Item;
const Brief = Item.Brief;

class DeductionTicket extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        flag:true,
    };
      this.first = true;//第一次进入页面
      this.parValue = 0;//
      this.dkqNum = 0;//使用的抵扣券张数
      this.dkqAcc = 0;//使用的抵扣券金额
      this.userAcc = 0;//用户应支付金额
      this.dkqQuota = 0;//抵扣金限额
  }
  close() {
    this.props.close();
  }


  onSelected(){
    this.props.onSelected()
  }
    saveDKQInfo = (flag,dkq,dkqAcc)=>{
      this.props.saveDKQInfo(flag,dkq,dkqAcc);
    }
    selectTicket(num){
        let ticket = this.props.tickets[num];
        let arr = this.props.chooseTicket.split(',');
        if(arr.indexOf(ticket.id) != -1){
            this.dkqQuota = this.dkqQuota - ticket.singleInvestDown;
            this.saveDKQInfo("del",ticket,this.dkqAcc);
        }else{
            if(this.dkqQuota+ticket.singleInvestDown <= this.props.count){
                this.saveDKQInfo("add",ticket,this.dkqAcc);
            }else{
                Toast.fail("抵扣券金额超限");
                return;
            }
        }



        if(ticket.isSelect){
          //取消选中抵扣券
            this.dkqQuota = this.dkqQuota - ticket.singleInvestDown;
            ticket.isSelect = false;
            this.dkqNum = this.dkqNum-1;
            this.userAcc = this.userAcc + this.dkqAcc;
            this.dkqAcc = this.dkqAcc-ticket.parValue;
            this.saveDKQInfo("del",ticket,this.dkqAcc);
        }else{
          //选中抵扣券
            if(this.dkqQuota+ticket.singleInvestDown <= this.props.count){
                this.dkqQuota = this.dkqQuota + ticket.singleInvestDown;
                ticket.isSelect = true;
                this.dkqNum = this.dkqNum+1;
                this.dkqAcc = this.dkqAcc+ticket.parValue;
                this.userAcc = this.userAcc - this.dkqAcc;
                this.saveDKQInfo("add",ticket,this.dkqAcc);
            }else{
              Toast.fail("抵扣券金额超限");
              return;
            }
        }
        this.setState({
            flag:!this.state.flag,
        })
    }
  renderTickets = () =>{
      let tickets = this.props.tickets;
      let _this = this;
      if(!tickets){return;}
      let arr = [];
      for(let i=0;i<tickets.length;i++){
          let color = '#CCCCCC';
          let ticket = tickets[i];
          let selected = false;
          if(this.props.chooseTicket == ""){
              this.dkqNum = 0;
              this.userAcc = this.props.count;
          }else{
              let arr = this.props.chooseTicket.split(',');
              if(arr.indexOf(ticket.id) != -1){
                  this.dkqNum = this.dkqNum + 1;
                  this.userAcc = this.props.count - ticket.parValue;
                  this.dkqQuota = this.dkqQuota + ticket.singleInvestDown;
                  selected = true;
              }
          }
          arr.push(
              <Item multipleLine onClick={() => _this.selectTicket(i)}>
                <div className={styles.rowRoot} style = {{color:!selected ? color:null}}>
                  <div className={styles.rowHead} style = {{color:!selected ? color:null}}>
                    <i className={styles.answerTick + ' iconfont icon-duigou'} style = {{backgroundColor:!selected ? 'white':null}}/>
                    <i className={styles.answerTicket + ' iconfont icon-quan'}/>
                      {ticket.parValue}元
                  </div>
                  <div>满{ticket.singleInvestDown}可用 有效期至{timeToDate(ticket.expirationDate)}</div>
                </div>
              </Item>)
      }

      return arr;
  }

  render() {
    return (
      <Modal
      className={'modalTicket'}
        popup
        visible={this.props.isOpen}
        onClose={() => this.close()}
        wrapClassName={styles.root}
        maskClosable={true}
        animationType="slide-up">
        <div className={styles.content}>
          <div className={styles.title}>
            <label>可用抵扣券</label>
            <label className = {styles.subTitle}>购买金额:<label className = {styles.subTitle2}>{accounting.formatNumber(this.props.count,",")}</label>
            </label>
          </div>
          <div className={styles.outSepContainer}>
            <div className={styles.eclipseLeft}/>
            <div className={styles.sepContainer}>
              <div className={styles.sep}/>
            </div>
            <div className={styles.eclipseRight}/>
          </div>
          <div className={styles.listView}>
            <div className={styles.listContainer}>
              <List  className="my-list">
               {this.renderTickets()}
              </List>
            </div>
            <div className={styles.btnContainer}>
              <div className={styles.btnInfo}>
              <label>{this.dkqNum}张抵扣<label className={styles.colorFont}>{this.dkqAcc}</label>元</label>
              <label>还需要支付{this.userAcc}元</label>
              </div>
              <div className={styles.btn} onClick={()=>{this.close()}}>
              <label>确认</label>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

DeductionTicket.propTypes = {
  isOpen: PropTypes.bool,
  onSelected: PropTypes.func
};

DeductionTicket.defaultProps = {
  onSelected:()=>{}
}

export default DeductionTicket;
