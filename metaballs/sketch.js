const w = 300, h = 300,
    fps = 50,
    gravity = 0.01;

let calc = new Vec();

window.setInterval(infLoop, 1000 / fps);

//canvas
let canv = document.createElement("canvas");
canv.setAttribute("id", "canvasID");
canv.width = w;
canv.height = h;
document.body.appendChild(canv);
let c = document.getElementById("canvasID"),
    ctx = c.getContext("2d"),
    img = ctx.createImageData(w, h);
//canvas

class Blob {
    constructor(x_, y_, col_) {
        this.pos = new Vec(x_, y_);
        //   this.col = `rgba(0,${col_},0,1)`;
        this.vel = new Vec(2 - Math.random() * 4, 2 - Math.random() * 4);
        this.acc = new Vec(0, 0);
    }

    updatePos() {
        if (this.pos.x > w || this.pos.x < 0) this.vel.x *= -1;
        if (this.pos.y > h || this.pos.y < 0) this.vel.y *= -1;
        this.acc.y += gravity;
        this.vel = calc.add(this.vel, this.acc);
        this.pos = calc.add(this.vel, this.pos);
        this.acc.set(0, 0);
    }
}

class Pixel {
    constructor(x_, y_, col_) {
        this.pos = new Vec(x_, y_);
        this.col = [0, col_, 0, 1];
    }

    draw(index) {
        let tempCol = this.updateColor();
        let [r, g, b] = [
            //Math.min(65, tempCol < 255 ? 0 : tempCol > 512 ? 255 : tempCol - 255),
            tempCol < 255 ? tempCol : 255,
            tempCol / 2,
            tempCol / 4
            //            Math.min(50, tempCol < 255 ? 0 : tempCol > 512 ? 255 : tempCol - 255)
        ]
        this.col = [r, g, b, 255];
        img.data[index] = this.col[0];
        img.data[index + 1] = this.col[1];
        img.data[index + 2] = this.col[2];
        img.data[index + 3] = this.col[3];
    }

    updateColor() {
        let sum = 0;
        const mult = 60000;
        const d = 200;
        for (const b of blobs) {
            if (b.pos.x < this.pos.x + d &&
                b.pos.x > this.pos.x - d &&
                b.pos.y < this.pos.y + d &&
                b.pos.y > this.pos.y - d)
                sum += (1 / (this.dist(this.pos, b.pos) * blobs.length));
            // if (mult * sum >= 355) return 355;
        }
        return (mult * sum) ** 2;
    }

    dist(v1, v2) {
        return (v1.x - v2.x) ** 2 + (v1.y - v2.y) ** 2;
    }

}

let blobs = [];
for (let i = 0; i < 5; i++)blobs.push(new Blob(Math.random() * w, Math.random() * h));


background("black");
let pixels = [];
for (let y = 0; y < h; y++) {
    pixels.push([]);
    for (let x = 0; x < w; x++) {
        pixels[y].push(new Pixel(x, y, 255 * Math.random()));
    }
}


function infLoop() {
    // background(`rgba(0,0,0,0)`);
    blobs.forEach(b => b.updatePos());
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            pixels[y][x].draw(4 * (w * y + x));
        }
    }
    ctx.putImageData(img, 0, 0);
}

infLoop();