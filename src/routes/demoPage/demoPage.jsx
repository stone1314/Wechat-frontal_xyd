/* eslint-disable no-dupe-keys */
/**
 * Created by abrahamchen on 2018/5/30.
 */

import React from 'react';
import { connect } from 'dva';
import style from './demoPage.less'
import CSS from '../../services/CreditSourceServices'

class DemoPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 判断是否需要身份认证
  jumpTo = () => {
    console.log("hahahah")

    let params = {grant_type:"password",username:'18116314976',password:"B95495D2B655E0CD832244427261B76A",sysId:"qAndroid",ip:"111",clientIp:"111",client_secret:"client_secret",client_id:"APP"}
    let headers = {'Content-Type': 'application/x-www-form-urlencoded'}
    CSS.apiToken({params,headers}).then(
      (res)=>{
        console.log(res);
      }
    ).catch(
      (err)=>{
        console.log(err);
      }
    );
    this.props.history.push({pathname:'/main',state:'MyLends'})
  };

  render() {
    return (
      <div style={{width:'100%', height:'100%'}} className={style.root}>
        <div className={style.fontsss} onClick={()=>{this.jumpTo()}}>demoPage</div>
      </div>
    );
  }
}

DemoPage.propTypes = {};

export default connect(({demoPage}) => {
  return {
    demoPage
  };
})(DemoPage);

