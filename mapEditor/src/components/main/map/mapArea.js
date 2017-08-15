import Util from './util';

class MapArea {
    constructor(points, type) {
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
    draw(ctx) {
        console.log("mapArea draw", this.points, this.type);

        ctx.beginPath();
        ctx.strokeStyle = "rgba(32, 144, 241,0.5)";
        ctx.fillStyle = "rgba(32, 144, 241,0.3)";
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
        ctx.fill();
        ctx.stroke();
    }
}

export default MapArea;