import React from 'react';
import { connect } from 'dva';
import MapView from './map/mapview';
import styles from './main.less';

const Main = ({ dispatch }) => {
  return (
    <div className={styles.main}>
        <MapView />
    </div>
  );
};

export default Main;
