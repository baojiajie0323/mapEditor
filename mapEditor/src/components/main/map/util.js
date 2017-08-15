class MapUtil {
    static getDistance(p1, p2) {
        return Math.pow((Math.pow((p2.x - p1.x), 2) + Math.pow((p2.y - p1.y), 2)), 0.5);
    }
}

export default MapUtil;