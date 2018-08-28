/* eslint-disable no-dupe-keys */
/**
 * Created by abrahamchen on 2018/5/30.
 */

import {TabBar} from 'antd-mobile';
import React from 'react';
import {connect} from 'dva';
import Chosened from './chosenedPage/chosened';
import MyLends from './myLends/myLends'
import style from '../../commonStyle/commonStyleConstants.less'

class MainTab extends React.Component {
    constructor(props) {
        super(props);
        let tab = 'Chosened';
        console.log('1,Chosened')
        this.state = {
            selectedTab: tab,
            hidden: false,
            fullScreen: true,
        };
    }

    componentWillMount() {
        //   this.jumpToMy('');
        this.loadTo();
    }

    loadTo() {
        console.log('2,Chosened')
        let tabState = window.localStorage.getItem('tabState');
        if (tabState == 'chosened') {
            let login = window.localStorage.getItem('login')
            if (login == '1') { //从选择页登录，返回到‘我的’页面
                this.setState({
                    selectedTab: 'MyLends',
                });
                window.localStorage.setItem('login', '0');
            } else {
                this.setState({
                    selectedTab: 'Chosened',
                });
            }
        } else if (tabState == 'myLends') {//需考虑未登录下，
            let token = window.localStorage.getItem('token');
            if (token) {
                this.setState({
                    selectedTab: 'MyLends',
                });
            } else {
                window.localStorage.setItem('tabState', 'chosened');
                this.setState({
                    selectedTab: 'Chosened',
                });
            }
        }
        else if (!tabState) {
            let token = window.localStorage.getItem('token');
            if (token) {
                this.setState({
                    selectedTab: 'MyLends',
                });
            } else {
                window.localStorage.setItem('tabState', 'chosened');
                this.setState({
                    selectedTab: 'Chosened',
                });
            }
        }

    }

    jumpToMy(value) {
        if (value == 'MyLends' || this.props.location.pathname == '/MyLends') {
            let token = window.localStorage.getItem("token");
            console.log('token', token);
            if (token == null) {
                window.localStorage.setItem('login', 1);
                this.props.history.push({pathname: '/login'});
            }
            else {
                this.setState({
                    selectedTab: 'MyLends',
                });
            }
        }
    }

    render() {
        return (
            <div style={this.state.fullScreen ? {
                position: 'fixed',
                height: '100%',
                width: '100%',
                top: 0
            } : {height: 400}}>

                <TabBar
                    unselectedTintColor="#949494"
                    barTintColor="white"
                    hidden={this.state.hidden}
                >
                    <TabBar.Item
                        key="Chosened"
                        icon={
                            <div style={{marginTop: '6px'}}>
                                <div className={style.tabChose1}></div>
                                <div className={style.tabItem2}>精品</div>
                            </div>
                        }
                        selectedIcon={
                            <div style={{marginTop: '6px'}}>
                                <div className={style.tabChose2}></div>
                                <div className={style.tabItem1}>精品</div>
                            </div>
                        }
                        selected={this.state.selectedTab === 'Chosened'}
                        badge={""}
                        onPress={() => {
                            window.localStorage.setItem('tabState', 'chosened')
                            this.setState({
                                selectedTab: 'Chosened',
                            });
                        }}
                        data-seed="logId"
                    >
                        <Chosened history={this.props.history}/>
                    </TabBar.Item>
                    <TabBar.Item
                        icon={
                            <div style={{marginTop: '6px'}}>
                                <div className={style.tabMy1}></div>
                                <div className={style.tabItem2}>我的</div>
                            </div>
                        }
                        selectedIcon={
                            <div style={{marginTop: '6px'}}>
                                <div className={style.tabMy2}/>
                                <div className={style.tabItem1}>我的</div>
                            </div>
                        }

                        key="MyLends"
                        badge={''}
                        selected={this.state.selectedTab === 'MyLends'}
                        onPress={() => {
                            window.localStorage.setItem('tabState', 'myLends')
                            this.jumpToMy('MyLends');
                        } }
                        data-seed="logId2"
                    >
                         <MyLends history={this.props.history}/>
                        {/* <Route path='/main/MyLends' component={MyLends} /> */}
                    </TabBar.Item>

                </TabBar>
            </div>
        );
    }
}

MainTab
    .propTypes = {};

export
default

connect(
    ({
         mainTab
     }) => {
        return {
            mainTab
        };
    }
)
(MainTab);