import Util from './util';

class MapArea {
    constructor(mapRender, type, points) {
        this._mapRender = mapRender;
        this.map = mapRender._map;
        this._mapHandle = mapRender._mapHandle;

        this.type = type;
        this.points = Object.assign([], points);
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

    }
    onMouseDown(e) {
        if (this._mapRender.isAreaPainting()) {
            return;
        }
        var lbutton = e.button == 0;

        console.log("onMouseDown", this.selected, this.mouseInArea);
        if (this.editMode) {
            if (this.cursor == "se-resize" || this.cursor == "sw-resize") {
                this.editType = "zoom";
            } else if (this.cursor == "pointer") {
                this.editType = "rotate";
            } else {
                this.editType = ""
            }
            return;
        }
        if (this.selected != this.mouseInArea) {
            this.selected = this.mouseInArea;
            if (!this.selected) {
                this.editMode = false;
            }
            this._mapRender.draw();
        }
        if (!lbutton) {
            if (this.mouseInArea) {
                var menu = [
                    { title: '编辑元素', onClick: this.onClickEdit.bind(this) },
                    { title: '拆分元素', onClick: this.onClickEdit },
                    { title: '' },
                    { title: '查看属性数据', onClick: this.onClickEdit },
                    { title: '删除元素', onClick: this.onClickEdit },
                ]
                this._mapRender.contextmenucb(true, menu, this._mapHandle.mouse);
            }
        }
    }
    onMouseUp(e) {
        this.editType = "";
    }
    onClickEdit() {
        this.editMode = true;
        this._mapRender.draw();
    }
    draw(ctx) {
        if (this.editMode) {
            this.drawEditFrame(ctx);
        }
        this.drawShape(ctx);
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

        if(!this.editType){
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

        this.map.style.cursor = this.cursor;
    }
}

export default MapArea;