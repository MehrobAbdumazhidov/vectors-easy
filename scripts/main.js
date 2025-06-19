let vectors = [];

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("canvas-container");
  for (let i = 0; i < 8; i++) {
    vectors.push({
      start: createVector(random(width), random(height)),
      vec: p5.Vector.random2D().mult(random(40, 80)),
      speed: p5.Vector.random2D().mult(0.5)
    });
}}

function draw() {
  background(249); // светло-серый фон

  drawGrid(40);

  strokeWeight(2);
  for (let v of vectors) {
    stroke("#e74c3c"); // красный
    drawVector(v.start, v.vec);
    v.start.add(v.speed);
    wrapAround(v.start);
  }
}

function drawGrid(spacing) {
  stroke(220);
  strokeWeight(1);
  for (let x = 0; x < width; x += spacing) {
    line(x, 0, x, height);
  }
  for (let y = 0; y < height; y += spacing) {
    line(0, y, width, y);
  }
}

function drawVector(start, vec) {
  let end = p5.Vector.add(start, vec);
  line(start.x, start.y, end.x, end.y);
  push();
  translate(end.x, end.y);
  rotate(vec.heading());
  let arrowSize = 7;
  line(0, 0, -arrowSize, -arrowSize / 2);
  line(0, 0, -arrowSize, arrowSize / 2);
  pop();
}

function wrapAround(vec) {
  if (vec.x < 0) vec.x = width;
  if (vec.x > width) vec.x = 0;
  if (vec.y < 0) vec.y = height;
  if (vec.y > height) vec.y = 0;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
