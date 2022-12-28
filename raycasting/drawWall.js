let newWalls = [],
    points = [],
    mousePos,
    iter = 0;
const w = 500, h = 500;

//canvas
let canv = document.createElement("canvas");
canv.setAttribute("id", "canvasID");
canv.width = w;
canv.height = h;
document.body.appendChild(canv);
let c = document.getElementById("canvasID"),
    ctx = c.getContext("2d");
//canvas

let btn = document.createElement("button");
btn.innerHTML = "Click Me";
document.body.appendChild(btn);
btn.onclick = function () {
    console.log(JSON.stringify(newWalls));
};

canv.addEventListener('mousemove', function (evt) {
    mousePos = getMousePos(canv, evt);
}, false);

canv.addEventListener('click', (event) => {
    newWalls.push({ x: mousePos.x, y: mousePos.y });
});

window.setInterval(infLoop, 1000 / 5);
function infLoop() {
    background(0, 1);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "white";
    if (newWalls.length > 1)
        for (let i = 1; i < newWalls.length; i++) {
            line(newWalls[i - 1].x, newWalls[i - 1].y, newWalls[i].x, newWalls[i].y);
        }
}

function getMousePos(canv, evt) {
    var rect = canv.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}


/*//create single wall (line)
canv.addEventListener('click', (event) => {
    points[iter] = { x: mousePos.x, y: mousePos.y };
    iter == 0 ? iter = 1 : iter = 0;
});

window.setInterval(infLoop, 1000 / 5);
function infLoop() {
    background(0, 1);
    if (points.length == 2) {
        newWalls.push(points);
        points = [];
    }
    ctx.lineWidth = 2;
    ctx.strokeStyle = "white";
    for (const wall of newWalls) {
        line(wall[0].x, wall[0].y, wall[1].x, wall[1].y);
    }
}*/