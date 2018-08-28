/* eslint-disable no-dupe-keys */
/**
 * Created by abrahamchen on 2018/5/30.
 */

import dva from 'dva';
import './index.less';
import './commonStyle/iconfont.css'
import registerModels from './models/index';
// import registerServiceWorker from './registerServiceWorker';
import router from './router';
import './rootFontSet';

// 1. Initialize
const app = dva({
  initialState: {},
  onError(e) {
    console.log('dva_onError', e);// eslint-disable-line
  },
});

// 2. Plugins
// app.use({});

// 3. Model
registerModels(app);

// 4. Router
app.router(router);

// 5. Start
app.start('#root');

// registerServiceWorker();