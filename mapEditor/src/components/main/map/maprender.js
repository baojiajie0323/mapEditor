import MapArea from './mapArea';
import MapHandle from './mapHandle';
import MapData from './mapData';
import Util from './util';

class MapRender {
    constructor(canvas,dispatch) {
        this._map = canvas;
        this._mapHandle = null;
        this.contextmenucb = null;
        this.showMousePoint = true;
        this.drawAreaMode = "";
        this.areaPoint = [];
        this.dispatch = dispatch;
        this.init();
    }
    init() {
        this.initHandle();        
        this._mapData = MapData.instance(this);
        this.draw();
    }
    initHandle() {
        this._mapHandle = new MapHandle(this);
        this._mapHandle.addListener("mousemove", this.onMouseMove.bind(this));
        this._mapHandle.addListener("mousedown", this.onMouseDown.bind(this));
        this._mapHandle.addListener("mouseleave", this.onMouseLeave.bind(this));
    }

    addMapArea(type, points) {
        this._mapData.addArea(type, points);
    }
    isAreaPainting() {
        return !!this.drawAreaMode;
    }
    setDrawMode(drawMode) {
        this.drawAreaMode = drawMode;
        this.areaPoint = [];
    }
    onMouseDown(e) {
        var leftClick = e.button == 0;
        if (this.drawAreaMode && leftClick) {
            //绘制模式
            var point = this._mapHandle.mouse;
            this.areaPoint.push(point);
            if (this.drawAreaMode == "rect") {
                // 矩形框绘制的时候 第二个点就可以认为是绘制结束
                if (this.areaPoint.length == 2) {
                    var points = [];
                    points.push(this.areaPoint[0]);
                    points.push({ x: this.areaPoint[1].x, y: this.areaPoint[0].y });
                    points.push(this.areaPoint[1]);
                    points.push({ x: this.areaPoint[0].x, y: this.areaPoint[1].y });
                    this.addMapArea("polygon", points);
                    this.areaPoint.length = 0;
                }
            } else if (this.drawAreaMode == "polygon") {
                if (this.areaPoint.length >= 2) {
                    if (this.areaPoint[0].x == point.x && this.areaPoint[0].y == point.y) {
                        this.areaPoint.splice(this.areaPoint.length - 1, 1);
                        this.addMapArea("polygon", this.areaPoint);
                        this.areaPoint.length = 0;
                    }
                }
            } else if (this.drawAreaMode == "circle") {
                // 圆形绘制的时候 第二个点就可以认为是绘制结束
                if (this.areaPoint.length == 2) {
                    this.addMapArea("circle", this.areaPoint);
                    this.areaPoint.length = 0;
                }
            }
            this.draw();
        }
    }
    onMouseMove(e) {
        this.draw();
    }
    onMouseLeave(e) {
        this.draw();
    }

    findNearbyPoint(point) {
        const mapAreaList = this._mapData.getAreaList();
        // 绘制中的起点需要有吸附功能
        if (this.areaPoint.length > 0) {
            var distance = Util.getDistance(point, this.areaPoint[0]);
            if (distance <= 10) {
                return this.areaPoint[0];
            }
        }
        // 已绘制完的区域的顶点需要有吸附功能
        for (var i = 0; i < mapAreaList.length; i++) {
            var mapArea = mapAreaList[i];
            for (var j = 0; j < mapArea.points.length; j++) {
                var distance = Util.getDistance(mapArea.points[j], point);
                if (distance <= 10) {
                    return mapArea.points[j];
                }
            }
        }
    }
    draw() {
        //console.time("mapRender");
        var ctx = this._map.getContext('2d');
        ctx.clearRect(0, 0, this._map.width, this._map.height);
        var mouseInArea = this.drawMapBoundary(ctx);
        this.drawMapArea(ctx);
        this.drawMapSprite(ctx);
        this.drawPaintArea(ctx);
        if (mouseInArea) {
            this.drawCurPoint(ctx);
        }
        //console.timeEnd("mapRender");
    }

    //绘制地图边界
    drawMapBoundary(ctx) {
        ctx.beginPath();
        ctx.rect(0, 0, this._map.width, this._map.height);
        var mouseInArea = ctx.isPointInPath(this._mapHandle.mouse.x, this._mapHandle.mouse.y);
        ctx.fillStyle = "white";
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(32, 144, 241,0.8)";
        ctx.fill();
        ctx.stroke();
        return mouseInArea;
    }

    //绘制区域
    drawMapArea(ctx) {
        const mapAreaList = this._mapData.getAreaList();
        mapAreaList.forEach((mapArea) => {
            mapArea.draw(ctx);
        })
    }
    drawMapSprite(ctx) {
        var context = this;
        // this.mapAreaList.forEach((mapArea) => {
        //     mapArea.draw(ctx);
        // })
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
            ctx.strokeRect(this.areaPoint[0].x, this.areaPoint[0].y, this._mapHandle.mouse.x - this.areaPoint[0].x, this._mapHandle.mouse.y - this.areaPoint[0].y);
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
            ctx.lineTo(this._mapHandle.mouse.x, this._mapHandle.mouse.y);
            ctx.stroke();
        } else if (this.drawAreaMode == "circle") {
            var r = Util.getDistance(this.areaPoint[0], this._mapHandle.mouse);
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
        ctx.save();
        ctx.font = "12px Arial";
        ctx.fillStyle = '#333';
        ctx.lineWidth = 1;
        ctx.fillText(`${this._mapHandle.mouse.x},${this._mapHandle.mouse.y}`, 5, 15);

        if (!this.drawAreaMode) {
            return;
        }
        ctx.beginPath();
        ctx.arc(this._mapHandle.mouse.x, this._mapHandle.mouse.y, 4, 0, Math.PI * 2, true);
        ctx.fillStyle = "rgb(32, 144, 241)";
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }

}

export default MapRender;