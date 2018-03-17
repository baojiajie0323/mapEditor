
class MapHandle {
    constructor(mapRender) {
        this._mapRender = mapRender;
        this._map = mapRender._map;
        this.EventListener = [];

        this.mouse = { x: -1, y: -1 };
        this.init();
    }
    init() {
        this._map.addEventListener("mousedown", this.onMouseDown.bind(this), false);
        this._map.addEventListener("mouseup", this.onMouseUp.bind(this), false);
        this._map.addEventListener("mousemove", this.onMouseMove.bind(this), false);
        this._map.addEventListener("mouseleave", this.onMouseLeave.bind(this), false);
    }
    addListener(type, handle) {
        this.EventListener.push({
            type, handle
        });
    }
    dispatchEvent(e) {
        var eventListener = this.EventListener.filter((el) => {
            return e.type == el.type
        })
        eventListener.forEach((el) => {
            el.handle(e);
        })
    }
    onMouseDown(e) {
        this._mapRender.dispatch({ type: 'mapeditor/selectedArea', payload: '' });
        this.dispatchEvent(e);
    }
    onMouseUp(e) {
        this.dispatchEvent(e);
    }
    onMouseMove(e) {
        var point = { x: e.offsetX, y: e.offsetY }
        this.mouse = this._mapRender.findNearbyPoint(point) || point;
        this.dispatchEvent(e);
    }
    onMouseLeave(e) {
        this.mouse = { x: -1, y: -1 }
        this.dispatchEvent(e);
    }
}

export default MapHandle;