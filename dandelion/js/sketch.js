


function setup() {
  let canvas = createCanvas(500, 400);
  canvas.parent("p5-canvas-container");
}

function draw() {
  background("#94BDF2");

  stroke("#365902"); // Stem
  strokeWeight(12);
  line(250, 230, 250, 500);

  strokeWeight(2); // Petals
  stroke("#F2B705");
  fill("#F2CB05");
  beginShape();
  curveVertex(315, 250);
  curveVertex(307, 255);
  curveVertex(315, 240);
  curveVertex(width / 2, 230);
  curveVertex(307, 255);
  curveVertex(315, 250);
  curveVertex(width / 2, 230);
  endShape();



  noStroke(); // Flower core
  fill("#D97904");
  ellipse(width / 2, 230, 40, 25);

  noStroke();
  fill("#F2CB05");
  ellipse(310, 250, 9);
  ellipse();

}

