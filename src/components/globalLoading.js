/**
 * Created by abrahamchen on 2017/9/28.
 */
import React from 'react';
import { ActivityIndicator } from 'antd-mobile';

class globalLoading extends React.Component {
  render() {
    return (
      <div
        style={{
          position: 'absolute',
          display: 'flex',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator toast text="正在加载" />
      </div>
    );
  }
}

globalLoading.propTypes = {};

export default globalLoading;
