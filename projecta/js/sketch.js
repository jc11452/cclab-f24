console.log("this thing works!!")

//arrays for shape properties
let xPositionShape = []; 
let yPositionShape = [];
let sizeShape = [];
let shapeStrokeSize = [];

let shapeLerpSpeed = 0.5;
let previouslyLerpedShapes = []; 

//variables for "eye"
let movingEyeX = 0; 
let movingEyeY = 0;

function setup() {
  let cnv = createCanvas(800, 500);
cnv.parent("p5-canvas-container")

  frameRate(10);
}

function draw() {
  background(255, 255, 255, 70); //disappearing trail effect

  fill(0);
  let closestShapeIndex = -1;
  let closestDistance = Infinity;

  for (let i = 0; i < xPositionShape.length; i++) {
    if (!previouslyLerpedShapes[i]) {
      let d = dist(movingEyeX + width / 2, movingEyeY + height / 2, xPositionShape[i], yPositionShape[i]);
      if (d < closestDistance && d <= 70) { 
        closestDistance = d;
        closestShapeIndex = i;
      }
    }
  }
  
  if (closestShapeIndex !== -1) {
    let targetX = xPositionShape[closestShapeIndex] - width / 2;
    let targetY = yPositionShape[closestShapeIndex] - height / 2;

    movingEyeX = lerp(movingEyeX, targetX, shapeLerpSpeed);
    movingEyeY = lerp(movingEyeY, targetY, shapeLerpSpeed);
    
    if (closestDistance <= 2) {
      previouslyLerpedShapes[closestShapeIndex] = true;
    }
  }
  
  noFill();
  movingEyeX += random(-13, 13); //random eye movement
  movingEyeY += random(-13, 13);
  //constrain eye movement within the canvas
  movingEyeX = constrain(movingEyeX, -width / 2 + 50, width / 2 - 50);
  movingEyeY = constrain(movingEyeY, -height / 2 + 50, height / 2 - 50);
  drawEye(movingEyeX, movingEyeY, 0.8);

  for (let i = 0; i < xPositionShape.length; i++) {
    strokeWeight(shapeStrokeSize[i]);
    
    //gradually lerp each shape's position towards the eye position
    xPositionShape[i] = lerp(xPositionShape[i], movingEyeX + width / 2, 0.05);
    yPositionShape[i] = lerp(yPositionShape[i], movingEyeY + height / 2, 0.05);
    ellipse(xPositionShape[i], yPositionShape[i], sizeShape[i], sizeShape[i]);
  }
}

function drawEye(x, y, scaleFactor) {
  let centerX = width / 2 + x;
  let centerY = height / 2 + y;

  for (let i = 0; i < 30; i++) {
    let wiggle = sin(frameCount * 0.01 + i) * 0.05;
    let radius = 50 - i * random(1, 5) + wiggle;

    strokeWeight(random(1, 3));
    ellipse(centerX, centerY, radius, radius);
  }
}

function mousePressed() {
  if (xPositionShape.length < 10) {
    xPositionShape.push(mouseX);
    yPositionShape.push(mouseY);
    sizeShape.push(random(10, 30));
    shapeStrokeSize.push(random(1, 4));
    previouslyLerpedShapes.push(false); //initialize for the new shape
  }
}
