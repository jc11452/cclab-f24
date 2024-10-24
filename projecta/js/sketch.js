console.log("this thing works!!")

let xPositionShape = [];
let yPositionShape = [];
let sizeShape = [];
let shapeStrokeSize = [];

let shapeLerpSpeed = 0.5;
let eyeSize = 27;

let movingEyeX = 0;
let movingEyeY = 0;

let ellipseCount = 0;
let bgColor;

let starsArray = [];
let starColors = [
    "#B3E0F2",
    "#4162A6",
    "#F2B138",
    "#F25A38",
    "#F2F2F2",
    "#3BACD9",
];
let eruptions = [];

function setup() {
    let cnv = createCanvas(800, 500);
    cnv.parent("p5-canvas-container")

    frameRate(10);
}

function draw() {
    if (xPositionShape.length === 0 && ellipseCount == 7) {
        background(0, 0, 0, 70); // Set background to black
        if (eyeSize < 260) {
            eyeSize++;
        }
    } else {
        background(255, 255, 255, 70); // Disappearing trail effect
    }

    // Reduce eyeSize to 27 if no stars are left
    if (starsArray.length === 0 && eyeSize > 27) {
        eyeSize -= 5; // Gradually decrease the eyeSize
    }

    fill(0);
    let closestShapeIndex = -1;
    let closestDistance = Infinity;

    // Check for the closest shape to the eye
    for (let i = 0; i < xPositionShape.length; i++) {
        let d = dist(
            movingEyeX + width / 2,
            movingEyeY + height / 2,
            xPositionShape[i],
            yPositionShape[i]
        );
        if (d < closestDistance && d <= 70) {
            closestDistance = d;
            closestShapeIndex = i;
        }
    }

    // Lerp the eye position towards the closest shape
    if (closestShapeIndex !== -1) {
        let targetX = xPositionShape[closestShapeIndex] - width / 2;
        let targetY = yPositionShape[closestShapeIndex] - height / 2;

        movingEyeX = lerp(movingEyeX, targetX, shapeLerpSpeed);
        movingEyeY = lerp(movingEyeY, targetY, shapeLerpSpeed);
    }

    // Random eye movement
    noFill();
    movingEyeX += random(-13, 13);
    movingEyeY += random(-13, 13);

    // Constrain eye movement within the canvas
    movingEyeX = constrain(movingEyeX, -width / 2 + 50, width / 2 - 50);
    movingEyeY = constrain(movingEyeY, -height / 2 + 50, height / 2 - 50);

    // Update and draw shapes
    for (let i = xPositionShape.length - 1; i >= 0; i--) {
        strokeWeight(shapeStrokeSize[i]);

        let directionX = movingEyeX + width / 2 - xPositionShape[i];
        let directionY = movingEyeY + height / 2 - yPositionShape[i];
        let distance = dist(
            xPositionShape[i],
            yPositionShape[i],
            movingEyeX + width / 2,
            movingEyeY + height / 2
        );
        let ellipseSpeed = 3;

        if (distance > 1) {
            xPositionShape[i] += (directionX / distance) * ellipseSpeed;
            yPositionShape[i] += (directionY / distance) * ellipseSpeed;
        }

        // Remove the shape if it reaches the eye
        if (distance <= 5) {
            // Remove shape properties from the arrays
            xPositionShape.splice(i, 1);
            yPositionShape.splice(i, 1);
            sizeShape.splice(i, 1);
            shapeStrokeSize.splice(i, 1);
        } else {
            ellipse(xPositionShape[i], yPositionShape[i], sizeShape[i], sizeShape[i]);
        }
    }

    push();
    noFill();
    // Draw the eye after the stars
    drawEye(movingEyeX, movingEyeY, 0.8);
    pop();

    // Draw erupting circles
    for (let i = eruptions.length - 1; i >= 0; i--) {
        let eruption = eruptions[i];

        eruption.x += eruption.velocityX;
        eruption.y += eruption.velocityY;

        // Set both stroke and fill to the eruption's color
        let eruptionColor = color(eruption.color);
        noFill();
        stroke(eruptionColor);
        strokeWeight(2);

        ellipse(eruption.x, eruption.y, eruption.size, eruption.size);
    }

    stars(); // Draw stars
}


function drawEye(x, y, scaleFactor) {
    let centerX = width / 2 + x;
    let centerY = height / 2 + y;

    if (xPositionShape.length === 0 && ellipseCount == 7) {
        stroke(255); // White stroke when background is black
    } else {
        stroke(0); // Black stroke for other conditions
    }

    for (let i = 0; i < eyeSize; i++) {
        let wiggle = sin(frameCount * 0.01 + i) * 0.03;
        let radius = 50 - i * random(1, 5) + wiggle;

        strokeWeight(random(1, 3));
        ellipse(centerX, centerY, radius, radius);
    }
}

function mousePressed() {
    // Allow adding a new ellipse only if the count is less than 10
    if (ellipseCount < 7) {
        xPositionShape.push(mouseX);
        yPositionShape.push(mouseY);
        sizeShape.push(random(10, 30));
        shapeStrokeSize.push(random(1, 4));

        ellipseCount++; // Increment the ellipse count
    }

    // Check if a star was clicked
    for (let i = starsArray.length - 1; i >= 0; i--) {
        let star = starsArray[i];
        let d = dist(mouseX, mouseY, star.x, star.y);

        if (d < 20) {
            // Remove the star
            starsArray.splice(i, 1);

            // Create small circles that erupt with the star's color as their fill and stroke
            for (let j = 0; j < 10; j++) {
                eruptions.push({
                    x: star.x,
                    y: star.y,
                    size: random(5, 20), // Random size for the circles
                    velocityX: random(-5, 5), // Random x velocity for explosion effect
                    velocityY: random(-5, -1), // Random y velocity for explosion effect
                    color: star.color, // Set the eruption's color to the star's color
                });
            }

            // Decrease eyeSize for each star that erupts
            if (eyeSize > 5) {
                eyeSize -= 15; // Decrease the eye size once per eruption
            }
        }
    }
}



function stars() {
    for (let i = 0; i < starsArray.length; i++) {
        let star = starsArray[i];

        // Calculate pulse size with slight random variation for twinkling effect
        let pulseSize = 20 + sin(frameCount * 0.1 + i) * 10 + random(-2, 2);

        // Lerp the star position towards the target position
        star.x = lerp(star.x, star.targetX, 0.1);
        star.y = lerp(star.y, star.targetY, 0.1);

        // Draw star trail (fade effect)
        noStroke();
        fill(star.color + "20"); // Faded color for trail
        ellipse(star.x, star.y, pulseSize + 20, pulseSize + 20); // Glow

        // Draw the main star
        fill(star.color);
        ellipse(star.x, star.y, pulseSize, pulseSize); // Star

        // Optionally, vary color slightly for each star
        let randomColorVariation = color(random(255), random(255), random(255), 60); // Soft glow color
        fill(randomColorVariation);
        ellipse(star.x, star.y, pulseSize + 5, pulseSize + 5); // Slightly larger for glow effect
    }
}

function keyPressed() {
    if (key === " ") {
        // Check for spacebar key
        let randomColor = random(starColors);
        // Create a star at the current eye position
        starsArray.push({
            x: movingEyeX + width / 2, // Use current eye position for x
            y: movingEyeY + height / 2, // Use current eye position for y
            targetX: random(width), // Target X position for lerp
            targetY: random(height), // Target Y position for lerp
            color: randomColor,
        });
    }
}
