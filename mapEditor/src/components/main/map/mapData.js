//数据格式：
data: [{
    layer: {
        name: 'test',
        area: [{

        }],
        sprite: [{

        }]
    }
}]

class MapData {
    constructor() {
        this.curMapName = "test";
        this.mapAreaList = [];
    }
    init() {
    }
    addArea(mapArea) {
        this.mapAreaList.push(mapArea);
    }

}

export default MapData;