// Based on: https://medium.com/@refik/a-journey-and-a-method-for-drawing-spheres-5b24246ca479

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const xControls = document.getElementById('x-controls');
const yControls = document.getElementById('y-controls');
const zControls = document.getElementById('z-controls');

const useColorsCheckbox = document.getElementById("use-colors-checkbox");

const mouseDamping = 1/3;
const increase_by = 0.4;
const r = 200; // radius
const angles = [0, 0, 0]; // rotation angles

function drawPoint(coor, hue, lightness = "50%") {
    // If the points z coordinate is less than
    // zero, it is out of view thus, grey.
    let color;
    if (coor[2] >= 0) {
        if (useColorsCheckbox.checked) {
            color = `hsl(${hue},100%,${lightness})`;
        } else {
            color = "rgb(0, 0, 0)";
        }
    } else { 
        if (useColorsCheckbox.checked) {
            color = `hsl(${hue},100%,90%)`;
        } else {
            color = "rgb(200, 200, 200)"
        }
    }
    ctx.fillStyle = color;
    ctx.fillRect(210 + coor[0], 210 - coor[1], 1, 1);
}

function realMod(n, m) {
    return ((n % m) + m) % m;
}

// Degree to radians
function radians(angle) {
    return angle * (Math.PI / 180);
}

// Contour of sphere, it is always the same circle
function drawContour() {
    // Draw contour
    for (var i = 0; i < 360; i += increase_by) {
        // Drawing circle
        drawPoint([
            Math.sin(radians(i)) * r,
            Math.cos(radians(i)) * r,
            0 // Anything 0 or above is fine for black point
        ], 0, "0%");
    }
}

// Convert spherical coordinate to x y z coordinate
function sphericalToPoint(ascension, declination) {
    ascension = radians(ascension);
    declination = radians(declination);
    return [
        Math.sin(ascension) * Math.sin(declination) * r,
        Math.cos(declination) * r,
        Math.cos(ascension) * Math.sin(declination) * r
    ];
}

// Turn for x (0), y (1) or z (2) axis
function rotateForAxis(axis, coor, angle) {
    angle = radians(angle);
    let spliced = coor.splice(axis, 1)[0];
    let c1 = coor[0];
    let c2 = coor[1];

    coor = [
        Math.cos(angle) * c1 - Math.sin(angle) * c2,
        Math.sin(angle) * c1 + Math.cos(angle) * c2
    ];

    coor.splice(axis, 0, spliced);

    return coor;
}

// Turn for all axis rotations
function rotate(coor) {
    return rotateForAxis(
        2, rotateForAxis(
            1, rotateForAxis(
                0, coor, angles[0]), angles[1]), angles[2]);
}

// Draw three axis circles
function drawAxisCircles() {
    // Clear canvas
    ctx.clearRect(0, 0, 420, 420);

    if (xControls.isVisible) {
        for (let i = 0; i < 360; i += increase_by) {
            drawPoint(rotate(sphericalToPoint(0, i)), 0);
        }
    }

    if (yControls.isVisible) {
        for (let i = 0; i < 360; i += increase_by) {
            drawPoint(rotate(sphericalToPoint(i, 90)), 128);
        }
    }

    if (zControls.isVisible) {
        for (let i = 0; i < 360; i += increase_by) {
            drawPoint(rotate(sphericalToPoint(90, i)), 256);
        }
    }

    drawContour();
}

function getCoordinate(axis) {
    if (axis.startsWith('x')) {
        return -angles[0];

    } else if (axis.startsWith('y')) {
        return -angles[1];

    } else if (axis.startsWith('z')) {
        return -angles[2];
    }

    return undefined;
}

function setCoordinate(axis, value) {
    const fixedValue = realMod(value, 360);

    if (axis.startsWith('x')) {
        angles[0] = -fixedValue;
        xInput.value = fixedValue;
        xRange.value = fixedValue;

    } else if (axis.startsWith('y')) {
        angles[1] = -fixedValue;
        yInput.value = fixedValue;
        yRange.value = fixedValue;

    } else if (axis.startsWith('z')) {
        angles[2] = -fixedValue;
        zInput.value = fixedValue;
        zRange.value = fixedValue;
    }
}

function setAllCoordinates(x, y, z) {
    setCoordinate('x', x);
    setCoordinate('y', y);
    setCoordinate('z', z);
}

function onCoordinateChanged(event) {
    setCoordinate(event.target.id, event.target.value);
    drawAxisCircles();
}

function onResetClicked() {
    setAllCoordinates(0, 0, 0);
    drawAxisCircles();
}

function onMouseMove(event) {
    if (event.buttons > 0) {
        const x = getCoordinate('x');
        let newX = x - Math.floor(event.movementY * mouseDamping);
        setCoordinate('x', newX);

        const y = getCoordinate('y');
        let newY = y + Math.floor(event.movementX * mouseDamping);
        setCoordinate('y', newY);

        drawAxisCircles();
    }
}

document.getElementById("reset-button").onclick = onResetClicked;
canvas.addEventListener('mousemove', onMouseMove);
useColorsCheckbox.addEventListener('change', drawAxisCircles);

xControls.addEventListener('value-changed', drawAxisCircles);
yControls.addEventListener('value-changed', drawAxisCircles);
zControls.addEventListener('value-changed', drawAxisCircles);


drawAxisCircles();
