let dancer;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5-canvas-container");

  dancer = new NovaDancer(width / 2, height / 2);
}

function draw() {
  background(0);
  drawFloor();

  dancer.update();
  dancer.display();
}

class NovaDancer {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.angle = 0;
    this.bounce = 0;
    this.bodyTwist = 0;
    this.hipSwing = 0;
    this.headTilt = 0;
    this.headSideToSide = 0;
    this.leftArmSwing = 0;
    this.rightArmSwing = 0;
    this.leftLegForward = 0;
    this.rightLegForward = 0;
  }

  update() {
    this.bounce = sin(frameCount * 0.1) * 5;
    this.bodyTwist = sin(frameCount * 0.05) * 5;
    this.hipSwing = cos(frameCount * 0.05) * 2.5;
    this.headTilt = sin(frameCount * 0.08) * 10;
    this.headSideToSide = cos(frameCount * 0.05) * 2.5;
    this.leftArmSwing = sin(frameCount * 0.1) * 20;
    this.rightArmSwing = sin(frameCount * 0.1 + PI / 3) * 20;
    this.leftLegForward = sin(frameCount * 0.1) * 10;
    this.rightLegForward = sin(frameCount * 0.1 + PI / 2) * 10;
  }

  display() {
    strokeWeight(4);
    push();
    translate(this.x, this.y + this.bounce);

    // Body
    stroke(255, 150, 150);
    push();
    rotate(radians(this.bodyTwist));
    line(this.hipSwing, 0, 0, -50);
    pop();

    // Head
    push();
    translate(this.headSideToSide, -60);
    rotate(radians(this.headTilt));
    fill(255, 200, 200);
    ellipse(0, 0, 30);
    pop();

    // Left Arm
    stroke(200, 150, 255);
    push();
    rotate(radians(-this.leftArmSwing));
    line(0, -35, -20, -20);
    translate(-20, -20);
    rotate(radians(this.leftArmSwing * 0.3));
    line(0, 0, -15, 15);
    fill(255, 200, 200);
    ellipse(-15, 15, 6, 6);
    pop();

    // Right Arm
    push();
    rotate(radians(this.rightArmSwing));
    line(0, -35, 20, -20);
    translate(20, -20);
    rotate(radians(-this.rightArmSwing * 0.3));
    line(0, 0, 15, 15);
    fill(255, 200, 200);
    ellipse(15, 15, 6, 6);
    pop();

    // Left Leg
    stroke(150, 200, 255);
    push();
    translate(this.leftLegForward, 0);
    rotate(radians(-15));
    line(0, 0, -10, 40);
    translate(-10, 40);
    rotate(radians(5));
    line(0, 0, -10, 30);
    fill(255, 200, 200);
    ellipse(-10, 30, 6, 6);
    pop();

    // Right Leg
    push();
    translate(this.rightLegForward, 0);
    rotate(radians(15));
    line(0, 0, 10, 40);
    translate(10, 40);
    rotate(radians(-5));
    line(0, 0, 10, 30);
    fill(255, 200, 200);
    ellipse(10, 30, 6, 6);
    pop();

    push();
    translate(-150, -150); // Offset from the main position
    noStroke();
    fill(255, 150, 150);
    ellipse(150, 150, 30, 20); // hip
    ellipse(150, 117.5, 27, 15); // chest
    pop();

    this.drawReferenceShapes();
    pop();
  }

  drawReferenceShapes() {
    noFill();
    stroke(255, 0, 0);
    line(-5, 0, 5, 0);
    line(0, -5, 0, 5);
    stroke(255);
    rect(-100, -100, 200, 200);
    fill(255);
    stroke(0);
  }
}
