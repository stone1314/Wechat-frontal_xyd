/**
 * Created by abrahamchen on 2017/9/28.
 */
import { Toast } from 'antd-mobile';
import PIServices from '../services/productInfoServices';
export default {

  namespace: 'lecaiProductDetail',

  state: {
    productDetail:null,
    answers:[],
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },

  effects: {
    // 
    *jumpToDetail({payload}, {call, put, select}) {  // eslint-disable-line
      let { productDetail } = yield select(state => ({
        productDetail: state.lecaiProductDetail.productDetail,
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
    refreshData(state, action) {
      return { ...state, ...action.payload };
    },
  },
};