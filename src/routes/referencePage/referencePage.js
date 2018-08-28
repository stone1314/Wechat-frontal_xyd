/* eslint-disable no-dupe-keys */
/**
 * Created by abrahamchen on 2018/7/2.
 */

import React from 'react';
import { connect } from 'dva';
import style from './referencePage.less'
import BackHeader from '../../components/backHeader/backHeader'



class ReferencePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        url: '',
        title: '',
      };
  }

  componentDidMount(){
    const url = this.props.location.state.url || '';
    const title = this.props.location.state.title || '';
    const kind = this.props.location.state.kind || '';
    if (title) {
      document.title = title;
    }

    this.setState({
      kind:kind,
      url,
      title,
    });
  }

  renderContent(){
    if(this.state.kind === 'img'){
      return <img className={style.image} title={this.state.title} src={this.state.url} />
    } else {
      return <iframe className={style.iframe} title={this.state.title} src={this.state.url} />
    }

  }



  render() {
    return (
      <div style={{width:'100%', height:'100%',overflowY:'auto'}} className={style.root}>
        <BackHeader
            title="乐猜宝规则"
            backType="0"
            _this={this}
        ></BackHeader>
        {this.renderContent()}
      </div>
    );
  }
}

ReferencePage.propTypes = {};

export default connect(({}) => {})(ReferencePage);

