import React from 'react'
import {connect} from 'dva'
import llStyle from './lendList.less'
import backImg from '../../asserts/login/arrowback@2x.png';
import {jumpToPage} from '../../utils/util'
import MyLendService from '../../services/myLendService';
import {Toast} from 'antd-mobile'
import accounting from 'accounting'
import BackHeader from '../../components/backHeader/backHeader'


class LendList extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            lendList:null,//存储出借信息
        }
        this.prodArr = ["1","2"];//产品属性，0:财富优加计划 1:新手标 2:猜多宝 3:月月续投 4:加油赚 5:节节高 6.季季续投
        this.title = '';//列表title
        this.date = '';//列表日期
    }
    /**
     *  返回
     */
    backToPage = () =>{
        this.props.history.goBack();
    }

    /**
     * 跳转到出借详情页面
     */
    jumpToDetail = (orderNo) =>{
        //把当前选中项的orderNo放入localStorage
        window.localStorage.setItem("orderNo",orderNo);
        jumpToPage(this,'/lendDetail')
    }
    /**
     * 创建出借列表内容
     * @returns {*}
     */
    renderDetail = () =>{
        let arr = [];
        let lendList = this.state.lendList;
        if(!lendList){
            return <div className={llStyle.noLendInfo}>没有出借信息</div>;
        }
        for(let i=0;i<lendList.length;i++){
            let lendObj = lendList[i];
            if(this.prodArr.indexOf(lendObj.productProp) == -1){
                break;
            }
            let quitStatus = "";
            //募集中 0 锁定中 4 可退出 5 退出中2,6,7 已退出 3
            switch (lendObj.quitStatus){
                case "0" :
                    quitStatus = "募集中";
                    this.title = '锁定期结束日';
                    this.date = lendObj.lockDueDate;
                    break;
                case "4" :
                    quitStatus = "锁定中";
                    this.title = '锁定期结束日';
                    this.date = lendObj.lockDueDate;
                    break;
                case "5" :
                    quitStatus = "可债转";
                    this.title = '锁定期结束日';
                    this.date = lendObj.lockDueDate;
                    break;
                case "2" :
                    quitStatus = "债转中";
                    this.title = '申请债转日';
                    this.date = lendObj.lockDueDate;
                    break;
                case "6" :
                    quitStatus = "债转中";
                    this.title = '锁定期结束日';
                    this.date = lendObj.lockDueDate;
                    break;
                case "7" :
                    quitStatus = "债转中";
                    this.title = '锁定期结束日';
                    this.date = lendObj.lockDueDate;
                    break;
                case "3" :
                    quitStatus = "已债转";
                    this.title = '债转日';
                    this.date = lendObj.lockDueDate;
                    break;
            }
            arr.push(
                <div key={i} className={llStyle.lendDetail} onClick={this.jumpToDetail.bind(this,lendObj.orderNo)}>
                    <div className={llStyle.lendName}>
                        <div className={llStyle.lendLeft}>{lendObj.productName}</div>
                        <div className={llStyle.lendRight}>{lendObj.contractAmt}元</div>
                    </div>
                    <div className={llStyle.lendDate}>
                        <div className={llStyle.lendLeft}>{this.title+":"+this.date}</div>
                        <div className={llStyle.lendRight}>{quitStatus}</div>
                    </div>
                </div>
            )
        }
        return arr;

    }
    componentWillMount(){
        this.getContractList();
    }

    /**
     * 查询出借列表信息
     */
    getContractList = () =>{
        let params = {quitStatus:'',authToken:window.localStorage.getItem("token"),client_id:'wechat'};
        let _this = this;
        MyLendService.getContractList(params,true).then((res)=>{
            if(res.resCode === '0000'){
                _this.setState({
                    lendList:res.data.contractList
                })
            }else if(res.resCode === '888888'){
                //刷新token成功，重新查询数据
                this.getContractList();
            }else{
                Toast.fail(res.resMsg);
            }
        }).catch((err)=>{
            console.log(err)
        })
    }

    render(){
        return(
            <div className={llStyle.lendList}>
                <BackHeader
                    title="我的出借"
                    backType="2"
                    _this={this}
                ></BackHeader>
                <div className={llStyle.overDiv}>
                    {this.renderDetail()}
                </div>
            </div>
        )
    }

}
LendList.propTypes = {};
export default connect(({lendList})=>{
    return {
        lendList
    };
})(LendList)