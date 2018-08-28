/* eslint-disable no-dupe-keys */
/**
 * Created by abrahamchen on 2017/9/30.
 */

import HttpHelper from './HttpHelper';

export default class ApiService {
  constructor() {
    this.post = HttpHelper.post;
    this.get = HttpHelper.get;
    this.wxget = HttpHelper.wxget;
    this.put = HttpHelper.put;
    this.urlPost = HttpHelper.urlPost;
    this.upLoadPost = HttpHelper.upLoadPost;
    this.postUrlRestful = HttpHelper.postUrlRestful;
    this.postRestful = HttpHelper.postRestful;
    this.getRestful = HttpHelper.getRestful;
  }
}
