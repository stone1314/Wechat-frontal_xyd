/**
 * Created by abrahamchen on 2017/9/28.
 */
import { Toast } from 'antd-mobile';
import PIServices from '../services/productInfoServices';
import TradeService from '../services/tradeService';
import RegisterService from '../services/registerService';


import Constant from '../constants/requestConstantValue';
const aaa ={"resCode":"0000","resMsg":"","data":{"donateConds":null,"operatorId":"1","count":"0","raiseEndingTime":"1554460200000","iconUrl":"/img/u=2483348597qk004291.jpg","preProfitRateDisplay":"6.97~7.07","guessRuleContent":"1. 选择您认为正确的答案并完成投资；||2. 猜中可在历史年化收益率上加息，猜错则按历史年化收益率来计算；||3. 若因特殊情况导致题目无法公布正确答案（例如赛事取消，电影换档等），则该期产品年化收益率为历史年化收益率+加息收益/2来计算；","qiutDescribe":"30天后自动退出","raiseState":"3","productType":"17","colour":null,"outLockDate":"2018-07-07","priorityBest":null,"superviseOrg":"资金安全由中金支付全程托管","priority":null,"guarContext":"11","description":"22","prodShareChannel":null,"lockDueDate":"2018-07-06","prodShareContent":null,"boughtWard":"出借咨询服务费为0","singlePeriod":null,"repaymentType":"到期一次还本付息","guarDescn":null,"channelCode":null,"raiseStartingTime":null,"chargeRate":"0","period":"1","recommendType":"0","minRate":"0","isActive":null,"guessRuleUrl":"http://172.16.250.165:6060/img/guizeqk004024.png","pictureUrl":"http://172.16.250.165:6060/img/tupianqk004023.jpg","prodSharePic":null,"shareUrl":"11?pid=10016&invCode=b4ad0aede&invMobile=181******76","productTypeId":"2030","shareRate":"0","guarType":"逾期风险补偿金","accumulateAmt":"100","buttonPic":null,"showTemplateCode":null,"purchaseLimitAmt":"10000","sum":"0.00","quitDays":null,"prodShareDocument":null,"intStartType":"T（购买日）+1（工作日）","donateDesc":null,"id":"7C15784D452B477F9C562772672559CE","subsidyRate":"0","raiseLine":null,"floatingZoneConds":null,"maxReserveDueDate":"2018-07-06","productTypeName":null,"name":"《极致追击》1","question":"以中国票房网数据为准，10月20日《极致追击》内地当日票房数据（含午夜场）将为？","createDate":1506679310000,"parameter2":"500元起投","optionList":[{"id":"EA48EF2ED9B9458EBA850C30E6D82EB9","pictureUrl":"http://172.16.250.165:6060//img/A5qianwanyixiaqk004020.jpg","guessId":"7C15784D452B477F9C562772672559CE","answer":"5千万以下","serialNum":"A"},{"id":"76FA944EC8844F1BBAE9ACF2F426D2F5","pictureUrl":"http://172.16.250.165:6060//img/B5qianwanjiyishangqk004021.jpg","guessId":"7C15784D452B477F9C562772672559CE","answer":"5千万及以上","serialNum":"B"}],"parameter1":"期限短","jingPinDisplayParamNew":null,"parameter4":null,"parameter3":"零费用","channelName":null,"realeaseLimitAmt":"2000000","guessId":"7C15784D452B477F9C562772672559CE","isAllowedReinvest":"0","maxJJGRate":"0","contractPath":null,"prjDescn":null,"buyDate":"2018-07-05","descnUrl":"http://www.baidu.com","pid":"10016","showTemplateType":"0","maxRate":"0","updateDate":1506679310000,"invPeriodUpLimit":null,"productId":"10484","downTime":"1554460200000","maxterm":"1","jpParameter":null,"unit":"D","operatorName":"管理员","upTime":null,"termProp":"1","lowestAmt":"500","donatePatternPic":null,"rightAnswerId":null,"increase":"0","periodCore":null,"preProfitRate":"7.02","interestDate":"2018-07-06","productProp":"2","productName":"猜多宝360天-28期","repatmentDescribe":"到期后3个工作日内自动回款至付款银行卡，到账时间以银行实际到账时间为准"},"sign":"CEBDC517853C28EF97A594B3D5CDC5D6","timestamp":"1530785808008","signType":null}

export default {

  namespace: 'lecaiProductSelect',

  state: {
    productDetail:null,
    question:'',
    answers:[],
    bannerUrls:[],
    detailInfo:{},
    guessRuleContent:'',
    guessRuleUrl:'',
    dkqInfo:null,//可用抵扣券信息
    tyjInfo:null,//可用体验金信息
      tyjChoosed:"",//选中的体验金id
      dkqChoosed:"",//选中的抵扣券`id
      userAccInfo:null,//用户可用余额信息
      lendPeoples:[],//出借人列表
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },

  effects: {
    // 获取产品详情
    *getProductDetail({payload}, {call, put, select}) {  // eslint-disable-line
      let pid = payload.pid
        let authToken =  window.localStorage.getItem("token");
        let headers = {'Content-Type': 'application/x-www-form-urlencoded'}
            //100001:APP 100002:微信 100003:PC
           const result = yield call(PIServices.productDetail,{headers,params:{pid,authToken,"client_id":"wechat",channelCode:'100002'},needLoading:true})
           if(result && result.resCode === "0000"){
                let productDetail = result.data;
                let question = productDetail.question ||'';
                let answers = productDetail.optionList ||[];
                let bannerUrls = [];
                bannerUrls.push(result.data.pictureUrl);
                let detailInfo  = {};
                let unit = '天'
                switch (productDetail.unit){
                  case 'Y':
                    unit='年';
                    break;
                  case 'M':
                    unit='月';
                    break;
                  default:
                }
                detailInfo['产品名称'] = productDetail.productName||'';
                detailInfo['历史年化收益率'] = productDetail.productName||'';
                detailInfo['猜中奖励'] = productDetail.subsidyRate +'%';
                detailInfo['锁定期'] = productDetail.period + unit;
                detailInfo['资金回款'] = productDetail.repatmentDescribe||'';
                let guessRuleContent = productDetail.guessRuleContent||'';
                let guessRuleUrl = productDetail.guessRuleUrl||'';
                yield put({ type: 'refreshData', payload: {productDetail, guessRuleContent, bannerUrls, guessRuleUrl, detailInfo, question, answers } });
                
            }else if(result && result.resCode === "888888"){
               yield put({type: 'lecaiProductSelect/getProductDetail', payload: payload });
           } else if(result){
              Toast.info(result.resMsg);
            }

    },
      //查询可用抵用券
    *queryCanUsedCouponsList({payload},{call,put}){
        let params = {authToken:window.localStorage.getItem("token"),productTypeId:payload.productTypeId,sysId:"qWechat",client_id:'wechat'};
        const res = yield call(TradeService.queryCanUsedCouponsList,params);
        if(res && res.resCode === '0000'){
            console.log("1");
            yield put({type:'refreshData',payload:{dkqInfo:res.data}})
        }else if(res && res.resCode === '888888'){
            //token刷新成功，重新查询数据
            window.G_dispatch({type:'lecaiProductSelect/queryCanUsedCouponsList',payload:{productTypeId:payload.productTypeId}})
        }else if(res){
            Toast.fail(res.resMsg);
        }
    },
      //查询可用体验金
      *queryCanUsedTYCouponsList({payload},{call,put}){
          let params = {authToken:window.localStorage.getItem("token"),productTypeId:payload.productTypeId,sysId:"qWechat",client_id:'wechat'};
          const res = yield call(TradeService.queryCanUsedTYCouponsList,params);
          if(res && res.resCode === '0000'){
              yield put({type:'refreshData',payload:{tyjInfo:res.data.couponsList}})
          }else if(res && res.resCode === '888888'){
              //token刷新成功，重新查询数据
              window.G_dispatch({type:'lecaiProductSelect/queryExCouponsList',payload:{}})
          }else if(res){
              Toast.fail(res.resMsg);
          }
      },
      //出借前检查
      *checkBeforeTrade({payload},{call,put}){
          // window.G_history.push({pathname:'/bankPay'});
          // return;
          //信雅达版本支持银行卡代扣，不需要跳转充值页面
          // if(payload.investMoney > payload.userAccInfo.availAssets){
          //     let param = {
          //         isShow:true,//是否展示弹框
          //         modalTitle:"充值提示",//弹框标题
          //         modalText:"您的余额不足，请去充值",//弹框内容
          //         modalType:"2",//弹框类型 0-授权提示弹框 1-风险测评弹框 2-余额不足弹框 3-预约退出日是否重选
          //         btnNum:"1",//按钮数量0-单按钮 1- 双按钮
          //         btnOneText:"取消",//按钮1内容
          //         btnTwoText:"去充值",//按钮2内容
          //     };
          //     window.G_dispatch({type:'paymentPage/showOrHidModal',payload:param});
          //     return;
          // }
          let params = {authToken:window.localStorage.getItem("token"),investMoney:payload.investMoney,reserverExitDate:payload.reserverExitDate,client_id:'wechat'};
          const result = yield call(TradeService.checkBeforeTrade,params);
          if(result && result.resCode === '0000'){
              if(result.data && result.data.isPospBlack != undefined && result.data.isPospBlack == '1'){
                  Toast.fail('账户异常，请联系客服');
                  return;
              }
              if(result.data && result.data.authInfo && result.data.authInfo.expried != undefined && result.data.authInfo.expried == 1
                  && result.data.authInfo.overInvest != undefined && result.data.authInfo.overInvest == 1){
                  // Toast.fail('您的授权已过期且出借金额超过授权金额，请重新授权');
                  let param = {
                      isShow:true,//是否展示弹框
                      modalTitle:"授权提示",//弹框标题
                      modalText:"您的授权已过期且出借金额超过授权金额，请重新授权",//弹框内容
                      modalType:"0",//弹框类型 0-授权提示弹框 1-风险测评弹框 2-余额不足弹框 3-预约退出日是否重选
                      btnNum:"1",//按钮数量0-单按钮 1- 双按钮
                      btnOneText:"取消",//按钮1内容
                      btnTwoText:"重新授权",//按钮2内容
                  };
                  window.G_dispatch({type:'paymentPage/showOrHidModal',payload:param});
                  return;
              }
              if(result.data && result.data.authInfo && result.data.authInfo.expried != undefined && result.data.authInfo.expried == 1){
                  // Toast.fail('您的授权已过期，请重新授权');
                  let param = {
                      isShow:true,//是否展示弹框
                      modalTitle:"授权提示",//弹框标题
                      modalText:"您的授权已过期，请重新授权",//弹框内容
                      modalType:"0",//弹框类型 0-授权提示弹框 1-风险测评弹框 2-余额不足弹框 3-预约退出日是否重选
                      btnNum:"1",//按钮数量0-单按钮 1- 双按钮
                      btnOneText:"取消",//按钮1内容
                      btnTwoText:"重新授权",//按钮2内容
                  };
                  window.G_dispatch({type:'paymentPage/showOrHidModal',payload:param});
                  return;
              }
              if(result.data && result.data.authInfo && result.data.authInfo.overInvest != undefined && result.data.authInfo.overInvest == 1){
                  // Toast.fail('您的出借金额已超过授权金额，请重新授权');
                  let param = {
                      isShow:true,//是否展示弹框
                      modalTitle:"授权提示",//弹框标题
                      modalText:"您的出借金额已超过授权金额，请重新授权",//弹框内容
                      modalType:"0",//弹框类型 0-授权提示弹框 1-风险测评弹框 2-余额不足弹框 3-预约退出日是否重选
                      btnNum:"1",//按钮数量0-单按钮 1- 双按钮
                      btnOneText:"取消",//按钮1内容
                      btnTwoText:"重新授权",//按钮2内容
                  };
                  window.G_dispatch({type:'paymentPage/showOrHidModal',payload:param});
                  return;
              }
              // 是否需要评测
              if(result.data.risk && result.data.risk.needAssessment){
                  // 没有等级，未评测
                  if(!result.data.risk.level){
                      // Toast.fail('亲，根据最新的政策法规，您需要完成风险承受能力测评后，才可以进行出借业务！');
                      let param = {
                          isShow:true,//是否展示弹框
                          modalTitle:"风险提示",//弹框标题
                          modalText:"亲，根据最新的政策法规，您需要完成风险承受能力测评后，才可以进行出借业务！",//弹框内容
                          modalType:"1",//弹框类型 0-授权提示弹框 1-风险测评弹框 2-余额不足弹框 3-预约退出日是否重选
                          btnNum:"1",//按钮数量0-单按钮 1- 双按钮
                          btnOneText:"继续出借",//按钮1内容
                          btnTwoText:"去测评",//按钮2内容
                      };
                      window.G_dispatch({type:'paymentPage/showOrHidModal',payload:param});
                  }else if(result.data.risk.expired){    // 是否过期
                      // Toast.fail('亲，您的风险承受能力测评已过期，根据相关政策法规，请在出借前更新您的评测结果！');
                      let param = {
                          isShow:true,//是否展示弹框
                          modalTitle:"风险提示",//弹框标题
                          modalText:"亲，您的风险承受能力测评已过期，根据相关政策法规，请在出借前更新您的评测结果！",//弹框内容
                          modalType:"1",//弹框类型 0-授权提示弹框 1-风险测评弹框 2-余额不足弹框 3-预约退出日是否重选
                          btnNum:"1",//按钮数量0-单按钮 1- 双按钮
                          btnOneText:"继续出借",//按钮1内容
                          btnTwoText:"去更新",//按钮2内容
                      };
                      window.G_dispatch({type:'paymentPage/showOrHidModal',payload:param});
                      // $scope.confirmBtn = "去更新";
                  }else if(result.data.risk.clUser){     // 是否是存量用户
                      let param = {
                          isShow:true,//是否展示弹框
                          modalTitle:"风险提示",//弹框标题
                          modalText:"亲，根据2018年最新政策法规，风险承受能力评测有所更新，请在出借前更新您的评测结果！",//弹框内容
                          modalType:"1",//弹框类型 0-授权提示弹框 1-风险测评弹框 2-余额不足弹框 3-预约退出日是否重选
                          btnNum:"1",//按钮数量0-单按钮 1- 双按钮
                          btnOneText:"继续出借",//按钮1内容
                          btnTwoText:"去更新",//按钮2内容
                      };
                      window.G_dispatch({type:'paymentPage/showOrHidModal',payload:param});
                      // Toast.fail('亲，根据2018年最新政策法规，风险承受能力评测有所更新，请在出借前更新您的评测结果！');
                      // $scope.confirmBtn = "去更新";
                  }else if(result.data.risk.overLimit){  // 是否超出上限
                      let param = {
                          isShow:true,//是否展示弹框
                          modalTitle:"风险提示",//弹框标题
                          modalText:"亲，您的风险承受能力评估结果为" + result.data.risk.level + "，建议您在本平台的出借资金不超过家庭可支配收入的" + result.data.risk.investLimit*100 + "%。",//弹框内容
                          modalType:"1",//弹框类型 0-授权提示弹框 1-风险测评弹框 2-余额不足弹框 3-预约退出日是否重选
                          btnNum:"1",//按钮数量0-单按钮 1- 双按钮
                          btnOneText:"继续出借",//按钮1内容
                          btnTwoText:"重新评测",//按钮2内容
                      };
                      window.G_dispatch({type:'paymentPage/showOrHidModal',payload:param});
                  }

              } else {
                  // 不需要评测
                  if (result.data && result.data.handlingAppTx && (result.data.handlingAppTx.code == '10054100' || result.data.handlingAppTx.code == '111')) {
                      Toast.fail(result.data.handlingAppTx.msg);
                      return;
                  }
                  if (result.data && result.data.reserverMsg) {
                      let param = {
                          isShow:true,//是否展示弹框
                          modalTitle:"风险提示",//弹框标题
                          modalText:result.data.reserverMsg,//弹框内容
                          modalType:"3",//弹框类型 0-授权提示弹框 1-风险测评弹框 2-余额不足弹框 3-预约退出日是否重选
                          btnNum:"1",//按钮数量0-单按钮 1- 双按钮
                          btnOneText:"重选",//按钮1内容
                          btnTwoText:"确认",//按钮2内容
                      };
                      window.G_dispatch({type:'paymentPage/showOrHidModal',payload:param});
                  } else {
                      //检查成功
                      //跳转到支付页面
                      window.G_history.push({pathname:'/bankPay'});
                  }

              }
              yield put({type:'refreshData',payload:{tyjInfo:result.data}})
          }else if(result && result.resCode === '888888'){
              //token刷新成功，重新查询数据
              window.G_dispatch({type:'lecaiProductSelect/checkBeforeTrade',payload:{}});
          }else if(result){
              Toast.fail(result.resMsg);
          }
      },
      //发送出借短信验证码
      *sendSms({payload},{call,put}){
          //获取用户信息
          let userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
          let params = {mobile:userInfo.mobile,type:"5",resType:"1",client_id:"wechat"};
          const res = yield call(RegisterService.sendSms,params);
          //短信验证码发送成功
          if(res && res.resCode === '0000'){
              Toast.info("发送验证码成功");
          }else{
              Toast.info(res.resMsg);
          }
      },
      //产品投资（含充值）出借
      *invest({payload},{call,put}){
          //获取用户信息
          let localStorage = window.localStorage;
          let userInfo = JSON.parse(localStorage.getItem("userInfo"));
          let authToken = localStorage.getItem("token");
          let sign = "000000timestamp="+new Date().getTime()+"bizContent="+{a:1};
          // let params = {pid:payload.pid,//产品ID
          //               productName:payload.productName,//产品名称
          //               channel:"100002",//渠道代码
          //               txAmt:payload.txAmt,
          //               validateCode:payload.validateCode,//短信验证码
          //               bankId:payload.bankId,//银行id
          //               isUseRed:payload.isUseRed,//0.不使用抵扣券，1.10元抵扣券，2.新手体验金，3.新手比例体验金，4.使用大额抵扣券券和10抵扣券，5.体验金与抵扣券混合使用
          //               idList:"",//抵扣券id列表 逗號分隔
          //               idTyList:"",//體驗金id列表 逗號分隔
          //               bankCardNo:payload.bankCardNo,//银行卡号
          //               hfToken:payload.hfToken,//恒丰交易密码验证token
          //               chargeAmt:payload.chargeAmt,//银行卡投资金额，用于充值
          //               reserveDueDate:payload.reserveDueDate,//预约退出日
          //               sign:payload.sign,//签名
          //               authToken:authToken};
          let params = {
                        sysId:"qWechat",
                        channel:"100002",//渠道代码
                        signType:"MD5",//
                        client_id:"wechat",//渠道代码
                        authToken:authToken,//用户token
                        pid:payload.pid,//产品ID
                        txAmt:payload.txAmt,
                        // isUseRed:payload.isUseRed,//0.不使用抵扣券，1.10元抵扣券，2.新手体验金，3.新手比例体验金，4.使用大额抵扣券券和10抵扣券，5.体验金与抵扣券混合使用
                        isUseRed:payload.isUseRed,//0.不使用抵扣券，1.10元抵扣券，2.新手体验金，3.新手比例体验金，4.使用大额抵扣券券和10抵扣券，5.体验金与抵扣券混合使用
                        idList:payload.idList,//抵扣券id列表 逗號分隔
                        idTyList:payload.idTyList,//體驗金id列表 逗號分隔
                        // reserveDueDate:payload.reserveDueDate,//预约退出日
                        reserveDueDate:payload.lockDueDate,//预约退出日
                        validateCode:payload.validateCode,//短信验证码
                        guessId:payload.guessId,//问题id
                        answerId:payload.answerId,//答案id
                    };
          const res = yield call(TradeService.invest,params);
          //出借成功
          if(res && res.resCode === '0000'){
              Toast.info("出借成功");
          }else if(res && res.resCode === '888888'){
              //token刷新成功，重新查询数据
              window.G_dispatch({type:'lecaiProductSelect/invest',payload:payload})
          }else{
              Toast.info(res.resMsg);
          }
      },
      //获取用户可用余额
      *getAssets({payload},{call,put}){
          //获取用户信息
          let localStorage = window.localStorage;
          let authToken = localStorage.getItem("token");
          let params = {authToken:authToken,client_id:'wechat',operateType:"8"};
          const res = yield call(TradeService.getAssets,params);
          //获取用户信息成功
          if(res && res.resCode === '0000'){
              yield put({type:"refreshData",payload:{userAccInfo:res.data}})
          }else if(res && res.resCode === '888888'){
              //token刷新成功，重新查询数据
              window.G_dispatch({type:'lecaiProductSelect/getAssets',payload:payload})
          }else{
              Toast.info(res.resMsg);
          }
      },

    //选择答案
    *selectAnswer({ payload }, { call, put, select }) {  // eslint-disable-line
      let { answers } = yield select(state => ({
        answers: state.lecaiProductSelect.answers,
      }));
      let serialNum = payload.serialNum
      for(let answer of answers){
      if(answer.serialNum === serialNum){
        answer.selected = true;
      } else {
        answer.selected = false;
      }
    }
    yield put({ type: 'refreshData', payload: {answers } }); 
    },

    //跳转至详情
    *jumpToDetail({ payload }, { call, put, select }) {  // eslint-disable-line
      let { productDetail,answers } = yield select(state => ({
        productDetail: state.lecaiProductSelect.productDetail,
      }));
      yield put({ type: 'lecaiProductDetail/refreshData', payload: { productDetail,answers } });
      G_history.push({pathname:'lecaiProductDetail'})  // eslint-disable-line
    },

    //跳转至详细规则
    *jumpToRule({ payload }, { call, put, select }) {  // eslint-disable-line
      let { guessRuleUrl } = yield select(state => ({
        guessRuleUrl: state.lecaiProductSelect.guessRuleUrl,
      }));
      G_history.push({pathname:'referencePage',state:{url:guessRuleUrl,kind:'img'}})  // eslint-disable-line
    },

    //跳转至支付界面
    *nextStep({ payload }, { call, put, select }) {  // eslint-disable-line
        if(payload.type === "lecai"){
            let { answers } = yield select(state => ({
                answers: state.lecaiProductSelect.answers,
            }));
            let selected = false;
            for(let answer of answers){
                selected = selected || answer.selected
            }
            if(!selected){
                Toast.info('请先选择一个答案');
                return;
            }
        }

        // G_history.push({pathname:'paymentPage',state:{}}); // eslint-disable-line
          //获取用户信息
        G_dispatch({type:"lecaiProductSelect/getAssets",payload:{}});// eslint-disable-line
          //查询可用体验金
        G_dispatch({type:"lecaiProductSelect/queryCanUsedTYCouponsList",payload:{productTypeId:payload.productTypeId}});// eslint-disable-line
          // 查询可用抵扣券
        G_dispatch({type:"lecaiProductSelect/queryCanUsedCouponsList",payload:{productTypeId:payload.productTypeId}});// eslint-disable-line

    },
    *getProductSale({payload},{call,put}){
        const res = yield call(TradeService.getProductSale,payload);
        if(res && res.resCode === '0000'){
            yield put({type:'refreshData',payload:{lendPeoples:res.data.saleList}})
        }else if(res && res.resCode === '888888'){
            put({type:'getProductSale',payload:payload})
        }else{
            Toast.fail("出借用户查询失败")
        }
    },
      /**
       * 刷新数据
       * @param payload
       * @param call
       * @param put
       */
      *resData({payload},{call,put}){
          yield put({ type: 'refreshData', payload: payload });
      },
  },

  reducers: {
    refreshData(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
