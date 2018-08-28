/**
 * Created by abrahamchen on 2018/6/27.
 */
import React from 'react';
import PropTypes from 'prop-types';
// import ReactModal from 'react-modal';
import styles from './historyBar.less';

class historyBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
    renderBody = () =>{
        let prod = this.props.prodDetail;
        //产品类型0:财富优加计划  1:新手标  2:猜多宝  3:月月续投  4:加油赚  5:节节高 6.季季续投
        if(prod.productProp == '1'){
          //新手标
            return(
                <div className={styles.body}>
                  <div className={styles.titleView}>
                    <div className={styles.infoCell} valueTitle={"购买当日起息"}>{prod.buyDate}</div>
                    <div className={styles.infoCell} valueTitle='锁定期结束日'>{prod.interestDate}</div>
                    <div className={styles.infoCellLast} valueTitle='继续持有或债权转让'></div>
                  </div>
                  <div className={styles.barContainer}>
                    <div className={styles.round} valueTitle=' '></div>
                    <div className={styles.linefl} valueTitle='起息'></div>
                    <div className={styles.round}  valueTitle=' '></div>
                    <div className={styles.lineb}  valueTitle={prod.period+"天锁定期"}></div>
                    <div className={styles.roundLast}  valueTitle=''></div>
                  </div>
                </div>
            )
        }else if(prod.productProp == '2'){
          //乐猜宝
            return(
                <div className={styles.body}>
                  <div className={styles.titleView}>
                    <div className={styles.infoCell} valueTitle={"购买日"}>{prod.buyDate}</div>
                    <div className={styles.infoCell} valueTitle='起息日'>{prod.interestDate}</div>
                    <div className={styles.infoCell} valueTitle='锁定期结束日'>{prod.lockDueDate}</div>
                    <div className={styles.infoCellLast} valueTitle='继续持有或债权转让'></div>
                  </div>
                  <div className={styles.barContainer}>
                    <div className={styles.round} valueTitle=' '></div>
                    <div className={styles.linef} valueTitle='次日起息'></div>
                    <div className={styles.round} valueTitle=' '></div>
                    <div className={styles.linefl} valueTitle={prod.period+"天锁定期"}></div>
                    <div className={styles.round}  valueTitle=' '></div>
                    <div className={styles.lineb}  valueTitle=""></div>
                    <div className={styles.roundLast}  valueTitle=''></div>
                  </div>
                </div>
            )
        }
    }

  render() {

    return (
      <div className={styles.root} style ={{
        ...this.props.style
      }}>
          {this.renderBody()}
      </div>

    );
  }
}

historyBar.propTypes = {};

export default historyBar;
