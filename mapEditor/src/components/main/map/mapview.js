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
        this.animate = this.animate.bind(this);
    }
    componentDidMount() {
        var mapWidth = this.mapContainer.offsetWidth;
        var mapHeight = this.mapContainer.offsetHeight;
        this.mapCanvas.width = mapWidth;
        this.mapCanvas.height = mapHeight;

        this.initThree();
    }
    initThree() {
        console.log("initThree");
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.mapCanvas
        });

        this.renderer.setClearColor(0xffffff);
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-20,20,1.5,-1.5, 1, 1000);
        this.camera.position.set(0, 0, 5);
        this.scene.add(this.camera);
        var cube = new THREE.Mesh(new THREE.CubeGeometry(20, 1, 10),
            new THREE.MeshBasicMaterial({
                color: 0xff0000,
                wireframe: true
            })
        );
        this.scene.add(cube);

        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.animate();
    }
    animate() {
        requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera);
        //stats.update();
    }
    updateControls() {
        this.controls.update();
    }

    render() {
        return <div ref={(c) => { this.mapContainer = c }} className={styles.mapview}>
            <canvas ref={(c) => { this.mapCanvas = c }} id="mapView" ></canvas>
        </div>
    }
}

export default connect()(MapView)


