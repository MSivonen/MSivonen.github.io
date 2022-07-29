let balls = [],
    amountOfBalls = 1000,
    qt,
    isCircle = true,
    range;

const
    w = 600, //canvas size
    h = 600,
    r = 2; //particle size;

function setup() {
    frameRate(60000);
    rectMode(CENTER);
    canv = createCanvas(w, h);
    canv.mouseClicked(() => isCircle = !isCircle);

    makeBalls(amountOfBalls);

    createP("Click mouse on screen to swap between circle and rectangle").position(30, h);
    everyRadio = createRadio("111");
    everyRadio.option("all", "Draw all balls");
    everyRadio.option("50", "Draw every 50th ball");
    everyRadio.selected("50");
    everyRadio.position(30, h + 30);
    treeRadio = createRadio("222");
    treeRadio.option("1", "Use tree");
    treeRadio.option("2", "Don't use tree");
    treeRadio.selected("1");
    treeRadio.position(30, h + 50);
    amountInput = createInput(amountOfBalls, "Amount of balls");
    createP("Amount of balls (max 100k)").position(30, h + 55);
    amountInput.position(220, h + 70).size(70);
    amountInput.input(() => makeBalls(amountInput.value()));
}

function draw() {
    balls.forEach(ball => {
        ball.col = [255];
    });
    qt = new QuadTree(new Rectangle(w / 2, h / 2, w / 2, h / 2), 20);
    balls.forEach(ball => {
        qt.insert(ball);
    });
    background('rgba(0,0,0,1)');
    qt.show(); //show quadtree grid

    balls.forEach(ball => {
        ball.update(); //move balls
    });

    stroke(0, 255, 0);
    noFill();
    if (isCircle) { //click mouse on screen to swap
        range = new Circle(mouseX, mouseY, 56);
        ellipse(range.x, range.y, range.r * 2);
    } else {
        range = new Rectangle(mouseX, mouseY, 56, 78);
        rect(range.x, range.y, range.w * 2, range.h * 2);
    }

    let points;
    if (treeRadio.value() == "1")
        points = qt.query(range);
    else points = balls;

    for (const ball of points) {
        ball.col = [0, 255, 0];
        for (const other of points)
            if (ball != other) {
                ball.collision(other);
                // if (treeRadio.value() == "1") ball.drawLine(other); //draw a line between balls
            }
    };

    if (everyRadio.value() == "all")
        balls.forEach(ball => ball.draw());
    else
        for (let i = 0; i < balls.length; i += 50)balls[i].draw(); //draw only every 50 balls


    fill(0, 255, 0);
    strokeWeight(2);
    text("FPS: " + frameRate().toFixed(0), 50, 50);
    fill(0);
    strokeWeight(1);
    text("FPS: " + frameRate().toFixed(0), 50, 50);
}

function makeBalls(amount) {
    amount > 100000 ? amount = 100000 : null;
    balls = [];
    for (let i = 0; i < amount; i++) {
        let b = new Ball(
            Math.random() * width,  //pos x
            Math.random() * height, //pos y
            r //r
        );
        balls.push(b);
    }
}