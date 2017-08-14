import MapArea from './mapArea';

class MapRender {
    constructor(canvas) {
        this.map = canvas;
        this.ctx = this.map.getContext('2d');
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);

        this.showMousePoint = true;
        this.mouse = [];
        this.mouseInArea = false;

        this.drawArea = true;
        //this.drawAreaMode = "rect";
        this.drawAreaMode = "polygon";
        this.areaPoint = [];

        this.mapAreaList = [];
        this.init();
    }
    init() {
        this.map.oncontextmenu = function (e) {
            return false;
        }
        this.initHandle();
        this.draw();
    }

    initHandle() {
        this.map.addEventListener("mousedown", this.onMouseDown, false);
        this.map.addEventListener("mousemove", this.onMouseMove, false);
        this.map.addEventListener("mouseleave", this.onMouseLeave, false);
    }
    onMouseDown(e) {
        console.log("onmousedown", e);
        var leftClick = e.button == 0;
        if (leftClick) {
            var point = { x: e.offsetX, y: e.offsetY };
            this.areaPoint.push(point);
            if (this.drawAreaMode == "rect") {
                // 矩形框绘制的时候 第二个点就可以认为是绘制结束
                if (this.areaPoint.length == 2) {
                    var mapArea = new MapArea(this.areaPoint);
                    this.mapAreaList.push(mapArea);
                    this.areaPoint.length = 0;
                }
            } else if (this.drawAreaMode == "polygon") {
                if (this.areaPoint.length >= 2) {
                    if (this.areaPoint[0].x == point.x && this.areaPoint[0].y == point.y) {
                        var mapArea = new MapArea(this.areaPoint);
                        this.mapAreaList.push(mapArea);
                        this.areaPoint.length = 0;
                    }
                }
            }
            this.draw();
        } else {
            this.areaPoint.length = 0;
            this.draw();
        }

    }
    onMouseMove(e) {
        //console.log("onmousemove", e.offsetX, e.offsetY);
        this.mouse = { x: e.offsetX, y: e.offsetY };
        this.draw();
    }
    onMouseLeave(e) {
        var ctx = this.ctx;
        this.mouse = { x: -1, y: -1 };
        this.draw();
    }
    draw() {
        var ctx = this.ctx;
        ctx.clearRect(0, 0, this.map.width, this.map.height);
        this.drawMapBoundary(ctx);
        this.drawMapArea(ctx);
        this.drawPaintArea(ctx);
        ctx.beginPath();
        if (this.mouseInArea && this.mouse.x > 0 && this.mouse.y > 0) {
            ctx.arc(this.mouse.x, this.mouse.y, 4, 0, Math.PI * 2, true);
            ctx.fillStyle = "rgb(32, 144, 241)";
        }
        ctx.closePath();
        ctx.fill();
    }

    drawMapBoundary(ctx) {
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.strokeStyle = "rgba(32, 144, 241,0.5)";
        ctx.rect(100, 50, this.map.width - 200, this.map.height - 100);
        this.mouseInArea = ctx.isPointInPath(this.mouse.x, this.mouse.y);
        ctx.fillRect(100, 50, this.map.width - 200, this.map.height - 100);
        ctx.strokeRect(100, 50, this.map.width - 200, this.map.height - 100);

        ctx.closePath();
        ctx.fill();
    }


    drawMapArea(ctx) {
        this.mapAreaList.forEach((mapArea) => {
            mapArea.draw(ctx);
        })
    }

    drawPaintArea(ctx) {
        if (!this.drawArea) {
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
            ctx.stroke();
        }
    }


}

export default MapRender;