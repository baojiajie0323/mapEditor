var mapJson = require('./map.json');
import mapArea from './mapArea';
import util from './util';
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
        this.initData();
    }
    initData() {
        console.log('MapData init', mapJson);
        var context = this;
        this.data = mapJson.map((d) => {
            d.area = d.area.map((a) => {
                return new mapArea(context._mapRender, a.type, a.points, a.text);
            })
            return d;
        })
    }
    getJsonData() {
        var context = this;
        if(!this.data) return;
        var dataJson =  [];
        this.data.forEach((d) => {
            var layer = {};
            layer.area = [];
            layer.name = d.name;
            d.area.forEach((a) => {
                layer.area.push({ points: a.points, text: a.text, type: a.type })
            })
            dataJson.push(layer);
        })
        console.log('getJsonData',dataJson);
        return dataJson;
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