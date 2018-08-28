import React from 'react'
import {connect} from 'dva'
import aStyle from './agreementText.less'
import backImg from '../../asserts/login/arrowback@2x.png';
import BackHeader from '../../components/backHeader/backHeader'


class AgreementText extends React.Component{
    constructor(props){
        super(props);
        this.state = {

        }
    }


    render(){
        return(
            <div className={aStyle.lendList}>
                <BackHeader
                    title="出借咨询与服务协议"
                    backType="0"
                    _this={this}
                ></BackHeader>
                <div className={aStyle.ldContent}>

                </div>
            </div>
        )
    }

}
AgreementText.propTypes = {};
export default connect(({agreementText})=>{
    return {
        agreementText
    };
})(AgreementText)