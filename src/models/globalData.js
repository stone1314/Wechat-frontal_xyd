/**
 * Created by abrahamchen on 2017/9/28.
 */
import { Toast } from 'antd-mobile';

export default {

  namespace: 'globalData',

  state: {
    isLoading: false,
    loadingNum: 0,
    wholeFlowLogin: false,
    wholeFlowAuthen: false,
    loanAppId: '',
    isRegister:true,//ture-注册 false-改密
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

    // 处理需要登录的情况
    *needLogin({payload}, {call, put, select}) {  // eslint-disable-line
      
    },

    *login({ payload }, { call, put, select }) {  // eslint-disable-line
      
    },
    *register({ payload }, { call, put, select }) {  // eslint-disable-line
      yield put({type:'isRegister',payload:payload})
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
