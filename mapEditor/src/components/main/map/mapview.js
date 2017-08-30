import React from 'react';
import { connect } from 'dva';
import styles from './map.less'

class MapView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        this.mapContainer = null;
        this.mapCanvas = null;
    }
    componentDidMount() {
        var mapWidth = this.mapContainer.offsetWidth;
        var mapHeight = this.mapContainer.offsetHeight;
        this.mapCanvas.width = mapWidth;
        this.mapCanvas.height = mapHeight;

        this.initThree();
    }
    initThree() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.mapCanvas
        });

        this.renderer.setClearColor(0x000000);
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(45, 4 / 3, 1, 1000);
        camera.position.set(0, 0, 5);
        scene.add(camera);
        var cube = new THREE.Mesh(new THREE.CubeGeometry(1, 2, 3),
            new THREE.MeshBasicMaterial({
                color: 0xff0000
            })
        );
        scene.add(cube);
        this.renderer.render(scene, camera);

        requestAnimationFrame(animate);
        controls.update();
        this.renderer.render(scene, camera);
    }

    render() {
        return <div ref={(c) => { this.mapContainer = c }} className={styles.mapview}>
            <canvas ref={(c) => { this.mapCanvas = c }} id="mapView" ></canvas>
        </div>
    }
}

export default connect()(MapView)


