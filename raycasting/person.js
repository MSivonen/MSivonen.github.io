/**@param numLights_ {number} number of parallel light sources for soft shadows
*@param lightPower_ {number} rgba alpha 0...1
@param fov_{number} field of view `Math.PI / fov_` */
class Person {
    constructor(x_, y_, fov_, numLights_ = -999, lightPower_) {
        this.numLights = numLights_;
        this.lightPower = lightPower_;
        this.fov = Math.PI / fov_;
        this.rayAngleStep = this.fov / 500; //Math.PI / 180 == 1deg intervals
        this.x = x_;
        this.y = y_;
        this.angle = -Math.PI / 2;
        this.rays = []; //2d rays
        this.colliders = [];
        this.speed = 2;
        this.turnSpeed = 0.07;
        this.lights = [];
        this.lightDist = 2;
        this.lightWidth = 3; //fov of additional lights
        this.lightPower = lightPower_;
        this.r = this.numLights * this.lightDist;
        this.stripes = []; //3d vertical stripes
        this.fatness = 3;

        this.make2dRays();
        this.make3dRays();
        for (let i = 0; i < 360; i++)
            this.colliders.push(new Ray(this.x, this.y, this.angle + (i * 180 / Math.PI), .1));

        this.softLight = false;
        if (this.softLight) {
            for (let i = numLights_ / -2; i <= numLights_ / 2; i += 1) {
                console.log(i);
                this.lights.push(new Person(this.x, this.y + i * this.lightDist, this.lightWidth, -999, 0.05));
            }
        }
        this.xResolution = this.fov / this.rayAngleStep;
    }

    draw() {
        this.rays.forEach(r => r.draw());
        this.lights.forEach(l => l.draw());
        ctx.lineWidth = 0;
        ctx.fillStyle = "rgb(255,255,255)";
        //if (this.lights.length > 0) 
        circle(this.x, this.y, this.fatness);
        ctx.lineWidth = 1;
        line(this.x + Math.cos(this.angle - Math.PI / 4) * 100, this.y + Math.sin(this.angle - Math.PI / 4) * 100,
            this.x + Math.cos(this.angle + Math.PI / 4) * 100, this.y + Math.sin(this.angle + Math.PI / 4) * 100,
        );
    }

    update() {
        this.colliders.forEach(c => c.update());
        this.move();
        //this.mousePos();
        this.updateRays();
        this.make3dRays();
        this.lights.forEach(l => l.updateRays());
    }

    make2dRays() {
        for (let i = this.fov / -2; i < this.fov / 2; i += this.rayAngleStep) {
            this.rays.push(new Ray(this.x, this.y, i, this.lightPower));
            //console.log("made a 2d ray")
        }
        for (let i = 0; i < this.fov / this.rayAngleStep; i++)
            this.stripes.push(new Stripe(this.angle, 50, this.fov, i, this.rays[i].col));
    }

    make3dRays() {
        this.rays = [];
        let xP = this.x,
            yP = this.y,
            aP = this.angle,
            fov = this.fov,
            distToViewPlane = 35,
            viewWidth = 50,
            rayAmount = this.fov / this.rayAngleStep,
            firstPoint = -viewWidth / 2,
            interv = viewWidth / rayAmount,
            points = [];

        for (let i = 0; i < rayAmount; i++) {
            let point = { x: firstPoint + interv * i, y: distToViewPlane, ang: -99 };
            point.ang = this.angle + Math.atan(point.x / distToViewPlane);
            //  console.log(point);
            ctx.lineWidth = this.rayWidth;
            ctx.strokeStyle = this.col;
            circle(point.x, point.y);
            this.rays.push(new Ray(this.x, this.y, point.ang, this.lightPower));
        }

    }

    mousePos() {
        this.x = Math.min(Math.max(0, mouseX), w - 1);
        this.y = Math.max(Math.min(h - 1, mouseY), 0);
    }

    updateRays() {
        for (let i = 0; i < this.rays.length; i++) {
            let ray = this.rays[i];
            // ray.pos.x = this.x;
            //  ray.pos.y = this.y;
            //  ray.angle = this.angle + this.fov / -2 + i * this.rayAngleStep;
            if (this.stripes.length > 0) {
                this.stripes[i].dist = this.rays[i].dist;//this.rays[i].dist;
                this.stripes[i].angle = this.angle - this.rays[i].angle;
                this.stripes[i].col = this.rays[i].col;
            }
        }
    }

    move() {
        let keysPressed = {
            "w": is_key_down("w"),
            "s": is_key_down("s"),
            "a": is_key_down("a"),
            "d": is_key_down("d")
        };
        let oldPos = new Vec(this.x, this.y);
        if (this.lights.length > 0 || !this.softLight) {
            if (keysPressed.w) {
                this.x += Math.cos(this.angle) * this.speed;
                this.y += Math.sin(this.angle) * this.speed;
            }
            if (keysPressed.s) {
                this.x -= Math.cos(this.angle) * this.speed;
                this.y -= Math.sin(this.angle) * this.speed;
            }
            if (keysPressed.a) {
                this.angle -= this.turnSpeed;
            }
            if (keysPressed.d) {
                this.angle += this.turnSpeed;
            }
        }

        for (const ray of this.colliders) {
            ray.pos.x = this.x;
            ray.pos.y = this.y;
        }

        if (this.collide()) {
            this.x = oldPos.x;
            this.y = oldPos.y;
        }
        //prevent gtfo
        this.x = Math.max(this.x, 10);
        this.y = Math.max(this.y, 10);
        this.x = Math.min(this.x, w - 10);
        this.y = Math.min(this.y, h - 10);

        let i = this.numLights / -2;
        for (const l of this.lights) {
            l.x = this.x + Math.cos(this.angle + Math.PI / 2) * this.lightDist * i;
            l.y = this.y + Math.sin(this.angle + Math.PI / 2) * this.lightDist * i;
            l.angle = this.angle;
            i += 1;
        }
    }

    collide() {
        let bump = false;
        for (const ray of this.colliders) {
            if (ray.dist < this.fatness) {
                bgCol = "rgba(155,52,52,1)";
                bump = true;
            }
            else {
                bgCol = "rgba(52,52,52,1)";
            }
        }
        return bump;
    }
}

