/* eslint-disable no-dupe-keys */
/**
 * Created by abrahamchen on 2018/5/30.
 */

import React from 'react';
import { connect } from 'dva';

class ProductListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 判断是否需要身份认证
  jumpTo = () => {
    this.props.history.push({pathname:'/demoPage'})
  };

  render() {
    return (
      <div style={{width:'100%', height:'100%'}}>
        <div onClick={this.jumpTo}>点击我</div>
      </div>
    );
  }
}

ProductListPage.propTypes = {};

export default connect(({productListPage}) => {
  return {
    productListPage
  };
})(ProductListPage);

