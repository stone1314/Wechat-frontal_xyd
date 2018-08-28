/* eslint-disable no-dupe-keys */
/**
 * Created by abrahamchen on 2018/5/30.
 */
import React from 'react';
import {connect} from 'dva';

import style from './chosened.less';
import  xinshoubiao from '../../../asserts/user/xinshoubiao@2x.png';
import  lecaibao from '../../../asserts/user/lecaibao@2x.png'
import  banner from  '../../../asserts/main/banner.png';
import {Modal, Button, Carousel, Toast}from 'antd-mobile';
import  ModalWX from '../../../components/modalWX/ModalWX';
import  accounting from  'accounting';
import {exit, note, showAlert, noteHF} from '../../../utils/util'
import  Foot from  '../../../components/foot/foot';
import LoginService from '../../../services/loginService'
import {isWeiXin} from '../../../utils/util'


class Chosened extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {
        //判断是否微信环境
        let isWX = isWeiXin();
        if(isWX){
            let openid = window.sessionStorage.getItem("openid");
            //判断是否获取过openid
            if(!openid){
                let url = window.location.href;
                let code = url.split("?")[1].split("&")[0].split("=")[1];
                this.login(code);
            }
        }

    }
    /**
     *  登录
     */
    login = (code) =>{
        let params = {grant_type:"password",sysId:"qWechat",clientIp:"111",wechatId:"",ip:"111",client_id:"wechat",client_secret:"000000",auth_code:code};
        LoginService.autoLoginBind(params).then(
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

                }else{
                    //登录失败 存储获取到的openid
                    window.sessionStorage.setItem("openid",res.error);
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


    componentDidMount() {
        this.props.dispatch({type: 'main/getProduct'});
        let state = window.localStorage.getItem("firstRegister");
        if (state && state == "1") {
            this.setState({isImgOpen: true});
        }
    }

    //验证风险测评
    checkTrade(action) {
        this.props.dispatch({
            type: 'main/checkBeforeTrade', payload: {
                callback: () => {
                    action();
                }
            }
        });
    }

    creatBanner() {
        return (
            <Carousel showArrows={false} showThumbs={false}>
                <img src={banner} className={style.bannerWidth }
                     onClick={() => {
                         window.location.href = "http://www.quarkfinance.com/m/info.aspx"
                     }}/>
            </Carousel>
        )
    }

    creatList() {
        let product = this.props.main.product;
        let productHtml = [];
        if (product && product.data) {
            let arr = product.data.productList;
            if (arr) {
                arr.map((item, index, value) => {
                    let value1 = item.preProfitRateDisplay.split('~')[0];
                    let value2 = item.preProfitRateDisplay.split('~')[1];

                    let percent1 = (<span style={{fontSize: '10px'}}>%</span>);
                    let percent2 = (<span style={{fontSize: '10px'}}>%~</span>);
                    let preProfitRateDisplay1 = accounting.formatNumber(value1, 2, ',', '.');
                    let preProfitRateDisplay2 = accounting.formatNumber(value2, 2, ',', '.')
                    let preProfitRate = item.preProfitRate;

                    if (index > 1) {
                        return false;
                    }

                    if (item.productProp == '1') {//产品属性，0:财富优加计划  1:新手标  2:猜多宝  3:月月续投  4:加油赚  5:节节高 6.季季续投
                        productHtml.push(
                            <div key={index}>
                                <div
                                    className={style.itemRow + ' ' + style.itemTitle + ' ' + style.itemTitleMargeTopBottom}>
                                    <img src={xinshoubiao} className={style.itemTitleImage}/>
                                    <div style={{display: 'Inline', marginLeft: '5px'}}>{item.productName}</div>
                                    <div className={style.tiyanjin}>
                                        <span>{item.jingPinDisplayParamNew}</span>
                                    </div>
                                </div>
                                <hr className={style.itemLeft}
                                    style={{backgroundColor: '#EEEEEE', border: 'none', height: '1px'}}/>
                                <div
                                    className={style.itemRow + ' ' + style.itemTitle + ' ' + style.itemContextMargeTopBottom}>

                                    <div style={{display: 'inline-block'}}>
                                        <div
                                            className={style.itemContext}>{preProfitRateDisplay1}{percent2}{preProfitRateDisplay2}{percent1}</div>
                                        <br/>
                                        <div className={ style.itemContentHintMargerTopBottom}>历史年化收益率</div>
                                    </div>

                                    <div style={{display: 'inline-block'}} className={style.columnLeft}>
                                        <div className={style.itemContext }> +{preProfitRate}{percent1}</div>
                                        <br/>
                                        <div className={ style.itemContentHintMargerTopBottom}> 限时奖励</div>
                                    </div>

                                    <div style={{display: 'inline-block', float: 'right'}}>
                                        <div className={style.itemContextDay }>{item.period}<span className={style.day}>天</span>
                                        </div>
                                        <br/>
                                        <div className={style.itemContentHintMargerTopBottom} style={{float: 'right'}}>
                                            锁定期
                                        </div>
                                    </div>


                                    <div className={style.buttonMarger}>
                                        <button className={style.btn2} onClick={() => {
                                            noteHF(this, null, () => {
                                                this.checkTrade(
                                                    () => {
                                                        window.sessionStorage.setItem("productSelectParam", item.pid);
                                                        // window.sessionStorage.setItem("productTypeId",item.productTypeId);
                                                        this.props.history.push({
                                                            pathname: '/newUsrProductDetail'
                                                        })
                                                    }
                                                )
                                            })
                                        }}>
                                            立即出借
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                        productHtml.push(<div key={1000 + index} className={style.interval}></div>);
                    } else {
                        productHtml.push(
                            <div key={index}>
                                <div
                                    className={style.itemRow + ' ' + style.itemTitle + ' ' + style.itemTitleMargeTopBottom}>
                                    <img src={lecaibao} className={style.itemTitleImage}/>

                                    <div style={{
                                        display: 'Inline',
                                        marginLeft: '5px'
                                    }}>{item.productName}</div>
                                    <div style={{float: 'right', marginTop: '4px'} }
                                         className={style.fontSize11}>

                                        <i className={    'iconfont icon-liwu'  }
                                           style={{
                                               marginRight: `${3 / 37.5}rem`,
                                               fontSize: `${10 / 37.5}rem`
                                           }}/>
                                        {item.jingPinDisplayParamNew}
                                    </div>
                                </div>
                                <hr className={style.itemLeft}
                                    style={{
                                        backgroundColor: '#EEEEEE',
                                        border: 'none',
                                        height: '1px'
                                    }}/>
                                <div
                                    className={style.itemRow + ' ' + style.itemTitle + ' ' + style.itemContextMargeTopBottom}>
                                    <div style={{display: 'inline-block'}}>
                                        <div
                                            className={style.itemContext}>{preProfitRateDisplay1}{percent2}{preProfitRateDisplay2}{percent1}</div>
                                        <br/>
                                        <div className={ style.itemContentHintMargerTopBottom}>历史年化收益率</div>
                                    </div>

                                    <div style={{display: 'inline-block'}} className={style.columnLeft}>
                                        <div className={style.itemContext }> +{preProfitRate}{percent1}</div>
                                        <br/>
                                        <div className={ style.itemContentHintMargerTopBottom}> 限时奖励</div>
                                    </div>

                                    <div style={{display: 'inline-block', float: 'right'}}>
                                        <div className={style.itemContextDay }>{item.period}<span className={style.day}>天</span>
                                        </div>
                                        <br/>
                                        <div className={style.itemContentHintMargerTopBottom} style={{float: 'right'}}>
                                            锁定期
                                        </div>
                                    </div>

                                    <div className={style.buttonMarger}>
                                        <button className={style.btn2} onClick={() => {
                                            noteHF(this, null, () => {
                                                    this.checkTrade(() => {
                                                        window.sessionStorage.setItem("productSelectParam", item.pid);
                                                        // window.sessionStorage.setItem("productTypeId",item.productTypeId);
                                                        this.props.history.push({
                                                            pathname: '/lecaiProductSelect'
                                                        })
                                                    })
                                                }
                                            );
                                        }}>立即出借
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                        productHtml.push(<div key={2000 + index} className={style.interval}></div>);
                    }
                })
            }
        } else if (product) {
            note(product);
        }


        return (
            <div className={style.itemModelColor}>
                {productHtml}
            </div>
        )
    }

    openPromto(kind) {
        this.setState({isOpen: !this.state.isOpen});
    }

    //转跳开户页面
    handleHref(val) {
        window.localStorage.removeItem('ticket');
        this.props.history.push({pathname: '/bankDepositoryPage'});
    }

    note() {
        return (
            <div className={style.note}>
                <div className={style.notemsg}>
                    市场有风险 出借需谨慎
                </div>
                <Foot getWeiXin={this.openPromto.bind(this)}/>

                <ModalWX isOpen={this.state.isOpen}
                         close={() => this.setState({isOpen: false})}/>
            </div>
        )
    }

    render() {
        console.log(1);
        return (
            <div className={style.root}>
                {this.creatBanner()}
                {this.creatList()}
                {this.note()}
            </div>
        );
    }
}

Chosened.propTypes = {};

export default connect(({main,login}) => {
    return {
        main,login
    };
})(Chosened);