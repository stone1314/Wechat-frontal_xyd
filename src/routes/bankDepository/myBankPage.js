/**
 * Created by HaihuaHuang on 2018/7/24.
 */

import React from 'react';
import {connect} from 'dva';
import {List, Icon, Toast, Modal} from 'antd-mobile';
import styles from './myBankPage.less';
import BackHeader from '../../components/backHeader/backHeader'
import {setBackUrl} from "../../utils/util";

const Item = List.Item;
const Brief = Item.Brief;

class myBankPage extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
        }
    }

    componentWillMount() {
        setBackUrl('myBankPage');
        this.props.dispatch({type: 'belongBankModel/getMyBankList'});
    }

    setBank(bank) {
        this.setState({id: bank.id});
    }

    defaultChk(stateBankId, itemBankId) {
        console.log('stateBankId', stateBankId);
        console.log('itemBankId', itemBankId);
        let html = <Icon type="check" size="md" style={{color: '#F75A0E'}}/>;
        if (!stateBankId) {
            this.setState({id: itemBankId});
            return html;
        } else if (stateBankId == itemBankId) {
            return html;
        } else {
            return '';
        }
    }

    noteSetBankCar() {
        const alert = Modal.alert;
        if (this.state.id != '') {
            const alertInstance = alert('', <div style={{fontSize: `${17 / 37.5}rem`, color: 'black'}}>
                提现银行卡只可设置一张，且不可修改，确定要提交吗？</div>, [
                {text: '取消', onPress: () => console.log('cancel'), style: 'default'},
                {
                    text: '确定', onPress: () => {
                    this.props.dispatch({
                        type: 'xydBankModel/setWithdrawCard', payload: {
                            bankId: this.state.id,
                            callback: () => {
                                this.props.history.push({pathname:'/MyLends'})
                            }
                        }
                    });
                }
                },
            ]);
        } else {
            Toast.info('请选择银行卡！');
        }
    }

    content() {
        let arr = [];
        if (this.props.belongBankModel.data && this.props.belongBankModel.data.bankCardList.length > 0) {
            let list = this.props.belongBankModel.data.bankCardList;
            list.map((item, index, value) => {

                arr.push(
                    <Item key={index}
                        /*extra={this.state.id == item.id ?
                         <Icon type="check" size="md" style={{color: '#F75A0E'}}/> : ''}*/
                          extra={this.defaultChk(this.state.id, item.id)}
                          thumb={<img style={{width: `${45 / 37.5}rem`, height: `${45 / 37.5}rem`}}
                                      src={item.iconUrl}></img> }
                          multipleLine
                          onClick={() => {
                              console.log(item);
                              this.setBank(item);
                          }}
                    >
                        {item.bankName}<span className={styles.tailNo}>（尾号{item.tailNo}）</span>
                        <Brief>单笔{item.deal }万，单日 {item.limit }万</Brief>
                    </Item>
                )
            });
        }

        return ( <div className={styles.move}>
            <List className={styles.listPage}>
                {arr}
                <Item
                    arrow="horizontal"
                    thumb={<button className={styles.wo} type="primary"><span style={{fontSize: '39px'}}>+</span>
                    </button>}
                    multipleLine
                    onClick={() => {
                        this.props.history.push({
                            pathname: '/addBankCard',
                            // state: info
                        })
                    }}
                >
                    添加银行卡
                </Item>
            </List>
        </div> )

    }

    render() {
        return (
            <div className={styles.myBankRoot}>
                <BackHeader
                    title="我的银行卡"
                    backType="2"
                    _this={this}
                ></BackHeader>
                {this.content()}
                <div className={styles.btn2}
                     onClick={() => {
                         this.noteSetBankCar();
                     }}
                >
                    <div className={styles.rootTitle}>确认</div>
                    <div className={styles.rootNote}>提现银行卡只可选择一张</div>
                </div>
            </div>
        );
    }
}

myBankPage.propTypes = {};

export default connect(({belongBankModel, xydBankModel}) => {
    return {belongBankModel, xydBankModel};
})(myBankPage);