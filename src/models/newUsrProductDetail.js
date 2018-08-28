/**
 * Created by abrahamchen on 2017/9/28.
 */
import { Toast } from 'antd-mobile';
import PIServices from '../services/productInfoServices';

export default {

  namespace: 'newUsrProductDetail',

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
      userAccInfo:null,//用户可用余额信息
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
          // if(authToken){
          //100001:APP 100002:微信 100003:PC
          const result = yield call(PIServices.productDetail,{headers,params:{pid,authToken,"client_id":"wechat",channelCode:'100002'},needLoading:true})
          //const result = aaa;
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
              window.G_history.push({
                  pathname: '/newUsrProductDetail',
              })
          }else if(result && result.resCode === "888888"){
              window.G_dispatch({type: 'newUsrProductDetail/getProductDetail', payload: { pid:'10037' } });
              // window.G_dispatch({type: 'lecaiProductSelect/getProductDetail', payload: { pid:pid } });
          } else if(result){
              Toast.info(result.resMsg);
          }
          // }else{
          //     Toast.info('token过期请重新登录');
          // }


      },
     // *getProductDetail({ payload }, { call, put, select }) {  // eslint-disable-line
     //  let pid = payload.pid
     //  let authToken =  window.localStorage.getItem("token");
     //    let headers = {'Content-Type': 'application/x-www-form-urlencoded'}
     //       const result = yield call(PIServices.bidListV,{headers,params:{pid,authToken,"client_id":"wechat",channelCode:'100002'},needLoading:true})
     //       if(result && result.data){
     //            let productDetail = result.data;
     //            yield put({ type: 'refreshData', payload: {productDetail } });
     //        } else if(result && result.resCode == "888888"){
     //           window.G_dispatch({type:"newUsrProductDetail/getProductDetail",payload:payload})
     //       }else if(result){
     //          Toast.info(result.resMsg);
     //        }
     // },

     // 处理需要登录的情况
     *jumpToDetail({payload}, {call, put, select}) {  // eslint-disable-line
      let { productDetail } = yield select(state => ({
        productDetail: state.newUsrProductDetail.productDetail,
      }));
     if(productDetail){
      G_history.push({pathname:'/referencePage',state:{url:productDetail.descnUrl}}); // eslint-disable-line
     }else {
      Toast.info('产品详情丢失');
     }
    },

    *jumpToInvestorList({ payload }, { call, put, select }) {  // eslint-disable-line
      G_history.push({pathname:'/preBidListPage',state:{}}); // eslint-disable-line
    },

    *nextStep({ payload }, { call, put, select }) {  // eslint-disable-line
     
    },
  },

  reducers: {
    trigerLoading(state, action) {
      return { ...state, ...action.payload };
    },

    refreshData(state, action) {
      return { ...state, ...action.payload };
    },
    isRegister(state,action){
      return{ ...state, ...action.payload}
    }
  },
};