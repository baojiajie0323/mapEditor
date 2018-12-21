import React from 'react';
import { connect } from 'dva';
import styles from './map.less'

// var step = 0;
var lineLightstep = 0;
const lineStep = 300;
const LEVEL_HEIGHT1 = 700;
const LEVEL_HEIGHT0 = 1400;


var OUT_X = 128;
var OUT_Y = 128;
var OUT_Z = 128;

var domainlist = [
    { id: 1, name: '河南监管总队', level: 0 },
    { id: 2, name: '安阳支队1', level: 1, parentId: 1 },
    { id: 3, name: '安阳支队2', level: 1, parentId: 1 },
    { id: 4, name: '安阳支队3', level: 1, parentId: 1 },
    { id: 5, name: '安阳支队4', level: 1, parentId: 1 },
    { id: 6, name: '安阳支队4', level: 1, parentId: 1 },
    { id: 7, name: '安阳支队4', level: 1, parentId: 1 },
    { id: 8, name: '安阳支队4', level: 1, parentId: 1 },
    { id: 9, name: '安阳支队4', level: 1, parentId: 1 },
    { id: 10, name: '安阳支队4', level: 1, parentId: 1 },
    { id: 11, name: '安阳支队1', level: 1, parentId: 1 },
    { id: 12, name: '安阳支队2', level: 1, parentId: 1 },
    { id: 13, name: '安阳支队3', level: 1, parentId: 1 },
    { id: 14, name: '安阳支队4', level: 1, parentId: 1 },
    { id: 15, name: '安阳支队4', level: 1, parentId: 1 },
    { id: 16, name: '安阳支队4', level: 1, parentId: 1 },
    { id: 17, name: '安阳支队4', level: 1, parentId: 1 },
    { id: 18, name: '安阳支队4', level: 1, parentId: 1 },
    { id: 19, name: '安阳支队4', level: 1, parentId: 1 },
    { id: 20, name: '安阳所1', level: 2, parentId: 2 },
    { id: 21, name: '安阳所1', level: 2, parentId: 2 },
    { id: 22, name: '安阳所1', level: 2, parentId: 2 },
    { id: 23, name: '安阳所1', level: 2, parentId: 2 },
    { id: 24, name: '安阳所1', level: 2, parentId: 2 },
    { id: 25, name: '安阳所1', level: 2, parentId: 2 },
    { id: 26, name: '安阳所1', level: 2, parentId: 2 },
    { id: 27, name: '安阳所1', level: 2, parentId: 2 },
    { id: 28, name: '安阳所1', level: 2, parentId: 2 },
    { id: 29, name: '安阳所1', level: 2, parentId: 2 },
    { id: 30, name: '安阳所1', level: 2, parentId: 3 },
    { id: 31, name: '安阳所1', level: 2, parentId: 4 },
    { id: 32, name: '安阳所1', level: 2, parentId: 5 },
    { id: 33, name: '安阳所1', level: 2, parentId: 6 },
    { id: 34, name: '安阳所1', level: 2, parentId: 7 },
    { id: 35, name: '安阳所1', level: 2, parentId: 8 },
    { id: 36, name: '安阳所1', level: 2, parentId: 9 },
    { id: 37, name: '安阳所1', level: 2, parentId: 10 },
    { id: 38, name: '安阳所1', level: 2, parentId: 11 },
    { id: 39, name: '安阳所1', level: 2, parentId: 12 },
]

class MapView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            viewMode: '3D',
        }
        this.mapContainer = null;
        this.mapCanvas = null;
        this.guicontrols = {
            rotationSpeed: 0.02,
            bouncingSpeed: 0.03,
            ambiColor: "#fff",
            areaAmbient: '#ff0000',
            areaEmissive: '#ff0000',
        }
        this.ground = {
            x: 1540,
            y: 858,
            z: 10
        }
        this.areas = [];

        this.plat0 = [];
        this.plat1 = [];
        this.plat2 = [];
        this.lightAnimateObj = [];
        this.planeWall = [];
        this.curPlatId = 1;
        this.clock = new THREE.Clock();
        this.onMouseClick = this.onMouseClick.bind(this);
    }
    componentDidMount() {
        var mapWidth = this.mapContainer.offsetWidth;
        var mapHeight = this.mapContainer.offsetHeight;
        this.mapCanvas.width = mapWidth;
        this.mapCanvas.height = mapHeight;

        this.platTexture = new THREE.TextureLoader().load('assets/plat.png');

        this.initStats();
        this.initGui();
        this.initThree();
        this.animate();

        document.addEventListener("dblclick", this.onMouseClick, false);
    }
    componentWillUnmount() {
        if (this.requestID) {
            window.cancelAnimationFrame(this.requestID);
        }
        //document.body.removeChild(this.gui.domElement.parentNode);
        //this.gui
    }
    onClick2D = (e) => {
        e.stopPropagation();
        if (this.state.viewMode == '2D') {
            return;
        }
        this.setState({ viewMode: '2D' }, this.initArea)
        this.orbitControls.reset();
        this.orbitControls.maxPolarAngle = 0;

        this.initArea();
    }
    onClick3D = (e) => {
        e.stopPropagation();
        if (this.state.viewMode == '3D') {
            return;
        }
        this.setState({ viewMode: '3D' }, this.initArea);
        // new TWEEN.Tween(this.camera.position).to({ x: 0, y: 1000, z: 1000 }, 500)
        //     .easing(TWEEN.Easing.Linear.None).start();
        // this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.orbitControls.reset();
        this.orbitControls.maxPolarAngle = 2 * Math.PI;
        new TWEEN.Tween(this.camera.position).to({ x: 0, y: 1000, z: 1000 }, 300)
            .easing(TWEEN.Easing.Linear.None).start();

    }
    onClickAllView = (e) => {
        this.curPlatId = 1;
        this.resetTopo();
        console.log(this.camera);
    }
    selectPlat(platObj) {
        var platname = platObj.object.name;
        var platId = platname.split('plat')[1];
        this.curPlatId = platId;
        this.resetTopo();
        var platall = this.plat0.concat(this.plat1).concat(this.plat2);
        for (var i = 0; i < platall.length; i++) {
            if (platall[i].name == platname) {
                var position = platall[i].position;
            }
        }
    }
    onMouseClick = (event) => {
        console.log('onMouseUp');
        event.preventDefault();
        var mouse = new THREE.Vector2();
        mouse.x = ((event.clientX - this.mapCanvas.getBoundingClientRect().left) / this.mapCanvas.offsetWidth) * 2 - 1;
        mouse.y = - ((event.clientY - this.mapCanvas.getBoundingClientRect().top) / this.mapCanvas.offsetHeight) * 2 + 1;

        this.raycaster.setFromCamera(mouse, this.camera);
        var intersects = this.raycaster.intersectObjects(this.scene.children, true);
        console.log("intersects", intersects);
        var arealist = intersects.filter((t) => { return t.object.name.indexOf('plat') >= 0 });
        if (arealist.length > 0) {
            console.log("intersects filter", arealist[0]);
            this.selectPlat(arealist[0])
            // if (this.INTERSECTED != arealist[0].object) {
            //     if (this.INTERSECTED) {
            //         this.INTERSECTED.material.emissive.setHex(this.INTERSECTED.currentHex);
            //     }
            //     this.INTERSECTED = arealist[0].object;
            //     this.INTERSECTED.currentHex = this.INTERSECTED.material.emissive.getHex();
            //     this.INTERSECTED.material.emissive.setHex(0xde4f18);
            //     new TWEEN.Tween(this.INTERSECTED.material).to({ opacity: 0.1 }, 300)
            //         .easing(TWEEN.Easing.Linear.None).yoyo(true).repeat(1).start();
            // }
        } else {
            // if (this.INTERSECTED) {
            //     this.INTERSECTED.material.emissive.setHex(this.INTERSECTED.currentHex);
            // }
            // this.INTERSECTED = null;
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
        this.renderer.setClearColor(0x1D1B36);
        this.scene = new THREE.Scene();

        this.initCamera();
        this.initLight();
        //this.addGround();
        //this.initArea();
        this.resetTopo();

        var axesHelper = new THREE.AxesHelper(50);
        this.scene.add(axesHelper);

        // this.trackballControls = new THREE.TrackballControls(this.camera);
        // this.trackballControls.rotateSpeed = 0.3;
        // this.trackballControls.zoomSpeed = 1.0;
        // this.trackballControls.panSpeed = 1.0;

        this.orbitControls = new THREE.OrbitControls(this.camera);
        this.orbitControls.autoRotate = true;
        this.orbitControls.enablePan = false;
        this.orbitControls.mouseButtons = { ORBIT: THREE.MOUSE.LEFT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.RIGHT }
        this.orbitControls.maxPolarAngle = Math.PI / 2;
        this.orbitControls.target = new THREE.Vector3(0,500,0);
        this.orbitControls.saveState();
        this.raycaster = new THREE.Raycaster();

    }
    initCamera() {
        //this.camera = new THREE.OrthographicCamera(-this.mapCanvas.width / 2, this.mapCanvas.width / 2, -this.mapCanvas.height / 2, this.mapCanvas.height / 2, 1, 5000);
        this.camera = new THREE.PerspectiveCamera(45, this.mapCanvas.width / this.mapCanvas.height, 1, 8000);
        this.camera.position.set(0, 2860, 3215);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.scene.add(this.camera);
    }
    initLight() {
        //this.ambientLight = new THREE.AmbientLight(this.guicontrols.ambiColor);
        // this.directLight = new THREE.DirectionalLight(0xffffff, 0.8);
        // this.directLight.position.set(0, 10000, 3000);

        //this.scene.add(this.ambientLight); //环境光 
        //this.scene.add(this.directLight);  //方向光
    }
    getRowColumn(nCount) {
        var rowMax = 10;
        var columnMax = 10;
        var ROW_COUNT = 1;
        var COLUMN_COUNT = 1;
        while (ROW_COUNT <= rowMax && COLUMN_COUNT <= columnMax) {
            if (ROW_COUNT * COLUMN_COUNT >= nCount) {
                break;
            }
            if (COLUMN_COUNT < ROW_COUNT) {
                COLUMN_COUNT++;
            } else {
                ROW_COUNT++;
            }
        }
        return { ROW_COUNT, COLUMN_COUNT };
    }
    resetPlatLevel0() {
        this.plat0.forEach((a) => {
            this.scene.remove(a);
        })
        this.plat0 = [];
        var scale = 2;
        var nGap = 200;
        var platObj = this.createPlat('1', scale, "河南监管总队", "#fff");
        platObj.position.x = 0;
        platObj.position.y += LEVEL_HEIGHT0;
        platObj.position.z = 0;
        this.scene.add(platObj);
        this.plat0.push(platObj);

        var createWall = () => {
            var geometry = new THREE.PlaneGeometry(
                OUT_X * scale + nGap,
                OUT_Y * scale + nGap
            );
            var material = new THREE.MeshBasicMaterial({
                color: 0x2d4293,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.5
            });
            var plane1 = new THREE.Mesh(geometry, material);
            var plane2 = new THREE.Mesh(geometry, material);
            var plane3 = new THREE.Mesh(geometry, material);
            let cubeEdges = new THREE.EdgesGeometry(geometry, 1);
            let edgesMtl = new THREE.LineBasicMaterial({ color: 0x3da0e5, transparent: true, opacity: 0.5 });
            let cubeLine1 = new THREE.LineSegments(cubeEdges, edgesMtl);
            let cubeLine2 = new THREE.LineSegments(cubeEdges, edgesMtl);
            let cubeLine3 = new THREE.LineSegments(cubeEdges, edgesMtl);
            plane1.add(cubeLine1);
            plane2.add(cubeLine2);
            plane3.add(cubeLine3);
            plane1.rotation.x = - Math.PI / 2;
            plane1.position.y += LEVEL_HEIGHT0 - 2;
            plane2.rotation.x = - Math.PI / 2;
            plane2.position.y += LEVEL_HEIGHT0 - 2 - 10;
            plane3.rotation.x = - Math.PI / 2;
            plane3.position.y += LEVEL_HEIGHT0 - 2 - 20;

            // var geometry1 = new THREE.PlaneGeometry(
            //     COLUMN_COUNT * OUT_X + nGap * (COLUMN_COUNT - 1) + 100,
            //     WALL_HEIGHT
            // );
            // var geometry2 = new THREE.PlaneGeometry(
            //     ROW_COUNT * OUT_Y + nGap * (ROW_COUNT - 1) + 100,
            //     WALL_HEIGHT
            // );
            // var texture = new THREE.TextureLoader().load('assets/wall.png');
            // texture.wrapS = THREE.RepeatWrapping;
            // var material_wall = new THREE.MeshBasicMaterial({
            //     map: texture,
            //     side: THREE.BackSide,
            //     transparent: true,
            // });
            // var plane_wall1 = new THREE.Mesh(geometry1, material_wall);
            // var plane_wall2 = new THREE.Mesh(geometry2, material_wall);
            // var plane_wall3 = new THREE.Mesh(geometry1, material_wall);
            // var plane_wall4 = new THREE.Mesh(geometry2, material_wall);
            // plane_wall1.position.y += WALL_HEIGHT / 2 - 2 + LEVEL_HEIGHT;
            // plane_wall1.position.z += (ROW_COUNT * OUT_Y + nGap * (ROW_COUNT - 1) + 100) / 2;

            // plane_wall2.rotation.y = Math.PI / 2;
            // plane_wall2.position.y += WALL_HEIGHT / 2 - 2 + LEVEL_HEIGHT;
            // plane_wall2.position.x += (COLUMN_COUNT * OUT_X + nGap * (COLUMN_COUNT - 1) + 100) / 2;

            // plane_wall3.rotation.y = Math.PI;
            // plane_wall3.position.y += WALL_HEIGHT / 2 - 2 + LEVEL_HEIGHT;
            // plane_wall3.position.z -= (ROW_COUNT * OUT_Y + nGap * (ROW_COUNT - 1) + 100) / 2;

            // plane_wall4.rotation.y = - Math.PI / 2;
            // plane_wall4.position.y += WALL_HEIGHT / 2 - 2 + LEVEL_HEIGHT;
            // plane_wall4.position.x -= (COLUMN_COUNT * OUT_X + nGap * (COLUMN_COUNT - 1) + 100) / 2;

            this.scene.add(plane1);
            this.scene.add(plane2);
            this.scene.add(plane3);
            this.planeWall.push(plane1)
            this.planeWall.push(plane2)
            this.planeWall.push(plane3)
            // this.scene.add(plane_wall1);
            // this.scene.add(plane_wall2);
            // this.scene.add(plane_wall3);
            // this.scene.add(plane_wall4);
        }
        createWall();
    }
    resetPlatLevel1() {
        this.plat1.forEach((a) => {
            this.scene.remove(a);
        })
        this.plat1 = [];
        var nGap = 250;
        var ROW_COUNT = 1;
        var COLUMN_COUNT = 1;
        var WALL_HEIGHT = 253;
        var scale = 1.2;
        var { ROW_COUNT, COLUMN_COUNT } = this.getRowColumn(this.domainlist1.length);

        for (var nRow = 0; nRow < ROW_COUNT; nRow++) {
            for (var nColumn = 0; nColumn < COLUMN_COUNT; nColumn++) {
                var nIndex = nRow * COLUMN_COUNT + nColumn;
                if(nIndex >= this.domainlist1.length){
                    break;
                }
                // 平台方块
                var platObj = this.createPlat(`${this.domainlist1[nIndex].id}`, scale, "安阳支队", "#FFF");
                platObj.position.x = - (COLUMN_COUNT * OUT_X + nGap * (COLUMN_COUNT - 1)) / 2 + nColumn * (OUT_X + nGap) + OUT_X / 2;
                platObj.position.y += LEVEL_HEIGHT1;
                platObj.position.z = - (ROW_COUNT * OUT_Y + nGap * (ROW_COUNT - 1)) / 2 + nRow * (OUT_Y + nGap) + OUT_Y / 2;
                this.scene.add(platObj);
                this.plat1.push(platObj);
            }
        }

        var createWall = () => {
            var geometry = new THREE.PlaneGeometry(
                COLUMN_COUNT * OUT_X + nGap * (COLUMN_COUNT - 1) + nGap,
                ROW_COUNT * OUT_Y + nGap * (ROW_COUNT - 1) + nGap
            );
            var material = new THREE.MeshBasicMaterial({
                color: 0x403689,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.15
            });
            var plane = new THREE.Mesh(geometry, material);
            plane.rotation.x = - Math.PI / 2;
            plane.position.y += LEVEL_HEIGHT1 - 2;

            let cubeEdges = new THREE.EdgesGeometry(geometry, 1);
            let edgesMtl = new THREE.LineBasicMaterial({ color: 0x7279ff, transparent: true, opacity: 0.6 });
            let cubeLine = new THREE.LineSegments(cubeEdges, edgesMtl);
            plane.add(cubeLine);

            var geometry1 = new THREE.PlaneGeometry(
                COLUMN_COUNT * OUT_X + nGap * (COLUMN_COUNT - 1) + nGap,
                WALL_HEIGHT
            );
            var geometry2 = new THREE.PlaneGeometry(
                ROW_COUNT * OUT_Y + nGap * (ROW_COUNT - 1) + nGap,
                WALL_HEIGHT
            );
            var texture = new THREE.TextureLoader().load('assets/wall.png');
            texture.wrapS = THREE.RepeatWrapping;
            var material_wall = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.BackSide,
                transparent: true,
            });
            var plane_wall1 = new THREE.Mesh(geometry1, material_wall);
            var plane_wall2 = new THREE.Mesh(geometry2, material_wall);
            var plane_wall3 = new THREE.Mesh(geometry1, material_wall);
            var plane_wall4 = new THREE.Mesh(geometry2, material_wall);
            plane_wall1.position.y += WALL_HEIGHT / 2 - 2 + LEVEL_HEIGHT1;
            plane_wall1.position.z += (ROW_COUNT * OUT_Y + nGap * (ROW_COUNT - 1) + nGap) / 2;

            plane_wall2.rotation.y = Math.PI / 2;
            plane_wall2.position.y += WALL_HEIGHT / 2 - 2 + LEVEL_HEIGHT1;
            plane_wall2.position.x += (COLUMN_COUNT * OUT_X + nGap * (COLUMN_COUNT - 1) + nGap) / 2;

            plane_wall3.rotation.y = Math.PI;
            plane_wall3.position.y += WALL_HEIGHT / 2 - 2 + LEVEL_HEIGHT1;
            plane_wall3.position.z -= (ROW_COUNT * OUT_Y + nGap * (ROW_COUNT - 1) + nGap) / 2;

            plane_wall4.rotation.y = - Math.PI / 2;
            plane_wall4.position.y += WALL_HEIGHT / 2 - 2 + LEVEL_HEIGHT1;
            plane_wall4.position.x -= (COLUMN_COUNT * OUT_X + nGap * (COLUMN_COUNT - 1) + nGap) / 2;

            this.scene.add(plane);
            this.scene.add(plane_wall1);
            this.scene.add(plane_wall2);
            this.scene.add(plane_wall3);
            this.scene.add(plane_wall4);
            this.planeWall.push(plane);
            this.planeWall.push(plane_wall1);
            this.planeWall.push(plane_wall2);
            this.planeWall.push(plane_wall3);
            this.planeWall.push(plane_wall4);
        }
        createWall();
    }
    resetPlatLevel2() {
        this.plat2.forEach((a) => {
            this.scene.remove(a);
        })
        this.plat2 = [];
        var nGap = 400;
        var WALL_HEIGHT = 253;
        var scale = 1;

        if(this.curLevel == 0){
            
        }
        var { ROW_COUNT, COLUMN_COUNT } = this.getRowColumn(this.domainlist2.length);

        for (var nRow = 0; nRow < ROW_COUNT; nRow++) {
            for (var nColumn = 0; nColumn < COLUMN_COUNT; nColumn++) {
                var nIndex = nRow * COLUMN_COUNT + nColumn;
                if(nIndex >= this.domainlist2.length){
                    break;
                }
                // 平台方块
                var platObj = this.createPlat(`${this.domainlist2[nIndex].id}`, scale, "安阳市看守所", "#FFF");
                platObj.position.x = - (COLUMN_COUNT * OUT_X + nGap * (COLUMN_COUNT - 1)) / 2 + nColumn * (OUT_X + nGap) + OUT_X / 2;
                platObj.position.y += 0;
                platObj.position.z = - (ROW_COUNT * OUT_Y + nGap * (ROW_COUNT - 1)) / 2 + nRow * (OUT_Y + nGap) + OUT_Y / 2;
                this.scene.add(platObj);
                this.plat2.push(platObj);
            }
        }

        var createWall = () => {
            var geometry = new THREE.PlaneGeometry(
                COLUMN_COUNT * OUT_X + nGap * (COLUMN_COUNT - 1) + nGap,
                ROW_COUNT * OUT_Y + nGap * (ROW_COUNT - 1) + nGap
            );
            var material = new THREE.MeshBasicMaterial({
                color: 0x4c2d9a,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.35
            });
            var plane = new THREE.Mesh(geometry, material);
            plane.rotation.x = - Math.PI / 2;
            plane.position.y += - 2;

            let cubeEdges = new THREE.EdgesGeometry(geometry, 1);
            let edgesMtl = new THREE.LineBasicMaterial({ color: 0x986dff, transparent: true, opacity: 0.5 });
            let cubeLine = new THREE.LineSegments(cubeEdges, edgesMtl);
            plane.add(cubeLine);

            var geometry1 = new THREE.PlaneGeometry(
                COLUMN_COUNT * OUT_X + nGap * (COLUMN_COUNT - 1) + nGap,
                WALL_HEIGHT
            );
            var geometry2 = new THREE.PlaneGeometry(
                ROW_COUNT * OUT_Y + nGap * (ROW_COUNT - 1) + nGap,
                WALL_HEIGHT
            );
            var texture = new THREE.TextureLoader().load('assets/wall.png');
            texture.wrapS = THREE.RepeatWrapping;
            var material_wall = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.BackSide,
                transparent: true,
            });
            var plane_wall1 = new THREE.Mesh(geometry1, material_wall);
            var plane_wall2 = new THREE.Mesh(geometry2, material_wall);
            var plane_wall3 = new THREE.Mesh(geometry1, material_wall);
            var plane_wall4 = new THREE.Mesh(geometry2, material_wall);
            plane_wall1.position.y += WALL_HEIGHT / 2 - 2;
            plane_wall1.position.z += (ROW_COUNT * OUT_Y + nGap * (ROW_COUNT - 1) + nGap) / 2;

            plane_wall2.rotation.y = Math.PI / 2;
            plane_wall2.position.y += WALL_HEIGHT / 2 - 2;
            plane_wall2.position.x += (COLUMN_COUNT * OUT_X + nGap * (COLUMN_COUNT - 1) + nGap) / 2;

            plane_wall3.rotation.y = Math.PI;
            plane_wall3.position.y += WALL_HEIGHT / 2 - 2;
            plane_wall3.position.z -= (ROW_COUNT * OUT_Y + nGap * (ROW_COUNT - 1) + nGap) / 2;

            plane_wall4.rotation.y = - Math.PI / 2;
            plane_wall4.position.y += WALL_HEIGHT / 2 - 2;
            plane_wall4.position.x -= (COLUMN_COUNT * OUT_X + nGap * (COLUMN_COUNT - 1) + nGap) / 2;

            this.scene.add(plane);
            this.scene.add(plane_wall1);
            this.scene.add(plane_wall2);
            this.scene.add(plane_wall3);
            this.scene.add(plane_wall4);
            
            this.planeWall.push(plane);
            this.planeWall.push(plane_wall1);
            this.planeWall.push(plane_wall2);
            this.planeWall.push(plane_wall3);
            this.planeWall.push(plane_wall4);
        }
        createWall();
    }
    createPlat(id, scale, name, textColor) {
        var group = new THREE.Group();
        var INNER_X = 50;
        var INNER_Y = 103;
        var INNER_Z = 103;
        var createOutMesh = () => {
            var geometry = new THREE.CubeGeometry(OUT_X, OUT_Y, OUT_Z);
            var mesh = new THREE.Mesh(geometry,
                [
                    new THREE.MeshBasicMaterial({ color: 0x4babef, opacity: 0.5, transparent: true, side: THREE.DoubleSide, depthWrite: false }),
                    new THREE.MeshBasicMaterial({ color: 0x4babef, opacity: 0.5, transparent: true, side: THREE.DoubleSide, depthWrite: false }),
                    new THREE.MeshBasicMaterial({ color: 0x4babef, opacity: 0.5, transparent: true, side: THREE.DoubleSide, depthWrite: false }),
                    new THREE.MeshBasicMaterial({ color: 0x3f98c3, side: THREE.DoubleSide, depthWrite: true }),
                    new THREE.MeshBasicMaterial({ visible: false }),
                    new THREE.MeshBasicMaterial({ color: 0x4babef, opacity: 0.5, transparent: true, side: THREE.DoubleSide, depthWrite: false }),
                ]
            );
            let cubeEdges = new THREE.EdgesGeometry(geometry, 1);
            let edgesMtl = new THREE.LineBasicMaterial({ color: 0x47c6ea });
            let cubeLine = new THREE.LineSegments(cubeEdges, edgesMtl);
            mesh.add(cubeLine);

            return mesh;
        }
        var createInnerMesh = () => {
            var geometry = new THREE.CubeGeometry(INNER_X, INNER_Y, INNER_Z);
            var texture = new THREE.TextureLoader().load('assets/plat.png');
            var mesh = new THREE.Mesh(geometry,
                [
                    new THREE.MeshBasicMaterial({ color: 0x76cef3 }), //r
                    new THREE.MeshBasicMaterial({ color: 0x76cef3 }), //l
                    new THREE.MeshBasicMaterial({ color: 0xa6feff }), //t
                    new THREE.MeshBasicMaterial({ color: 0xa6feff }), //b
                    new THREE.MeshBasicMaterial({ map: this.platTexture }),    //f
                    new THREE.MeshBasicMaterial({ color: 0x9aecf8 }), //back
                ]
            );
            return mesh;
        }
        var outMesh = createOutMesh();
        outMesh.name = 'plat' + id;
        var innerMesh = createInnerMesh();
        innerMesh.position.y -= (OUT_Y - INNER_Y) / 2 - 2;
        group.add(outMesh);
        group.add(innerMesh);

        // 文字
        var textmesh = this.createSpriteText(name, textColor);
        textmesh.position.x = outMesh.position.x;
        textmesh.position.y = outMesh.position.y + OUT_Y / 2 + 20;
        textmesh.position.z = outMesh.position.z;
        group.add(textmesh);

        group.position.y += OUT_Y * scale / 2;
        group.scale.set(scale, scale, scale);
        group.name = `plat${id}`;
        return group;
    }
    resetLine() {
        this.lightAnimateObj.forEach(({ splineObject, linelight }) => {
            this.scene.remove(splineObject);
            this.scene.remove(linelight);
        })
        this.lightAnimateObj = [];

        var LINE_JOIN_HEIGHT0 = 300;
        var LINE_JOIN_HEIGHT1 = 400;
        var point = new THREE.Vector3();
        var createLine = (lineStartPosition, lineEndPosition, lineJoinHeight) => {
            var curve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(lineStartPosition.x, lineStartPosition.y, lineStartPosition.z),
                new THREE.Vector3(lineStartPosition.x, lineEndPosition.y + lineJoinHeight, lineStartPosition.z),
                new THREE.Vector3(lineEndPosition.x, lineEndPosition.y + lineJoinHeight, lineEndPosition.z),
                new THREE.Vector3(lineEndPosition.x, lineEndPosition.y, lineEndPosition.z),
            ]);
            curve.curveType = 'catmullrom';
            curve.tension = 0;

            var geometry = new THREE.BufferGeometry();
            geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(lineStep * 3), 3));
            var position = geometry.attributes.position;
            for (var i = 0; i < lineStep; i++) {
                var t = i / (lineStep - 1);
                curve.getPoint(t, point);
                position.setXYZ(i, point.x, point.y, point.z);
            }
            var material = new THREE.LineBasicMaterial({ color: 0x327ABF,linewidth:100 });
            var splineObject = new THREE.Line(geometry, material);
            this.scene.add(splineObject);

            var sphere = new THREE.SphereBufferGeometry(6, 32, 32);
            var texture = new THREE.TextureLoader().load('assets/light.png');
            var linelight = new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0xB9F7FD }))
            //var texture = new THREE.TextureLoader().load('assets/light.png');
            //let linelight = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture }));
            //linelight.scale.set(20, 20, 1);
            this.scene.add(linelight);


            this.lightAnimateObj.push({
                splineObject,
                linelight
            })
        }
        // 总队与支队连线
        if (this.plat0.length > 0 && this.plat1.length > 0) {
            for (var i = 0; i < this.plat1.length; i++) {
                var lineStartPosition = this.plat0[0].position;
                var lineEndPosition = this.plat1[i].position;
                createLine(lineStartPosition, lineEndPosition, LINE_JOIN_HEIGHT0);
            }
        }

        // 支队与所连线
        if (this.plat1.length > 0 && this.plat2.length > 0) {
            for (var i = 0; i < this.plat2.length; i++) {
                var lineStartPosition = this.plat1[0].position;
                if (this.plat1.length > 1) {
                    lineStartPosition = this.plat1[i].position;
                }
                var lineEndPosition = this.plat2[i].position;
                createLine(lineStartPosition, lineEndPosition, LINE_JOIN_HEIGHT1);
            }
        }
    }
    resetTopo() {
        var curPlat = domainlist.find(d => d.id == this.curPlatId);
        var curLevel = curPlat.level;
        if (curLevel == 0) {
            this.domainlist0 = domainlist.filter(d => d.level == 0);
            this.domainlist1 = domainlist.filter(d => d.level == 1);
            this.domainlist2 = domainlist.filter(d => d.level == 1);
        } else if (curLevel == 1) {
            this.domainlist0 = domainlist.filter(d => d.level == 0);
            this.domainlist1 = domainlist.filter(d => d.id == this.curPlatId);
            this.domainlist2 = domainlist.filter(d => d.level == 2 && d.parentId == this.curPlatId);
        } else if (curLevel == 2) {
            this.domainlist0 = domainlist.filter(d => d.level == 0);
            this.domainlist1 = domainlist.filter(d => d.id == curPlat.parentId);
            this.domainlist2 = domainlist.filter(d => d.id == this.curPlatId);
        }
        this.curLevel = curLevel;

        this.planeWall.forEach(p => {
            this.scene.remove(p);
        })
        this.planeWall = [];

        this.resetPlatLevel0();
        this.resetPlatLevel1();
        this.resetPlatLevel2();
        this.resetLine();
    }
    updateLineLight() {
        for (var i = 0; i < this.lightAnimateObj.length; i++) {
            var { linelight } = this.lightAnimateObj[i];
            var { splineObject } = this.lightAnimateObj[i];
            var x = splineObject.geometry.attributes.position.array[lineLightstep * 3];
            var y = splineObject.geometry.attributes.position.array[lineLightstep * 3 + 1];
            var z = splineObject.geometry.attributes.position.array[lineLightstep * 3 + 2];
            // if (i > 0) {
            //     var x1 = splineObject.geometry.attributes.position.array[(lineLightstep - 1) * 3];
            //     var y1 = splineObject.geometry.attributes.position.array[(lineLightstep - 1) * 3 + 1];
            //     var z1 = splineObject.geometry.attributes.position.array[(lineLightstep - 1) * 3 + 2];

            //     // var v1 = new THREE.Vector3(x, y, z);
            //     // var v2 = new THREE.Vector3(x1, y1, z1);
            //     // var angle = v1.angleTo(v2);
            //     if (y1 == y) {
            //         linelight.material.rotation = -Math.PI / 2;
            //     } else {
            //         linelight.material.rotation = 0;
            //     }

            // } else {
            //     linelight.material.rotation = 0;
            // }

            linelight.position.x = x;
            linelight.position.y = y;
            linelight.position.z = z;
        }
        lineLightstep++;
        if (lineLightstep >= lineStep) {
            lineLightstep = 0;
        }


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


        var mesh = new THREE.Mesh(geom, new THREE.MeshLambertMaterial({
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
    initArea() {
        if (this.areas.length > 0) {
            this.areas.forEach((a) => {
                this.scene.remove(a);
            })
            this.areas.length = 0;
        }
        const mapAreaList = [];
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
                amount: this.state.viewMode == "3D" ? Math.random() * 50 + 10 : 1,
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
            this.areas.push(linemesh);
            this.areas.push(areaMesh);
            this.areas.push(textmesh);

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
    createSpriteText(text, color) {
        //先用画布将文字画出
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        canvas.width = 1000;
        canvas.height = 500;
        // ctx.fillStyle = "#f00";
        // ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = color;
        ctx.font = "bold 110px 微软雅黑";
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
        textObj.scale.set(400, 200, 1);
        //textObj.position.set(0, 0, 98);
        return textObj;
    }
    animate = () => {
        TWEEN.update();
        this.stats.update();
        var delta = this.clock.getDelta;
        this.orbitControls.update(delta);
        this.updateLineLight();
        console.log('camera rotation',this.camera.rotation);
        console.log('camera position',this.camera.position);
        //this.camera.rotateY(0.001);
        //this.camera.rotation.x += 0.001
        //this.trackballControls.update(delta);
        this.requestID = requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera);
        //console.log(this.camera)
    }
    updateControls() {
        this.controls.update();
    }

    render() {
        return <div ref={(c) => { this.mapContainer = c }} className={styles.mapview}>
            <canvas ref={(c) => { this.mapCanvas = c }} id="mapView" ></canvas>
            <div ref={(c) => { this.statdom = c }}></div>
            <div className={styles.operateView}>
                <div onClick={this.onClickAllView}>全景</div>
            </div>
            <div className={styles.viewMode}>
                <div className={this.state.viewMode == "2D" ? styles.checked : ''} onClick={this.onClick2D}>2D</div>
                <div className={this.state.viewMode == "3D" ? styles.checked : ''} onClick={this.onClick3D}>3D</div>
            </div>
        </div>
    }
}

export default connect()(MapView)


