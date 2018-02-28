import React from 'react';
import { connect } from 'dva';
import EditorPanel from './editorpanel/editorpanel';
import Map from './map/map';
import MapView from './map/mapview';
import styles from './main.less';

const Main = ({ dispatch, showMapView }) => {
  return (
    <div className={styles.main}>
      {showMapView ?
        <MapView /> :
        [<EditorPanel />,
        <Map />]
      }
    </div>
  );
};

Main.propTypes = {
};

function MapToStates(state) {
  const { showMapView } = state.mapeditor;
  return {
    showMapView
  }
}
export default connect(MapToStates)(Main);
