/**
 * Created by abrahamchen on 2018/6/28.
 */
import React from 'react';
import PropTypes from 'prop-types';
// import ReactModal from 'react-modal';
import {Modal, List} from 'antd-mobile';
import styles from './experienceCash.less';
import accounting from 'accounting'

const Item = List.Item;
const Brief = Item.Brief;

class ExperienceCash extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flag:true,

    };
    // this.first = true;//第一次进入页面
      this.parValue = 0;
  }
  close() {
    this.props.close();
  }

  selectTicket(num){
      let ticket = this.props.tickets[num];
      if(this.props.chooseTicket == ticket.id){
          this.parValue = 0;
      }
      this.saveTYJInfo(ticket);
  }

  onSelected(){
    this.props.onSelected()
  }
    saveTYJInfo =(tyj)=>{
      this.props.saveTYJInfo(tyj)
    }

  renderTickets(tickets){
    if(!tickets){return;}
    let _this = this;
    let arr = [];
    for(let i=0;i<tickets.length;i++){
        let color = '#CCCCCC';
        let ticket = tickets[i];
        let selected = false;
        if(this.props.chooseTicket == ""){
            this.parValue = 0;
        }
        if(this.props.chooseTicket == ticket.id){
            selected = true;
            this.parValue = ticket.parValue
        }
        arr.push(
            <Item multipleLine onClick={() => this.selectTicket(i)}>
              <div className={styles.rowRoot} style = {{color:!selected ? color:null}}>
                <div className={styles.rowHead} style = {{color:!selected ? color:null}}>
                  <i className={styles.answerTick + ' iconfont icon-duigou'} style = {{backgroundColor:!selected ? 'white':null}}/>
                  <i className={styles.answerTicket + ' iconfont icon-quan'}/>
                    {ticket.parValue}元
                </div>
                <div>有效期至{ticket.expirationDate}</div>
              </div>
              <div className={styles.disText}>{ticket.couponsDescription}</div>
            </Item>)
    }
      // _this.first = false;
    return arr;
    // return tickets.map((ticket,index)=>{
    // })
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
            <label>可用体验金</label>
            <label className = {styles.subTitle}>购买金额:<label className = {styles.subTitle2}>{accounting.formatNumber(this.props.count,",")}</label>
            </label>
          </div>
          <div className={styles.outSepContainer}>
            <div className={styles.sepContainer}>
              <div className={styles.sep}/>
            </div>
          </div>
          <div className={styles.listView}>
            <div className={styles.listContainer}>
              <List  className="my-list">
               {this.renderTickets(this.props.tickets)}
              </List>
            </div>
            <div className={styles.btnContainer}>
              <div className={styles.tyjInfo}>使用<div className={styles.tyjInfotext}>{this.parValue}</div>元体验金</div>
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

ExperienceCash.propTypes = {
  isOpen: PropTypes.bool,
  onSelected: PropTypes.func
};

ExperienceCash.defaultProps = {
  onSelected:()=>{}
}

export default ExperienceCash;
