/**
 * Created by abrahamchen on 2018/7/8.
 */
import React from 'react';
import PropTypes from 'prop-types';
// import ReactModal from 'react-modal';
import styles from './verticalProgress.less';
import accounting from 'accounting'

class historyBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderTitleRow() {
      let row = [];
      let lendResult = this.props.lendResult?this.props.lendResult:null;
      if(lendResult){
          //获取错误码
          let errCode = lendResult.resCode;
          if(errCode == '0000'){
              row.push(
                  <div className={styles.titleRowHead}>
                      <div className={styles.line}/>
                      <i className={styles.exclamation + ' iconfont icon-duigou'}/>
                  </div>
              )
              row.push(
                  <div className={styles.titleRowBody}>
                      <div
                          className={styles.titleRowBodyText}
                          beforeText={accounting.formatNumber(lendResult.txAmt,2,',')+"元"}
                          afterText={'支付时间'+lendResult.txTime}>交易成功</div>
                  </div>
              )
              row.concat(this.renderBodyRow("1")).concat(this.renderBodyRow("2")).concat(this.renderBodyRow("3",true));
          }else if(errCode == '0107'){
              row.push(
                  <div className={styles.titleRowHead}>
                      <div className={styles.line}/>
                      <i className={styles.exclamation + ' iconfont icon-gantanhao'}/>
                  </div>
              )
              row.push(
                  <div className={styles.titleRowBody}>
                      <div
                          className={styles.titleRowBodyText}
                          beforeText={accounting.formatNumber(lendResult.txAmt,2,',')+"元"}
                          afterText={'支付时间'+lendResult.txTime}>交易处理中</div>
                  </div>
              )
              row.concat(this.renderBodyRow("1")).concat(this.renderBodyRow("2")).concat(this.renderBodyRow("3",true));
          }
      }
    return row;
  }

    /**
     * 绘制结果展示内容
     * @param flag 1-收益产生日期 2-锁定期结束日 3-申请债权转让
     * @param islast
     * @returns {Array}
     */
  renderBodyRow(flag,islast) {
    let lendResult = this.props.lendResult;
    let row = [];
    let text = "";
    let date = "";
    if(flag == "1"){
        text = "收益产生日期";
        date = lendResult.expectedValueDate;
    }else if(flag == "2"){
        text = "锁定期结束日";
        date = lendResult.lockDueDate;
    }else if(flag == "3"){
        text = "";
        date = "申请债权转让"
    }
    row.push(
      <div className={styles.bodyRowHead}>
        {!islast
          ? <div className={styles.line}/>
          : null}
        <div className={styles.grayBall}/>
      </div>
    )
    row.push(
      <div className={styles.bodyRowBody}>
        <div className={styles.bodyRowBodyText} afterText={text}>2018-06-30</div>
      </div>
    )
    return row;
  }

  render() {
    // if(!this.props.lendResult){
    //   return null;
    // }
    return (
      <div className={styles.root} style ={{
        ...this.props.style
      }}>
        {this.renderTitleRow()}
        {/*{this.renderBodyRow("1")}*/}
        {/*{this.renderBodyRow("2")}*/}
        {/*{this.renderBodyRow("3",true)}*/}
      </div>

    );
  }
}

historyBar.propTypes = {};

export default historyBar;