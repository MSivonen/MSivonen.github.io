class Wall {
    constructor(xs_, ys_, xe_, ye_, col_ = "rgb(55,155,55)") {
        //this.xs = xs_;
        //this.ys = ys_;
        this.start = new Vec(xs_, ys_);
        this.end = new Vec(xe_, ye_);
        //this.xe = xe_;
        //this.ye = ye_;
        this.col = col_;
    }

    draw() {
        ctx.lineWidth = 2;
        ctx.strokeStyle = this.col;
        line(this.start.x, this.start.y, this.end.x, this.end.y);
    }
}