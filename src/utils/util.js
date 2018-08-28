/* eslint-disable no-unused-vars */
/* global wx:true*/
// import JsSignService from '../services/JsSign';
//
// export const getJsSign = (cb) => {
//   const link = encodeURIComponent(window.location.href.split('#')[0]);
//   JsSignService
//   .getJsSign({
//     url: (link),
//     mp: 'dianrongtest',
//   })
//   .then(
//     (res) => {
//       if (!res || res.result !== 'success') return;
//       const jsSign = res.content;
//       wx.config({
//         debug: false,  // 开启调试模式,调用的所有api的返回值会在客户端alert出来，
//                       // 若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
//         appId: jsSign.appId, // 必填，公众号的唯一标识
//         timestamp: jsSign.timestamp, // 必填，生成签名的时间戳
//         nonceStr: jsSign.nonceStr, // 必填，生成签名的随机串
//         signature: jsSign.signature, // 必填，签名，见附录1
//         jsApiList: [
//           'onMenuShareTimeline',
//           'onMenuShareAppMessage',
//           'onMenuShareQQ',
//           'onMenuShareWeibo',
//           'onMenuShareQZone',
//           'chooseImage',
//           'getLocation',
//           'getLocalImgData',
//           'uploadImage',
//         ], // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
//       });
//       wx.ready((result) => {
//         if (cb instanceof Function) {
//           cb();
//         }
//       });
//       wx.error((e) => {
//         console.log(e);
//           // config信息验证失败会执行error函数，如签名过期导致验证失败，
//           // 具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
//       });
//     },
//   ).catch((e) => {
//     console.log(e);
//   });
// };
import React from 'react'
import LoginService from '../services/loginService';
import {Toast, Modal} from 'antd-mobile';
import Config from '../constants/constant';
import md5 from 'js-md5'


export function checkBankCardNum(bankno) {
    if (/^([1-9]{1})(\d{7,18})$/.test(bankno)) {
        return true;
    } else {
        return false;
    }
}

/**
 * 校验手机号
 * */
export function isPhoneCorrect(phone) {
    if (/^1\d{10}$/.test(phone)) {
        return true;
    } else {
        return false;
    }
};

//格式化手机
export function formatMobile(mobile) {
    if (isPhoneCorrect(mobile)) {
        return `${mobile.substring(0, 3)}****${mobile.substring(7, 11)}`
    } else {
        return '';
    }
}

export function formatMoney(s, n) {
    const nn = n > 0 && n <= 20 ? n : 2;
    const ss = parseFloat((`${s || '0'}`).replace(/[^\d.-]/g, '')).toFixed(nn);
    const l = ss.split('.')[0].split('').reverse();
    const r = ss.split('.')[1];
    let t = '';
    for (let i = 0; i < l.length; i += 1) {
        t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? ',' : '');
    }
    return `${t.split('').reverse().join('')}.${r}`;
}

// 格式化我的借款日期
export function formatDate(time) {
    const date = new Date(time);
    const y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? (`0${m}`) : m;
    let d = date.getDate();
    d = d < 10 ? (`0${d}`) : d;
    let minute = date.getMinutes();
    let second = date.getSeconds();
    minute = minute < 10 ? (`0${minute}`) : minute;
    second = second < 10 ? (`0${second}`) : second;
    return `${y}.${m}.${d}`;
}

// 格式化我的还款日期
export function formatRepaymentDate(time) {
    const date = new Date(time);
    const y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? (`0${m}`) : m;
    let d = date.getDate();
    d = d < 10 ? (`0${d}`) : d;
    let minute = date.getMinutes();
    let second = date.getSeconds();
    minute = minute < 10 ? (`0${minute}`) : minute;
    second = second < 10 ? (`0${second}`) : second;
    return `${d}`;
}

// 格式化我的借款周期
export function formatMaturityType(maturityType) {
    switch (maturityType) {
        case 'MONTHLY':
            return '个月';
        case 'DAILY':
            return '日';
        case 'WEEKLY':
            return '周';
        case 'DOUBLEWEEKLY':
            return '双周';
        default:
            break;
    }
}

// 格式化审核状态模块我的借款周期
export function formatAduitStateMaturityType(maturityType) {
    switch (maturityType) {
        case 'MONTHLY':
            return '月';
        case 'DAILY':
            return '日';
        case 'WEEKLY':
            return '周';
        case 'DOUBLEWEEKLY':
            return '双周';
        default:
            break;
    }
}

// 格式化我的借款金额
export function formatNumber(num, precision, separator) {
    let parts;
    // 判断是否为数字
    if (!isNaN(parseFloat(num)) && isFinite(num)) {
        // 处理小数点位数
        var num = (typeof precision !== 'undefined' ? Number(num).toFixed(precision) : Number(num)).toString();
        // 分离数字的小数部分和整数部分
        parts = num.split('.');
        // 整数部分加[separator]分隔
        parts[0] = parts[0].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, `$1${separator || ','}`);
        console.log(parts.join('.'));
        return parts.join('.');
    }
    return null;
}

// 格式化还款计划列表还款状态
export function formatRepayStatusList(paymentStatus) {
    switch (paymentStatus) {
        case 'S14_PENDING_GRACE_PERIOD':
        case 'S15_PENDING_LATE16_31':
        case 'S16_CLOSED_UNPAID':
            return '逾期';
        case 'S11_FUTURE':
        case 'S12_NOTIFIED':
        case 'S13_PENDING_ACH':
            return '待还款';
        case 'S17_CLOSED_PAID':
            return '已还完';
        default:
            break;
    }
}

// 格式化还款状态
export function formatRepayStatus(paymentStatus) {
    switch (paymentStatus) {
        case 'S14_PENDING_GRACE_PERIOD':
        case 'S15_PENDING_LATE16_31':
        case 'S16_CLOSED_UNPAID':
            return '逾期';
        case 'S11_FUTURE':
        case 'S12_NOTIFIED':
        case 'S13_PENDING_ACH':
            return '本期待还';
        case 'S17_CLOSED_PAID':
            return '本期已结清';
        default:
            break;
    }
}

// 格式化我的还款日期
export function formatRepayDate(time) {
    const date = new Date(time);
    const y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? (`0${m}`) : m;
    let d = date.getDate();
    d = d < 10 ? (`0${d}`) : d;
    let minute = date.getMinutes();
    let second = date.getSeconds();
    minute = minute < 10 ? (`0${minute}`) : minute;
    second = second < 10 ? (`0${second}`) : second;
    return `${y}年${m}月${d}日`;
}

// 格式化贷款产品列表
export function formatLoanProduct(productCode) {
    switch (productCode) {
        case 'OUTSTANDING':
            return '新贵贷';
        case 'PAYROLL':
            return '工薪贷';
        case 'PRIVATE_OWNER':
            return '助业贷';
        case 'SMB':
            return '小微企业信用贷';
        case 'MCA':
            return '商户预借信用贷';
        case 'PROPERTY_OWNER':
            return '业主贷';
        case 'MOBILE':
            return '手机贷';
        case 'BD_CAR_W':
            return 'BD车贷 批售融资';
        case 'BD_CAR_R':
            return 'BD车贷 零售融资';
        case 'BD_CAR_M':
            return 'BD车贷 抵押融资';
        case 'BD_HOUSE_AP':
            return 'BD房贷 首付款';
        case 'BD_WAREHOUSE_RECEIPT_PLEDGE':
            return 'BD 仓单质押';
        case 'BD_FB':
            return 'BD 保理业务';
        case 'BD_GC':
            return 'BD 担保公司';
        case 'BD_SL':
            return 'BD 小贷公司';
        case 'BD_OTHER':
            return 'BD 其他';
        case 'SZB_HELP_INDUSTRY':
            return 'SZB 助业贷';
        case 'SZB_PAYROLL':
            return 'SZB 工薪贷';
        case 'SZB_POS':
            return 'SZB POS贷';
        case 'SZB_LEYE':
            return 'SZB 乐业贷';
        case 'DOWN_PAYMENT':
            return '首付贷';
        case 'ONLINE':
            return '线上贷款';
        case 'DOUBLE_FUND':
            return '双金贷';
        case 'CONSUMER':
            return '消费贷';
        case 'PERSONAL_MORTGAGE':
            return '个人抵押贷款';
        case 'BRIDGE_PROPERTY_EXCHANGE':
            return '尾款贷';
        case 'REDEEM_HOUSE_LOAN':
            return '赎楼贷';
        case 'LIFE_INSURANCE':
            return '寿险贷';
        case 'ELOAN':
            return '融E贷';
        case 'INVESTMENT':
            return '投资贷';
        case 'CASH_LOAN':
            return '现金贷';
        case 'MCA_GREENLANE_ONLINE':
            return 'MCA绿色通道线上版';
        case 'MCA_GREENLANE_OFFLINE':
            return 'MCA绿色通道线下版';
        case 'MCA_SIMPLIFIED':
            return 'MCA简版';
        case 'ENTERPRISE_MORTGAGE':
            return '企业抵押贷';
        case 'SPEED_LOAN':
            return '超速贷';
        case 'SCP_CHAIN':
            return '供应链';
        case 'ORD_LOAN':
            return '购易贷';
        case 'CASH_OUT':
            return '变现贷';
        case 'ELOAN_BUSINESS':
            return '融e贷企业版';
        case 'CAR_OWNER':
            return '车主贷';
        case 'PERSONAL_RELOAN':
            return '续贷';
        case 'DOUBLE_FUND_ONLINE':
            return '51公积金';
        case 'HIGH_SALARY':
            return '优薪贷';
        case 'LOG':
            return '司机贷';
        // 标准个贷（lite新产品）
        case 'PL-CLO-YSDAI01-000000-01':
            return 'A优薪贷';
        case 'PL-CLO-YCDAI01-000000-01':
            return 'A优车贷 ';
        case 'PL-CLO-SXDAI01-000000-01':
            return 'A寿险贷';
        case 'PL-CLO-SJDAI02-000000-01':
            return 'A双金贷';
        case 'PL-CLO-XGDAI01-000000-01':
            return 'A新贵贷';
        case 'PL-CLO-YZDAI01-000000-01':
            return 'A业主贷';
        // 续贷（lite新产品）
        case 'PL-CLO-YXDAISJ-000000-01':
            return 'A续贷';  // return '双金贷续贷'
        case 'PL-CLO-YXDAISX-000000-01':
            return 'A续贷';  // return '寿险贷续贷'
        case 'PL-CLO-YXDAIXG-000000-01':
            return 'A续贷';  // return '新贵贷续贷'
        case 'PL-CLO-YXDAIGX-000000-01':
            return 'A续贷';  // return '工薪贷续贷'
        case 'PL-CLO-YXDAIZY-000000-01':
            return 'A续贷';  // return '助业贷续贷'
        case 'PL-CLO-YXDAI0YZ-000000-01':
            return 'A续贷';  // return '业主贷续贷'
        default:
            break;
    }
}

// 格式化贷款状态
export function formatLoanStatus(status) {
    switch (status) {
        case 'ERROR':
            return '状态异常';
        case 'NEW':
        case 'PREHOLD':
            return '继续申请';
        case 'CREATED':
            return '待审核';
        case 'SUBMITTED':
        case 'IN_REVIEW':
        case 'PRE_APPROVED':
            return '审核中';
        case 'HOLD':
            return '待补件';
        case 'APPROVED':
        case 'OFFER_ACCEPTED':
        case 'ACCEPTED':
            return '待签约';
        case 'IN_FUNDING':
        case 'ISSUING':
            return '待放款';
        case 'ISSUED':
        case 'CURRENT':
        case 'GRACE_CURRENT':
        case 'OVERDUE':
        case 'DEFAULTED':
        case 'SETTLED':
            return '已放款';
        case 'REJECTED':
            return '已拒绝';
        case 'WITHDRAWN':
        case 'EXPIRED':
            return '已取消';
        default:
            break;
    }
}

// 获取querystring的值
export function getUrlParam(name) {
    const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
    const r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]);
    return null;
}

/**
 * 页面跳转
 * @param ithis this
 * @param path 欲跳转至的页面
 */

export function jumpToPage(ithis, path, param) {
    ithis.props.history.push({pathname: path, state: param});
}

export function mapState(index) {
    switch (index) {
        case '0':
            return '交易成功';
        case '1':
            return '交易处理中';
        case '2':
            return '交易失败';
        default:
            return '交易失败';
    }
}

//"isOpenHfAccount": "0", \\是否开通存管(0未开户 1已开户 2未激活3开户处理中)
export function mapOpenLmAccount(index) {
    switch (index) {
        case '0':
            return '开通存管';
        case '1':
            return '已开通存管';
        case  '2':
            return '未激活存管';
        case '3':
            return '开户处理中';
    }
}

/**
 * 刷新token
 */
export function refreshToken() {
    let params = {
        grant_type: "password",
        sysId: "qIOS",
        clientIp: "111",
        ip: "111",
        client_id: "wechat",
        client_secret: "000000",
        refresh_token: window.localStorage.getItem("refreshToken")
    };
    LoginService.refreshToken(params).then((res) => {
        if (res.access_token) {
            //刷新token成功
            let storage = window.localStorage;
            storage.setItem('token', res.access_token);//用户token
            storage.setItem('refreshToken', res.refresh_token);//refresh_token
            storage.setItem('expiresIn', res.expires_in);//token有效时间
            return true;
        } else {
            return false;
        }
    }).catch((err) => {
        console.log(err);
    })
}

export function note(result) {
    if (result) {
        switch (result.resCode) {
            case '0001':
                Toast.info(result.resMsg);
                break;
            default:
                break;
        }
    }
}

/**
 * 验证日切
 */
export function noteHF(_this, action, callback) {
    LoginService.getChkTime().then((result) => {
        console.log(result);
        if (result.resCode == '0000') {
            if (noteMsg(_this, action)) {
                callback();
            }

        } else if (result.resCode == '0105') {
            Toast.info(result.resMsg);
        }
        else {
            Toast.info(result.resMsg);
        }
    })
}

export function noteMsg(_this, action) {
    let user = window.localStorage.getItem("userInfo");
    if (user) {
        let userInfo = JSON.parse(user);
        if (!userInfo.isOpenHfAccount || userInfo.isOpenHfAccount == '0') {
            showMsg(
                '您的账户还未开通恒丰银行存管账户',
                '',
                '取消',
                '去开通',
                '/xydBankDepositoryPage',
                _this
            )
            return false;
        }

        if (!userInfo.isSetHfPassword || userInfo.isSetHfPassword == '0') {
            showMsg(
                '',
                '您还未设置交易密码',
                '取消',
                '去设置',
                'setHFPwd',
                _this
            )
            return false;
        }

        if (!userInfo.isBindCard || userInfo.isBindCard == '0') {
            showMsg(
                '',
                '您还未绑定银行卡',
                '取消',
                '去绑定',
                '/addBankCard',
                _this
            )
            return false;
        }


        if (!userInfo.isWithdrawCard || userInfo.isWithdrawCard == '0' && action == 'withdraw') {
            showMsg(
                '',
                '您还未设置提现银行卡',
                '取消',
                '去绑定',
                '/myBankPage',
                _this
            )
            return false;
        }

        return true;
    } else {
        _this.props.history.push({pathname: '/login'});
        return false;
    }
}

export function showMsg(title, content, btn1, btn2, pathname, _this) {
    const alert = Modal.alert;
    const alertInstance =
        alert(title, <div style={{
            fontSize: `${17 / 37.5}rem`,
            color: 'black',
            marginTop: `${30 / 37.5}rem`,
            marginBottom: `${30 / 37.5}rem`
        }}>{content}</div>, [
            {text: btn1, onPress: () => console.log('cancel'), style: 'default'},
            {
                text: btn2, onPress: () => {
                    if (pathname == 'setHFPwd') {
                        setPwd(_this);
                    } else {
                        window.G_history.push({pathname: pathname});
                    }
                }
            },
        ]);
}

/**
 * 转恒丰设置密码页面
 */
export function setPwd(_this) {
    console.log('_this', _this);
    let token = window.localStorage.getItem('token');
    if (token) {
        _this.props.dispatch({
            type: 'xydBankModel/setHFPwd',
            payload: {
                s_this: _this,
                callback: (result, this_) => {
                    //记录操作动作
                    window.localStorage.setItem('operateType', Config.OPERATE_ENUM.XYD_HFPWD_KEY);
                    console.log('设置：operateType', Config.OPERATE_ENUM.XYD_HFPWD_KEY);
                    this_.props.history.push(
                        {pathname: '/pospResult', state: {pospHtml: result}}
                    )
                }
            }
        });
    } else {
        Toast.info('请重新登录！');
        _this.props.history.push({pathname: '/login'});
    }
}


export function showAlert(_this) {
    let userInfo = window.localStorage.getItem("userInfo");
    let user = JSON.parse(userInfo);
    if (user && user.isOpenHfAccount == '0') {
        const alert = Modal.alert;
        const alertInstance = alert('您的账户还未开通恒丰银行存管账户', ' ', [
            {text: '取消', onPress: () => alertInstance.close(), style: 'default'},
            {text: '去开通', onPress: () => _this.props.history.push({pathname: '/bankDepositoryPage'})},
        ]);
    } else {
        return true;
    }
};


//绑卡提示
/*export function setBankCar(_this) {
 const alert = Modal.alert;
 const alertInstance = alert('', <div style={{fontSize: `${17 / 37.5}rem`, color: 'black'}}>您还未绑定银行卡</div>, [
 {text: 'Cancel', onPress: () => console.log('cancel'), style: 'default'},
 {
 text: 'OK', onPress: () => {
 _this.props.history.push({pathname: '/bankDepositoryPage'});
 }
 },
 ]);
 }*/

//提现卡页面
/*export function setGetBankCar(_this) {
 const alert = Modal.alert;
 const alertInstance = alert('', <div style={{fontSize: `${17 / 37.5}rem`, color: 'black'}}>您还未设置提现银行卡</div>, [
 {text: 'Cancel', onPress: () => console.log('cancel'), style: 'default'},
 {
 text: 'OK', onPress: () => {
 _this.props.history.push({pathname: '/bankDepositoryPage'});
 }
 },
 ]);
 }*/

/*
 //设置交易密码
 export function setPwd(_this) {
 const alert = Modal.alert;
 const alertInstance = alert('', <div style={{fontSize: `${17 / 37.5}rem`, color: 'black'}}>您还未设置交易密码</div>, [
 {text: 'Cancel', onPress: () => console.log('cancel'), style: 'default'},
 {
 text: 'OK', onPress: () => {
 _this.props.history.push({pathname: '/bankDepositoryPage'});
 }
 },
 ]);
 }
 */


/**
 * 日期格式化
 * @param time 时间戳
 * @returns {string} 2018-09-09
 */
export function timeToDate(time) {
    let date = new Date(time);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    month = month + "";
    month = month.length == 1 ? "0" + month : month;
    let day = date.getDate()+"";
    day = day.length == 1 ? "0" + day : day;
    return year + "-" + month + "-" + day;
}

/**
 * 格式化出借参数
 * @param yzm 验证码
 * @returns {string} 2018-09-09
 */
export function formatLendParam(yzm) {
    //获取时间戳
    let localStorage = window.localStorage;
    let time = new Date().getTime();
    let param = JSON.parse(localStorage.getItem("operateParam"));
    if (yzm && yzm !== "") {
        param.validateCode = yzm;
    }
    let params = "000000timestamp=" + time + "bizContent=" + JSON.stringify(param);
    param.bizContent = JSON.stringify(param);
    param.sign = md5(params);
    param.timestamp = time;
    localStorage.setItem("operateParam", JSON.stringify(param));
}

/**
 * 判断是否微信环境
 * @returns {boolean}
 */
export function isWeiXin() {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger' || ua.match(/_SQ_/i) == '_sq_') {
        return true;
    } else {
        return false;
    }
}

/**
 * 记录返回Url
 */
export function setBackUrl(url) {
    window.sessionStorage.setItem('BACK_URL', url)
}

/**
 * 获取返回Url
 */
export function getBackUrl() {
    return window.sessionStorage.getItem('BACK_URL') || '/';
}