import React from 'react'
import {connect} from 'dva'
import styles from './preBidListPage.less'
import {ListView} from 'antd-mobile'
import IInfoCell from '../../components/investorInfoCell/investorInfoCell';
import PIServices from '../../services/productInfoServices';
import BackHeader from '../../components/backHeader/backHeader'
import ModalInfo from '../../components/modalInfo/ModalInfo'



class LendPro extends React.Component {
  constructor(props) {
    super(props);
    let dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      });
    this.state = {
      isLoading:false,
      start:1,
      limit:10,
      dataSource,
    }
    this.trueRowData = [];
    this.start = 1;
    this.authToken = ''
    this.onEndReached = this.onEndReached.bind(this);
  }

  componentWillMount(){
    let authToken = this.authToken =  window.localStorage.getItem("token");
    this.getData(this.start,authToken);
  // let source  = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
  // this.setState({
  //   dataSource: this.state.dataSource.cloneWithRows(source),
  // });
  }

  getData(start,authToken){
    let headers = {'Content-Type': 'application/x-www-form-urlencoded'}
    PIServices.bidListV({headers,
      params:{start,limit:'10',authToken,"client_id":"wechat",channelCode:'100002'},
      needLoading:true})
      .then((res)=>{
        if(res && res.data &&res.data.asset_list){
          let rowDatas = res.data.asset_list;
          for(let item of rowDatas ){
            item.loan_yearly_rate = item.loan_yearly_rate.replace('%','');
            this.trueRowData.push(item);
          }
          this.start = this.start+1;
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.trueRowData),
          })
        }
      }).catch((error)=>{
        console.log(error);
      })
  }

  onEndReached(){
    this.getData(this.start,this.authToken)

  }

    /**
     * 跳转到详情页面
     */
    jumpToDetail = (rowData) =>{
      window.sessionStorage.setItem("preBidDetail",JSON.stringify(rowData));
      this.props.history.push({pathname:'./preBidDetail'})
    }
    showTost = (event) =>{
      debugger;
        event.stopPropagation();
        this.setState({isOpen: true})
    }

  renderRow = (rowData, sectionID, rowID, highlightRow) => {
        return <IInfoCell onClick={this.jumpToDetail.bind(this,rowData)} showTost={this.showTost.bind(this)} rowData={rowData}/>
  }

  render() {
    return (
      <div className={styles.tRoot}>
        <BackHeader
            title="拟投借贷项目"
            backType="0"
            _this={this}
        ></BackHeader>
          <ListView
          className={styles.listView + ' customListview'}
            ref={el => this.lv = el}
            initialListSize={10}
            dataSource={this.state.dataSource}
            renderFooter={() => 
                this.state.isLoading ? <div style={{ padding: 30,textAlign: 'center'}}/>:null
            }
           
            renderRow={this.renderRow}
            style={{
            height: this.state.height,
            overflow: 'auto'
          }}
            scrollRenderAheadDistance={500}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={10}/>
        <ModalInfo
            isOpen={this.state.isOpen}
            close={() => this.setState({isOpen: false})}
            title={'风险评级'}
            content={"借款人申请借款时的风险评级等级"}
        />
      </div>
    )
  }

}
LendPro.propTypes = {};
export default connect(({lendPro}) => {
  return {lendPro};
})(LendPro)