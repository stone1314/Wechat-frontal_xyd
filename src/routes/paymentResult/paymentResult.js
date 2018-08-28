/**
 * Created by abrahamchen on 2018/6/21.
 */
import React from 'react';
import {connect} from 'dva';
import {Button, Toast} from 'antd-mobile';
import faliureIco from '../../asserts/bankDepository/faliure@2x.png';
import shield from '../../asserts/paymentResult/shield2@2x.png';
import styles from './paymentResult.less';
import VerticalProgress from '../../components/verticalProgress/verticalProgress';
import BackHeader from '../../components/backHeader/backHeader';
import Config from '../../constants/constant';


class PaymentResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.nextStep = this.nextStep.bind(this);
  }

    componentWillMount() {
      let localStorage = window.localStorage;
      let param = JSON.parse(localStorage.getItem("operateParam"));
      param.chargeAmt = Number(param.chargeAmt);
      this.props.dispatch({
          type: 'depositModel/saveTxInfoNew',
          payload: param
      })
  }
  nextStep() {
    this.props.history.push({pathname: '/', state: "MyLends"});
  }

    /**
     * 绘制返回头部
     */
    renderHeader = () =>{
        let lendResult = this.props.depositModel?this.props.depositModel.lendResult:null;
        if(lendResult){
            //获取错误码
            let errCode = lendResult.resCode;
            if(errCode == '0000' || errCode == '0107'){
                return(<VerticalProgress
                    lendResult = {lendResult}
                />)
            }else{
                let arr = [];
                arr.push(<img className={styles.resultIco} src={faliureIco} alt=''/>);
                arr.push(<label className={styles.prompt}>{'交易失败'}</label>);
                arr.push(<div className={styles.progressContainer}>{lendResult.resMsg}</div>);
                    return arr;
            }
        }
    }
  render() {
    let lendResult = this.props.depositModel?this.props.depositModel.lendResult:null;
    return (
      <div className={styles.root}>
          <BackHeader
              title="交易结果"
              backType="2"
              _this={this}
          ></BackHeader>
          {this.renderHeader()}
        <Button
          className={styles.nextButton}
          onClick={() => this.nextStep()}
           disabled={false}>
          {'查看我的出借'}
        </Button>
        <div className = {styles.lastInfo}>
            <img className={styles.shield} src={shield}/>
            资金已存管至恒丰银行
        </div>

      </div>
    );
  }
}


export default connect(({depositModel}) => {
  return {depositModel};
})(PaymentResult);