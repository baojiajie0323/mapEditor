var mapJson = require('./map.json');
import mapArea from './mapArea';
//import mapSprite from './mapSprite';

class MapData {
    constructor(mapRender) {
        //this.init();
    }
    static instance(mapRender) {
        if (!MapData._instance) {
            MapData._instance = new MapData(mapRender);
        }
        if (mapRender) {
            MapData._instance._mapRender = mapRender;
            MapData._instance.init();
        }
        return MapData._instance;
    }
    init() {
        this.curMapName = "test";
        this.dataJson = mapJson;
        this.initData();
        console.log('MapData init', mapJson);
    }
    initData() {
        var context = this;
        this.data = this.dataJson.map((d) => {
            d.area = d.area.map((a) => {
                return new mapArea(context._mapRender, a.type, a.points, a.text);
            })
            return d;
        })
    }
    getJsonData() {
        var context = this;
        if(!this.data) return;
        this.dataJson = this.data.map((d) => {
            var areajson = 
            d.area = d.area.map((a) => {
                return { points: a.points, text: a.text, type: a.type }
            })
            return d;
        })
        return this.dataJson;
    }
    getCurMapData() {
        for (var i = 0; i < this.data.length; i++) {
            if (this.data[i].name == this.curMapName) {
                return this.data[i];
            }
        }
    }
    addArea(type, points) {
        var mapData = this.getCurMapData();
        if (!mapData) {
            return;
        }
        var mapArea = new MapArea(this, type, points);
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