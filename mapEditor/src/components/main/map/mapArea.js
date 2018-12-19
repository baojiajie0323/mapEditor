import Util from './util';

class MapArea {
    constructor(mapRender, type, points, text) {
        this._mapRender = mapRender;
        this.map = mapRender._map;
        this._mapHandle = mapRender._mapHandle;

        this.id = Util.getUUID();
        this.type = type;
        this.points = Object.assign([], points);
        this.text = text;

        this.centerpoint = Util.getCenterPoint(this.points, this.type);
        this.selected = false;
        this.mouseInArea = false;

        this.mouseState = "";

        this.editMode = false;
        this.editType = "";


        this.init();
    }
    init() {
        this._mapHandle.addListener("mousemove", this.onMouseMove.bind(this));
        this._mapHandle.addListener("mousedown", this.onMouseDown.bind(this));
        this._mapHandle.addListener("mouseup", this.onMouseUp.bind(this));
    }
    onMouseMove(e) {
        if (this.editType == "zoom") {
            var originDistance = Util.getDistance(this.zoomStartPoint, this.centerpoint);
            var newDistance = Util.getDistance(this._mapHandle.mouse, this.centerpoint);
            var scale = newDistance / originDistance;
            this.translatePoints(0, 0, scale);
            this.zoomStartPoint = this._mapHandle.mouse;
        } else if (this.editType == "rotate") {
            var originAngle = Util.getAngle(this.rotateStartPoint, this.centerpoint);
            var newAngle = Util.getAngle(this._mapHandle.mouse, this.centerpoint);
            var rotate = originAngle - newAngle;
            console.log("angle:", newAngle, rotate);
            this.translatePoints(0, 0, 1, rotate);
            this.rotateStartPoint = this._mapHandle.mouse;
        } else if (this.editType == "move") {
            var originPoint = this.moveStartPoint;
            var newPoint = this._mapHandle.mouse;
            this.translatePoints(newPoint.x - originPoint.x, newPoint.y - originPoint.y);
            this.moveStartPoint = this._mapHandle.mouse;
        }
    }
    onMouseDown(e) {
        if (this._mapRender.isAreaPainting()) {
            return;
        }
        var lbutton = e.button == 0;

        console.log("onMouseDown", this.selected, this.mouseInArea);
        if (!lbutton) {
            if (this.mouseInArea) {
                var menu = [
                    { title: this.editMode ? '停止编辑' : '编辑元素', onClick: this.onClickEdit },
                    { title: '拆分元素', onClick: this.onClickEdit },
                    { title: '' },
                    { title: '查看属性数据', onClick: this.onClickEdit },
                    { title: '删除元素', onClick: this.onClickDelete },
                ]
                this._mapRender.contextmenucb(true, menu, this._mapHandle.mouse);
            }
        }
        if (this.editMode && lbutton) {
            if (this.cursor == "se-resize" || this.cursor == "sw-resize") {
                this.editType = "zoom";
                this.zoomStartPoint = this._mapHandle.mouse;
            } else if (this.cursor == "pointer") {
                this.editType = "rotate";
                this.rotateStartPoint = this._mapHandle.mouse;
            } else if (this.cursor == "move") {
                this.editType = "move"
                this.moveStartPoint = this._mapHandle.mouse;
            } else {
                this.editType = "";
            }

            return;
        }
        if (this.selected != this.mouseInArea) {
            this.selected = this.mouseInArea;
            if (!this.selected) {
                this.editMode = false;
            } else {
                this._mapRender.dispatch({ type: 'mapeditor/selectedArea', payload: this.id });
            }
            this._mapRender.draw();
        }
    }
    onMouseUp(e) {
        this.editType = "";
    }
    translatePoints(offsetx, offsety, scale, rotate) {
        console.log("translatePoints", this.centerpoint, scale, rotate);
        if (offsetx) {
            this.centerpoint.x += offsetx;
        }
        if (offsety) {
            this.centerpoint.y += offsety;
        }
        var context = this;
        this.points.forEach((p, index) => {
            console.log("translatePoints1", p, offsetx, offsety);
            // if (context.type == "circle" && index >= 1) {
            //     return;
            // }
            if (offsetx) {
                p.x += offsetx;
            }
            if (offsety) {
                p.y += offsety;
            }
            if (scale) {
                var xd = p.x - this.centerpoint.x;
                var yd = p.y - this.centerpoint.y;
                p.x = xd * scale + this.centerpoint.x;
                p.y = yd * scale + this.centerpoint.y;
            }

            if (rotate) {
                var angle = rotate * 2 * Math.PI / 360;
                var x = p.x;
                var y = p.y;
                p.x = (x - this.centerpoint.x) * Math.cos(angle) - (y - this.centerpoint.y) * Math.sin(angle) + this.centerpoint.x;
                p.y = (x - this.centerpoint.x) * Math.sin(angle) + (y - this.centerpoint.y) * Math.cos(angle) + this.centerpoint.y;
            }

            console.log("translatePoints2", p);
        });
    }
    onClickEdit = () => {
        this.editMode = !this.editMode;
        this._mapRender.draw();
    }
    onClickDelete = () => {
        alert('onclickdelete');
    }
    draw(ctx) {
        if (this.editMode) {
            this.drawEditFrame(ctx);
        }
        this.drawShape(ctx);
        this.drawText(ctx);
    }
    drawShape(ctx) {
        const { mouse } = this._mapHandle;
        ctx.beginPath();
        ctx.lineJoin = "round";
        ctx.lineWidth = 1;
        if (this.type == "polygon") {
            this.points.forEach((point, index) => {
                if (index == 0) {
                    ctx.moveTo(point.x, point.y);
                } else {
                    ctx.lineTo(point.x, point.y);
                }
            })
            ctx.closePath();
        } else {
            var r = Util.getDistance(this.points[1], this.points[0]);
            ctx.arc(this.points[0].x, this.points[0].y, r, 0, 2 * Math.PI);
        }
        ctx.fillStyle = "rgba(32, 144, 241,0.3)";
        ctx.fill();
        ctx.strokeStyle = "rgba(32, 144, 241,0.5)";
        this.mouseInArea = ctx.isPointInPath(mouse.x, mouse.y);

        if (this.selected && !this.editMode) {
            ctx.strokeStyle = "rgb(255, 110, 11)";
            ctx.lineWidth = 2;
        }
        ctx.stroke();
    }
    drawEditFrame(ctx) {
        const { mouse } = this._mapHandle;
        var x1, x2, y1, y2;
        if (this.type == "polygon") {
            var arr_x = this.points.map((p) => { return p.x });
            var arr_y = this.points.map((p) => { return p.y });
            x1 = Math.min.apply(null, arr_x) - 2;
            y1 = Math.min.apply(null, arr_y) - 2;
            x2 = Math.max.apply(null, arr_x) + 2;
            y2 = Math.max.apply(null, arr_y) + 2;
        } else {
            var cc = this.points[0];
            var r = Util.getDistance(this.points[1], this.points[0]);
            x1 = cc.x - r - 2;
            y1 = cc.y - r - 2;
            x2 = cc.x + r + 2;
            y2 = cc.y + r + 2;
        }
        ctx.beginPath();
        ctx.setLineDash([5, 2]);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgb(255, 110, 11)";
        ctx.rect(x1, y1, x2 - x1, y2 - y1);
        ctx.moveTo(x1 + (x2 - x1) / 2, y1);
        ctx.lineTo(x1 + (x2 - x1) / 2, y1 - 20);
        ctx.stroke();
        ctx.setLineDash([]);

        if (!this.editType) {
            this.cursor = "default";
        }
        ctx.beginPath();
        ctx.arc(x1 + (x2 - x1) / 2, y1 - 23, 5, 0, Math.PI * 2);
        if (ctx.isPointInPath(mouse.x, mouse.y)) {
            this.cursor = "pointer";
        }
        ctx.fillStyle = "rgb(255,255,255)";
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.rect(x1 - 5, y1 - 5, 10, 10);
        if (ctx.isPointInPath(mouse.x, mouse.y)) {
            this.cursor = "se-resize";
        }
        ctx.fillStyle = "rgb(255,255,255)";
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.rect(x1 - 5, y2 - 5, 10, 10);
        if (ctx.isPointInPath(mouse.x, mouse.y)) {
            this.cursor = "sw-resize";
        }
        ctx.fillStyle = "rgb(255,255,255)";
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.rect(x2 - 5, y1 - 5, 10, 10);
        if (ctx.isPointInPath(mouse.x, mouse.y)) {
            this.cursor = "sw-resize";
        }
        ctx.fillStyle = "rgb(255,255,255)";
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.rect(x2 - 5, y2 - 5, 10, 10);
        if (ctx.isPointInPath(mouse.x, mouse.y)) {
            this.cursor = "se-resize";
        }
        ctx.fillStyle = "rgb(255,255,255)";
        ctx.fill();
        ctx.stroke();

        if (this.mouseInArea) {
            this.cursor = "move";
        }
        this.map.style.cursor = this.cursor;
    }
    drawText(ctx) {
        ctx.save();
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = '#333';
        ctx.lineWidth = 1;
        ctx.fillText("一监区", this.centerpoint.x, this.centerpoint.y + 3);
        ctx.restore();
    }
}

export default MapArea;