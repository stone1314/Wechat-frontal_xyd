/* eslint-disable no-dupe-keys */
/**
 * Created by abrahamchen on 2018/5/30.
 */


import React from 'react';
import { Router, Route } from 'dva/router';
import rootRoute from './rootRoute';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Route path="/" component={rootRoute} />
    </Router>
  );
}

export default RouterConfig;
