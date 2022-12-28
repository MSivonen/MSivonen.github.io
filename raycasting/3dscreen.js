class Stripe {
    constructor(angle_, dist_, fov_, i_, col_) {
        this.dist = dist_;
        this.angle = angle_;
        this.fov = fov_;
        this.w;
        this.i = i_;
        this.x,
            this.col = col_;
    }


    draw() {
        this.w = w / person.rays.length;
        this.x = this.i * (this.w);
        this.dist *= Math.cos(this.angle);
        this.h = Math.max(0, Math.min(h, 5 / (this.dist / w)));
        this.y = (h - this.h) / 2;
        line(person.x, person.y,
            person.x + Math.cos(-this.angle + person.angle) * this.dist,
            person.y + Math.sin(-this.angle + person.angle) * this.dist);
        const col = Math.floor(map(this.dist ** 2, 0, 500 ** 2, 255, 0));
        ctx.fillStyle = this.col;
        ctx.fillRect(this.x, this.y + h, this.w + 1, this.h);
    }

    drawOld() {
        this.w = w / person.rays.length;
        this.x = this.i * (this.w);
        this.dist *= Math.cos(this.angle);
        this.h = Math.max(0, Math.min(h, map(this.dist, 0, 400, h, 0)));
        this.y = (h - this.h) / 2;
        line(person.x, person.y,
            person.x + Math.cos(-this.angle + person.angle) * this.dist,
            person.y + Math.sin(-this.angle + person.angle) * this.dist);
        ctx.fillStyle = "rgb(255,255,255)";
        ctx.fillRect(this.x, this.y + h, this.w + 1, this.h);
    }
}