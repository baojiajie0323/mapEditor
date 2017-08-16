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
    draw(ctx) {
        console.log("mapArea draw", this.points, this.type);

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
        if (this.checkselected) {
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
}

export default MapArea;