/**Vector class and vector calculations
 * @param x_ {number} x-coordinate
 * @param y_ {number} y-coordinate
 * @Example `let thisVector = new Vec(123, 456);`
  
 `const calc = new Vector();`

 `thisVector = calc.mult(thisVector, multiplier);`
 */
class Vec {
    constructor(x_, y_) {
        this.x = x_;
        this.y = y_;
    }

    /**@Create a new vector from angle
    *@param angle {number} in radians
    *@param len {number} Length (magnitude)
    *@return {Vec} `new Vec(angle, length)` */
    static fromAngle(angle, len) {
        return new Vec(Math.cos(angle) * len, Math.sin(angle) * len);
    }

    /**@Substract a vector from another
    *@param v1_ {Vec} @param v2_ {Vec} 
    *@return {Vec} v1_-v2_
    *@example calc.sub(v1_, v2_)*/
    sub(v1_, v2_) {
        return {
            x: v1_.x - v2_.x,
            y: v1_.y - v2_.y
        }
    }

    /**@Add a vector to another
    *@param v1_ {Vec} @param v2_ {Vec} 
    *@return {Vec} v1_+v2_
    *@example calc.add(v1_, v2_)*/
    add(v1_, v2_) {
        return {
            x: v1_.x + v2_.x,
            y: v1_.y + v2_.y
        }
    }

    /**@Multiply a vector by a number
    *@param v_ {Vec} @param n_ {number} 
    *@return {Vec} {v.x * n, v.y * n}
    *@example calc.mult(v, 3)*/
    mult(v_, n_) {
        return {
            x: v_.x * n_,
            y: v_.y * n_
        }
    }

    /**@Set coordinates of this vector
    *@param x_ {number}
    *@param y_ {number} 
    *@example myVector.set(x, y)*/
    set(x_, y_) {
        this.x = x_;
        this.y = y_;
    }

    /**@Dot product of two vectors (==inner product)
    *@param v1 {Vec}
    *@param v2 {Vec} 
    *@return {Vec} v1_.x * v2_.x + v1_.y * v2_.y
    *@example calc.dot(v1, v2)*/
    dot(v1_, v2_) {
        return v1_.x * v2_.x + v1_.y * v2_.y;
    }

    /**@Magnitude (length) of a vector
    *@param v_ {Vec}
    *@return {number} Math.sqrt(v.x ** 2 + v.y ** 2)
    *@example calc.mag(v1)*/
    mag(v_) {
        return (Math.sqrt(v_.x ** 2 + v_.y ** 2));
    }

    /**@Distance between two vectors
    *@param v1 {Vec}
    *@param v2 {Vec} 
    *@return {number} Math.sqrt((v1_.x - v2_.x) ** 2 + (v1_.y - v2_.y) ** 2)
    *@example calc.dist(v1, v2)*/
    dist(v1_, v2_) {
        return (Math.sqrt((v1_.x - v2_.x) ** 2 + (v1_.y - v2_.y) ** 2));
    }

    project(v1_, v2_) {
        const a = this.dot(v1_, v2_) / this.dot(v2_, v2_);
        return {
            x: a * v2_.x,
            y: a * v2_.y
        }
    }

    /*test, Doesn't work
        wallCollide(wall, person) {
        const ac = calc.sub(person, wall.start);
        const ab = calc.sub(wall.end, wall.start);
        const d = calc.add(calc.project(ac, ab), wall.start);
        line(person.x, person.y, d.x, d.y);
        const ray = { pos: new Vec(d.x, d.y, person.x, person.y,direction:) };
        if (calc.intersect(ray, wall)) {
            //console.log("SSS");
            if (calc.mag(calc.sub(d, person)) < person.fatness) {

                //const rt={x:,y:};
                return true;
            }
            else return false;
        }
    }*/

    /** Intersection point between this ray and a wall, or `false` if no intersection.
 * @param wall {Vec}
 * @returns {{x:number, y:number}|false} `Vector {x:123, y:123}` or `false`
 */
    intersect(ray, wall) {
        //https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection#Given_two_points_on_each_line_segment
        let x1 = ray.pos.x,
            y1 = ray.pos.y,
            x2 = ray.pos.x + ray.direction.x,
            y2 = ray.pos.y + ray.direction.y,
            x3 = wall.start.x,
            y3 = wall.start.y,
            x4 = wall.end.x,
            y4 = wall.end.y;

        let d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        let t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / d;
        let u = ((x1 - x3) * (y1 - y2) - (y1 - y3) * (x1 - x2)) / d;

        if (0 <= t && t <= 1 && 0 <= u && u <= 1) {
            let px = x1 + t * (x2 - x1);
            let py = y1 + t * (y2 - y1);

            // circle(px, py, 5, false);
            // ctx.fillStyle = wall.col;
            // ctx.fill();
            return { x: px, y: py, col: wall.col };
        }
        else {
            return null;
        }
    }
}