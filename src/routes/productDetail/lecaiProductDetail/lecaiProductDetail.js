/**
 * Created by abrahamchen on 2018/6/26.
 */
import React from 'react';
import {connect} from 'dva';
import {Button, Toast} from 'antd-mobile';
import styles from './lecaiProductDetail.less';
import CommonProductDetail from '../commonProductDetail';
import BackHeader from '../../../components/backHeader/backHeader'
//  import LoginService from '../../../services/LoginService';

const aaa = {"resCode":"0000","resMsg":"","data":{"downTime":"1554460200000","maxJJGRate":"0","raiseEndingTime":"1554460200000","invPeriodUpLimit":null,"pid":"10016","prodSharePic":null,"quitDays":null,"isActive":null,"maxterm":"1","productName":"猜多宝360天-28期","raiseState":"3","superviseOrg":"资金安全由中金支付全程托管","rightAnswerId":null,"floatingZoneConds":null,"isAllowedReinvest":"0","guessRuleUrl":"http://172.16.250.165:6060//img/guizeqk004024.png","accumulateAmt":"100","productTypeName":null,"donateConds":null,"iconUrl":"/img/u=2483348597qk004291.jpg","id":"7C15784D452B477F9C562772672559CE","descnUrl":"http://172.16.250.165:6060/null","operatorId":"1","guessRuleContent":"1. 选择您认为正确的答案并完成投资；||2. 猜中可在历史年化收益率上加息，猜错则按历史年化收益率来计算；||3. 若因特殊情况导致题目无法公布正确答案（例如赛事取消，电影换档等），则该期产品年化收益率为历史年化收益率+加息收益/2来计算；","maxReserveDueDate":"2018-07-06","period":"1","subsidyRate":"0","productId":"10484","pictureUrl":"http://172.16.250.165:6060//img/tupianqk004023.jpg","count":"0","guarContext":"11","raiseLine":null,"showTemplateType":"0","maxRate":"0","priority":null,"chargeRate":"0","unit":"D","purchaseLimitAmt":"10000","preProfitRateDisplay":"6.97~7.07","name":"《极致追击》1","guarDescn":null,"minRate":"0","outLockDate":"2018-07-07","shareUrl":"11?pid=10016&invCode=b4ad0aede&invMobile=181******76","interestDate":"2018-07-06","contractPath":null,"guarType":"逾期风险补偿金","updateDate":1506679310000,"prodShareDocument":null,"buyDate":"2018-07-05","jpParameter":null,"buttonPic":null,"description":"22","sum":"0.00","repatmentDescribe":"到期后3个工作日内自动回款至付款银行卡，到账时间以银行实际到账时间为准","operatorName":"管理员","prodShareChannel":null,"repaymentType":"到期一次还本付息","donateDesc":null,"guessId":"7C15784D452B477F9C562772672559CE","lowestAmt":"500","productType":"17","boughtWard":"出借咨询服务费为0","channelCode":null,"createDate":1506679310000,"periodCore":null,"priorityBest":null,"termProp":"1","question":"以中国票房网数据为准，10月20日《极致追击》内地当日票房数据（含午夜场）将为？","prodShareContent":null,"productProp":"2","singlePeriod":null,"optionList":[{"serialNum":"A","answer":"5千万以下","pictureUrl":"http://172.16.250.165:6060//img/A5qianwanyixiaqk004020.jpg","id":"EA48EF2ED9B9458EBA850C30E6D82EB9","guessId":"7C15784D452B477F9C562772672559CE"},{"serialNum":"B","answer":"5千万及以上","pictureUrl":"http://172.16.250.165:6060//img/B5qianwanjiyishangqk004021.jpg","id":"76FA944EC8844F1BBAE9ACF2F426D2F5","guessId":"7C15784D452B477F9C562772672559CE"}],"increase":"0","prjDescn":null,"shareRate":"0","preProfitRate":"7.02","productTypeId":"2030","realeaseLimitAmt":"2000000","donatePatternPic":null,"lockDueDate":"2018-07-06","upTime":null,"colour":null,"jingPinDisplayParamNew":null,"qiutDescribe":"30天后自动退出","showTemplateCode":null,"raiseStartingTime":null,"recommendType":"0","channelName":null,"parameter4":null,"intStartType":"T（购买日）+1（工作日）","parameter3":"零费用","parameter2":"500元起投","parameter1":"期限短"},"sign":"57DE538C8B79E663B4CDF21FAC087351","timestamp":"1530781336905","signType":null}

class LecaiProductDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={styles.root}>
        <BackHeader
            title="乐猜宝详情"
            backType="0"
            _this={this}
        ></BackHeader>
        <CommonProductDetail type ='lecai' { ...this.props }/>
      </div>

    );
  }
}

LecaiProductDetail.propTypes = {};

export default connect(({lecaiProductDetail,lecaiProductSelect}) => {
  return {LPDData: lecaiProductDetail,lecaiProductSelect};
})(LecaiProductDetail);