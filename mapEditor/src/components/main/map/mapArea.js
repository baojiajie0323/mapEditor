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
        this.mouse = { x: 0, y: 0 };

        this.editMode = false;
        this.enableEdit = false;
        this.editType = "";


        this.init();
    }
    init() {
        this._mapHandle.addListener("mousemove", this.onMouseMove.bind(this));
        this._mapHandle.addListener("mousedown", this.onMouseDown.bind(this));
    }
    onMouseMove(e) {

    }
    onMouseDown(e) {
        if (this._mapRender.isAreaPainting()) {
            return;
        }

    }
    checkMouse(mouse) {
        this.mouse = mouse;
    }
    checkEdit(mouse) {
        this.enableEdit = true;
    }
    setEditMode(bEdit) {
        this.editMode = true;
    }
    draw(ctx) {
        if (this.editMode) {
            this.drawEditFrame(ctx, mouse);
        }
        this.drawShape(ctx);
    }
    drawShape(ctx) {
        const { mouse } = this._mapHandle;
        ctx.beginPath();
        ctx.lineJoin = "round";
        ctx.lineWidth = 1;
        if (this.type == "polygon") {
            var points = [];
            if (this.points.length == 2) {
                points.push(this.points[0]);
                points.push({ x: this.points[1].x, y: this.points[0].y });
                points.push(this.points[1]);
                points.push({ x: this.points[0].x, y: this.points[1].y });
            } else {
                points = this.points;
            }
            points.forEach((point, index) => {
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
           
        if(this.selected){
            ctx.strokeStyle = "rgb(255, 110, 11)";
            ctx.lineWidth = 2;
        }
        ctx.stroke();
    }
    drawEditFrame(ctx, mouse) {
        if (this.type == "polygon") {
            var arr_x = this.points.map((p) => { return p.x });
            var arr_y = this.points.map((p) => { return p.y });
            var x1 = Math.min.apply(null, arr_x) - 2;
            var y1 = Math.min.apply(null, arr_y) - 2;
            var x2 = Math.max.apply(null, arr_x) + 2;
            var y2 = Math.max.apply(null, arr_y) + 2;
        } else {
            var cc = this.points[0];
            var x1 = cc.x - this.r - 2;
            var y1 = cc.y - this.r - 2;
            var x2 = cc.x + this.r + 2;
            var y2 = cc.y + this.r + 2;
        }

        console.log("drawEditFrame", x1, y1, x2 - x1, y2 - y1, "mouse:", mouse.x, mouse.y);

        ctx.beginPath();
        ctx.setLineDash([5, 2]);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgb(255, 110, 11)";
        ctx.rect(x1, y1, x2 - x1, y2 - y1);
        ctx.moveTo(x1 + (x2 - x1) / 2, y1);
        ctx.lineTo(x1 + (x2 - x1) / 2, y1 - 20);
        ctx.stroke();
        ctx.setLineDash([]);

        var cursor = "default";
        ctx.beginPath();
        ctx.arc(x1 + (x2 - x1) / 2, y1 - 22, 3, 0, Math.PI * 2);
        if (ctx.isPointInPath(mouse.x, mouse.y)) {
            cursor = "pointer";
            this.editType = "rotate";
        }
        ctx.fillStyle = "rgb(255,255,255)";
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.rect(x1 - 3, y1 - 3, 6, 6);
        if (ctx.isPointInPath(mouse.x, mouse.y)) {
            cursor = "se-resize";
            this.editType = "zoom";
        }
        ctx.fillStyle = "rgb(255,255,255)";
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.rect(x1 - 3, y2 - 3, 6, 6);
        if (ctx.isPointInPath(mouse.x, mouse.y)) {
            cursor = "sw-resize";
            this.editType = "zoom";
        }
        ctx.fillStyle = "rgb(255,255,255)";
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.rect(x2 - 3, y1 - 3, 6, 6);
        if (ctx.isPointInPath(mouse.x, mouse.y)) {
            cursor = "sw-resize";
            this.editType = "zoom";
        }
        ctx.fillStyle = "rgb(255,255,255)";
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.rect(x2 - 3, y2 - 3, 6, 6);
        if (ctx.isPointInPath(mouse.x, mouse.y)) {
            cursor = "se-resize";
            this.editType = "zoom";
        }
        ctx.fillStyle = "rgb(255,255,255)";
        ctx.fill();
        ctx.stroke();

        this.map.style.cursor = cursor;
    }
}

export default MapArea;