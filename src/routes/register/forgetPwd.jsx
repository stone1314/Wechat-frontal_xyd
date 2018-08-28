/**
 * created by bingdu 2018.06.14
 */

import  React from 'react';
import {connect} from 'dva';
import loginStyle from '../login/login.less';
import { Button,Toast} from 'antd-mobile';

import backImg from '../../asserts/login/arrowback@2x.png';
import logoImg from '../../asserts/login/logo@2x.png';

import {jumpToPage,isWeiXin} from '../../utils/util'
import RegisterService from '../../services/registerService'
import LoginService from '../../services/loginService'
import md5 from 'js-md5'
import regUtil from '../../utils/regUtil'
import BackHeader from '../../components/backHeader/backHeader'



class ForgetPwd extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            pwd:null,//用户密码
            text:'请设置密码',//输入框默认展示内容
            iType:"password",//密码输入框的type
            iTypeImg:" iconfont icon-biyan1",//眼睛图片的样式
        };
    }

    /**
     * 用户登录
     */
    login =(mobile,pwd)=>{
        let params = {grant_type:"password",sysId:"qIOS",clientIp:"111",wechatId:"",ip:"111",client_id:"wechat",client_secret:"000000",username:mobile,password:md5(pwd).toUpperCase()};
        LoginService.login(params).then((res)=>{
            if(res.access_token){
                //登录成功
                let storage=window.localStorage;
                storage.setItem('token',res.access_token);//用户token
                storage.setItem('refreshToken',res.refresh_token);//refresh_token
                storage.setItem('expiresIn',res.expires_in);//token有效时间
                // jumpToPage(this,'./');
                this.props.history.push({pathname: '/MyLends'})
                this.queryUserDetail(res.access_token);
            }else{
                //登录失败
                Toast.info(res.error_description);
            }
        }).catch((err)=>{
            Toast.fail("登录失败");
            console.log(err);
        })
    };

    /**
     * 获取用户信息
     * @param token 用户token
     */
    queryUserDetail = (token)=>{
        this.props.dispatch({type: 'login/getUserInfo',payload:{token:token}});
        //获取用户信息
/*        let userParams = {sysId:'qIOS',appVersion:'',appBuildVersion:'',client_id:'wechat',authToken:token};
        RegisterService.queryUserDetail(userParams).then((res)=>{
            if(res.resCode === '0000'){
                // Toast.info("获取用户信息成功");
                window.localStorage.setItem("userInfo",JSON.stringify(res.data));
            }else{
                Toast.fail(res.resMsg);
            }
        }).catch((err)=>{
            console.log(err);
        })*/
    }

    /**
     * 注册
     */
    retister = () =>{
        let pwd = this.state.pwd;
        // if(pwd.length <8){
        //     Toast.fail("密码不足8位");
        //     return;
        // }
        let reg = regUtil.pwdReg;
        if(!reg.test(pwd)){
            Toast.fail("密码由8~14位字母、字符、数字组成");
            return;
        }
        let localStorage = window.localStorage;
        let isRegister = localStorage.getItem("isRegister");
        let mobile = this.props.register.registerMobile;

        if(isRegister === 'true'){
            let yzm = localStorage.getItem("yzm");
            let param = null;
            if(mobile){
                let isWX = isWeiXin();
                let params = null;
                if(isWX){//微信环境
                    let openid = window.sessionStorage.getItem("openid");
                    param = {sysId:'qIOS',appVersion:'',appBuildVersion:'',mobile:mobile,wechatId:'',wechatName:'',validateCode:yzm,loginPassword:md5(this.state.pwd).toUpperCase(),client_id:'wechat',wechatId:openid};
                }else{//非微信环境
                    param = {sysId:'qIOS',appVersion:'',appBuildVersion:'',mobile:mobile,wechatId:'',wechatName:'',validateCode:yzm,loginPassword:md5(this.state.pwd).toUpperCase(),client_id:'wechat'};
                }
            }else{
                Toast.info('未获取到手机号');
                return;
            }
            //新用户注册
            RegisterService.registerFWX(param).then((res)=>{
                if(res.resCode === '0000'){
                    //注册成功
                    Toast.info("注册成功");
                    //添加第一次注册标识
                    window.localStorage.setItem("firstRegister","1");
                    //注册成功自动登录
                    this.login(mobile,this.state.pwd);

                }else{
                    //注册失败
                    Toast.info(res.resMsg);
                }
            }).then((err)=>{
                console.log(err)
            })
        }else{
            let param = null;
            if(mobile){
                param = {sysId:'qIOS',client_id:'wechat',mobile:mobile,loginPassword:md5(this.state.pwd).toUpperCase()};
            }else{
                Toast.info('未获取到手机号');
                return;
            }
            //老用户改密
            //设置密码
            RegisterService.resetLoginPassword(param).then((res)=>{
                if(res.resCode == '0000'){
                    //密码设置成功
                    Toast.info("密码设置成功");
                    //改密成功自动登录
                    this.login(mobile,this.state.pwd);
                }else{
                    Toast.fail(res.resMsg);
                }
            }).catch((err)=>{
                console.log(err);
            })
        }

    }

    /**
     * 输入登录信息
     * @param
     */
    inputLoginInfo = () =>{
        let pwd = this.refs.pwd.value;
        if(pwd !=null && pwd != '' && pwd){
            this.setState({
                pwd:pwd,
            })
        }else{
            this.setState({
                pwd:null,
            })
        }
    }
    /**
     * 跳转到
     */
    jumpToRegister = () =>{
        jumpToPage(this,'./register');
    }

    /**
     *  返回
     */
    backToPage = () =>{
        this.props.history.goBack();
    }

    componentWillMount =()=>{
        if(window.localStorage.getItem("isRegister")=== 'true'){
            this.setState({
                text:'请设置密码'
            })
        }else{
            this.setState({
                text:'请设置新密码'
            })
        }
    }
    /**
     * 验证密码输入
     */
    // validatePwd =() =>{
    //     let pwd = this.refs.pwd.value.replace(/[^\w\.\/]/ig,'');
    //     this.refs.pwd.value = pwd;
    //     if(pwd !=null && pwd != '' && pwd){
    //         this.setState({
    //             pwd:pwd,
    //         })
    //     }
    // }
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
    render(){
        return(
            <div className={loginStyle.main}>
                <BackHeader
                    title="设置密码"
                    backType="0"
                    _this={this}
                ></BackHeader>
                <div className={loginStyle.logoDiv}>
                    <img className={loginStyle.logoImg} src={logoImg} />
                </div>
                <div className={loginStyle.textDivPwd}>
                    <div className={loginStyle.testDiv_ID}>
                        <i className={loginStyle.mimaImg + ' iconfont icon-shouji'}/>
                        <input ref="pwd" className={loginStyle.textDiv_test} autoComplete="off" type={this.state.iType} minLength={8} maxLength={14} placeholder={this.state.text} onChange={this.inputLoginInfo.bind(this)}></input>
                        <i className={loginStyle.checkPwdImg + this.state.iTypeImg} onClick={this.downYan.bind(this)}/>
                    </div>
                </div>
                <div className={loginStyle.changePwd}>
                    密码由8~14位字母、字符、数字组成
                </div>
                <div className={loginStyle.btnDiv}>
                    {
                        this.state.pwd?
                            <Button activeClassName={loginStyle.btnC} className={[loginStyle.btnSub,loginStyle.btn]} onClick={this.retister.bind(this)}>
                                完成
                            </Button>:
                            <Button disabled activeClassName={loginStyle.btnC} className={[loginStyle.btnSub,loginStyle.btn]}>
                                完成
                            </Button>
                    }

                </div>
            </div>
        )

    }

}
ForgetPwd.propTypes = {};

export default connect(({forgetPwd,globalData,register}) => {
    return {
        forgetPwd,
        globalData,
        register
    };
})(ForgetPwd);
