export default {

    namespace: 'BankDepositoryResultPage',
  
    state: {
      prompt:'操作成功，请点击【下一步】完成操作',
      btnText:'下一步',
      result:'succssed', //三种状态，succssed 成功下一步，操作中processing，出错，error
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      *fetch({ payload }, { call, put }) {  // eslint-disable-line
        yield put({ type: 'save' });
      },
    },
  
    reducers: {
      save(state, action) {
        return { ...state, ...action.payload };
      },
    },
  
  };

  