let gridAmountX = 240;
let gridAmountY = 160;
let ants = [];
const antsAmount = 1;
const home = 0, food = 1;
const debug = false;
let showGrid = 1;
let homePos, foodPos;
let homeRadius = 50, foodRadius = 50;
const antSize = 5;
let img;
let nest;
let foodSources = [];
let font;
let gridUpdateFrameInterval = 5; // update grid every N frames
const foodPerAnt = .1;

function preload() {
  font = loadFont("HARRYP_.TTF");
}

function setup() {
  img = createImage(gridAmountX, gridAmountY);
  img.loadPixels(); // Ensure the image is loaded for manipulation
  for (let i = 0; i < img.pixels.length; i += 4) {
    img.pixels[i] = 0;     // Red
    img.pixels[i + 1] = 0; // Green
    img.pixels[i + 2] = 0; // Blue
    img.pixels[i + 3] = 155; // Alpha
  }
  img.updatePixels(); // Update the image with the new pixel values

  createCanvas(800, 600, WEBGL);
  homePos = createVector(100, height / 2);
  foodPos = createVector(width - 100, height / 2);
  nest = new Location(home, homePos.x, homePos.y, homeRadius, 0);
  for (let i = 0; i < antsAmount; i++) {
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

  ants.forEach(ant => ant.update());

  if (frameCount % gridUpdateFrameInterval === 0) {
    updateImage();
    if (showGrid) {
      //drawPixels();
    }
  }

  updateFoodGrid();

  if (showGrid) {
    image(img, 0, 0, width, height);
  }

  [...foodSources, nest].forEach(f => f.show());

  ants.forEach(ant => ant.show());

  fill(0);
  [...foodSources, nest].forEach(f => text(f.foodAmount.toFixed(1), f.x, f.y));
}

function mousePressed() {
  makeFood(mouseX, mouseY);
}

function makeFood(x, y) {
  clearFoodGrid();
  foodPos = createVector(x, y);
  foodSources.push(new Location(food, x, y, foodRadius, 1000));
  updateFoodGrid();
}

function clearFoodGrid() {
  img.loadPixels();
  for (let i = 0; i < img.width; i++) {
    for (let j = 0; j < img.height; j++) {
      let index = (i + j * img.width) * 4;
      img.pixels[index + 2] = 0; // Clear blue channel
    }
  }
  markCells(homePos, nest.r, home);
  img.updatePixels();
}

function updateFoodGrid() {
  clearFoodGrid();
  foodSources.forEach(f => markCells(createVector(f.x, f.y), f.r, food));
}

function markCells(pos, radius, type) {
  let startX = max(0, floor((pos.x - radius) / (width / gridAmountX)));
  let endX = min(gridAmountX - 1, floor((pos.x + radius) / (width / gridAmountX)));
  let startY = max(0, floor((pos.y - radius) / (height / gridAmountY)));
  let endY = min(gridAmountY - 1, floor((pos.y + radius) / (height / gridAmountY)));

  img.loadPixels();
  for (let i = startX; i <= endX; i++) {
    for (let j = startY; j <= endY; j++) {
      let index = (i + j * img.width) * 4;
      let d = dist(pos.x, pos.y, i * (width / gridAmountX) + (width / gridAmountX) / 2, j * (height / gridAmountY) + (height / gridAmountY) / 2);
      if (d < radius) {
        if (type === home) {
          img.pixels[index + 2] = 1; // Mark as home in blue channel
        }
        if (type === food) {
          img.pixels[index + 2] = 2; // Mark as food in blue channel
        }
      }
    }
  }
  img.updatePixels();
}

function updateImage() {
  img.loadPixels();
  for (let i = 0; i < img.width; i++) {
    for (let j = 0; j < img.height; j++) {
      let index = (i + j * img.width) * 4;
      img.pixels[index] *= 0.993; // Decay home trace in red channel
      img.pixels[index + 1] *= 0.993; // Decay food trace in yellow channel
    }
  }
  img.updatePixels();
}

function drawPixels() {
  img.loadPixels();
  for (let i = 0; i < img.width; i++) {
    for (let j = 0; j < img.height; j++) {
      let index = (i + j * img.width) * 4;
      let col = color(img.pixels[index], img.pixels[index + 1], 0, img.pixels[index] + img.pixels[index + 1]);
      img.set(i, j, col);
    }
  }
  img.updatePixels();
}

function getCell(x, y) {
  let col = floor(x / (width / gridAmountX));
  let row = floor(y / (height / gridAmountY));
  let index = (col + row * img.width) * 4;
  return {
    homeTrace: img.pixels[index],
    foodTrace: img.pixels[index + 1],
    isHome: img.pixels[index + 2] === 1 ? true : false,
    isFood: img.pixels[index + 2] === 2 ? true : false
  };
}

function addTrace(x, y, type, strength, distanceTraveled) {
  let col = floor(x / (width / gridAmountX));
  let row = floor(y / (height / gridAmountY));
  let index = (col + row * img.width) * 4;
  if (type === home) {
    img.pixels[index] += strength / 4; // Red channel for home trace
  } else if (type === food) {
    img.pixels[index + 1] += strength / 4; // Yellow channel for food trace
  }
  console.log(x, y, type == 0 ? "home" : "food", strength);
  console.log(img.pixels[index + 1])
}

class Location {
  constructor(type_, x, y, r, foodAmount) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.type = type_;
    this.color = type_ === home ? color(255, 0, 0) : color(255, 255, 0);
    this.foodAmount = foodAmount;
    this.alive = true;
    this.update();
  }

  update() {
    if (this.type == home) {
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

class Ant {
  constructor() {
    this.pos = createVector(homePos.x + random(30) - 15, homePos.y + random(30) - 15);
    this.angle = random(TWO_PI);
    this.color = color(0, 0, 0);
    this.hasFood = false;
    this.r = antSize;
    this.prevCell = null;
    this.vel = 2;
    this.turningSpeed = 0.05;
    this.visionRange = 5 * width / gridAmountX;
    this.targetAngle = random(TWO_PI);
    this.distanceTraveled = 1000;
    this.targetCell = null;
    this.randomSeed = random(10000);
  }

  getCellsInVisionRange() {
    let cellsInRange = [];
    for (let i = -this.visionRange; i <= this.visionRange; i += width / gridAmountX) {
      for (let j = -this.visionRange; j <= this.visionRange; j += height / gridAmountY) {
        let x = this.pos.x + i;
        let y = this.pos.y + j;
        if (x >= 0 && x < width && y >= 0 && y < height) {
          let cell = getCell(x, y);
          if (cell !== this.prevCell) {
            let dx = x - this.pos.x;
            let dy = y - this.pos.y;
            let angleToCell = atan2(dy, dx);
            let normalizedAntAngle = (this.angle + PI) % TWO_PI - PI;
            let normalizedCellAngle = (angleToCell + PI) % TWO_PI - PI;
            let angleDifference = abs(normalizedCellAngle - normalizedAntAngle);
            if (angleDifference > PI) {
              angleDifference = TWO_PI - angleDifference;
            }
            if (angleDifference < PI / 2) {
              cellsInRange.push(cell);
            }
          }
        }
      }
    }
    return cellsInRange;
  }

  addNoise(amount) {
    let noiseValue = (noise(this.randomSeed + frameCount * .01) - .5) * amount;
    return noiseValue;
  }

  turn(targetCell) {
    let currentCell = getCell(this.pos.x, this.pos.y);
    console.log(`Current cell: pos(${this.pos.x}, ${this.pos.y}), isHome(${currentCell.isHome}), isFood(${currentCell.isFood}), homeTrace(${currentCell.homeTrace}), foodTrace(${currentCell.foodTrace})`);

    if (currentCell.isHome && this.hasFood) {
      console.log("HOME");
      this.angle += PI + random(-PI / 4, PI / 4);
      this.targetAngle = this.angle;
      this.hasFood = false;
      this.color = color(0, 0, 0);
      this.distanceTraveled = 1000;
      nest.foodAmount += foodPerAnt;
    } else if (currentCell.isFood && !this.hasFood) {
      console.log(`Picked up food: pos(${this.pos.x}, ${this.pos.y}), hasFood(${this.hasFood})`, currentCell);
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
      if (minSource != null) foodSources[minSource].foodAmount -= foodPerAnt;
    }

    if (targetCell) {
      let dx = (targetCell.x * (width / gridAmountX)) - this.pos.x;
      let dy = (targetCell.y * (height / gridAmountY)) - this.pos.y;
      this.targetAngle = atan2(dy, dx) + this.addNoise(0.8);
    }

    this.targetAngle += this.addNoise(.2);

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

    let wallProximity = antSize;
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

    if (this.pos.x > width - antSize * 2 && this.pos.y < height / 2 + antSize * 2 && this.pos.y > height / 2 - antSize * 2) {
      this.angle = PI;
    }
  }

  findTarget() {
    let targetCell = null;
    let cellsInRange = this.getCellsInVisionRange();

    const posX = this.pos.x;
    const posY = this.pos.y;

    if (!this.hasFood) {
      let closestDist = Infinity;
      for (let cell of cellsInRange) {
        if (cell.isFood) {
          let d = dist(posX, posY, cell.x * (width / gridAmountX) + (width / gridAmountX) / 2, cell.y * (height / gridAmountY) + (height / gridAmountY) / 2);
          if (d < closestDist) {
            closestDist = d;
            targetCell = cell;
          }
        }
      }
    } else {
      let closestDist = Infinity;
      for (let cell of cellsInRange) {
        if (cell.isHome) {
          let d = dist(posX, posY, cell.x * (width / gridAmountX) + (width / gridAmountX) / 2, cell.y * (height / gridAmountY) + (height / gridAmountY) / 2);
          if (d < closestDist) {
            closestDist = d;
            targetCell = cell;
          }
        }
      }
    }

    if (!targetCell) {
      let bestScore = -Infinity;
      for (let cell of cellsInRange) {
        if (cell.foodTrace > 0) console.log(cell.homeTrace);
        let trace = this.hasFood ? cell.homeTrace : cell.foodTrace;
        if (trace > 0) {
          let score = trace * (this.hasFood ? 0.02 : 0.05);
          if (score > bestScore) {
            bestScore = score;
            targetCell = cell;
          }
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

    const currentCell = getCell(this.pos.x, this.pos.y);
    if (currentCell != this.prevCell) {
      addTrace(this.pos.x, this.pos.y, this.hasFood ? food : home, this.distanceTraveled * 0.5, this.distanceTraveled);
      this.prevCell = currentCell;
      this.targetCell = this.findTarget();
      console.log(this.hasFood)
    }

    this.distanceTraveled *= 0.996;
  }

  show() {
    fill(this.color);
    noStroke();
    rectMode(CENTER);
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    rect(0, 0, this.r, this.r / 2);
    pop();

    if (debug) {
      stroke(0, 255, 0);
      line(this.pos.x, this.pos.y, this.pos.x + 100 * cos(this.targetAngle), this.pos.y + 100 * sin(this.targetAngle));
    }

  }
}