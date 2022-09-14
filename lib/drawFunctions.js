function circle(x, y, r, stroke_ = true) {
    ctx.beginPath()
    ctx.arc(x, y, r, 0, 2 * Math.PI, false)
    if (stroke_) ctx.stroke();
    ctx.fill();
}

function line(xs, ys, xe, ye) {
    ctx.beginPath();
    ctx.moveTo(xs, ys);
    ctx.lineTo(xe, ye);
    ctx.stroke();
}

function background(col) {
    ctx.fillStyle = col;
    ctx.fillRect(0, 0, canv.width, canv.height);
}