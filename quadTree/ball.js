class Ball {
    constructor(x_, y_, r_) {
        this.x = x_;
        this.y = y_;
        this.r = r_;
        this.col = [188];
    }

    update() {
        this.x += .5;
        this.y += .5;
        if (this.x > w) this.x = 0;
        if (this.y > h) this.y = 0;
    }

    drawLine(other) {
        stroke(0, 255, 255, 80);
        line(this.x, this.y, other.x, other.y);
    }

    collision(other) {
        let x = this.x - other.x;
        let y = this.y - other.y;
        if (Math.sqrt(x ** 2 + y ** 2) < this.r + other.r) {
            this.col = [255, 0, 0];
            other.col = [255, 0, 0];
        }
        return Math.sqrt(x ** 2 + y ** 2);
    }

    draw() {
        strokeWeight(0);
        fill(...this.col);
        rect(this.x, this.y, this.r * 2);
    }
}