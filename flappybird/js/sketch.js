let myObstacles = [];
let fly1;

let gameOver = false;

function setup() {
  let canvas = createCanvas(500, 400);
  canvas.parent("p5-canvas-container");

  for (let i = 0; i < 15; i++) {
    myObstacles.push(new Obstacle());
  }
  fly1 = new Fly();
}

function draw() {
  background(220);

  for (let i = 0; i < myObstacles.length; i++) {
    myObstacles[i].update();
    myObstacles[i].display();
  }
  fly1.update();
  fly1.display();

  //check collision
  for (let i = 0; i < myObstacles.length; i++) {
    myObstacles[i].checkCollision(myFly.x, myFly.y);
  }
  if (gameOver == true) {
    text("GAMEOVER", 100, 200);
  }
}

class Obstacle {
  constructor() {
    this.x = random(width, 2 * width);
    this.y = random(0, height);
    this.speedX = -1;
    //optional constructors
    this.size = 40;
  }
  update() {
    this.x += this.speedX;
    if (this.x < -this.size) {
      this.x = width;
      this.y = random(0, height);
    }
  }
  display() {
    push();
    translate(this.x, this.y);
    fill(0);
    rect(0, 0, this.size, this.size);
    pop();
  }

}
class Fly {
  constructor() {
    this.x = width / 3;
    this.y = height / 2;
    this.speedY = 0;
    this.r = 3;
  }
  update() {
    if (this.y < height) {
      this.speedY += 0.1;
    }

    if (keyIsPressed == true && key == "w") {
      this.speedY -= 0.2;
    }

    this.y += this.speedY;

    if (this.y >= height - this.r) {
      this.y = height - this.r;
    }
  }
  display() {
    push();
    translate(this.x, this.y);
    fill("red");
    circle(0, 0, this.r * 2);
    pop();
  }
  //collision with other objects
  checkCollision(otherX, otherY) {
    if (otherX > this.x && otherX < this.x + this.size && this.y < this.y + this.size) {
      gameOver = true;
    }
  }
}
