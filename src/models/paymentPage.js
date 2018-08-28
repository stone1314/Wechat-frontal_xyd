/**
 * Created by abrahamchen on 2017/9/28.
 */
import { Toast } from 'antd-mobile';
import services from '../services/depositService'


export default {

  namespace: 'paymentPage',

  state: {
      isShow:false,//是否展示弹框
      modalTitle:"",//弹框标题
      modalText:"",//弹框内容
      modalType:"",//弹框类型 0-授权提示弹框 1-风险测评弹框 2-余额不足弹框 3-预约退出日是否重选 4-短信验证码 5-用户未开户 6-用户未绑卡
      btnNum:"",//按钮数量0-单按钮 1- 双按钮
      btnOneText:"",//按钮1内容
      btnTwoText:"",//按钮2内容
      availAssets:"0",//可用余额支付
      dkqAcc:"0",//使用抵扣券
      bankAcc:"0",//银行卡支付
      lendCount:"0",//出借金额
      dkqInfo:"",//选中的抵扣券
      tyjInfo:"",//选中的体验金
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },

  effects: {
    *changeLoadingNum({ payload }, { call, put, select }) {  // eslint-disable-line
      let { loadingNum } = yield select(state => ({
        loadingNum: state.globalData.loadingNum,
      }));
      const delta = payload.delta;
      loadingNum += delta;
      if (loadingNum > 0) {
        yield put({ type: 'trigerLoading', payload: { isLoading: true, loadingNum } });
      } else {
        yield put({ type: 'trigerLoading', payload: { isLoading: false, loadingNum: 0 } });
      }
    },
      //设置弹框显示隐藏及弹框信息
      *showOrHidModal({payload},{call,put}){
        yield put({type:'refreshData',payload:{...payload}})
      },

    // 处理需要登录的情况
    *needLogin({payload}, {call, put, select}) {  // eslint-disable-line
      
    },

    *login({ payload }, { call, put, select }) {  // eslint-disable-line
      
    },
    *register({ payload }, { call, put, select }) {  // eslint-disable-line
      yield put({type:'isRegister',payload:payload})
    },
      * getBankInfo({payload}, {call, put, select}) {
          const bankResult = yield call(services.getBankCard, payload);
          if (bankResult && bankResult.resCode != '0000') {
              Toast.info(bankResult.resMsg);
              return;
          }
          if (bankResult && bankResult.resCode == '888888') {
              //token 刷新成功
              window.G_dispatch({type: 'initDepositPage', payload: {payload}})
              return;
          }


          let bankCardList = bankResult ? bankResult.data.bankCardList[0] : {};
          yield put({
              type: 'refreshData', payload: {
                  bankCardList
              }
          })
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