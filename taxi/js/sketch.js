let taxiInstance;

function setup() {
  let canvas = createCanvas(500, 400);
  canvas.parent("p5-canvas-container");

  taxiInstance = new Taxi(50, 300, 0.5);
}

function draw() {
  background(220);

  taxiInstance.display();
}

class Taxi {
  constructor(startX, startY, sF) {
    this.x = startX;
    this.y = startY;
    this.scaleFactor = sF;
  }
  display() {
    push();
    translate(this.x, this.y)
    noStroke();
    fill(240, 220, 60);

    // base:
    rect(-50, -50, 100, 30);
    // top"
    rect(-25, -70, 50, 20);
    // wheel 1:
    this.drawWheel(-30, -15);
    // wheel 2:
    this.drawWheel(30, -15);


    // just to see origin 
    // of translation matrix:
    fill("red");
    circle(0, 0, 5);
    Pop();
  }
  drawWheel(x, y) {
    push();
    translate(x, y);

    noStroke();
    fill(0);
    ellipse(0, 0, 28, 32);

    pop();
  }
}