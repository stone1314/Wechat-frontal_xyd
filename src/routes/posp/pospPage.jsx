/* eslint-disable no-dupe-keys */
/**
 * 此页面显示HF第三方页面
 * Created by leizhao on 2018/6/20.
 */

import React from 'react';
import {connect} from 'dva';
import styles from './pospPage.less'
import BackHeader from '../../components/backHeader/backHeader'


class PospResult extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            innerHtml: ''
        };
    }

    componentWillMount() {
        if (this.props.location.state) {
            this.setState({
                innerHtml: this.props.location.state.pospHtml
            })
        } else {
            this.props.history.replace('/');
        }
    }

    render() {
        return (
            <div>
                <BackHeader title="" backType="0" _this={this}/>
                <iframe src={this.state.innerHtml}></iframe>
            </div>
        );
    }
}

PospResult.propTypes = {};

export default connect()(PospResult);

