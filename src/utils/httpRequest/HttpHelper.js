/* eslint-disable no-unused-vars,indent,no-plusplus */
/**
 * Created by abrahamchen on 2017/9/30.
 */
import _ from 'lodash';
import 'whatwg-fetch';
import {Toast} from 'antd-mobile';
import LoginService from '../../services/loginService'
import {refreshToken} from '../../utils/util'
const oldFetchfn = window.fetch;

const creatBody = function ({headers, params}) {
    if (params) {
        if (typeof (params) === 'string') {
            return params;
        }
        let body = '';
        if (headers && headers['Content-Type'] === 'application/x-www-form-urlencoded') {
            for (let key in params) {
                if(key != 'sysId'){
                    body = body + key + '=' + params[key] + '&'
                }
            }
            body = body + 'sysId=qWechat';
            return body;
        } else {
            return JSON.stringify(params);
        }
    } else {
        return null;
    }
}

const creatHeaders = function (headers) {
    let originHeaders = {
        'Content-Type': 'application/json;charset=UTF-8',
    }
    if (headers) {
        return Object.assign(originHeaders, headers);
    } else {
        return originHeaders;
    }
}


window.fetch = function (url, params, timeOut) {
    const fetchPromise = oldFetchfn(url, params);
    const timeoutPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error('请求超时，请稍后重试'));
        }, 121000);
    });
    return Promise.race([fetchPromise, timeoutPromise]);
};

const judgeLogin = async function (response) {
    //console.log('judgeLogin',response);
    if (!response) {
        return Promise.reject('请求返回为空，请稍后重试');
    }
    if (!response.ok) {
        return Promise.reject(response.statusText || '请求超时，请稍后重试');
    }
    let res = await response.json();  // eslint-disable-line
    //console.log('62',res);
    if (res && res.error_description === 'Missing OAuth token.') {
        G_dispatch({type: 'globalData/needLogin', payload: {triger: true}});  // eslint-disable-line
        res.result = 'error';
    }
    if (res.error == "invalid_token") {
        //跳转到登录页面
        window.localStorage.clear();
        window.G_history.push({pathname: "./login"})
        // return {resCode:"999999",resMsg:"token过期，跳转至登录页面"}
    } else if (res.error === "expired_token") {
        //刷新用户token
        let isToken = refreshToken();//刷新token
        if (isToken) {
            //token刷新成功
            return {resCode: "888888", resMsg: "token刷新成功"}
        } else {
            window.localStorage.clear();
            window.G_history.push({pathname: "./login"})
            // return {resCode:"999999",resMsg:"token刷新失败，跳转至登录页面"}
        }
    }
    return res;
};

class HttpHelper {
    // 超时时间
    static timeout = 30000;

    /*
     *  get请求
     *  url:请求地址
     *  params:参数
     * */
    static get(turl, {params, needLoading}) { // eslint-disable-line
        let url = turl;
        if (params) {
            const paramsArray = [];
            // 拼接参数
            Object.keys(params).forEach(key => paramsArray.push(`${key}=${encodeURI(params[key])}`));
            if (url.search(/\?/) === -1) {
                url += `?${paramsArray.join('&')}`;
            } else {
                url += `&${paramsArray.join('&')}`;
            }
        }
        // fetch请求
        if (needLoading) {
            G_dispatch({type: 'globalData/changeLoadingNum', payload: {delta: 1}});  // eslint-disable-line
        }
        return fetch(url, {
            method: 'GET',
            credentials: 'include',
        })
            .then((response) => {
                // console.log(response,123);
                if (needLoading) {
                    G_dispatch({type: 'globalData/changeLoadingNum', payload: {delta: -1}});  // eslint-disable-line
                }
                return judgeLogin(response);
            }).catch((error) => {
                if (needLoading) {
                    G_dispatch({type: 'globalData/changeLoadingNum', payload: {delta: -1}});  // eslint-disable-line
                }
                Toast.offline('请求超时，请稍后重试', 1);
            });
    }
    static wxget(url) { // eslint-disable-line
        return fetch(url, {
            method: 'GET',
            credentials: 'include',
        })
            .then((response) => {
                return judgeLogin(response);
            }).catch((error) => {
                Toast.offline('请求超时，请稍后重试', 1);
            });
    }

    /*
     *  urlPost请求
     *  url:请求地址
     *  params:参数
     * */

    static urlPost(turl, {headers, params, needLoading}) { // eslint-disable-line
        let url = turl;
        if (params) {
            const paramsArray = [];
            // 拼接参数
            Object.keys(params).forEach((key) => {
                if (Object.prototype.toString.call(params[key]) === '[object Array]') {
                    for (const value of params[key]) {
                        paramsArray.push(`${key}=${encodeURI(value)}`);
                    }
                } else {
                    paramsArray.push(`${key}=${encodeURI(params[key])}`);
                }
            });
            if (url.search(/\?/) === -1) {
                url += `?${paramsArray.join('&')}`;
            } else {
                url += `&${paramsArray.join('&')}`;
            }
        }
        if (needLoading) {
            G_dispatch({type: 'globalData/changeLoadingNum', payload: {delta: 1}});  // eslint-disable-line
        }
        // fetch请求
        return fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
        })
            .then((response) => {
                if (needLoading) {
                    G_dispatch({type: 'globalData/changeLoadingNum', payload: {delta: -1}});  // eslint-disable-line
                }
                return judgeLogin(response);
            }).catch((error) => {
                if (needLoading) {
                    G_dispatch({type: 'globalData/changeLoadingNum', payload: {delta: -1}});  // eslint-disable-line
                }
                Toast.offline('请求超时，请稍后重试', 1);
            });
    }

    /*
     *  post请求
     *  url:请求地址
     *  params:参数
     *  headers:headers
     *  replaceHeaders:是否
     * */
    static post(url, {params, headers, needLoading}) {
        let body = '';
        // SignHelper.HandleParams(params);
        body = creatBody({headers, params});
        let trueHeaders = creatHeaders(headers)
        if (needLoading) {
            G_dispatch({type: 'globalData/changeLoadingNum', payload: {delta: 1}});  // eslint-disable-line
        }

        let paramsEntity = {
            method: 'POST',
            credentials: 'include',
            headers: trueHeaders,
        }
        if (body) {
            paramsEntity.body = body;
        }
        return fetch(url, paramsEntity).then((response) => {
           /* console.log('接口请求SUCCESS：');
            console.log(response);*/
            if (needLoading) {
                G_dispatch({type: 'globalData/changeLoadingNum', payload: {delta: -1}});  // eslint-disable-line
            }
            //   JSONObject.fromObject(historyEvent);
            // let res = judgeLogin(response);


            return judgeLogin(response);
        }).catch((error) => {
         /*   console.log('接口请求ERROR：');
            console.log(url);
            console.log(error);*/
            if (needLoading) {
                G_dispatch({type: 'globalData/changeLoadingNum', payload: {delta: -1}});  // eslint-disable-line
            }
            if (_.isString(error)) {
                Toast.offline(error, 1);
            } else if (Object.prototype.hasOwnProperty.call(error, 'responseStatus') && !error.responseStatus) {
                return error;
            } else {
                // Toast.offline(_(error).toString());
                Toast.offline('请求超时，请稍后重试', 1);
                // return error;
            }
        });
    }

    /*
     *  上传post请求
     *  url:请求地址
     *  params:参数
     *  headers:headers
     *  replaceHeaders:是否
     * */
    static upLoadPost(url, params, needLoading) {
        const body = params;
        if (needLoading) {
            G_dispatch({type: 'globalData/changeLoadingNum', payload: {delta: 1}});  // eslint-disable-line
        }
        return fetch(url, {
            method: 'POST',
            credentials: 'include',
            body,
        }).then((response) => {
            if (needLoading) {
                G_dispatch({type: 'globalData/changeLoadingNum', payload: {delta: -1}});  // eslint-disable-line
            }
            return judgeLogin(response);
        }).catch((error) => {
            if (needLoading) {
                G_dispatch({type: 'globalData/changeLoadingNum', payload: {delta: -1}});  // eslint-disable-line
            }
            if (_.isString(error)) {
                Toast.offline(error, 1);
            } else if (Object.prototype.hasOwnProperty.call(error, 'responseStatus') && !error.responseStatus) {
                return error;
            } else {
                // Toast.offline(_(error).toString());
                Toast.offline('请求超时，请稍后重试', 1);
                // return error;
            }
        });
    }

    /*
     *  put请求
     *  url:请求地址
     *  params:参数
     *  headers:headers
     *  replaceHeaders:是否
     * */
    static put(url, params, needLoading) {
        let body = '';
        // SignHelper.HandleParams(params);
        const handleResult = params;
        body = JSON.stringify(handleResult);
        if (needLoading) {
            G_dispatch({type: 'globalData/changeLoadingNum', payload: {delta: 1}});  // eslint-disable-line
        }

        return fetch(url, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
            body,
        }).then((response) => {
            if (needLoading) {
                G_dispatch({type: 'globalData/changeLoadingNum', payload: {delta: -1}});  // eslint-disable-line
            }
            return judgeLogin(response);
        }).catch((error) => {
            if (needLoading) {
                G_dispatch({type: 'globalData/changeLoadingNum', payload: {delta: -1}});  // eslint-disable-line
            }
            if (_.isString(error)) {
                Toast.offline(error, 1);
            } else if (Object.prototype.hasOwnProperty.call(error, 'responseStatus') && !error.responseStatus) {
                return error;
            } else {
                // Toast.offline(_(error).toString());
                Toast.offline('请求超时，请稍后重试', 1);
                // return error;
            }
        });
    }

    /*
     *  restfulGet请求
     *  params:参数类型是object {year:year,day:day}
     *  http://www.example.com/photo/{year}/{day}/{month}/{topic}        （resful接口类型）
     *  http://www.example.com/photo/{year}/{day}/{month}/{topic}/ship   （resful接口类型）
     * */
    static getRestful(url, restfulParams, params, needLoading) {
        let newUrl;
        if (restfulParams instanceof Object) {
            Object.keys(restfulParams).forEach(
                (k) => {
                    const rex = new RegExp(`{${k}}`, 'i');
                    newUrl = url.replace(rex, restfulParams[k]);
                },
            );
        }
        return this.get(newUrl, params, needLoading);
    }

    /*
     *  restfulPut请求
     *  params:参数类型是object {year:year,day:day}
     *  http://www.example.com/photo/{year}/{day}/{month}/{topic}        （resful接口类型）
     *  http://www.example.com/photo/{year}/{day}/{month}/{topic}/ship   （resful接口类型）
     * */
    static postRestful(url, restfulParams, params, needLoading) {
        let newUrl;
        if (restfulParams instanceof Object) {
            Object.keys(restfulParams).forEach(
                (k) => {
                    const rex = new RegExp(`{${k}}`, 'i');
                    newUrl = url.replace(rex, restfulParams[k]);
                },
            );
        }
        return this.post(newUrl, params, needLoading);
    }

    /*
     *  restfulPostUrl请求
     *  params:参数类型是object {year:year,day:day}
     *  http://www.example.com/photo/{year}/{day}/{month}/{topic}        （resful接口类型）
     *  http://www.example.com/photo/{year}/{day}/{month}/{topic}/ship   （resful接口类型）
     * */
    static postUrlRestful(url, restfulParams, params, needLoading) {
        let newUrl;
        if (restfulParams instanceof Object) {
            Object.keys(restfulParams).forEach(
                (k) => {
                    const rex = new RegExp(`{${k}}`, 'i');
                    newUrl = url.replace(rex, restfulParams[k]);
                },
            );
        }
        return this.urlPost(newUrl, params, needLoading);
    }
}

export default HttpHelper;
