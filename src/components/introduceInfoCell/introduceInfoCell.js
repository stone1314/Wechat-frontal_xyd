/**
 * Created by abrahamchen on 2018/6/27.
 */
import React from 'react';
import PropTypes from 'prop-types';
// import ReactModal from 'react-modal';
import styles from './introduceInfoCell.less';

class introduceInfoCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
      let arrowIco = styles.arrowIco + ' icon-gengduo1'
    return (
      <div className={styles.root} style ={{
        ...this.props.style
      }} onClick={()=>this.props.onClick()}>
        <div className = {styles.allContainer}>
          <div className ={styles.titleContainer}>
            {this.props.titlePrompt
              ? <div className ={styles.titlePrompt}/>
              : null}
            <label className ={styles.titleText}>{this.props.title}</label>
          </div>
          {this.props.subTitle
            ? <div className ={styles.subTitle}>
                {this.props.subTitle}
              </div>
            : null}
        </div>
        {this.props.endText?<span className={styles.endText}>{this.props.endText}</span>:null}
        {this.props.arrowIco ? <i className={arrowIco}/> : null}
      </div>

    );
  }
}

introduceInfoCell.propTypes = {
  
};
introduceInfoCell.defaultProps={
  onClick:()=>{},
}


export default introduceInfoCell;