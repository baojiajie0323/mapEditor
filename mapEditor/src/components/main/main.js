import React from 'react';
import { connect } from 'dva';
import EditorPanel from './editorpanel/editorpanel';
import Map from './map/map';
import styles from './main.less';

const Main = ({ dispatch }) => {
  return (
    <div className={styles.main}>
      <EditorPanel />
      <Map />
    </div>
  );
};

Main.propTypes = {
};

function MapToStates(state) {
  //const { } = state.mapEditor;
  return {

  }
}
export default connect(MapToStates)(Main);
