class MapUtil {
    static getDistance(p1, p2) {
        return Math.pow((Math.pow((p2.x - p1.x), 2) + Math.pow((p2.y - p1.y), 2)), 0.5);
    }
    static getAngle(p1, p2) {
        var angle = Math.atan((p2.y - p1.y) / (p1.x - p2.x));
        if (p2.x - p1.x >= 0) {
            angle += Math.PI;
        } else if (p2.y < p1.y) {
            angle += 2 * Math.PI;
        }
        return angle * 360 / (2 * Math.PI);
    }
    static getCenterPoint(points, type) {
        if (type == "polygon") {
            var x1, x2, y1, y2;
            var arr_x = points.map((p) => { return p.x });
            var arr_y = points.map((p) => { return p.y });
            x1 = Math.min.apply(null, arr_x) - 2;
            y1 = Math.min.apply(null, arr_y) - 2;
            x2 = Math.max.apply(null, arr_x) + 2;
            y2 = Math.max.apply(null, arr_y) + 2;
            return { x: x1 + (x2 - x1) / 2, y: y1 + (y2 - y1) / 2 }
        }
        else {
            return Object.assign({}, points[0]);
        }
    }
}

export default MapUtil;