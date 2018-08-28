/**
 * created by bingdu 2018.06.14
 */

import  React from 'react';
import {connect} from 'dva';
import loginStyle from '../login/login.less';
import { Button,Toast} from 'antd-mobile';

import backImg from '../../asserts/login/arrowback@2x.png';
import logoImg from '../../asserts/login/logo@2x.png';
import shouji from '../../asserts/login/shouji@2x.png';
import yzm from '../../asserts/login/yanzhengma@2x.png';

import RegisterService from '../../services/registerService';

import {jumpToPage} from '../../utils/util'
import Constant from '../../constants/requestConstantValue';
import regUtil from '../../utils/regUtil';
import BackHeader from '../../components/backHeader/backHeader'





class Register extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            mobile:null,//手机号
            pwd:null,//密码
            isToast:false,//是否显示验证码提示框
            btnText:'获取验证码',//获取验证码按钮展示内容
            yzmErr:null,//图形验证码输入错误时
            beginTime:60,//倒计时开始时间
            imgSrc:null,//验证码路径
            imgYZMbtn:true,//获取验证码按钮是否可点击 true-可以 false-不可以
        };
        this.STO = null;//setTimeOut临时值
        this.yzmTime = "";//记录图形验证码超过次数的开始时间
        this.title = "";//标题
    }
    /**
     * 输入手机号
     */
    inputMobile = () =>{
        //获取当前输入的手机号
        let mobile = this.refs.mobile.value;
        if(mobile.length === 0){
            this.setState({
                mobile:null,
            })
        }else{
            this.setState({
                mobile:mobile,
            })
        }

    }
    inputPwd = () =>{
        //获取当前输入的密码
        let pwd = this.refs.pwd.value;
        if(pwd.length === 0){
            this.setState({
                pwd:null,
            })
        }else{
            this.setState({
                pwd:pwd,
            })
        }

    }
    /**
     * 刷新图形验证码
     */
    refreshImg =()=>{
        let str = "";
        if(window.localStorage.getItem("isRegister") === 'true'){
            str = Constant.API_HOST + Constant.REFRESH_IMG+'?mobile='+this.state.mobile+'&type=1&resType=3&client_id=wechat&rnd='+ Math.random();
        }else{
            str = Constant.API_HOST + Constant.REFRESH_IMG+'?mobile='+this.state.mobile+'&type=2&resType=3&client_id=wechat&rnd='+ Math.random();
        }
        this.setState({
            imgSrc:str,
        })
    }

    /**
     * 获取图形验证码
     */
    getYZM = () =>{
        if(!this.state.mobile){
            Toast.fail("手机号不能为空");
            return;
        }
        let reg = regUtil.mobileReg;
        if(!reg.test(this.state.mobile)){
            Toast.fail("手机号格式不正确");
            return;
        }
        //获取当前时间戳
        let nowTime = new Date().getTime();
        if(this.yzmTime != "" && (nowTime-this.yzmTime)<60000){
            Toast.fail("图形码验证次数超限，请稍后访问");
            return;
        }
        //刷新图形验证码
        this.refreshImg();

        this.setState({
            isToast:true,
        })

    }
    /**
     * 取消获取验证码框
     */
    cancelToast = () =>{
        this.setState({
            isToast:false,
        })
    }

    /**
     *  返回
     */
    backToPage = () =>{
        this.props.history.goBack();
    }

    /**
     * 倒计时60s
     */
    settime = () => {
        let beginTime = this.state.beginTime;
        if (beginTime == 0) {
            clearTimeout(this.STO);
            this.setState({
                btnText:'获取验证码',
                beginTime:60,
                imgYZMbtn:true,
            })
        } else {
            let nowTime = --beginTime;
            this.STO = setTimeout(()=> {
                this.setState({
                    btnText:nowTime+'s',
                    beginTime:nowTime,
                })
                this.settime();
            },1000)
        }

    }

    /**
     * 发送验证码
     */
    sendYZM = () =>{
        //校验图形验证码
        let yzmText = this.refs.yzmText.value;
        let localStorage = window.localStorage;
        let paramImg = {mobile:this.state.mobile,type:localStorage.getItem("isRegister") === 'true'?"1":"2",resType:"3",client_id:"wechat",validateCode:yzmText.toUpperCase()};
        let _this = this;
        RegisterService.validateSms(paramImg).then(
            (res)=>{
                if(res.resCode === '0000'){
                    //图形验证码校验成功
                    this.setState({
                        btnText:'60s',
                        isToast:false,
                        imgYZMbtn:false,
                    });
                    this.settime();
                    //发送短信验证码
                    let params = {mobile:this.state.mobile,type:localStorage.getItem("isRegister") === 'true'?"1":"2",resType:"1",client_id:"wechat"}
                    RegisterService.sendSms(params).then(
                        (res)=>{
                            //短信验证码发送成功
                            if(res.resCode === '0000'){
                                Toast.info("发送验证码成功");
                            }else{
                                clearTimeout(this.STO);
                                this.setState({
                                    btnText:'获取验证码',
                                    beginTime:60,
                                })
                                Toast.info(res.resMsg);
                            }
                        }
                    ).catch(
                        (err)=>{
                            console.log(err);
                        }
                    )
                }else{
                    //图形验证码校验失败
                    Toast.info(res.resMsg);
                }

            }
        ).catch((err)=>{
            console.log("err")
        })
        // let yzmText = document.getElementById('yzmText').value;
        // if(yzmText == '1234'){
        //     this.setState({
        //         btnText:'60s',
        //         isToast:false,
        //     });
        //     this.settime();
        //     let params = {mobile:this.state.mobile,type:"1",resType:"1",client_id:"wechat"}
        //     RegisterService.sendSms(params).then(
        //         (res)=>{
        //             if(res.resCode === '0000'){
        //                 Toast.info("发送验证码成功");
        //             }else{
        //                 Toast.info(res.resMsg);
        //             }
        //
        //         }
        //     ).catch(
        //         (err)=>{
        //             console.log(err);
        //         }
        //     )
        // }else{
        //     this.setState({
        //         yzmErr:'验证码有误',
        //     })
        // }

    }
    /**
     * 点击下一步
     */
    jumpToPwd = () =>{
        if(!this.state.mobile){
            Toast.fail("手机号不能为空");
            return;
        }
        let reg = regUtil.mobileReg;
        if(!reg.test(this.state.mobile)){
            Toast.fail("手机号格式不正确");
            return;
        }
        let pwd = this.state.pwd;
        if(!pwd){
            Toast.fail("验证码不能为空");
            return;
        }
        // if(this.props.globalData.isRegister){
        //     //账号注册
        //     let params = {sysId:"qIOS",appVersion:"",appBuildVersion:"",mobile:this.state.mobile,password:"",wechatId:"",wechatName:"",validateCode:pwd,client_id:"wechat"};
        //     RegisterService.registerFWX(params).then((res)=> {
        //         if (res.resCode === '0000') {
        //             this.props.dispatch({type: 'register/setMobile', payload: {registerMobile: this.state.mobile}});
        //             //短信验证码正确跳转到输入密码页面
        //             jumpToPage(this, './forgetPwd');
        //         } else {
        //             //注册失败
        //             Toast.info(res.resMsg);
        //         }
        //     }).then((err)=>{
        //         console.log(err)
        //     })
        // }else{
        //     let params = {mobile:this.state.mobile,type:"2",resType:"1",client_id:"wechat",validateCode:pwd};
        //     // 验证短信验证码是否正确
        //     RegisterService.validateSms(params).then(
        //         (res)=>{
        //             if(res.resCode === '0000'){
        //                 // Toast.info("验证码校验成功")
        //                 this.props.dispatch({type:'register/setMobile',payload:{registerMobile:this.state.mobile}});
        //                 //短信验证码正确跳转到输入密码页面
        //                 jumpToPage(this,'./forgetPwd');
        //             }else{
        //                 Toast.info(res.resMsg);
        //             }
        //
        //
        //         }
        //     ).catch((err)=>{
        //         console.log("err")
        //     })
        // }
        //短信验证码放进localStorage
        let localStorage = window.localStorage;
        localStorage.setItem("yzm",pwd);
        let params = {mobile:this.state.mobile,type:localStorage.getItem("isRegister") === 'true'?"1":"2",resType:"1",client_id:"wechat",validateCode:pwd};
        // 验证短信验证码是否正确
        RegisterService.validateSms(params).then(
            (res)=>{
                if(res.resCode === '0000'){
                    // Toast.info("验证码校验成功")
                    this.props.dispatch({type:'register/setMobile',payload:{registerMobile:this.state.mobile}});
                    //短信验证码正确跳转到输入密码页面
                    jumpToPage(this,'./forgetPwd');
                }else{
                    Toast.info(res.resMsg);
                }
            }
        ).catch((err)=>{
            console.log("err")
        })

    }

    /**
     * 获取图形验证码失败
     */
    yzmImgError= ()=>{
        //记录当前时间戳
        this.yzmTime = new Date().getTime();
        this.setState({
            isToast:false,
        })
        Toast.fail("图形码验证次数超限，请稍后访问");
    }

    render(){
        if(window.localStorage.getItem("isRegister") === 'true'){
            this.title = "注册"
        }else{
            this.title = "忘记密码"
        }
        return(
            <div className={loginStyle.main}>
                <BackHeader
                    title={this.title}
                    backType="0"
                    _this={this}
                ></BackHeader>
                <div className={loginStyle.logoDiv}>
                    <img className={loginStyle.logoImg} src={logoImg} />
                </div>
                <div className={loginStyle.textDiv}>
                    <div className={loginStyle.testDiv_ID}>
                        <i className={loginStyle.shoujiImg + ' iconfont icon-shouji'}/>
                        <input ref="mobile" autoComplete="off" className={loginStyle.textDiv_test} type="tel" maxLength={11} placeholder="请输入手机号" onChange={this.inputMobile.bind(this)}></input>
                    </div>
                    <div className={loginStyle.hr}></div>
                    <div className={loginStyle.testDiv_ID}>
                        <i className={loginStyle.shoujiImg + ' iconfont icon-yanzhengma-'}/>
                        <input ref="pwd" autoComplete="off" className={loginStyle.textDiv_test} type="tel" maxLength={6} placeholder="请输入验证码" onChange={this.inputPwd.bind(this)}></input>
                        <div className={loginStyle.yzmDiv}>
                            {
                                this.state.imgYZMbtn?
                                    <Button activeClassName={loginStyle.btnC} className={[loginStyle.btn,loginStyle.btnyzm]} onClick={this.getYZM.bind(this)} >
                                        {this.state.btnText}
                                    </Button>:
                                    <Button disabled activeClassName={loginStyle.btnC} className={[loginStyle.btn,loginStyle.btnyzm]} >
                                        {this.state.btnText}
                                    </Button>
                            }
                        </div>

                    </div>
                </div>
                <div className={loginStyle.forgetPwd}>
                </div>
                <div className={loginStyle.btnDiv}>
                    <Button activeClassName={loginStyle.btnC} className={[loginStyle.btn,loginStyle.btnSub]} onClick={this.jumpToPwd.bind(this)} >
                        下一步
                    </Button>
                </div>
                {this.state.isToast?
                    <div className={loginStyle.yzmBack}>
                        <div className={loginStyle.yzmToast}>
                            <div className={loginStyle.toastTitle}>
                                请输入图形验证码
                            </div>
                            <div className={loginStyle.toastContent}>
                                <div className={loginStyle.toastCon}>
                                    <input ref="yzmText" autoComplete="off" type="text" maxLength="4" className={loginStyle.conText}/>
                                    <img id="yzmImg" src={this.state.imgSrc} onError={this.yzmImgError.bind(this)} className={loginStyle.conImg} onClick={this.refreshImg.bind(this)}/>
                                </div>
                            </div>
                            <div className={loginStyle.toastErr}>
                                {this.state.yzmErr}
                            </div>
                            <div className={loginStyle.toastBtn}>
                                <div className={loginStyle.btnCancel} onClick={this.cancelToast.bind(this)}>取消</div>
                                <div className={loginStyle.btnOK} onClick={this.sendYZM.bind(this)}>确定</div>
                            </div>
                        </div>
                    </div>:null}

            </div>
        )

    }

}
Register.propTypes = {};

export default connect(({register,globalData}) => {
    return {
        register,
        globalData
    };
})(Register);
