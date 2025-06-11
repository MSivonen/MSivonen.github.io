const SCALE = 300;
let num_points = 8,
  points = [],
  tangents = [],
  intersections = [],
  littlePie,
  bigPie,
  avgPie;

function setup() {
  frameRate(10);
  createCanvas(800, 800);
  for (let i = 0; i < num_points; i++) generatePoint();
}

function draw() {
  tangents = [];
  intersections = [];
  background(180);
  
  calculateTangents();
  
  calculateIntersections();
  
  // Calculate the circumference of the polygon inside the circle
  littlePie = calculateCircumference(points) / 2; 
  // Calculate the circumference of the polygon outside the circle
  bigPie = calculateCircumference(intersections) / 2; 
  
  avgPie = (bigPie + littlePie) / 2;
  
  graphics();
  noLoop();
}

function generatePoint() {
  let angle = random(TWO_PI);
  points.push({ angle: angle, x: cos(angle), y: sin(angle) });
  points.sort((a, b) => a.angle - b.angle);
}

function calculateTangents() {
  for (let p of points) {
    let tangentX = -p.y; // Perpendicular slope (dx = -dy)
    let tangentY = p.x;  // Perpendicular slope (dy = dx)
    let length = 2;
    let startX = p.x - tangentX * length;
    let startY = p.y - tangentY * length;
    let endX = p.x + tangentX * length;
    let endY = p.y + tangentY * length;
    tangents.push({ startX, startY, endX, endY });
  }
}

function calculateIntersections() {
  for (let i = 0; i < tangents.length; i++) {
    let t1 = tangents[i];
    let t2 = tangents[(i + 1) % tangents.length]; // Wrap around to the first tangent
    intersections.push(calculateIntersection(
      t1.startX, t1.startY, t1.endX, t1.endY,
      t2.startX, t2.startY, t2.endX, t2.endY
    ));
  }
}

function calculateCircumference(arr) {
  let circumference = 0;
  for (let i = 0; i < arr.length; i++) {
    let p1 = arr[i];
    let p2 = arr[(i + 1) % arr.length];
    if (p1 && p2) {
      let dx = p2.x - p1.x;
      let dy = p2.y - p1.y;
      circumference += sqrt(dx * dx + dy * dy);
    }
  }
  return circumference;
}

function calculateIntersection(x1, y1, x2, y2, x3, y3, x4, y4) {
  // Line-line intersection formula
  let denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

  let px = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / denom;
  let py = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / denom;

  return { x: px, y: py };
}


function graphics() {
  translate(400, 400);
  stroke(0);
  noFill();
  circle(0, 0, SCALE * 2);

  // Draw the lines from circle center to points on circle and connect the points
  drawLines();
  drawPolygon(points, [255, 0, 0]);

  // Draw green tangential lines
  drawTangents();

  // Draw lines between tangent lines' intersections
  drawPolygon(intersections, [0, 0, 255]);

  displayText();
}

function drawLines() {
  stroke(0, 100);
  for (let p of points) {
    line(0, 0, p.x * SCALE, p.y * SCALE);
  }
}

function drawPolygon(arr, color) {
  stroke(...color);
  noFill();
  beginShape();
  for (let p of arr) {
    if (p) vertex(p.x * SCALE, p.y * SCALE);
  }
  endShape(CLOSE);
}

function drawTangents() {
  stroke(0, 255, 0);
  for (let t of tangents) {
    line(t.startX * SCALE, t.startY * SCALE, t.endX * SCALE, t.endY * SCALE);
  }
}

function displayText() {
  noStroke();
  fill(0);
  textSize(12);
  textAlign(RIGHT, CENTER);
  const decimals = 20;
  const xCoord = -100;
  text(`Pi is more than: ${littlePie.toFixed(decimals)}`, xCoord, -380);
  text(`Error: ${(littlePie - PI).toFixed(decimals)}`, xCoord, -365);
  text(`Pi is less than: ${bigPie.toFixed(decimals)}`, xCoord, -350); decimals
  text(`Error: ${(bigPie - PI).toFixed(decimals)}`, xCoord, -335);
  text(`Pi is exactly: ${avgPie.toFixed(decimals)}`, xCoord, -320);
  text(`...with a slight error of: ${abs(PI - avgPie).toFixed(decimals)}`, xCoord, -310);

  textAlign(CENTER, CENTER);
  text(`Points used: ${points.length}`, 0, 350);
}

function mouseClicked() {
  if (keyIsDown(SHIFT) && keyIsDown(CONTROL)) for (let i = 0; i < 1000; i++) generatePoint();
  else if (keyIsDown(SHIFT)) for (let i = 0; i < 10; i++) generatePoint();
  else if (keyIsDown(CONTROL)) for (let i = 0; i < 100; i++) generatePoint();
  else generatePoint();
  loop();
}