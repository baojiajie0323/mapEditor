import MapArea from './mapArea';
import Util from './util';

class MapRender {
    constructor(canvas) {
        this.map = canvas;
        this.ctx = this.map.getContext('2d');
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.contextmenucb = null;

        this.showMousePoint = true;
        this.mouse = [];
        this.mouseInArea = false;

        this.drawAreaMode = "";
        this.areaPoint = [];

        this.mapAreaList = [];
        this.init();
    }
    init() {
        this.initHandle();
        this.draw();
    }
    initHandle() {
        this.map.addEventListener("mousedown", this.onMouseDown, false);
        this.map.addEventListener("mousemove", this.onMouseMove, false);
        this.map.addEventListener("mouseleave", this.onMouseLeave, false);
    }
    setDrawMode(drawMode) {
        this.drawAreaMode = drawMode;
        this.areaPoint = [];
        for (var i = 0; i < this.mapAreaList.length; i++) {
            var mapArea = this.mapAreaList[i];
            mapArea.checkSelect(!drawMode);
        }
        this.draw();
    }
    onMouseDown(e) {
        console.log("onmousedown", e);
        var leftClick = e.button == 0;
        if (this.drawAreaMode) {
            //绘制模式
            if (leftClick) {
                var point = this.mouse;
                this.areaPoint.push(point);
                if (this.drawAreaMode == "rect") {
                    // 矩形框绘制的时候 第二个点就可以认为是绘制结束
                    if (this.areaPoint.length == 2) {
                        var mapArea = new MapArea(this.map, this.areaPoint, "polygon");
                        this.mapAreaList.push(mapArea);
                        this.areaPoint.length = 0;
                    }
                } else if (this.drawAreaMode == "polygon") {
                    if (this.areaPoint.length >= 2) {
                        if (this.areaPoint[0].x == point.x && this.areaPoint[0].y == point.y) {
                            var mapArea = new MapArea(this.map, this.areaPoint, "polygon");
                            this.mapAreaList.push(mapArea);
                            this.areaPoint.length = 0;
                        }
                    }
                } else if (this.drawAreaMode == "circle") {
                    // 圆形绘制的时候 第二个点就可以认为是绘制结束
                    if (this.areaPoint.length == 2) {
                        var mapArea = new MapArea(this.map, this.areaPoint, "circle");
                        this.mapAreaList.push(mapArea);
                        this.areaPoint.length = 0;
                    }
                }
                this.draw();
            }
        } else {
            this.checkMouseInArea()
            if (!leftClick) {
                for (var i = 0; i < this.mapAreaList.length; i++) {
                    var mapArea = this.mapAreaList[i];
                    if (mapArea.mouseInArea) {
                        var menu = [
                            { title: '编辑元素', onClick: this.onClickEdit.bind(this) },
                            { title: '拆分元素', onClick: this.onClickEdit },
                            { title: '' },
                            { title: '查看属性数据', onClick: this.onClickEdit },
                            { title: '删除元素', onClick: this.onClickEdit },
                        ]
                        this.contextmenucb(true, menu, this.mouse);
                        break;
                    }
                }
            }
        }
    }
    onMouseMove(e) {
        console.log("onmousemove", e);
        this.mouse = { x: e.offsetX, y: e.offsetY };

        var nearbyPoint = this.findNearbyPoint(this.mouse);
        if (nearbyPoint) {
            this.mouse = nearbyPoint;
        }
        if (this.drawAreaMode) {
            this.draw();
        } else {
            // if (e.which == 1) {
            //     if (this.curmouseInArea && this.curmouseInArea.editMode &&
            //         this.curmouseInArea.editType){
                        
            //         }
            // }
            // else {
                if (this.curmouseInArea && this.curmouseInArea.editMode) {
                    this.draw();
                }
            //}
        }
    }
    onMouseLeave(e) {
        var ctx = this.ctx;
        this.mouse = { x: -1, y: -1 };
        this.draw();
    }

    checkMouseInArea() {
        this.curmouseInArea = null;
        for (var i = 0; i < this.mapAreaList.length; i++) {
            var mapArea = this.mapAreaList[i];
            mapArea.checkMouse(this.mouse);
            mapArea.checkEdit(true);
        }
        this.draw();
        for (var i = 0; i < this.mapAreaList.length; i++) {
            var mapArea = this.mapAreaList[i];
            if (mapArea.mouseInArea) {
                this.curmouseInArea = mapArea;
            }
        }
        console.log(this.curmouseInArea);
    }

    onClickEdit() {
        console.log("onClickEdit");
        if (this.curmouseInArea) {
            this.curmouseInArea.setEditMode();
        }
        this.draw();
    }

    findNearbyPoint(point) {
        // 绘制中的起点需要有吸附功能
        if (this.areaPoint.length > 0) {
            var distance = Util.getDistance(point, this.areaPoint[0]);
            if (distance <= 10) {
                return this.areaPoint[0];
            }
        }

        // 已绘制完的区域的顶点需要有吸附功能
        for (var i = 0; i < this.mapAreaList.length; i++) {
            var mapArea = this.mapAreaList[i];
            for (var j = 0; j < mapArea.points.length; j++) {
                var distance = Util.getDistance(mapArea.points[j], point);
                if (distance <= 10) {
                    return mapArea.points[j];
                }
            }
        }
    }
    draw() {
        var ctx = this.ctx;
        ctx.clearRect(0, 0, this.map.width, this.map.height);
        this.drawMapBoundary(ctx);
        this.drawMapArea(ctx);
        this.drawPaintArea(ctx);
        this.drawCurPoint(ctx);
    }

    drawMapBoundary(ctx) {
        console.log("drawMapBoundary", this.map.width, this.map.height);
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(32, 144, 241,0.8)";
        ctx.rect(0, 0, this.map.width, this.map.height);
        this.mouseInArea = ctx.isPointInPath(this.mouse.x, this.mouse.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }


    drawMapArea(ctx) {
        var context = this;
        this.mapAreaList.forEach((mapArea) => {
            mapArea.draw(ctx, this.mouse);
        })
    }

    drawPaintArea(ctx) {
        if (!this.drawAreaMode) {
            return;
        }
        if (this.areaPoint.length <= 0) {
            return;
        }

        if (this.drawAreaMode == "rect") {
            ctx.beginPath();
            ctx.strokeStyle = "rgb(32, 144, 241)";
            ctx.lineJoin = "round";
            ctx.lineWidth = 2;
            ctx.strokeRect(this.areaPoint[0].x, this.areaPoint[0].y, this.mouse.x - this.areaPoint[0].x, this.mouse.y - this.areaPoint[0].y);
            ctx.closePath();
        } else if (this.drawAreaMode == "polygon") {
            console.log("drawPaintArea");
            ctx.beginPath();
            ctx.strokeStyle = "rgb(32, 144, 241)";
            ctx.lineJoin = "round";
            ctx.lineWidth = 2;
            this.areaPoint.forEach((point, index) => {
                if (index == 0) {
                    ctx.moveTo(point.x, point.y);
                } else {
                    ctx.lineTo(point.x, point.y);
                }
            })
            ctx.lineTo(this.mouse.x, this.mouse.y);
            ctx.stroke();
        } else if (this.drawAreaMode == "circle") {
            var r = Util.getDistance(this.areaPoint[0], this.mouse);
            ctx.beginPath();
            ctx.strokeStyle = "rgb(32, 144, 241)";
            ctx.lineWidth = 2;
            ctx.arc(this.areaPoint[0].x, this.areaPoint[0].y, r, 0, 2 * Math.PI);
            ctx.stroke();
            //ctx.strokeRect(this.areaPoint[0].x, this.areaPoint[0].y, this.mouse.x - this.areaPoint[0].x, this.mouse.y - this.areaPoint[0].y);
            //ctx.closePath();
        }
    }
    drawCurPoint(ctx) {
        if (!this.drawAreaMode) {
            return;
        }
        ctx.beginPath();
        if (this.mouseInArea && this.mouse.x > 0 && this.mouse.y > 0) {
            ctx.arc(this.mouse.x, this.mouse.y, 4, 0, Math.PI * 2, true);
            ctx.fillStyle = "rgb(32, 144, 241)";
        }
        ctx.closePath();
        ctx.fill();
    }

}

export default MapRender;