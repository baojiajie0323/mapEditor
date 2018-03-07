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
            ambiColor: "#0c0c0c",
            areaAmbient: '#ff0000',
            areaEmissive: '#ff0000',
        }
        this.ground = {
            x: 1540,
            y: 858,
            z: 10
        }
        this.clock = new THREE.Clock();
        this.onMouseClick = this.onMouseClick.bind(this);
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

        document.addEventListener("click", this.onMouseClick, false);
    }
    componentWillUnmount() {
        if (this.requestID) {
            window.cancelAnimationFrame(this.requestID);
        }
        //document.body.removeChild(this.gui.domElement.parentNode);
        //this.gui
    }
    onMouseClick = (event) => {
        console.log('onMouseUp');
        event.preventDefault();
        var mouse = new THREE.Vector2();
        // mouse.x = (event.clientX / this.mapCanvas.width) * 2 - 1;
        // mouse.y = - (event.clientY / this.mapCanvas.height) * 2 + 1;
        mouse.x = ((event.clientX - this.mapCanvas.getBoundingClientRect().left) / this.mapCanvas.offsetWidth) * 2 - 1;
        mouse.y = - ((event.clientY - this.mapCanvas.getBoundingClientRect().top) / this.mapCanvas.offsetHeight) * 2 + 1;

        this.raycaster.setFromCamera(mouse, this.camera);
        var intersects = this.raycaster.intersectObjects(this.scene.children);
        console.log("intersects", intersects);
        var arealist = intersects.filter((t) => { return t.object.name.indexOf('area') >= 0 });
        if (arealist.length > 0) {
            if (this.INTERSECTED != arealist[0].object) {
                if (this.INTERSECTED) {
                    this.INTERSECTED.material.emissive.setHex(this.INTERSECTED.currentHex);
                    //this.INTERSECTED.material.opacity = 1;
                }
                this.INTERSECTED = arealist[0].object;
                this.INTERSECTED.currentHex = this.INTERSECTED.material.emissive.getHex();
                this.INTERSECTED.material.emissive.setHex(0xde4f18);
                new TWEEN.Tween( this.INTERSECTED.material).to( {opacity: 0.1} , 300 )
                .easing( TWEEN.Easing.Linear.None).yoyo(true).repeat(1).start();
            }
        } else {
            if (this.INTERSECTED) this.INTERSECTED.material.emissive.setHex(this.INTERSECTED.currentHex);
            this.INTERSECTED = null;
        }
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
        this.gui.addColor(this.guicontrols, 'areaAmbient').onChange((e) => {
           console.log(this.areaMaterial);
           this.areaMaterial.color = new THREE.Color(e);
        });
        this.gui.addColor(this.guicontrols, 'areaEmissive').onChange((e) => {
            console.log(this.areaMaterial);
            this.areaMaterial.emissive = new THREE.Color(e);
         });
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
        // this.trackballControls.rotateSpeed = 0.3;
        // this.trackballControls.zoomSpeed = 1.0;
        // this.trackballControls.panSpeed = 1.0;

        this.orbitControls = new THREE.OrbitControls(this.camera);

        this.raycaster = new THREE.Raycaster();

    }
    initCamera() {
        //this.camera = new THREE.OrthographicCamera(-this.mapCanvas.width / 2, this.mapCanvas.width / 2, -this.mapCanvas.height / 2, this.mapCanvas.height / 2, 1, 5000);
        this.camera = new THREE.PerspectiveCamera(45, this.mapCanvas.width / this.mapCanvas.height, 0.1, 10000);
        this.camera.position.set(0, 1200, 500);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.scene.add(this.camera);
    }
    initLight() {
        this.ambientLight = new THREE.AmbientLight(this.guicontrols.ambiColor);
        this.directLight = new THREE.DirectionalLight(0xffffff, 0.8);
        this.directLight.position.set(0, 10000, 3000);

        this.scene.add(this.ambientLight); //环境光 
        this.scene.add(this.directLight);  //方向光
    }
    addGround() {
        var groundMesh = new THREE.Mesh(new THREE.CubeGeometry(this.ground.x, this.ground.y, this.ground.z),
            new THREE.MeshLambertMaterial({
                color: 0xf1f6f7,
                ambient: 0x858685,
                emissive: 0x858685,
                //wireframe: true
            })
        );
        groundMesh.rotation.x = - Math.PI / 2;
        groundMesh.name = "ground";
        this.scene.add(groundMesh);
    }
    createMesh(geom) {
        // assign two materials
        // var meshMaterial = new THREE.MeshNormalMaterial();
        // meshMaterial.side = THREE.DoubleSide;
        // var wireFrameMat = new THREE.MeshBasicMaterial();
        //wireFrameMat.wireframe = true;
        // create a multimaterial


        //var mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [meshMaterial, wireFrameMat]);
        // if (!this.areaMaterial) {
        //     this.areaMaterial = new THREE.MeshLambertMaterial({
        //         color: 0x000,
        //         emissive: 0x7eb0f7,
        //         wrapAround: true,
        //         opacity: 0.9,
        //         transparent: true,
        //     })
        // }


        var mesh = new THREE.Mesh(geom,new THREE.MeshLambertMaterial({
            color: 0x333333,
            emissive: 0x7eb0f7,
            wrapAround: true,
            opacity: 1,
            transparent: true,
        }))
        //this.areaMesh

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
        mapAreaList.forEach((a, index) => {
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
            areaMesh.position.y = this.ground.z;
            areaMesh.rotation.x = - Math.PI / 2;
            areaMesh.name = `area_${index}`;

            var linemesh = new THREE.Line(shape.createPointsGeometry(10), new THREE.LineBasicMaterial({
                color: 0x1585e3,
                linewidth: 2
            }));
            linemesh.position.y = this.ground.z + options.amount;
            linemesh.rotation.x = - Math.PI / 2;

            var textmesh = this.createSpriteText("一监区");
            textmesh.position.x = centerpoint.x;
            textmesh.position.y = this.ground.z + options.amount + 40;
            textmesh.position.z = - centerpoint.y;
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
        ctx.font = "bold 80px 微软雅黑";
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
        textObj.scale.set(200, 100, 1);
        //textObj.position.set(0, 0, 98);
        return textObj;
    }
    animate = () => {
		TWEEN.update();
        this.stats.update();
        var delta = this.clock.getDelta;
        this.orbitControls.update(delta);
        //this.trackballControls.update(delta);
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


