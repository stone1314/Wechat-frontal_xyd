export default {
    mobileReg:/^1[3,4,5,6,7,8,9]\d{9}$/,//手机号格式正则
    pwdReg:/^(?:(?=.*[0-9].*)(?=.*[A-Za-z].*)(?=.*[,\.#%'\+\*\@\-:;^_~!"?()/=&\\<>¥|[\]{}`].*))[,\.#%'\+\*\@\-:;^_~!"?()/=&\\<>¥|[\]{}`0-9A-Za-z]{8,14}$/,//数字、字符、字母组合密码正则
    identityCard: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,//身份证15位，18位

}