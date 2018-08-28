/**
 * Created by abrahamchen on 2018/6/26.
 */
import React from 'react';
import {connect} from 'dva';
import styles from './newUsrProductDetail.less';
import CommonProductDetail from '../commonProductDetail';
import BackHeader from '../../../components/backHeader/backHeader'

class NewUsrProductDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount(){
    // let pid = this.pid = this.props.location.state.pid;
    //   this.props.dispatch({type: 'newUsrProductDetail/getProductDetail', payload: { pid:'10037' } });
      // this.props.dispatch({type: 'lecaiProductSelect/getProductDetail', payload: { pid:this.props.location.state } });
      let pid = window.sessionStorage.getItem("productSelectParam");
      this.props.dispatch({
          type: 'lecaiProductSelect/getProductDetail',
          payload: {pid: pid}
      });
  }

  render() {
    return (
      <div className={styles.root}>
          <BackHeader
              title="新手标"
              backType="0"
              _this={this}
          ></BackHeader>
        <div className={styles.scrollDiv}>
            <CommonProductDetail type ='newUsr' pid = {this.pid} {...this.props}/>
        </div>
      </div>

    );
  }
}

NewUsrProductDetail.propTypes = {};

export default connect(({lecaiProductSelect}) => {
  return {NUPDData: lecaiProductSelect};
})(NewUsrProductDetail);