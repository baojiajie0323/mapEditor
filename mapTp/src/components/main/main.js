import React from 'react';
import { connect } from 'dva';
import MapView from './map/mapview';
import styles from './main.less';

class Topo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewMode: '3D'
    }
  }
  onClick2D = () => {
    this.setState({ viewMode: '2D' })
  }
  onClick3D = () => {
    this.setState({ viewMode: '3D' })
  }
  render() {
    const { viewMode } = this.state;
    return (
      <div className={styles.main} >
        <div className={styles.topo}>
          {
            viewMode == "2D" ?
              null
              :
              <MapView />
          }
        </div>
        <div className={styles.viewMode}>
          <div className={viewMode == "2D" ? styles.checked : ''} onClick={this.onClick2D}>2D</div>
          <div className={viewMode == "3D" ? styles.checked : ''} onClick={this.onClick3D}>3D</div>
        </div>
        <div className={styles.infoPanel}>

        </div>
      </div>
    );
  }
};

function mapStateToProps(state) {
  //const { } = state.renlianqiandao;
  return {
  };
}

export default connect(mapStateToProps)(Topo);
