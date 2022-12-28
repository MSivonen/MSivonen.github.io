/**@param lightPower_ {number} rgba alpha 0...1 */
class Ray {
    constructor(x_, y_, angle_, lightPower_ = 0.05) {
        this.pos = new Vec(x_, y_);
        this.end = new Vec();
        this.angle = angle_;
        this.direction = Vec.fromAngle(this.angle, 50);
        this.col = `rgba(255,255,100,${lightPower_})`;
        this.rayWidth = 1;
        this.dist = 99e99;
    }

    draw() {
        ctx.lineWidth = this.rayWidth;
        ctx.strokeStyle = this.col;
        this.update();
        line(this.pos.x, this.pos.y, this.end.x, this.end.y);
    }

    update() {
        this.direction = Vec.fromAngle(this.angle, 750);
        let shortest = 99e99;
        let result = { x: 99e99, y: "99e99" };
        let p;
        level.walls.forEach(wall => { //find the closest wall, if any, and get the intersection point
            p = calc.intersect(this, wall);
            if (p) {
                let distance = calc.dist(this.pos, p);
                if (distance < shortest) {
                    result = p;
                    shortest = distance;
                }
            }
        });
        if (result.x < 99e99) {
            this.end.x = result.x;
            this.end.y = result.y;
            this.dist = shortest;
            this.col = result.col;
        }
        else {
            this.end.set(this.pos.x + this.direction.x, this.pos.y + this.direction.y);
            this.dist = 99e99;
        }
    }
}

