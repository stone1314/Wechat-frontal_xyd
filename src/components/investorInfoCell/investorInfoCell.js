/**
 * Created by abrahamchen on 2018/6/27.
 */
import React from 'react';
import PropTypes from 'prop-types';
// import ReactModal from 'react-modal';
import styles from './investorInfoCell.less';

class introduceInfoCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
      
    return (
      <div className={styles.root} style ={{
        ...this.props.style
      }} onClick={()=>this.props.onClick()}>
       <div className={styles.firstLine}>
         <div className={styles.ffPart}>
           <div className={styles.colorPoint}/>
           {this.props.rowData.borrower_name}
           <br/>
           {`项目编号: ${this.props.rowData.borrower_bid_contract_no}`}
         </div>
           <label className={styles.green} onClick={this.props.showTost.bind(this)}>{this.props.rowData.pre_borrower_credit_level}</label>
         <div>
         </div>
       </div >
       <div className={styles.secondLine}>
         <div className={styles.onePart} title='借款金额'>
         <label className={styles.bigger}>{this.props.rowData.loan_amt}</label><label>{' 元'}</label>
         </div>
         <div className={styles.secPart} title='借款利率'>
         <label className={styles.bigger}>{this.props.rowData.loan_yearly_rate}</label><label>{' %'}</label>
         </div>
         <div className={styles.thrPart} title={`借款类型：${this.props.rowData.loan_purpose}`}>
         {`借款期数：${this.props.rowData.loan_term}期 `}
         </div>
       </div>
      </div>

    );
  }
}

introduceInfoCell.propTypes = {
  
};
introduceInfoCell.defaultProps={
  onClick:()=>{},
  rowData:{},
}


export default introduceInfoCell;