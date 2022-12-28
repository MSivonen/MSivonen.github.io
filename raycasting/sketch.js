let person,
    walls = [],
    calc,
    level,
    bgCol="rgba(52,52,52,1)";

let test1, test2, test3;

const w = 500, h = 500,
    xResolution = 100,
    fps = 60;

window.setInterval(infLoop, 1000 / fps);

//canvas
let canv = document.createElement("canvas");
canv.setAttribute("id", "canvasID");
canv.width = w;
canv.height = h * 2;
document.body.appendChild(canv);
let c = document.getElementById("canvasID"),
    ctx = c.getContext("2d");
//canvas

(function setup() {
    calc = new Vec(0, 0);
    person = new Person(35, 475, 1.5, 4, 1);
    //    for (let i = 0; i < 5; i++)
    //      walls.push(new Wall(Math.random() * w, Math.random() * h, Math.random() * w, Math.random() * h));
    //walls.push(new Wall(0, h, w, h));
    level = new Level(level1.edges);//, ...level1.extraWalls);
})();

function infLoop() {
    background(bgCol);
    ctx.fillStyle = "rgb(200,200,200)";
    ctx.fillRect(0, h + h / 2, h + h, w);
    person.update();
    person.draw();
    level.draw();
    person.stripes.forEach(s => s.draw());
}