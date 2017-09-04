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
        this._groundHeight = 10;

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
            canvas: this.mapCanvas,
            antialias: true
        });
        this.renderer.setClearColor(0xf1f2f7);
        this.scene = new THREE.Scene();

        this.initCamera();
        this.initLight();
        this.addGround();
        //this.addArea();
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.animate();
    }
    initCamera() {
        //this.camera = new THREE.OrthographicCamera(-this.mapCanvas.width / 2, this.mapCanvas.width / 2, -this.mapCanvas.height / 2, this.mapCanvas.height / 2, 1, 5000);
        this.camera = new THREE.PerspectiveCamera(45, this.mapCanvas.width / this.mapCanvas.height, 1, 5000);
        this.camera.position.set(500, 0, 1100);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.scene.add(this.camera);
    }
    initLight() {
        var light = new THREE.DirectionalLight(0xffffff, 0.8);
        //var light = new THREE.AmbientLight(0xffffff, 1);
        
        light.position.set(10, 150, 10);
        this.scene.add(light);
    }
    addGround() {
        var ground = new THREE.Mesh(new THREE.CubeGeometry(1000, this._groundHeight, 650),
            new THREE.MeshLambertMaterial({
                color: 0xf1f6f7,
                ambient: 0x858685,
                emissive: 0x858685,
                //wireframe: true
            })
        );
        this.scene.add(ground);
    }
    addArea() {
        var area = new THREE.Mesh(new THREE.CubeGeometry(150, 30, 100),
            new THREE.MeshLambertMaterial({
                color: 0xd8c8df,
                emissive: 0xd8c8df
                //wireframe: true
            })
        );
        //area.setPosition
        this.scene.add(area);
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


