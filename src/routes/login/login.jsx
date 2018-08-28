/**
 * created by bingdu 2018.06.14
 */

import  React from 'react';
import {connect} from 'dva';
import loginStyle from './login.less';
import { Button,Toast} from 'antd-mobile';

import backImg from '../../asserts/login/arrowback@2x.png';
import logoImg from '../../asserts/login/logo@2x.png';

import {jumpToPage} from '../../utils/util'
import LoginService from '../../services/loginService'
import RegisterService from '../../services/registerService'
import md5 from 'js-md5'
import regUtil from '../../utils/regUtil'
import {isWeiXin} from '../../utils/util'
import BackHeader from '../../components/backHeader/backHeader'



class Login extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isChecked:false,//true：表单已填写完整 false：表单未填写完整
            mobile:null,//用户手机号
            pwd:null,//用户密码
            iType:"password",//密码输入框的type
            iTypeImg:" iconfont icon-biyan1",//眼睛图片的样式
        };
    }

    /**
     *  登录
     */
    login = () =>{
        let reg = regUtil.mobileReg;
        if(!reg.test(this.state.mobile)){
            Toast.fail("手机号格式不正确");
            return;
        }
        let isWX = isWeiXin();
        let params = null;
        if(isWX){//微信环境
            let openid = window.sessionStorage.getItem("openid");
            params = {grant_type:"password",sysId:"qIOS",clientIp:"111",wechatId:"",ip:"111",client_id:"wechat",client_secret:"000000",username:this.state.mobile,password:md5(this.state.pwd).toUpperCase(),wechatId:openid};
        }else{//非微信环境
            params = {grant_type:"password",sysId:"qIOS",clientIp:"111",wechatId:"",ip:"111",client_id:"wechat",client_secret:"000000",username:this.state.mobile,password:md5(this.state.pwd).toUpperCase()};
        }
        LoginService.login(params).then(
            (res)=>{
                console.log(res);
                if(res.access_token){
                    //登录成功
                    let storage=window.localStorage;
                    storage.setItem('token',res.access_token);//用户token
                    storage.setItem('refreshToken',res.refresh_token);//refresh_token
                    storage.setItem('expiresIn',res.expires_in);//token有效时间

                    //获取用户信息
                    this.props.dispatch({type: 'login/getUserInfo',payload:{token:res.access_token}});
                    //获取返回标识字段 如果是1 则跳转到"我的"页面
                    if(storage.getItem("login") == "1"){
                        // this.props.history.push({pathname: '/',tabType:1})
                        window.localStorage.setItem('tabState','chosened')
                        this.props.history.push({pathname: '/MyLends'});
                    }else{
                        this.backToPage();
                    }

                }else{
                    //登录失败
                    Toast.info(res.error_description);
                }
            }
        ).catch(
            (err)=>{
                Toast.info("登录失败");
                console.log(err);
            }
        );
        // this.props.dispatch({type:'login/login',payload:param})
    }
    /**
     * 输入登录信息
     * @param flag 0：输入手机号 1：输入密码
     */
    inputLoginInfo = () =>{
        //获取当前输入的手机号
        // let mobile = document.getElementById('mobile').value;
        let mobile = this.refs.mobile.value;
        //获取当前输入的密码
        let pwd = this.refs.pwd.value;
        if(mobile != '' && pwd != ''){
            this.setState({
                isChecked:true,
                mobile:mobile,
                pwd:pwd
            })
        }else{
            this.setState({
                isChecked:false,
            })
        }
    }
    /**
     * 跳转到注册页面
     * @param flag true-注册 false-忘记密码
     */
    jumpToRegister = (flag) =>{
        let localStorage = window.localStorage;
        if(flag){
            localStorage.setItem("isRegister",true);
            // this.props.dispatch({type: 'globalData/register', payload: {isRegister: true}});
        }else{
            localStorage.setItem("isRegister",false);
            // this.props.dispatch({type: 'globalData/register', payload: {isRegister: false}});
        }
        jumpToPage(this,'./register');
    }



    /**
     *  返回
     */
    backToPage = () =>{
        this.props.history.goBack();
    }
    /**
     * 验证密码输入 只能输入字符和数字
     */
    validatePwd =() =>{
        let pwd = this.refs.pwd.value;
        this.refs.pwd.value = pwd.replace(/[^\w\.\/]/ig,'');
    }
    /**
     * 点击按钮切换密码明文和密文
     */
    downYan = () =>{
        if(this.state.iType === "text"){
            this.setState({
                iType:"password",
                iTypeImg:" iconfont icon-biyan1"
            })
        }else{
            this.setState({
                iType:"text",
                iTypeImg:" iconfont icon-zhengyan",
            })
        }
    }

    test = () =>{
        console.log("sbgkhjsdladsfbakhdjbfkjdfjvbdfb");
    }

    render(){
        let backInfo = {title:"标题",rightAction:this.test.bind(this),rightActionText:"右侧",backType:"0"}
        return(
            <div className={loginStyle.main}>
                <BackHeader
                    title="登录"
                    backType="0"
                    _this={this}
                ></BackHeader>
                <div className={loginStyle.logoDiv}>
                    <img className={loginStyle.logoImg} src={logoImg} />
                </div>
                <div className={loginStyle.textDiv}>
                    <div className={loginStyle.testDiv_ID}>
                        <i className={loginStyle.shoujiImg + ' iconfont icon-shouji'}/>
                        <input ref="mobile" autoComplete="off" className={loginStyle.textDiv_test} type="tel" maxLength={11} placeholder="请输入手机号" onChange={this.inputLoginInfo.bind(this)}></input>
                    </div>
                    <div className={loginStyle.hr}></div>
                    <div className={loginStyle.testDiv_ID}>
                        <i className={loginStyle.mimaImg + ' iconfont icon-mima'}/>
                        <input ref="pwd" autoComplete="off" className={loginStyle.textDiv_test} type={this.state.iType} maxLength={14} placeholder="请输入密码" onChange={this.inputLoginInfo.bind(this)}></input>
                        <i className={loginStyle.checkPwdImg + this.state.iTypeImg} onClick={this.downYan.bind(this)}/>
                    </div>
                </div>
                <div className={loginStyle.forgetPwd}>
                    <span onClick={this.jumpToRegister.bind(this,false)}>忘记密码？</span>
                </div>
                <div className={loginStyle.btnDiv}>
                    {
                        this.state.isChecked?
                            <Button activeClassName={loginStyle.btnC} className={[loginStyle.btnSub,loginStyle.btn]} onClick={this.login.bind(this)}>
                                登录
                            </Button>:
                            <Button disabled activeClassName={loginStyle.btnC} className={[loginStyle.btnSub,loginStyle.btn]}>
                                登录
                            </Button>
                    }

                </div>
                <div className={loginStyle.registerDiv}>
                    <div className={loginStyle.registerBtn} onClick={this.jumpToRegister.bind(this,true)}>
                        立即注册
                    </div>
                </div>
            </div>
        )

    }

}
Login.propTypes = {};

export default connect(({login}) => {
    return {
        login
    };
})(Login);
