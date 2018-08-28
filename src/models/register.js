export default {
    namespace:'register',
    state:{
        registerMobile:null,
    },
    subscriptions:{

    },
    effects:{
        *setMobile({payload},{call,put}){
            yield put({type:'reMobile',payload:payload});
        }
    },
    reducers:{
        reMobile(state,action){
            return{...state,...action.payload};
        }
    }
}