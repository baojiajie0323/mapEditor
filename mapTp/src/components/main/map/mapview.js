import React from 'react';
import { connect } from 'dva';
import styles from './map.less'

// var step = 0;
var lineLightstep = 0;
const lineStep = 300;
const LEVEL_HEIGHT2 = 0;
const LEVEL_HEIGHT1 = 700;
const LEVEL_HEIGHT0 = 1400;
const LINE_JOIN_HEIGHT0 = 300;
const LINE_JOIN_HEIGHT1 = 400;
var WALL_HEIGHT0 = 253;
var WALL_HEIGHT1 = 253;
var WALL_HEIGHT2 = 253;
const GAP0 = 200;
const GAP1 = 250;
const GAP2 = 400;
const OUT_X = 128;
const OUT_Y = 128;
const OUT_Z = 128;
const INNER_X = 50;
const INNER_Y = 103;
const INNER_Z = 103;

const PLANE0_BOTTOM_COLOR = 0x2d4293;
const PLANE0_BOTTOM_OPACITY = 0.5;
const PLANE0_BORDER_COLOR = 0x3da0e5;
const PLANE0_BORDER_OPACITY = 0.5;
const EACHPLANEGAP = 20;

const PLANE1_BOTTOM_COLOR = 0x403689;
const PLANE1_BOTTOM_OPACITY = 0.15;
const PLANE1_BORDER_COLOR = 0x7279ff;
const PLANE1_BORDER_OPACITY = 0.6;


const PLAT_OUT_RIGHT_COLOR_NORMAL = 0x4babef;
const PLAT_OUT_RIGHT_OPACITY_NORMAL = 0.5;
const PLAT_OUT_LEFT_COLOR_NORMAL = 0x4babef;
const PLAT_OUT_LEFT_OPACITY_NORMAL = 0.5;
const PLAT_OUT_TOP_COLOR_NORMAL = 0x4babef;
const PLAT_OUT_TOP_OPACITY_NORMAL = 0.5;
const PLAT_OUT_BOTTOM_COLOR_NORMAL = 0x3f98c3;
const PLAT_OUT_BACK_COLOR_NORMAL = 0x4babef;
const PLAT_OUT_BACK_OPACITY_NORMAL = 0.5;
const PLAT_INNER_RIGHT_COLOR_NORMAL = 0x76cef3;
const PLAT_INNER_LEFT_COLOR_NORMAL = 0x76cef3;
const PLAT_INNER_TOP_COLOR_NORMAL = 0xa6feff;
const PLAT_INNER_BOTTOM_COLOR_NORMAL = 0xa6feff;
const PLAT_INNER_BACK_COLOR_NORMAL = 0x9aecf8;
const PLAT_BORDER_COLOR_NORMAL = 0x47c6ea;
const PLAT_BORDER_COLOR_SELECT = 0xFFD700;
const PLAT_TEXT_COLOR_NORMAL = '#1E90FF';
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
    { id: 40, name: '安阳所1', level: 2, parentId: 2 },
    { id: 41, name: '安阳所1', level: 2, parentId: 2 },
    { id: 42, name: '安阳所1', level: 2, parentId: 2 },
    { id: 43, name: '安阳所1', level: 2, parentId: 2 },
    { id: 44, name: '安阳所1', level: 2, parentId: 2 },
    { id: 45, name: '安阳所1', level: 2, parentId: 2 },
    { id: 46, name: '安阳所1', level: 2, parentId: 2 },
    { id: 47, name: '安阳所1', level: 2, parentId: 2 },
    { id: 48, name: '安阳所1', level: 2, parentId: 2 },
    { id: 49, name: '安阳所1', level: 2, parentId: 2 },
    { id: 50, name: '安阳所1', level: 2, parentId: 2 },
    { id: 51, name: '安阳所1', level: 2, parentId: 2 },
    { id: 52, name: '安阳所1', level: 2, parentId: 2 },
    { id: 53, name: '安阳所1', level: 2, parentId: 2 },
    { id: 54, name: '安阳所1', level: 2, parentId: 2 },
    { id: 55, name: '安阳所1', level: 2, parentId: 2 },
    { id: 56, name: '安阳所1', level: 2, parentId: 2 },
    { id: 57, name: '安阳所1', level: 2, parentId: 2 },
    { id: 58, name: '安阳所1', level: 2, parentId: 2 },
    { id: 59, name: '安阳所1', level: 2, parentId: 2 },
    { id: 60, name: '安阳所1', level: 2, parentId: 2 },
    { id: 61, name: '安阳所1', level: 2, parentId: 2 },
    { id: 62, name: '安阳所1', level: 2, parentId: 2 },
    { id: 63, name: '安阳所1', level: 2, parentId: 2 },
    { id: 64, name: '安阳所1', level: 2, parentId: 2 },
    { id: 65, name: '安阳所1', level: 2, parentId: 2 },
    { id: 66, name: '安阳所1', level: 2, parentId: 2 },
    { id: 67, name: '安阳所1', level: 2, parentId: 2 },
    { id: 68, name: '安阳所1', level: 2, parentId: 2 },
    { id: 69, name: '安阳所1', level: 2, parentId: 2 },
]

class MapView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            autoRotate: false
        }
        this.mapContainer = null;
        this.mapCanvas = null;

        this.plat0 = [];
        this.plat1 = [];
        this.plat2 = [];
        this.platGroup = {};
        this.lightAnimateObj = [];
        this.curPlatId = 1;
        this.clock = new THREE.Clock();
        this.onMouseClick = this.onMouseClick.bind(this);
    }
    componentDidMount() {
        this.mapCanvas.width = this.mapContainer.offsetWidth;
        this.mapCanvas.height = this.mapContainer.offsetHeight;

        this.initStats();
        this.initThree();
        this.animate();

        document.addEventListener("click", this.onMouseClick, false);

        // 计算起始位置和结束位置
        document.addEventListener("mousedown", (e) => {
            this.beginX = e.clientX;
            this.beginY = e.clientY;
        }, false)
        document.addEventListener("mouseup", (e) => {
            this.endX = e.clientX;
            this.endY = e.clientY;
        }, false)
    }
    isdrag() {
        if (Math.sqrt((this.beginX - this.endX) * (this.beginX - this.endX) + (this.beginY - this.endY) * (this.beginY - this.endY)) <= 1) {
            return false;
        }
        return true;
    }
    componentWillUnmount() {
        if (this.requestID) {
            window.cancelAnimationFrame(this.requestID);
        }
        this.renderer.dispose();
    }
    onClickAllView = (e) => {
        this.curPlatId = 1;
        this.resetTopo();
        console.log(this.camera);
    }
    onClickAutoRotate = () => {
        var { autoRotate } = this.state;
        autoRotate = !autoRotate;
        this.orbitControls.autoRotate = autoRotate;
        this.orbitControls.saveState();
        this.setState({ autoRotate: autoRotate })
    }
    selectPlat(platObj) {
        var platname = platObj.object.name;
        var platId = platname.split('plat')[1];
        if (this.curPlatId == platId) {
            return;
        }
        this.curPlatId = platId;
        this.resetTopo();
        // var platall = this.plat0.concat(this.plat1).concat(this.plat2);
        // for (var i = 0; i < platall.length; i++) {
        //     if (platall[i].name == platname) {
        //         var position = platall[i].position;
        //     }
        // }
    }
    onMouseClick = (event) => {
        if (this.isdrag()) {
            return;
        }
        console.log('onMouseClick');
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
    initThree() {
        console.log("initThree");
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.mapCanvas,
            alpha: true,
            antialias: true
        });
        this.renderer.setClearColor(0x000000, 0);
        this.scene = new THREE.Scene();

        this.initCamera();
        this.initTopo();

        var axesHelper = new THREE.AxesHelper(50);
        this.scene.add(axesHelper);


        this.raycaster = new THREE.Raycaster();

    }
    initCamera() {
        this.camera = new THREE.PerspectiveCamera(45, this.mapCanvas.width / this.mapCanvas.height, 1, 8000);
        this.camera.position.set(0, 2860, 3215);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.scene.add(this.camera);

        this.orbitControls = new THREE.OrbitControls(this.camera);
        this.orbitControls.autoRotate = this.state.autoRotate;
        this.orbitControls.enablePan = false;
        this.orbitControls.mouseButtons = { ORBIT: THREE.MOUSE.LEFT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.RIGHT }
        this.orbitControls.maxPolarAngle = Math.PI / 2;
        this.orbitControls.target = new THREE.Vector3(0, 500, 0);
        this.orbitControls.saveState();
    }
    // 初始化拓扑图
    initTopo() {
        this.platTexture = new THREE.TextureLoader().load('assets/plat.png');
        this.wallTexture = new THREE.TextureLoader().load('assets/wall.png');
        this.wallTexture.wrapS = THREE.RepeatWrapping;
        this.lightGeometry = new THREE.SphereBufferGeometry(6, 32, 32);
        this.lightMaterail = new THREE.MeshBasicMaterial({ color: 0xB9F7FD });

        // 初始化每层的底和墙
        var initPanel = () => {
            var geometry = new THREE.PlaneGeometry(1, 1);
            let cubeEdges = new THREE.EdgesGeometry(geometry, 1);
            var createPanel0 = () => {
                var group = new THREE.Group();
                var material = new THREE.MeshBasicMaterial({
                    color: PLANE0_BOTTOM_COLOR,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: PLANE0_BOTTOM_OPACITY
                });
                var plane1 = new THREE.Mesh(geometry, material);
                var plane2 = new THREE.Mesh(geometry, material);
                var plane3 = new THREE.Mesh(geometry, material);
                let edgesMtl = new THREE.LineBasicMaterial({
                    color: PLANE0_BORDER_COLOR,
                    transparent: true,
                    opacity: PLANE0_BORDER_OPACITY
                });
                let cubeLine1 = new THREE.LineSegments(cubeEdges, edgesMtl);
                let cubeLine2 = new THREE.LineSegments(cubeEdges, edgesMtl);
                let cubeLine3 = new THREE.LineSegments(cubeEdges, edgesMtl);
                plane1.add(cubeLine1);
                plane2.add(cubeLine2);
                plane3.add(cubeLine3);
                plane1.rotation.x = - Math.PI / 2;
                plane1.position.y += - 2;
                plane2.rotation.x = - Math.PI / 2;
                plane2.position.y += - 2 - EACHPLANEGAP;
                plane3.rotation.x = - Math.PI / 2;
                plane3.position.y += - 2 - EACHPLANEGAP * 2;

                group.add(plane1);
                group.add(plane2);
                group.add(plane3);
                group.position.y += LEVEL_HEIGHT0;
                group.name = 'PLANE0_BOTTOM';
                this.scene.add(group);

            }
            var createPanel12 = (index) => {
                var material = new THREE.MeshBasicMaterial({
                    color: PLANE1_BOTTOM_COLOR,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: PLANE1_BOTTOM_OPACITY
                });
                var plane = new THREE.Mesh(geometry, material);
                let edgesMtl = new THREE.LineBasicMaterial({
                    color: PLANE1_BORDER_COLOR,
                    transparent: true,
                    opacity: PLANE1_BORDER_OPACITY
                });
                let cubeLine = new THREE.LineSegments(cubeEdges, edgesMtl);
                plane.add(cubeLine);
                plane.rotation.x = - Math.PI / 2;
                plane.position.y += (index == 1 ? LEVEL_HEIGHT1 : LEVEL_HEIGHT2) - 2;

                var material_wall = new THREE.MeshBasicMaterial({
                    map: this.wallTexture,
                    side: THREE.BackSide,
                    transparent: true,
                });
                var plane_wall1 = new THREE.Mesh(geometry, material_wall);
                var plane_wall2 = new THREE.Mesh(geometry, material_wall);
                var plane_wall3 = new THREE.Mesh(geometry, material_wall);
                var plane_wall4 = new THREE.Mesh(geometry, material_wall);
                var positionY = (index == 1 ? WALL_HEIGHT1 : WALL_HEIGHT2) / 2 - 2 + (index == 1 ? LEVEL_HEIGHT1 : LEVEL_HEIGHT2);
                var scaleY = index == 1 ? WALL_HEIGHT1 : WALL_HEIGHT2;
                plane_wall1.position.y += positionY;
                plane_wall1.scale.y = scaleY;
                //plane_wall1.position.z += (ROW_COUNT * OUT_Y + nGap * (ROW_COUNT - 1) + nGap) / 2;

                plane_wall2.rotation.y = Math.PI / 2;
                plane_wall2.position.y += positionY;
                plane_wall2.scale.y = scaleY;
                //plane_wall2.position.x += (COLUMN_COUNT * OUT_X + nGap * (COLUMN_COUNT - 1) + nGap) / 2;

                plane_wall3.rotation.y = Math.PI;
                plane_wall3.position.y += positionY;
                plane_wall3.scale.y = scaleY;
                //plane_wall3.position.z -= (ROW_COUNT * OUT_Y + nGap * (ROW_COUNT - 1) + nGap) / 2;

                plane_wall4.rotation.y = - Math.PI / 2;
                plane_wall4.position.y += positionY;
                plane_wall4.scale.y = scaleY;
                //plane_wall4.position.x -= (COLUMN_COUNT * OUT_X + nGap * (COLUMN_COUNT - 1) + nGap) / 2;

                plane.name = index == 1 ? 'PLANE1_BOTTOM' : 'PLANE2_BOTTOM';
                plane_wall1.name = index == 1 ? 'PLANE1_WALL_F' : 'PLANE2_WALL_F';
                plane_wall2.name = index == 1 ? 'PLANE1_WALL_R' : 'PLANE2_WALL_R';
                plane_wall3.name = index == 1 ? 'PLANE1_WALL_B' : 'PLANE2_WALL_B';
                plane_wall4.name = index == 1 ? 'PLANE1_WALL_L' : 'PLANE2_WALL_L';

                this.scene.add(plane);
                this.scene.add(plane_wall1);
                this.scene.add(plane_wall2);
                this.scene.add(plane_wall3);
                this.scene.add(plane_wall4);
            }
            createPanel0();
            createPanel12(1);
            createPanel12(2);
        }
        initPanel();
        this.resetTopo();
    }
    resetTopo() {
        this.domainlist0 = [];
        this.domainlist1 = [];
        this.domainlist2 = [];
        var curPlat = domainlist.find(d => d.id == this.curPlatId);
        var curLevel = curPlat.level;
        if (curLevel == 0) {
            this.domainlist0 = domainlist.filter(d => d.level == 0);
            this.domainlist1 = domainlist.filter(d => d.level == 1);
            if (this.domainlist1.length == 0) {
                this.domainlist2 = domainlist.filter(d => d.parentId == this.curPlatId);
            } else {
                this.domainlist2 = this.domainlist1;
            }
        } else if (curLevel == 1) {
            this.domainlist0 = domainlist.filter(d => d.level == 0);
            this.domainlist1 = domainlist.filter(d => d.id == this.curPlatId);
            this.domainlist2 = domainlist.filter(d => d.level == 2 && d.parentId == this.curPlatId);
        } else if (curLevel == 2) {
            this.domainlist0 = domainlist.filter(d => d.level == 0);
            this.domainlist1 = domainlist.filter(d => d.id == curPlat.parentId);
            this.domainlist2 = domainlist.filter(d => d.id == this.curPlatId);
        }
        this.resetPlatTopo();
        this.resetLine();
    }
    resetPlatTopo() {
        var getRowColumn = (nCount) => {
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
        var resetPlat = (nGap, positionY, domainlist, level) => {
            var nCount = domainlist.length;
            var scale = nCount == 1 ? 2 : 1;
            var { COLUMN_COUNT, ROW_COUNT } = getRowColumn(nCount);
            for (var nRow = 0; nRow < ROW_COUNT; nRow++) {
                for (var nColumn = 0; nColumn < COLUMN_COUNT; nColumn++) {
                    var nIndex = nRow * COLUMN_COUNT + nColumn;
                    if (nIndex >= nCount) {
                        break;
                    }
                    // 平台方块
                    var domain = domainlist[nIndex];
                    let platObj = this.getPlat(domain.id, domain.name, level);
                    console.log('reset plat scale', platObj.name, platObj.scale.x, scale);
                    new TWEEN.Tween({ scale: platObj.scale.x }).to({ scale: scale }, 300)
                        .onUpdate(function () {
                            platObj.scale.set(this.scale,this.scale,this.scale)
                        })
                        .start();

                    //platObj.scale.set(scale, scale, scale);
                    platObj.position.x = - (COLUMN_COUNT * OUT_X + nGap * (COLUMN_COUNT - 1)) / 2 + nColumn * (OUT_X + nGap) + OUT_X / 2;
                    platObj.position.y = positionY + OUT_Y * scale / 2;
                    platObj.position.z = - (ROW_COUNT * OUT_Y + nGap * (ROW_COUNT - 1)) / 2 + nRow * (OUT_Y + nGap) + OUT_Y / 2;
                    this[`plat${level}`].push(platObj);
                }
            }

            var panelWidth = COLUMN_COUNT * OUT_X * scale + nGap * (COLUMN_COUNT - 1) + nGap;
            var panelHeight = ROW_COUNT * OUT_Y * scale + nGap * (ROW_COUNT - 1) + nGap;

            // 底
            var panel = this.scene.getObjectByName(`PLANE${level}_BOTTOM`);
            if (level == 0) {
                panel.scale.set(panelWidth, 1, panelHeight);
            } else {
                panel.scale.set(panelWidth, panelHeight, 1);
            }

            // 墙
            var wall_f = this.scene.getObjectByName(`PLANE${level}_WALL_F`);
            var wall_b = this.scene.getObjectByName(`PLANE${level}_WALL_B`);
            var wall_r = this.scene.getObjectByName(`PLANE${level}_WALL_R`);
            var wall_l = this.scene.getObjectByName(`PLANE${level}_WALL_L`);
            if (!!wall_f) {
                wall_f.scale.x = panelWidth;
                wall_f.position.z = panelHeight / 2;
            }
            if (!!wall_b) {
                wall_b.scale.x = panelWidth;
                wall_b.position.z = - panelHeight / 2;
            }
            if (!!wall_r) {
                wall_r.scale.x = panelHeight;
                wall_r.position.x = panelWidth / 2;
            }
            if (!!wall_l) {
                wall_l.scale.x = panelHeight;
                wall_l.position.x = -panelWidth / 2;
            }

        }
        this.plat0 = [];
        this.plat1 = [];
        this.plat2 = [];
        console.log(this.domainlist2);
        resetPlat(GAP0, LEVEL_HEIGHT0, this.domainlist0, 0);
        resetPlat(GAP1, LEVEL_HEIGHT1, this.domainlist1, 1);
        resetPlat(GAP2, LEVEL_HEIGHT2, this.domainlist2, 2);
        for (var p in this.platGroup) {
            if (!this.plat0.find(a => a.name == p) &&
                !this.plat1.find(a => a.name == p) &&
                !this.plat2.find(a => a.name == p)) {
                console.log(p)
                this.scene.remove(this.platGroup[p]);
            }
        }

    }

    getPlat(id, name, level) {
        var plat = this.scene.getObjectByName(`${level}plat${id}`);
        if (!!plat) {
            console.log('find1!')
            return plat;
        }
        plat = this.platGroup[`${level}plat${id}`];
        if (!!plat) {
            this.scene.add(plat);
            console.log('find2!')
            return plat;
        }
        console.log('no find!')
        var group = new THREE.Group();
        var createOutMesh = () => {
            var geometry = new THREE.CubeGeometry(OUT_X, OUT_Y, OUT_Z);
            var mesh = new THREE.Mesh(geometry,
                [
                    new THREE.MeshBasicMaterial({ color: PLAT_OUT_RIGHT_COLOR_NORMAL, opacity: PLAT_OUT_RIGHT_OPACITY_NORMAL, transparent: true, side: THREE.DoubleSide, depthWrite: false }),
                    new THREE.MeshBasicMaterial({ color: PLAT_OUT_LEFT_COLOR_NORMAL, opacity: PLAT_OUT_LEFT_OPACITY_NORMAL, transparent: true, side: THREE.DoubleSide, depthWrite: false }),
                    new THREE.MeshBasicMaterial({ color: PLAT_OUT_TOP_COLOR_NORMAL, opacity: PLAT_OUT_TOP_OPACITY_NORMAL, transparent: true, side: THREE.DoubleSide, depthWrite: false }),
                    new THREE.MeshBasicMaterial({ color: PLAT_OUT_BOTTOM_COLOR_NORMAL, side: THREE.DoubleSide, depthWrite: true }),
                    new THREE.MeshBasicMaterial({ visible: false }),
                    new THREE.MeshBasicMaterial({ color: PLAT_OUT_BACK_COLOR_NORMAL, opacity: PLAT_OUT_BACK_OPACITY_NORMAL, transparent: true, side: THREE.DoubleSide, depthWrite: false }),
                ]
            );
            let cubeEdges = new THREE.EdgesGeometry(geometry, 1);
            let edgesMtl = new THREE.LineBasicMaterial({ color: PLAT_BORDER_COLOR_NORMAL });
            let cubeLine = new THREE.LineSegments(cubeEdges, edgesMtl);
            mesh.add(cubeLine);

            return mesh;
        }
        var createInnerMesh = () => {
            var geometry = new THREE.CubeGeometry(INNER_X, INNER_Y, INNER_Z);
            var mesh = new THREE.Mesh(geometry,
                [
                    new THREE.MeshBasicMaterial({ color: PLAT_INNER_RIGHT_COLOR_NORMAL }), //r
                    new THREE.MeshBasicMaterial({ color: PLAT_INNER_LEFT_COLOR_NORMAL }), //l
                    new THREE.MeshBasicMaterial({ color: PLAT_INNER_TOP_COLOR_NORMAL }), //t
                    new THREE.MeshBasicMaterial({ color: PLAT_INNER_BOTTOM_COLOR_NORMAL }), //b
                    new THREE.MeshBasicMaterial({ map: this.platTexture }),    //f
                    new THREE.MeshBasicMaterial({ color: PLAT_INNER_BACK_COLOR_NORMAL }), //back
                ]
            );
            return mesh;
        }

        var outMesh = createOutMesh();
        outMesh.name = `${level}plat${id}`;
        var innerMesh = createInnerMesh();
        innerMesh.position.y -= (OUT_Y - INNER_Y) / 2 - 2;

        // 文字
        var textmesh = this.createSpriteText(name, PLAT_TEXT_COLOR_NORMAL);
        textmesh.position.x = outMesh.position.x;
        textmesh.position.y = outMesh.position.y + OUT_Y / 2 + 20;
        textmesh.position.z = outMesh.position.z;

        group.add(outMesh);
        group.add(innerMesh);
        group.add(textmesh);
        group.name = `${level}plat${id}`;
        this.scene.add(group);
        this.platGroup[group.name] = group;
        return group;
    }
    resetLine() {
        this.lightAnimateObj.forEach(({ splineObject, linelight }) => {
            this.scene.remove(splineObject);
            this.scene.remove(linelight);
        })
        this.lightAnimateObj = [];
        var point = new THREE.Vector3();


        var createLine = (lineStartPosition, lineEndPosition, lineJoinHeight, lineColor) => {
            var curve;
            if (lineStartPosition.x == lineEndPosition.x &&
                lineStartPosition.z == lineEndPosition.z) {
                curve = new THREE.CatmullRomCurve3([
                    new THREE.Vector3(lineStartPosition.x, lineStartPosition.y, lineStartPosition.z),
                    new THREE.Vector3(lineEndPosition.x, lineEndPosition.y, lineEndPosition.z),
                ]);
            } else {
                curve = new THREE.CatmullRomCurve3([
                    new THREE.Vector3(lineStartPosition.x, lineStartPosition.y, lineStartPosition.z),
                    new THREE.Vector3(lineStartPosition.x, lineEndPosition.y + lineJoinHeight, lineStartPosition.z),
                    new THREE.Vector3(lineEndPosition.x, lineEndPosition.y + lineJoinHeight, lineEndPosition.z),
                    new THREE.Vector3(lineEndPosition.x, lineEndPosition.y, lineEndPosition.z),
                ]);
            }
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
            var material = new THREE.LineBasicMaterial({ color: lineColor });
            var splineObject = new THREE.Line(geometry, material);
            this.scene.add(splineObject);

            //var texture = new THREE.TextureLoader().load('assets/light.png');
            var linelight = new THREE.Mesh(this.lightGeometry, this.lightMaterail);
            //var texture = new THREE.TextureLoader().load('assets/light.png');
            //let linelight = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture }));
            //linelight.scale.set(20, 20, 1);
            this.scene.add(linelight);


            this.lightAnimateObj.push({
                splineObject,
                linelight
            })
        }
        // 支队与上级连线
        if (this.plat0.length > 0 && this.plat1.length > 0) {
            for (var i = 0; i < this.plat1.length; i++) {
                var lineStartPosition = this.plat0[0].position;
                var lineEndPosition = this.plat1[i].position;
                createLine(lineStartPosition, lineEndPosition, LINE_JOIN_HEIGHT0, 0x327ABF);
            }
        }

        // 所与上级连线
        if (this.plat2.length > 0) {
            if (this.plat1.length > 0) { // 有支队
                for (var i = 0; i < this.plat2.length; i++) {
                    var lineStartPosition = this.plat1[0].position;
                    if (this.plat1.length > 1) {
                        lineStartPosition = this.plat1[i].position;
                    }
                    var lineEndPosition = this.plat2[i].position;
                    createLine(lineStartPosition, lineEndPosition, LINE_JOIN_HEIGHT1, 0x6C56C3);
                }
            } else {  // 没有支队
                for (var i = 0; i < this.plat2.length; i++) {
                    var lineStartPosition = this.plat0[0].position;
                    var lineEndPosition = this.plat2[i].position;
                    createLine(lineStartPosition, lineEndPosition, LINE_JOIN_HEIGHT0 + LINE_JOIN_HEIGHT1, 0x6C56C3);
                }
            }

        }
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
    createSpriteText(text, color) {
        //先用画布将文字画出
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        canvas.width = 1000;
        canvas.height = 500;
        // ctx.fillStyle = "#f00";
        // ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = color;
        ctx.font = "bold 90px 微软雅黑";
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
        // console.log('camera rotation', this.camera.rotation);
        // console.log('camera position', this.camera.position);
        this.requestID = requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera);
    }
    render() {
        const { autoRotate } = this.state;
        return <div ref={(c) => { this.mapContainer = c }} className={styles.mapview}>
            <canvas ref={(c) => { this.mapCanvas = c }} id="mapView" ></canvas>
            <div ref={(c) => { this.statdom = c }}></div>
            <div className={styles.operateView}>
                <div onClick={this.onClickAllView}>全景</div>
                <div className={autoRotate ? styles.checked : ''} onClick={this.onClickAutoRotate}>旋转</div>
            </div>
        </div>
    }
}

export default connect()(MapView)


