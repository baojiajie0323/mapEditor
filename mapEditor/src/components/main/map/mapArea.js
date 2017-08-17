import Util from './util';

class MapArea {
    constructor(points, type) {
        this.checkselected = false;
        this.mouseInArea = false;
        this.mouse = { x: 0, y: 0 };
        this.type = type;
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
    setEditMode(bEdit) {
        this.editMode = true;
    }
    draw(ctx) {
        console.log("mapArea draw", this.points, this.type);
        if (this.editMode) {
            this.drawEditFrame(ctx);
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
    drawEditFrame(ctx) {
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

        console.log("drawEditFrame", x1, y1, x2 - x1, y2 - y1);

        ctx.beginPath();
        ctx.setLineDash([5,2]);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgb(255, 110, 11)";
        ctx.rect(x1, y1, x2 - x1, y2 - y1);
        ctx.stroke();
        ctx.setLineDash([]);
    }
}

export default MapArea;