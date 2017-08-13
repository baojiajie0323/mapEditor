class MapRender {
    constructor(canvas) {
        this.map = canvas;
        this.ctx = this.map.getContext('2d');
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.showMousePoint = true;
        this.mouse = [];
        this.mouseInArea = false;
        this.init();
    }
    init() {
        this.initHandle();
    }

    initHandle() {
        this.map.addEventListener("mousemove", this.onMouseMove, false);
        this.map.addEventListener("mouseleave", this.onMouseLeave, false);
    }
    onMouseMove(e) {
        console.log("onmousemove", e.offsetX, e.offsetY);


        this.mouse = { x: e.offsetX, y: e.offsetY };
        this.draw();
    }
    onMouseLeave(e) {
        var ctx = this.ctx;
        this.mouse = { x: -1, y: -1 };
        this.draw();
    }
    draw() {
        var ctx = this.ctx;
        ctx.clearRect(0, 0, this.map.width, this.map.height);
        this.drawMapBoundary(ctx);
        ctx.beginPath();
        if (this.mouseInArea && this.mouse.x > 0 && this.mouse.y > 0) {
            ctx.arc(this.mouse.x, this.mouse.y, 4, 0, Math.PI * 2, true);
            ctx.fillStyle = "rgb(32, 144, 241)";
        }
        ctx.closePath();
        ctx.fill();
    }

    drawMapBoundary(ctx) {
        ctx.fillStyle = "white";
        ctx.strokeStyle = "rgba(32, 144, 241,0.5)";
        ctx.beginPath();
        ctx.rect(100, 50, this.map.width - 200, this.map.height - 100);
        this.mouseInArea = ctx.isPointInPath(this.mouse.x,this.mouse.y);
        ctx.fillRect(100, 50, this.map.width - 200, this.map.height - 100);
        ctx.strokeRect(100, 50, this.map.width - 200, this.map.height - 100);
        
        ctx.closePath();
        ctx.fill();
    }
}

export default MapRender;