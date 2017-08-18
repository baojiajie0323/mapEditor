import Util from './util';

class MapArea {
    constructor(map, points, type) {
        this.checkselected = false;
        this.mouseInArea = false;
        this.map = map;
        this.mouse = { x: 0, y: 0 };
        this.type = type;
        this.editMode = false;
        this.enableEdit = false;
        this.editType = "";
        console.log("MapArea", points);
        if (type == "circle") {
            this.points = [];
            this.points.push(points[0]);
            this.r = Util.getDistance(points[1], points[0]);
        }
        else {
            if (points.length == 2) {
                this.points = [];
                this.points.push(points[0]);
                this.points.push({ x: points[1].x, y: points[0].y });
                this.points.push(points[1]);
                this.points.push({ x: points[0].x, y: points[1].y });
            } else {
                this.points = Object.assign([], points);
            }
        }
    }
    checkSelect(checkselect) {
        this.checkselected = checkselect;
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
    draw(ctx, mouse) {
        console.log("mapArea draw", this.points, this.type);
        if (this.editMode) {
            this.drawEditFrame(ctx, mouse);
        }


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
            ctx.arc(this.points[0].x, this.points[0].y, this.r, 0, 2 * Math.PI);
        }
        ctx.fillStyle = "rgba(32, 144, 241,0.3)";
        ctx.fill();
        ctx.strokeStyle = "rgba(32, 144, 241,0.5)";
        if (!this.editMode && this.checkselected) {
            if (ctx.isPointInPath(this.mouse.x, this.mouse.y)) {
                this.mouseInArea = true;
                ctx.strokeStyle = "rgb(255, 110, 11)";
                ctx.lineWidth = 2;
            } else {
                this.mouseInArea = false;
            }
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