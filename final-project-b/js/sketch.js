let flower;
let stalk;

let starsArray = [];
let starColors = ["#B3E0F2", "#ffb073", "#fce479", "#F2F2F2", "#3BACD9"];

let particles = [];

let shapes = [];
let eruptions = []; // New array to track shape eruptions
let numShapes = 7;
let startTime;


function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");

  frameRate(60);

  // Create particles
  for (let i = 0; i < 400; i++) {
    particles.push(new Particle());
  }

  angleMode(DEGREES);
  flower = new BloomingFlower();
  stalk = new Stalk();

  startTime = millis();

  angleMode(DEGREES);
  flower = new BloomingFlower();
  stalk = new Stalk();
}

function draw() {
  background(0);

  push();
  radialGradient(width / 2, height / 2, width, flower.bloomFactor);

  // Draw and animate the stalk
  stalk.draw();

  // If the stalk is fully grown, start the flower bloom animation
  if (stalk.isFullyGrown()) {
    flower.draw();

    // Display stars only after the flower has fully bloomed
    if (flower.bloomFactor >= flower.maxBloom) {
      for (let star of starsArray) {
        star.display();
      }

      // Remove shapes once the flower is fully bloomed
      shapes = [];  // Clear the shapes array
    }
  }
  pop();

  // Update and draw shapes
  for (let i = shapes.length - 1; i >= 0; i--) {
    shapes[i].update();
    shapes[i].draw();
  }

  // Update and draw eruptions
  for (let i = eruptions.length - 1; i >= 0; i--) {
    eruptions[i].update();
    eruptions[i].draw();

    // Remove eruptions that are too far from the center
    if (dist(eruptions[i].x, eruptions[i].y, width / 2, height / 2) > 300) {
      eruptions.splice(i, 1);
    }
  }

  // Add a new shape every 3 seconds, until the total reaches `numShapes`
  if (shapes.length < numShapes) {
    // Check if enough time has passed since the last shape was added
    let currentTime = millis();
    let timeSinceLastShape = currentTime - (startTime + (shapes.length * 7000));

    if (timeSinceLastShape >= 2000) {
      // Generate random positions well outside the canvas boundaries
      let xPos = random(width * -1.5, width * 2); // Ensure starting outside canvas (left/right)
      let yPos = random(height * -1.5, height * 2); // Ensure starting outside canvas (top/bottom)
      shapes.push(new ShapeGenerator(xPos, yPos, 30));
    }
  }

  // Update and display particles (dust or breeze effect)
  for (let particle of particles) {
    particle.update();
    particle.display();
  }
}

function mousePressed() {
  for (let i = shapes.length - 1; i >= 0; i--) {
    let shape = shapes[i];
    // Check if mouse is over the shape
    let d = dist(mouseX, mouseY, shape.x, shape.y);
    if (d < shape.size / 2) {
      // Combust the shape
      shape.combust();
    }
  }
}

function radialGradient(x, y, maxRadius, bloomFactor) {
  let startColor = color(0, 0, 0);
  let endColor = color(171, 209, 151);
  let lerpedColor = lerpColor(startColor, endColor, bloomFactor);

  for (let r = maxRadius; r > 0; r -= 1) {
    let t = map(r, 0, maxRadius, 0, 1);
    let gray = color(map(r, 0, maxRadius, 60, 0));
    let blue = color(183, 208, 235);
    let gradientColor = lerpColor(gray, blue, bloomFactor);
    fill(gradientColor);
    noStroke();
    ellipse(x, y, r * 1.5);
  }

  noStroke();
  fill(lerpedColor);
  rectMode(CENTER);
  rect(width / 2, height / 2 + 170, 800, 160);
}

class Eruption {
  constructor(x, y, shapeType, size = 7) {
    this.x = x;
    this.y = y;
    this.shapeType = shapeType;
    this.size = size;
    this.velocityX = random(-2, 2);
    this.velocityY = random(-2, 2);
    this.color = this.getColor();
    this.lifetime = 180; // 3 seconds at 60 fps
  }

  getColor() {
    // Return color based on shape type
    return '#FFFFFF'; // White color for now
  }

  update() {
    this.x += this.velocityX;
    this.y += this.velocityY;
    this.lifetime--;
  }

  draw() {
    noFill();
    stroke(this.color);
    strokeWeight(1);

    // Draw shape based on original shape type
    if (this.shapeType === 0) {
      // Circle
      ellipse(this.x, this.y, this.size, this.size);
    } else if (this.shapeType === 1) {
      // Square
      rect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    } else if (this.shapeType === 2) {
      // Triangle
      triangle(
        this.x, this.y - this.size / 2,
        this.x - this.size / 2, this.y + this.size / 2,
        this.x + this.size / 2, this.y + this.size / 2
      );
    }
  }
}

class ShapeGenerator {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.targetX = width / 2;
    this.targetY = height / 2;
    this.originalX = x; // Save original position for backward movement
    this.originalY = y;
    this.shapeType = floor(random(3)); // Random shape type: 0, 1, or 2
    this.currentY = y; // Initialize currentY to match the starting y position
  }

  combust() {
    // Create multiple eruption particles from this shape
    const numEruptions = 10; // Number of eruption particles

    for (let i = 0; i < numEruptions; i++) {
      // Create an Eruption object
      eruptions.push(new Eruption(this.x, this.y, this.shapeType));
    }

    // Remove this shape from the shapes array
    let index = shapes.indexOf(this);
    if (index > -1) {
      shapes.splice(index, 1);
    }
  }

  update() {
    this.x += (this.targetX - this.x) * 0.02; //speed
    this.y += (this.targetY - this.y) * 0.02;

    // Check distance from center
    let distanceFromCenter = dist(this.x, this.y, width / 2, height / 2);

    if (distanceFromCenter <= 150) {
      // Ensure we don't modify stalk if it's already fully grown
      if (!stalk.grown) {
        stalk.currentY += 0.5; // Increment currentY to make stalk appear to shrink
      }
    }
  }

  draw() {
    noFill();
    strokeWeight(2)
    stroke(255);

    // Use `if` statements to draw the shapes
    if (this.shapeType === 0) {
      ellipse(this.x, this.y, this.size); // Circle
    } else if (this.shapeType === 1) {
      rect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size); // Square
    } else if (this.shapeType === 2) {
      triangle(
        this.x, this.y - this.size / 2, // Top
        this.x - this.size / 2, this.y + this.size / 2, // Bottom left
        this.x + this.size / 2, this.y + this.size / 2 // Bottom right
      ); // Triangle
    }
  }
}


class Stalk {
  constructor() {
    this.startY = 150; // Initial y-coordinate
    this.endY = 0; // Target y-coordinate
    this.currentY = this.startY; // Current y-coordinate for animation
    this.growthSpeed = 0.5; // Speed of stalk growth
    this.grown = false; // Flag for growth completion
  }

  draw() {
    translate(width / 2, height / 2 - 50); // Center the stalk
    strokeWeight(5);
    stroke(174, 188, 33);

    // Animate the stalk's growth
    if (this.currentY > this.endY) {
      this.currentY -= this.growthSpeed; // Decrement the starting y-coordinate
    } else {
      this.grown = true; // Mark as fully grown
    }

    // Draw the stalk
    line(0, this.currentY, 0, 200);
  }

  isFullyGrown() {
    return this.grown; // Return the growth status
  }
}

class BloomingFlower {
  constructor() {
    this.bloomFactor = 0; // Controls the bloom progress
    this.bloomSpeed = 0.01; // Speed of blooming
    this.maxBloom = 1; // Maximum bloom factor
    this.t = 0; // For petal animation
    this.glowSize = 0; // Glow effect size
    this.starSpawnTimer = 0; // Timer for spawning stars
    this.centerSize = 0; // Flower center size, starts from 0
    this.maxCenterSize = 40; // Maximum flower center size
  }

  draw() {
    // Draw the glowing effect behind the flower
    this.drawGlow();

    // Draw petals
    for (let angle = 0; angle < 360; angle += 15) {
      push();
      rotate(angle);
      this.drawPetal(this.bloomFactor, angle);
      pop();
    }

    // Draw the flower center
    this.drawCenter();

    // Bloom animation
    if (this.bloomFactor < this.maxBloom) {
      this.bloomFactor += this.bloomSpeed;
    }

    // Grow the flower center simultaneously with the bloom factor
    if (this.centerSize < this.maxCenterSize) {
      this.centerSize = lerp(0, this.maxCenterSize, this.bloomFactor);
    }

    // Once the flower is fully bloomed, spawn stars at random intervals
    if (this.bloomFactor >= this.maxBloom) {
      this.starSpawnTimer++;
      if (this.starSpawnTimer >= 60) {
        this.spawnRandomStars();
        this.starSpawnTimer = 0;
      }
    }

    this.t += 1; // Increment animation time
  }

  drawGlow() {
    let glowColor = color(255, 133, 194, 25);
    this.glowSize = lerp(this.glowSize, this.bloomFactor * 160, 0.1);

    noStroke();
    fill(glowColor);
    ellipse(0, 0, this.glowSize, this.glowSize);
  }

  drawPetal(factor, angleOffset) {
    let petalColor = lerpColor(
      color(4, 217, 217),
      color(242, 145, 145),
      (sin(angleOffset + this.t) + 1) / 2
    );
    fill(petalColor);
    noStroke();

    beginShape();
    for (let theta = 0; theta <= 360; theta++) {
      let r = factor * (70 * sin(5 * theta + this.t));
      let x = r * cos(theta);
      let y = factor * r * sin(theta) * 0.3;
      vertex(x, y);
    }
    endShape(CLOSE);
  }

  drawCenter() {
    // Dynamic gradient fill
    noStroke();
    fill(
      lerpColor(
        color(255, 236, 189),
        color(237, 161, 123),
        (sin(this.t / 1) + 1) / 2
      )
    );
    ellipse(0, 0, this.centerSize);

    noFill();
    strokeWeight(2);
    stroke(251, 110, 57);
    for (let i = 0; i < 4; i++) {
      let size = 4 + i * 9;
      ellipse(0, 0, size, size);
    }
  }

  spawnRandomStars() {
    let numStars = 2;
    for (let i = 0; i < numStars; i++) {
      let randomColor = random(starColors);
      starsArray.push(new Star(0, 0, randomColor));
    }
  }
}

class Star {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.baseSize = 4;
    this.velocityX = random(-0.5, 0.5);
    this.velocityY = random(-0.5, 0.5);
  }

  display() {
    this.x += this.velocityX;
    this.y += this.velocityY;

    noStroke();
    fill(this.color + "10");
    ellipse(this.x, this.y, this.baseSize + 20, this.baseSize + 20);

    fill(this.color);
    ellipse(this.x, this.y, this.baseSize, this.baseSize);

    let randomColorVariation = color(random(255), random(255), random(255), 10);
    fill(randomColorVariation);
    ellipse(this.x, this.y, this.baseSize + 5, this.baseSize + 5);
  }
}

class Particle {
  constructor() {
    // Randomly set particle positions across the entire canvas
    this.x = random(width);
    this.y = random(height - 180);
    this.size = random(1, 3); // Random size
    this.speedX = random(-0.3, 0.3); // Random horizontal speed
    this.speedY = random(-0.3, 0.3); // Random vertical speed
    this.alpha = 60; // Random transparency
  }

  update() {
    this.x += this.speedX; // Update x position
    this.y += this.speedY; // Update y position

    if (this.x > width) { this.x = 0; }
    if (this.x < 0) { this.x = width; }
    if (this.y > height) { this.y = 0; }
    if (this.y < 0) { this.y = height; }
  }

  display() {
    noStroke();
    fill(255, this.alpha); // White color with transparency
    ellipse(this.x, this.y, this.size); // Draw the particle
  }
}