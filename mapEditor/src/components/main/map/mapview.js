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
        this.guicontrols = {
            rotationSpeed: 0.02,
            bouncingSpeed: 0.03,
            ambiColor: "#0c0c0c"
        }
        this.clock = new THREE.Clock();
    }
    componentDidMount() {
        var mapWidth = this.mapContainer.offsetWidth;
        var mapHeight = this.mapContainer.offsetHeight;
        this.mapCanvas.width = mapWidth;
        this.mapCanvas.height = mapHeight;

        this.initStats();
        this.initGui();
        this.initThree();
        this.animate();
    }
    initStats() {
        this.stats = new Stats();
        this.stats.setMode(0);
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.left = '0';
        this.stats.domElement.style.top = '0';
        this.statdom.append(this.stats.domElement);
    }
    initGui() {
        this.gui = new dat.GUI();
        this.gui.domElement.style.marginTop = '65px';
        this.gui.add(this.guicontrols, 'rotationSpeed', 0, 0.5);
        this.gui.add(this.guicontrols, 'bouncingSpeed', 0, 0.5);
        this.gui.addColor(this.guicontrols, 'ambiColor').onChange((e) => {
            this.ambientLight.color = new THREE.Color(e);
        });
    }
    initThree() {
        console.log("initThree");
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.mapCanvas,
            antialias: true
        });
        this.renderer.setClearColor(0xeeeeee);
        this.scene = new THREE.Scene();

        this.initCamera();
        this.initLight();
        this.addGround();
        this.addArea();
        // this.trackballControls = new THREE.TrackballControls(this.camera);
        // this.trackballControls.rotateSpeed = 1.0;
        // this.trackballControls.zoomSpeed = 1.0;
        // this.trackballControls.panSpeed = 1.0;

        this.orbitControls = new THREE.OrbitControls(this.camera);
    }
    initCamera() {
        //this.camera = new THREE.OrthographicCamera(-this.mapCanvas.width / 2, this.mapCanvas.width / 2, -this.mapCanvas.height / 2, this.mapCanvas.height / 2, 1, 5000);
        this.camera = new THREE.PerspectiveCamera(45, this.mapCanvas.width / this.mapCanvas.height, 1, 5000);
        this.camera.position.set(0, 0, 2000);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.scene.add(this.camera);
    }
    initLight() {
        this.ambientLight = new THREE.AmbientLight(this.guicontrols.ambiColor);
        this.scene.add(this.ambientLight);

        var light = new THREE.DirectionalLight(0xffffff, 0.8);
        //var light = new THREE.AmbientLight(0xffffff, 1);

        light.position.set(0, 0, 1000);
        this.scene.add(light);
    }
    addGround() {
        var ground = new THREE.Mesh(new THREE.CubeGeometry(1540, 858, this._groundHeight),
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
                color: 0x7777ff,
                wrapAround: true
            }))
        //area.setPosition
        this.scene.add(area);
    }
    animate = () => {
        this.stats.update();
        var delta = this.clock.getDelta;
        this.orbitControls.update(delta);
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
            <div ref={(c) => { this.statdom = c }}></div>
        </div>
    }
}

export default connect()(MapView)


