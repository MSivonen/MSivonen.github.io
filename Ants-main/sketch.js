// Constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const GRID_COLS = 240;
const GRID_ROWS = 160;
const CELL_WIDTH = CANVAS_WIDTH / GRID_COLS;
const CELL_HEIGHT = CANVAS_HEIGHT / GRID_ROWS;
const NUM_ANTS = 1500;
const HOME = 0;
const FOOD = 1;
const DEBUG = 1;
const SHOW_GRID = 1;
const HOME_RADIUS = 50;
const FOOD_RADIUS = 50;
const ANT_SIZE = 5;
const GRID_UPDATE_INTERVAL = 5;
const FOOD_PER_ANT = 0.1;

let foodSources = [];
let grid, homePos, foodPos, img, nest, font;
const ants = [];
let antShader;

function preload() {
  font = loadFont("HARRYP_.TTF");
  antShader = loadShader('basic.vert', 'basic.frag');
}

function setup() {
  img = createImage(GRID_COLS, GRID_ROWS);
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT, WEBGL);
  homePos = createVector(100, height / 2);
  foodPos = createVector(width - 100, height / 2);
  nest = new Location(HOME, homePos.x, homePos.y, HOME_RADIUS, 0);
  grid = new Grid(GRID_COLS, GRID_ROWS);
  for (let i = 0; i < NUM_ANTS; i++) {
    ants.push(new Ant());
  }
  makeFood(foodPos.x, foodPos.y);
  textAlign(CENTER, CENTER);
  textFont(font);
}

function draw() {
  background(35, 100, 20);
  translate(-width / 2, -height / 2);


  nest.update();
  foodSources.forEach(f => f.update());
  foodSources = foodSources.filter(f => f.alive);
  console.time("ssss");
  ants.forEach(ant => ant.update());
  console.timeEnd("ssss");
  if (frameCount % GRID_UPDATE_INTERVAL === 0) {
    grid.update();
    if (SHOW_GRID) {
      grid.updateColors();
      grid.drawPixels();
    }
  }

  updateFoodGrid();

  if (SHOW_GRID) {
    image(img, 0, 0, width, height);
  }

  nest.show();
  foodSources.forEach(f => f.show());

  shader(antShader);
  noStroke();
  rectMode(CENTER);
  ants.forEach(ant => {
    ant.show();
  });
  resetShader();

  fill(0);
  [...foodSources, nest].forEach(f => text(f.foodAmount.toFixed(1), f.x, f.y));
  console.log("fps: " + frameRate() + "-----------------------")
}

function mousePressed() {
  makeFood(mouseX, mouseY);
}

function makeFood(x, y) {
  clearFoodGrid();
  foodPos = createVector(x, y);
  foodSources.push(new Location(FOOD, x, y, FOOD_RADIUS, 1000));
  updateFoodGrid();
}

function clearFoodGrid() {
  for (let i = 0; i < GRID_COLS; i++) {
    for (let j = 0; j < GRID_ROWS; j++) {
      let cell = grid.cells[i][j];
      cell.isHome = false;
      cell.isFood = false;
    }
  }
  markCells(homePos, nest.r, HOME);
}

function updateFoodGrid() {
  clearFoodGrid();
  foodSources.forEach(f => markCells(createVector(f.x, f.y), f.r, FOOD));
}

function markCells(pos, radius, type) {
  let startX = max(0, floor((pos.x - radius) / CELL_WIDTH));
  let endX = min(grid.cols - 1, floor((pos.x + radius) / CELL_WIDTH));
  let startY = max(0, floor((pos.y - radius) / CELL_HEIGHT));
  let endY = min(grid.rows - 1, floor((pos.y + radius) / CELL_HEIGHT));

  for (let i = startX; i <= endX; i++) {
    for (let j = startY; j <= endY; j++) {
      let cell = grid.cells[i][j];
      let d = dist(pos.x, pos.y, cell.x + CELL_WIDTH / 2, cell.y + CELL_HEIGHT / 2);
      if (d < radius) {
        if (type === HOME) {
          cell.isHome = true;
        }
        if (type === FOOD) {
          cell.isFood = true;
        }
      }
    }
  }
}

class Location {
  constructor(type, x, y, r, foodAmount) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.type = type;
    this.color = type === HOME ? color(255, 0, 0) : color(255, 255, 0);
    this.foodAmount = foodAmount;
    this.alive = true;
    this.update();
  }

  update() {
    if (this.type === HOME) {
      this.r = max(Math.cbrt(this.foodAmount * 4), 15);
    } else {
      this.r = max(Math.sqrt(this.foodAmount * 2), 5);
    }
    if (this.foodAmount < 1) this.alive = false;
  }

  show() {
    noStroke();
    fill(this.color);
    circle(this.x, this.y, this.r * 2);
  }
}

class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.homeTrace = { strength: 0, distance: 0 };
    this.foodTrace = { strength: 0, distance: 0 };
    this.isHome = false;
    this.isFood = false;
    this.redValue = 0;
    this.yellowValue = 0;
    this.traceDecayMult = Math.pow(0.993, GRID_UPDATE_INTERVAL);
  }

  updateColors() {
    this.redValue = map(this.homeTrace.strength, 0, 1000, 0, 255) * 0.5;
    this.yellowValue = map(this.foodTrace.strength, 0, 1000, 0, 255) * 0.5;
  }

  show() {
    noStroke();
    rectMode(CORNER);
    if (this.redValue > 0) {
      fill(255, 0, 0, this.redValue);
      rect(this.x, this.y, CELL_WIDTH, CELL_HEIGHT);
    }
    if (this.yellowValue > 0) {
      fill(255, 255, 0, this.yellowValue);
      rect(this.x + CELL_WIDTH / 2, this.y + CELL_HEIGHT / 2, CELL_WIDTH / 1.5);
    }
  }

  update() {
    this.homeTrace.strength *= this.traceDecayMult;
    this.foodTrace.strength *= this.traceDecayMult;
    if (this.homeTrace.strength < 0.1) {
      this.homeTrace.strength = 0;
    }
    if (this.foodTrace.strength < 0.1) {
      this.foodTrace.strength = 0;
    }
  }

  addTrace(type, strength, distanceTraveled) {
    let trace = type === HOME ? this.homeTrace : this.foodTrace;
    trace.strength += strength;
    trace.distance = (trace.distance * trace.strength + distanceTraveled * strength) / (trace.strength + strength);
  }
}

class Grid {
  constructor(cols, rows) {
    this.cols = cols;
    this.rows = rows;
    this.cells = [];

    for (let i = 0; i < cols; i++) {
      this.cells[i] = [];
      for (let j = 0; j < rows; j++) {
        this.cells[i][j] = new Cell(i * CELL_WIDTH, j * CELL_HEIGHT);
      }
    }
  }

  show() {
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        this.cells[i][j].show();
      }
    }
  }

  updateColors() {
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        this.cells[i][j].updateColors();
      }
    }
  }

  drawPixels() {
    img.loadPixels();
    for (let x = 0; x < img.width; x++) {
      for (let y = 0; y < img.height; y++) {
        let cell = this.cells[x][y];
        let col = color(cell.redValue + cell.yellowValue, cell.yellowValue, 0, cell.redValue + cell.yellowValue);
        img.set(x, y, col);
      }
    }
    img.updatePixels();
  }

  update() {
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        this.cells[i][j].update();
      }
    }
  }

  getCell(x, y) {
    let col = floor(x / CELL_WIDTH);
    let row = floor(y / CELL_HEIGHT);
    return this.cells[col][row];
  }
}

class Ant {
  constructor() {
    this.pos = createVector(homePos.x + random(30) - 15, homePos.y + random(30) - 15);
    this.angle = random(TWO_PI);
    this.color = color(0, 0, 0);
    this.hasFood = false;
    this.r = ANT_SIZE;
    this.prevCell = null;
    this.vel = 2;
    this.turningSpeed = 0.05;
    this.visionRange = 9 * width / GRID_COLS;
    this.targetAngle = random(TWO_PI);
    this.distanceTraveled = 1000;
    this.targetCell = null;
    this.prevTarget = Infinity;
    this.FOV = PI / 2;
    this.randomSeed = random(10000);
  }

  getCellsInVisionRange() {
    let cellsInRange = [];
    let startX = max(0, floor((this.pos.x - this.visionRange) / CELL_WIDTH));
    let endX = min(grid.cols - 1, floor((this.pos.x + this.visionRange) / CELL_WIDTH));
    let startY = max(0, floor((this.pos.y - this.visionRange) / CELL_HEIGHT));
    let endY = min(grid.rows - 1, floor((this.pos.y + this.visionRange) / CELL_HEIGHT));

    for (let i = startX; i <= endX; i++) {
      for (let j = startY; j <= endY; j++) {
        let cell = grid.cells[i][j];
        if (cell !== this.prevCell) {
          let dx = cell.x - this.pos.x;
          let dy = cell.y - this.pos.y;
          let distance = sqrt(dx * dx + dy * dy);
          if (distance <= this.visionRange) {
            let angleToCell = atan2(dy, dx);
            let normalizedAntAngle = (this.angle + PI) % TWO_PI - PI;
            let normalizedCellAngle = (angleToCell + PI) % TWO_PI - PI;
            let angleDifference = abs(normalizedCellAngle - normalizedAntAngle);
            if (angleDifference > PI) {
              angleDifference = TWO_PI - angleDifference;
            }
            if (angleDifference < this.FOV / 2) {
              cellsInRange.push(cell);
            }
          }
        }
      }
    }
    return cellsInRange;
  }

  addNoise(amount) {
    return (noise(this.randomSeed + frameCount * 0.01) - 0.5) * amount;
  }

  turn(targetCell) {
    let currentCell = grid.getCell(this.pos.x, this.pos.y);

    if (currentCell.isHome && this.hasFood) {
      this.angle += PI + random(-PI / 4, PI / 4);
      this.targetAngle = this.angle;
      this.hasFood = false;
      this.color = color(0, 0, 0);
      this.distanceTraveled = 1000;
      nest.foodAmount += FOOD_PER_ANT;
    } else if (currentCell.isFood && !this.hasFood) {
      this.angle += PI + random(-PI / 4, PI / 4);
      this.targetAngle = this.angle;
      this.hasFood = true;
      this.color = color(0, 0, 95);
      this.distanceTraveled = 1000;
      let minSource = null;
      let minDist = Infinity;

      for (let i = 0; i < foodSources.length; i++) {
        let f = foodSources[i];
        let d = dist(this.pos.x, this.pos.y, f.x, f.y);
        if (d < minDist) {
          minDist = d;
          minSource = i;
        }
      }
      if (minSource != null) foodSources[minSource].foodAmount -= FOOD_PER_ANT;
    }

    if (targetCell) {
      if (DEBUG) targetCell.highlight = true;
      this.targetAngle = atan2(targetCell.y - this.pos.y, targetCell.x - this.pos.x) + this.addNoise(0.8);
    }

    this.targetAngle += this.addNoise(0.2);

    if (keyIsDown(68)) { // D key
      this.targetAngle += 0.15;
    }
    if (keyIsDown(65)) { // A key
      this.targetAngle -= 0.15;
    }

    let angleDifference = (this.targetAngle - this.angle + PI) % TWO_PI - PI;
    if (angleDifference < -PI) {
      angleDifference += TWO_PI;
    } else if (angleDifference > PI) {
      angleDifference -= TWO_PI;
    }

    if (abs(angleDifference) < this.turningSpeed) {
      this.angle = this.targetAngle;
    } else {
      this.angle += this.turningSpeed * Math.sign(angleDifference);
    }

    this.avoidWalls();
  }

  avoidWalls() {
    let wallProximity = ANT_SIZE;
    let repulsionStrength = 0.05;

    if (this.pos.x <= wallProximity) {
      this.angle = lerp(this.angle, 0, repulsionStrength);
    } else if (this.pos.x >= width - wallProximity) {
      this.angle = lerp(this.angle, this.pos.y < height / 2 ? PI : -PI, repulsionStrength);
    } else if (this.pos.y <= wallProximity) {
      this.angle = lerp(this.angle, HALF_PI, repulsionStrength);
    } else if (this.pos.y >= height - wallProximity) {
      this.angle = lerp(this.angle, -HALF_PI, repulsionStrength);
    }

    if (this.pos.x > width - ANT_SIZE * 2 && this.pos.y < height / 2 + ANT_SIZE * 2 && this.pos.y > height / 2 - ANT_SIZE * 2) {
      this.angle = PI;
    }
  }

  findTarget() {
    let targetCell = null;
    let cellsInRange = this.getCellsInVisionRange();

    if (!this.hasFood) {
      targetCell = this.findClosestCell(cellsInRange, cell => cell.isFood);
    } else {
      targetCell = this.findClosestCell(cellsInRange, cell => cell.isHome);
    }

    if (!targetCell) {
      targetCell = this.findBestTraceCell(cellsInRange);
    }

    return targetCell;
  }

  findClosestCell(cells, condition) {
    let closestDist = Infinity;
    let targetCell = null;
    for (let cell of cells) {

      if (condition(cell)) {
        let d = dist(this.pos.x, this.pos.y, cell.x + CELL_WIDTH / 2, cell.y + CELL_HEIGHT / 2);
        if (d < closestDist) {
          closestDist = d;
          targetCell = cell;
        }
      }
    }

    return targetCell;
  }

  findBestTraceCell(cells) {
    let bestScore = -Infinity;
    let targetCell = null;
    for (let cell of cells) {
      let trace = this.hasFood ? cell.homeTrace : cell.foodTrace;
      if (trace.strength > 0) {
        let score = trace.distance * (this.hasFood ? 0.98 : 0.95) + trace.strength * (this.hasFood ? 0.02 : 0.05);
        if (score > bestScore) {
          bestScore = score;
          targetCell = cell;
        }
      }
    }
    return targetCell;
  }

  move() {
    this.pos.add(p5.Vector.fromAngle(this.angle).mult(this.vel));
    this.pos.x = constrain(this.pos.x, this.r, width - this.r);
    this.pos.y = constrain(this.pos.y, this.r, height - this.r);
  }

  update() {
    this.turn(this.targetCell);
    this.move();

    const currentCell = grid.getCell(this.pos.x, this.pos.y);
    if (currentCell !== this.prevCell) {
      currentCell.addTrace(this.hasFood ? FOOD : HOME, this.distanceTraveled * 0.5, this.distanceTraveled);
      this.prevCell = currentCell;
      this.targetCell = this.findTarget();
    }

    this.distanceTraveled *= 0.996;
  }

  show() {
    //fill(this.color);
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    rect(0, 0, this.r, this.r / 2);
    pop();

    /*     if (DEBUG) {
          stroke(0, 255, 0);
          line(this.pos.x, this.pos.y, this.pos.x + 100 * cos(this.targetAngle), this.pos.y + 100 * sin(this.targetAngle));
        } */
  }
}