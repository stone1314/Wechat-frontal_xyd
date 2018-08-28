/**
 * Created by abrahamchen on 2018/6/26.
 */
import React from 'react';
import { connect } from 'dva';
import { Button, Toast, Carousel } from 'antd-mobile';
import styles from './lecaiProductSelect.less';
import xuanzhongIco from '../../../asserts/lecaiProductSelect/xuanzhong@2x.png';
import weixuanIco from '../../../asserts/lecaiProductSelect/weixuan@2x.png';
import BackHeader from '../../../components/backHeader/backHeader'


class LecaiProductSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      question: '',
      answers: [],
      bannerUrls:[],
      detailInfo:[],
      guessRuleContent:'',
      guessRuleUrl:'',
    };
    this.authToken = '';
    this.productDetail = {};
  }

  componentWillMount(){
      let pid = window.sessionStorage.getItem("productSelectParam");
      this.props.dispatch({type: 'lecaiProductSelect/getProductDetail', payload: { pid:pid} });
  }

  onSelect(serialNum) {
    this.props.dispatch({type: 'lecaiProductSelect/selectAnswer', payload: { serialNum } });
  }

  jumpToDetail(){
    this.props.dispatch({type: 'lecaiProductSelect/jumpToDetail', payload: {  } });
  }

  jumpToRule(){
    this.props.dispatch({type: 'lecaiProductSelect/jumpToRule', payload: {  } });
  }

  nextStep(){
      let answers = this.props.LCPSData.answers;
      let selected = false;
      for(let answer of answers){
          selected = selected || answer.selected
      }
      if(!selected){
          Toast.info('请先选择一个答案');
          return;
      }
      let param = {};
      param.productTypeId = this.props.LCPSData.productDetail.productTypeId;
      param.type = "lecai";
      localStorage.setItem("paymentPageParam",JSON.stringify(param));
      this.props.history.push({pathname:'paymentPage',state:{}})
    // this.props.dispatch({type: 'lecaiProductSelect/nextStep', payload: { productTypeId:this.props.LCPSData.productDetail.productTypeId,type:"lecai" } });
  }

  renderBanner(bannerData) {
    return bannerData.map((item, index) => {
      return <div className={styles.banner} >
             <img className={styles.banner} src = {item}/>
             </div>
    }); 
  }

  renderAnswers(answers) {
    return answers.map((item, index) => {
      return <div className={styles.answer}>
          <img className={styles.answerImg} src ={item.pictureUrl}/>
          <img className={styles.answerIco} onClick={()=>this.onSelect(item.serialNum)} src = {item.selected ? xuanzhongIco : weixuanIco}/>
          <div className={styles.answerText}>{item.serialNum + '.' + item.answer}</div>
          </div>
    })
  }

  renderDetails(detailInfo){
    let infos = []
    for(let key in detailInfo){
      infos.push(<div>{key + ': ' + detailInfo[key]}<br/></div>)
    }
    return infos;
  }

  renderRulers(guessRuleContent) {
    let rulers = guessRuleContent.split("||");
    let infos = []
    for(let ruler of rulers){
      infos.push(<div>{ruler}<br/></div>)
    }
    return infos;
  }

  render() {
    let { question, answers,bannerUrls,detailInfo,guessRuleContent,guessRuleUrl} = this.props.LCPSData;
    let height = Math.round(answers.length / 2) * 168 + 16;
    return (
      <div className={styles.troot}>
        <BackHeader
            title="乐猜宝"
            backType="0"
            _this={this}
        ></BackHeader>
      <div className={styles.scrollDiv}>
        <Carousel
        dots={false}
        className={'banner145'}
        autoplay={true}
        infinite
        beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
        afterChange={index => console.log('slide to', index)}>
          {this.renderBanner(bannerUrls)}
        </Carousel>
        <div className={styles.question}>
          {question}
        </div>
        <div className={styles.answers} style={{minHeight:`${height/37.5}rem`}}>
           {this.renderAnswers(answers)}
        </div>
        <div className={styles.infoDetailContainer}>
          <div className={styles.PPCResultTimeC}>
            <div className={styles.PPCResultTime} >
              {"产品详情"}
            </div>
            <div className={styles.reEvaBtn} onClick={()=>this.jumpToDetail()}>
              更多详情
            </div>
          </div>
          <div className={styles.reContent}>
          {this.renderDetails(detailInfo)}
          </div>
        </div>

        <div className={styles.infoDetailContainer} style = {{minHeight:`${115/37.5}rem`}}>
          <div className={styles.PPCResultTimeC} >
            <div className={styles.PPCResultTime} >
              {"竞猜规则"}
            </div>
            <div className={styles.reEvaBtn} onClick={()=>this.jumpToRule()}>
              详细规则
            </div>
          </div>
          <div className={styles.reContent}>
              {this.renderRulers(guessRuleContent)}
          </div>
        </div>
        <div className={styles.zhanwei}></div>
        <Button
         className={styles.nextButton}
         onClick={()=>this.nextStep()}
         disabled={false}
        >
         确认答案，开始出借
       </Button>
      </div>
      </div>
    );
  }
}

LecaiProductSelect.propTypes = {};

export default connect(({ lecaiProductSelect }) => {
  return { LCPSData: lecaiProductSelect };
})(LecaiProductSelect);