const w = 300, h = 300,
    fps = 50,
    resolution = 5;

let calc = new Vec();

window.setInterval(infLoop, 1000 / fps);

//canvas
let canv = document.createElement("canvas");
canv.setAttribute("id", "canvasID");
canv.width = w;
canv.height = h;
document.body.appendChild(canv);
let c = document.getElementById("canvasID"),
    ctx = c.getContext("2d");
//canvas

class Blob {
    constructor(x_, y_, col_) {
        this.pos = new Vec(x_, y_);
        this.col = `rgba(0,${col_},0,1)`;
        this.vel = new Vec(Math.random() * 2, Math.random() * 2);
        this.acc = new Vec(0, 0);
    }

    updatePos() {
        if (this.pos.x > w || this.pos.x < 0) this.vel.x *= -1;
        if (this.pos.y > h || this.pos.y < 0) this.vel.y *= -1;
        this.pos = calc.add(this.vel, this.pos);
        this.acc.set(0, 0);
    }
}

class Pixel {
    constructor(x_, y_, col_) {
        this.pos = new Vec(x_, y_);
        this.col = `rgba(0,${col_},0,1)`;
    }

    show() {
        let tempCol=this.updateColor()
        this.col = `rgba(${tempCol-255},${tempCol},${tempCol-1355},1)`
        ctx.fillStyle = this.col;
        ctx.strokeWeight = 0;
        ctx.fillRect(this.pos.x, this.pos.y, resolution, resolution);
    }

    updateColor() {
        let sum = 0;
        for (const b of blobs) {
            sum += calc.dist(this.pos, b.pos);
        }
        return 5000 / (sum / blobs.length);
    }

}

let blobs = [];
for (let i = 0; i < 3; i++)blobs.push(new Blob(Math.random() * w, Math.random() * h));


background("black");
let pixels = [];
for (let y = 0; y < h / resolution; y++) {
    pixels.push([]);
    for (let x = 0; x < w / resolution; x++) {
        pixels[y].push(new Pixel(x * resolution, y * resolution, 255 * Math.random()));
    }
}


function infLoop() {
    background(`rgba(0,0,0,0)`);
    //ctx.fillStyle = `rgba(0,40,0,1)`
    blobs.forEach(b => b.updatePos());
    for (let y = 0; y < h / resolution; y++) {
        for (let x = 0; x < w / resolution; x++) {
            pixels[y][x].updateColor();
        }
    }
    for (let y = 0; y < h / resolution; y++) {
        for (let x = 0; x < w / resolution; x++) {
            pixels[y][x].show();
        }
    }
}

infLoop();