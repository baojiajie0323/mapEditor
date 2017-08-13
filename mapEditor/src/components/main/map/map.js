import React from 'react';
import { connect } from 'dva';
import MapRender from './maprender';
import styles from './map.less'

class Map extends React.Component {
    constructor(props) {
        super(props);
        this.mapContainer = null;
        this.mapCanvas = null;
    }
    componentDidMount() {
        var mapWidth = this.mapContainer.offsetWidth;
        var mapHeight = this.mapContainer.offsetHeight;
        this.mapCanvas.width = mapWidth;
        this.mapCanvas.height = mapHeight;
        console.log("componentDidMount",mapWidth,mapHeight);
        var mapRender = new MapRender(this.mapCanvas);
    }
    render() {
        return <div ref={(c) => { this.mapContainer = c }} className={styles.map}>
            <canvas ref={(c) => { this.mapCanvas = c }} id="mapcanvas"></canvas>
        </div>
    }
}

function MapToStates(states) {
    return {

    }
}
export default connect(MapToStates)(Map)


