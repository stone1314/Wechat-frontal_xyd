import  style from './foot.less';
import  React from 'react';
import  ModalWX from '../modalWX/ModalWX';


class Foot extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    getWX = () => {
        this.props.getWeiXin();
    }

    render() {
        return (
            <div className={style.icontype}>
                <div onClick={() => {
                    console.log(this.props.backType);
                    let url = "http://a.app.qq.com/o/simple.jsp?pkgname=com.kuake.kklicai&pid=21443&from=singlemessage&isappinstalled=0"
                    window.G_history.push({
                        pathname: '/pospResult',
                        state: {pospHtml: url, backType: this.props.backType}
                    });
                }}>
                    <i className={' iconfont icon-shouji'}/>下载App
                </div>

                <div className={style.iconBorder} onClick={() => {
                    let url = "https://www.caimigs.com/"
                    window.G_history.push({
                        pathname: '/pospResult',
                        state: {pospHtml: url, backType: this.props.backType}
                    });

                }}><i className={'iconfont icon-diannao'}/>电脑版
                </div>

                <div onClick={ () => {
                    this.getWX();
                }}><i className={'iconfont icon-weixin'}/>关注微信
                </div>
            </div>
        );
    }
}

export  default  Foot;