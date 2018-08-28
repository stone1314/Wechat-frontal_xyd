/* eslint-disable no-dupe-keys no-restricted-globals*/
/**
 * Created by abrahamchen on 2017/9/6.
 */
const getHost = function () {
    let host;
    let wxHost;
    let ssoHost;
    const hosts = {
        dev: 'http://172.26.234.63:22',
        demo: 'http://172.26.234.63:22',


        //pro: 'http://172.16.150.33:9000',//http://172.29.23.37:9000',

        //pro: 'http://172.29.20.68:9000'//http://172.29.23.37:9000',
        //pro: 'http://172.16.36.31:9000'//http://172.29.23.37:9000',
        //  pro: 'http://172.16.35.39:9000', //刘维
        //  pro: 'http://172.29.20.27:9000', //张航

        //    pro: 'http://172.29.23.37:9000',//虎

       // pro: 'http://172.29.23.40:9000',//李浩

        // pro: 'http://172.16.150.33:9000',//测试
        pro: 'https://wx-sit-bkd.caimigs.com',//测试
        // pro: 'http://172.29.20.35:9000',//麻花
        // pro: 'http://172.29.20.68:9000',//云霄
        // pro: 'http://172.29.20.34:9000',//明杰

    };

    const wxHosts = {
        dev: 'https://borrower-demo.dianrong.com',
        demo: 'https://borrower-demo.dianrong.com',
        pro: 'https://borrower.dianrong.com',
    };

    const ssoHosts = {
        dev: 'https://auth-demo.dianrong.com/auth-server',
        demo: 'https://auth-demo.dianrong.com/auth-server',
        pro: 'https://auth.dianrong.com/auth-server',
    };

    if (location.hostname.match(/.+-dev/i)) {  // eslint-disable-line
        host = hosts.dev;
        wxHost = wxHosts.dev;
        ssoHost = ssoHosts.dev;
    } else if (location.hostname.match(/.+-demo/i)) {  // eslint-disable-line
        host = hosts.demo;
        wxHost = wxHosts.demo;
        ssoHost = ssoHosts.demo;
    } else {
        host = hosts.pro;
        wxHost = wxHosts.pro;
        ssoHost = ssoHosts.pro;
    }
    return {host, wxHost, ssoHost};
};

const {host, wxHost, ssoHost} = getHost();

export default {

    WX_HOST: wxHost, // wx signature

    // 本地服务器地址
    API_HOST: host, // 'https://172.29.20.24:8080',//

    // API_HOSTS: 'http://10.9.14.45:9001', // 'https://172.29.20.24:8080',//

    // sso系统服务器地址
    REMOTE_API_HOST: ssoHost,

    //日切状态查询
    CHECK_TIME:'/api/trade/checkTime',

    // 查询产品列表
    QUERY_PRODUCT_lIST: '/product/queryProductList',

    //登录

    API_TOKEN: '/api/token',


    //获取充值银行卡
    QUERY_BANK_CARD: '/api/bank/cardBindList',
    //获取可用余额接口
    QUERY_AVAIABLE_AMT: '/api/activity/getAccount',
    //充值接口
    DEPOSIT_AMT: '/api/trade/accountCharge',
    //校验交易密码
    HF_PASSWORD_CHECK:'/api/user/hfPasswordCheck',
    //获取控台配置数据
    WITHDRAW_CONFIG: '/api/others/sysConfig',
    //获取提现信息
    WITHDRAW_ASSETS: '/api/account/getAssets',
    //检查工作日
    WITHDRAW_CHECK_WORKTIME: '/api/trade/hfWithdrawCheckWorkTime',
    //提现接口
    WITHDRAW_AMT: '/api/trade/accountWithdraw',


    //banner
    BANNER: '/api/advertise',

    //产品列表，包括新手标（未登录）
    DEF_PRODUCT: '/api/product/queryProductDefList',
    //产品列表，包括新手标（登录）
    PRODUCT: '/api/product/queryProductList',

    //获取用户状态信息1
    ALLMONEY1: '/api/trade/getWealthNew',
    //获取用户状态信息2
    ALLMONEY2: '/api/account/getAssets',


    //交易记录列表
    //TRADERECORD:'/api/trade/hfWithdrawRecord',
    TRADERECORD: '/api/trade/hfTradeRecord',

    //安全退出
    LOGOUT: '/api/user/logout',


    //交易记录(购买产品详情)
    //TXINFO: '/api/trade/queryTxInfo',
    //交易记录(提现，充值，详情)
    //WITHDRAWRECORD:'/api/trade/hfWithdrawRecord',


    //刷新图形验证码
    REFRESH_IMG: '/api/image/refresh',


    //获取是否开通存管信息
    GET_USER_INFO_FROM_IT: '/api/user/getUserInfoFromIt',

    //获取短信验证码
    SEND_SMS: '/api/sendSms',
    //校验短信验证码
    VALIDATE_SMS: '/api/validateSms',
    //注册
    REGISTER_FWX: '/api/user/registerFWX',


    //单个产品详情
    PRODUCT_DETAIL: '/api/product/productDetail',

    //单个产品详情（不含乐猜宝）
    PRODUCT_DefList: '/product/queryProductDefList',

    //单个产品详情（不含乐猜宝）
    BID_LISTV: '/api/trade/bidListV',

    //设置登录密码
    RESET_LOGIN_PWD: '/api/user/resetLoginPassword',

    //提交风险评测答案
    RISK_ASSESSMENT: '/api/user/riskAssessment',

    //获取风险评测结果
    RISK_CAPACITY: '/api/user/riskCapacity',
    //获取用户详情
    QUERY_USER_DETAIL:'/api/user/queryUserDetail',


    //获取出借列表
    GET_CONTRACT_LIST: '/api/trade/getContractList',
    //获取出借列表详情(资产交易详情)
    QUERY_ASSERT_INFO: '/api/trade/queryAssertInfo',
    //判断是否节假日
    TRADE_RESERVER_EXIT_DATE_CHECK: '/api/trade/tradeReserverExitDateCheck',
    //修改预约退出日，密码校验
    VALIDATE_PWD: '/api/user/validatePwd',
    //修改预约退出日
    CONTRACT_RESERVER_EXIT: '/api/trade/contractReserveExit',
    //查询出借咨询与服务协议
    GET_AGREEMENT_URL: '/api/others/getAgreementUrl',
    //债权列表查询
    CREDITOR_RIGHT_V: '/api/trade/creditorRightsV',
    //字典值查询
    SYS_CONFIG: '/api/others/sysConfig',

    //懒猫-恒丰开户
    OPEN_HF_ACCOUNT: '/api/user/openhfAccountWechat',

    //信雅达-开户
    OPEN_XYD_HF_ACCOUNT:'/api/user/openAccount',

    //信雅达-设置交易密码
    SET_HF_PWD:'/api/user/hfPasswordSet',
   //信雅达-绑卡信息
    GET_BANK_INFO:'/api/bank/cardBindList',

    //设置提现卡
    SET_WITHDRAW_CARD:'/api/bank/setWithdrawCard',

    //出借前检查
    CHECK_BEFORE_TRADE: '/api/trade/checkBeforeTrade',
    //产品投资（含充值）出借(懒猫出借)
    INVEST: '/api/trade/invest',
    //产品投资（含充值）出借(信雅达出借)
    SAVE_TXINFO_NEW: '/api/trade/saveTxInfoNew',
    //虚户资产提现 含用户余额
    GET_ASSERTS: '/api/account/getAssets',
    //抵扣券查询
    QUERY_CAN_USED_COUPONS_LIST: '/api/coupon/queryCanUsedCouponsList',
    //体验金查询
    QUERY_CAN_USED_TY_COUPONS_LIST: '/api/coupon/queryCanUsedTYCouponsList',

    //绑卡
    //支持银行列表
    BANK_CARD_LIST: '/api/others/queryBankList',
    //语音、图形验证码是否超限接口
    QUERY_WINDOW_TYPE: '/api/image/queryWindowType',
    //协议
    AGREEMENT: '/api/agreement',
    //绑卡
    BIND_CARD: '/api/bank/cardbind',
    //判断是否开启协议支付
    IS_SIGNED_PAY: '/api/bank/isSignedPay',
    //协议支付申请
    SIGNED_PAY_APPLY: '/api/bank/signedPay',
    //协议支付确认
    SIGNED_PAY_CONFIRM:'/api/bank/confirmProtocolPayment',
    //获取出借用户列表
    GET_PRODUCT_SALE:'/api/product/getProductSale',
    //交易短信
    SEND_TRADE_SMS: '/api/sendTradeSms',
    //主动出借
    CONTRACT_EXIT:'/api/trade/contractExit',
    //微信自动登录接口
    AUTO_LOGIN_BIND:'/api/wechat/autoLoginBind',
};
