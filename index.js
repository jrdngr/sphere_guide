import { realMod } from './math.js';

// Based on: https://medium.com/@refik/a-journey-and-a-method-for-drawing-spheres-5b24246ca479

const sphere = document.getElementById('sphere');

const xControls = document.getElementById('x-controls');
const yControls = document.getElementById('y-controls');
const zControls = document.getElementById('z-controls');

const useColorsCheckbox = document.getElementById("use-colors-checkbox");

const MOUSE_DAMPING = 1/3;
const TOUCH_DAMPING = 1/50;
const TOUCH_THROTTLE = 10;

let currentTouch = undefined;
let touchEvents = 0;

function getControls(name) {
    if (name.startsWith('x')) {
        return xControls;

    } else if (name.startsWith('y')) {
        return yControls;

    } else if (name.startsWith('z')) {
        return zControls;
    }

    return undefined;
}

function getCoordinate(axis) {
    return getControls(axis).angle;
}

function setCoordinate(axis, angle) {
    getControls(axis).angle = realMod(angle, 360);
}

function setAllCoordinates(x, y, z) {
    setCoordinate('x', x);
    setCoordinate('y', y);
    setCoordinate('z', z);
}

function onResetClicked() {
    setAllCoordinates(0, 0, 0);
    draw()
}

function onMouseMove(event) {
    if (event.buttons > 0) {
        const dx = - Math.floor(event.movementY * MOUSE_DAMPING);
        const dy = Math.floor(event.movementX * MOUSE_DAMPING)
        shiftCoordinates(dx ,dy);
    }
}

function shiftCoordinates(dx, dy) {
    setCoordinate('x', getCoordinate('x') + dx);
    setCoordinate('y', getCoordinate('y') + dy);

    draw()
}

function onTouchStart(event) {
    if (!currentTouch) {
        currentTouch = event.changedTouches[0];
    }
}

function onTouchMove(event) {
    for (const touch of event.changedTouches) {
        if (touch.identifier === currentTouch.identifier) {
            touchEvents += 1;
            if (touchEvents % TOUCH_THROTTLE == 0) {
                const dx = Math.floor((touch.screenY - currentTouch.screenY) * TOUCH_DAMPING);
                const dy = Math.floor((touch.screenX - currentTouch.screenX) * TOUCH_DAMPING);
                shiftCoordinates(-dx, dy);
            }
            return;
        }
    }
}

function onTouchEnd(event) {
    for (const touch of event.changedTouches) {
        if (touch.identifier === currentTouch.identifier) {
            currentTouch = undefined;
            touchEvents = 0;
            return;
        }
    }
}

function onStateChanged() {
    sphere.controls = {
        x: xControls.state,
        y: yControls.state,
        z: zControls.state,
    };
    draw()
}

function onUseColorChanged() {
    sphere.shouldUseColors = useColorsCheckbox.checked;
}

function draw() {
    sphere.draw();
}

document.getElementById("reset-button").onclick = onResetClicked;
useColorsCheckbox.addEventListener('change', onUseColorChanged);

sphere.addEventListener('mousemove', onMouseMove);
sphere.addEventListener('touchstart', onTouchStart);
sphere.addEventListener('touchmove', onTouchMove);
sphere.addEventListener('touchend', onTouchEnd);

xControls.addEventListener('value-changed', onStateChanged);
xControls.addEventListener('visibility-changed', onStateChanged);

yControls.addEventListener('value-changed', onStateChanged);
yControls.addEventListener('visibility-changed', onStateChanged);

zControls.addEventListener('value-changed', onStateChanged);
zControls.addEventListener('visibility-changed', onStateChanged);


draw();
