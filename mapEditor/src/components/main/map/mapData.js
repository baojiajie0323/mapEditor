var mapJson = require('./map.json');

class MapData {
    constructor() {
        //this.init();
    }
    static instance() {
        if (!MapData._instance) {
            MapData._instance = new MapData();
        }
        return MapData._instance;
    }
    init() {
        this.curMapName = "test";
        this.data = mapJson;
        console.log('MapData init', mapJson);
    }
    getCurMapData() {
        for (var i = 0; i < this.data.length; i++) {
            if (this.data[i].name == this.curMapName) {
                return this.data[i];
            }
        }
    }
    addArea(mapArea) {
        var mapData = this.getCurMapData();
        if (!mapData) {
            return;
        }
        mapData.area.push(mapArea);
    }
    getAreaList() {
        var mapData = this.getCurMapData();
        if (!mapData) {
            return;
        }
        return mapData.area;
    }

}

export default MapData;