import React from 'react';
import { connect } from 'dva';
import styles from './map.less'
import util from './util';
import MapData from './mapData';

// var step = 0;
class MapView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        this.mapContainer = null;
        this.mapCanvas = null;
        this.guicontrols = {
            rotationSpeed: 0.02,
            bouncingSpeed: 0.03,
            ambiColor: "#0c0c0c"
        }
        this.ground = {
            x: 1540,
            y: 858,
            z: 10
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
    componentWillUnmount() {
        if (this.requestID) {
            window.cancelAnimationFrame(this.requestID);
        }
        //document.body.removeChild(this.gui.domElement.parentNode);
        this.gui
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
        this.camera = new THREE.PerspectiveCamera(45, this.mapCanvas.width / this.mapCanvas.height, 0.1, 10000);
        this.camera.position.set(0, -500, 1200);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.scene.add(this.camera);
    }
    initLight() {
        this.ambientLight = new THREE.AmbientLight(this.guicontrols.ambiColor);
        this.directLight = new THREE.DirectionalLight(0xffffff, 0.8);
        this.directLight.position.set(0, 0, 10000);

        this.scene.add(this.ambientLight); //环境光
        this.scene.add(this.directLight);  //方向光
    }
    addGround() {
        var ground = new THREE.Mesh(new THREE.CubeGeometry(this.ground.x, this.ground.y, this.ground.z),
            new THREE.MeshLambertMaterial({
                color: 0xf1f6f7,
                ambient: 0x858685,
                emissive: 0x858685,
                //wireframe: true
            })
        );
        this.scene.add(ground);
    }
    createMesh(geom) {
        // assign two materials
        var meshMaterial = new THREE.MeshNormalMaterial();
        meshMaterial.side = THREE.DoubleSide;
        var wireFrameMat = new THREE.MeshBasicMaterial();
        //wireFrameMat.wireframe = true;
        // create a multimaterial


        //var mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [meshMaterial, wireFrameMat]);


        var mesh = new THREE.Mesh(geom,
            new THREE.MeshLambertMaterial({
                color: 0x2090F1,
                wrapAround: true,
                opacity: 0.3,
                transparent: true,
            }))

        return mesh;
    }
    convertPoints(points) {
        return points.map((p) => {
            return {
                x: - this.ground.x / 2 + p.x,
                y: this.ground.y / 2 - p.y
            }
        })
    }
    convertPoint(p) {
        return {
            x: - this.ground.x / 2 + p.x,
            y: this.ground.y / 2 - p.y
        }
    }
    addArea() {
        const mapAreaList = MapData.instance().getAreaList();
        console.log('addarea', mapAreaList);
        mapAreaList.forEach((a) => {
            var shape = new THREE.Shape();
            var drawPoints = this.convertPoints(a.points);
            var centerpoint = this.convertPoint(a.centerpoint);
            if (a.type == 'polygon') {
                if (a.points.length <= 2) {
                    return;
                }
                shape.moveTo(drawPoints[0].x, drawPoints[0].y);
                for (var i = 1; i < drawPoints.length; i++) {
                    shape.lineTo(drawPoints[i].x, drawPoints[i].y);
                }
                shape.lineTo(drawPoints[0].x, drawPoints[0].y);
            } else if (a.type == 'circle') {
                if (a.points.length != 2) {
                    return;
                }
                var shape = new THREE.Shape();
                var drawPoints = this.convertPoints(a.points);
                shape.absarc(
                    drawPoints[0].x,
                    drawPoints[0].y,
                    util.getDistance(drawPoints[0], drawPoints[1]),
                    0,
                    Math.PI * 2,
                    true
                );
            }
            var options = {
                amount: Math.random() * 50 + 10,
                //amount: 1,
                bevelEnabled: false,
            };
            var areaMesh = this.createMesh(new THREE.ExtrudeGeometry(shape, options));
            areaMesh.position.z = this.ground.z;

            var linemesh = new THREE.Line(shape.createPointsGeometry(10), new THREE.LineBasicMaterial({
                color: 0x2090F1,
                linewidth: 2
            }));
            linemesh.position.z = this.ground.z + options.amount;

            var textmesh = this.createSpriteText("一监区");
            textmesh.position.x = centerpoint.x;
            textmesh.position.y = centerpoint.y;
            textmesh.position.z = this.ground.z + options.amount + 40;
            //textmesh.position.z = 98;
            console.log(textmesh);
            this.scene.add(linemesh);
            this.scene.add(areaMesh);
            this.scene.add(textmesh);
        })
        // mapAreaList.forEach((mapArea) => {
        //     mapArea.draw(ctx);
        // })


        // var area = new THREE.Mesh(new THREE.CubeGeometry(150, 30, 100),
        //     new THREE.MeshLambertMaterial({
        //         color: 0x7777ff,
        //         wrapAround: true
        //     }))
        //area.setPosition
        //this.shape.position.set(0, 0, 500);
    }
    createSpriteText(text) {
        //先用画布将文字画出
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        canvas.width = 1000;
        canvas.height = 500;
        // ctx.fillStyle = "#f00";
        // ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = "#333";
        ctx.font = "80px 微软雅黑";
        ctx.lineWidth = 4;
        ctx.textAlign = "center"
        ctx.fillText(text, 500, 250);
        //console.log('canvas:',canvas.width,canvas.height);
        // ctx.strokeStyle = "#fff";
        // ctx.strokeText(text, 500, 250);
        let texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;

        //使用Sprite显示文字
        let material = new THREE.SpriteMaterial({ map: texture });
        let textObj = new THREE.Sprite(material);
        textObj.scale.set(200,100, 1);
        //textObj.position.set(0, 0, 98);
        return textObj;
    }
    animate = () => {
        this.stats.update();
        var delta = this.clock.getDelta;
        this.orbitControls.update(delta);
        this.requestID = requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera);
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


