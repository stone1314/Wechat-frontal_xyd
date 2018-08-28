export default {
    //借款期限类型
    loan_term_type:{
        "1":"天",
        "2":"周",
        "3":"月",
        "4":"年",
    },
    //短信业务类型(1: 注册 2 ：忘记密码 3 ：绑定银行卡 4 ：绑定新手机 5:购买理财产品 6:领取油费,8:短信登录时发送的验证码类别)
    API_SEND_SMS_TYPE: {
        REGISTER: '1',
        FORGET_PWD: '2',
        BIND_CARD: '3',
        BIND_PHONE: '4',
        TRADE_SMS: '5',
        SMS_LOGIN: '8',
    },
    //短信资源类型(1.文本 2.语音 3.图形)
    API_SMS_RES_TYPE: {
        TEXT: '1',
        VOICE: '2',
        IMAGE: '3'
    },
    //协议类型: 1普通协议 2产品合同协议 3图片路径
    AGREEMENT: {
        NORMAL: 1,
        PRODUC: 2,
        IMAGE: 3
    },
    // 协议CODE
    AGREEMENTCODE: {
        userRegister: 'userRegister',//用户注册协议
        kuaiJieDoc:'kuaiJieDoc',     //快捷支付服务协议
        delegateDoc: 'delegateDoc',//委托划扣授权书
        depositoryDoc: 'depositoryDoc', // 存管协议
        counponDoc: 'counponDoc',   //抵扣券使用规则图片
        experienceDoc: 'experienceDoc', //体验金规则图片
        redPktDoc: 'redPktDoc',  //红包规则图片
        risk_identification:"risk_identification",//风险提示函
    },
    /**
     * 操作类型
     * 代表存管开户、激活、充值、提现等操作，不同的操作跳转不同的 M 站页面
     * */
    OPERATE_ENUM: {
        DISPOSIT_KEY: 'DISPOSIT',
        WITHDRAW_KEY: 'WITHDRAW',
        OPENACCOUNT_KEY: 'OPENACCOUNT',//开通存管标识
        XYD_HFPWD_KEY:'XYDHFPWD',//信雅达恒丰交易密码
        LEND:'LEND',//出借
        CONTRACT_EXIT:'CONTRACT_EXIT',//主动退出
    }
}