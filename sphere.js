import { radians, realMod, sphericalToPoint } from './math.js';

const INCREASE_BY = 0.4;

class SphereCanvas extends HTMLElement {
    constructor() {
        super();

        this.controlStates = {
            x: {
                angle: 0,
                visible: true,
            },
            y: {
                angle: 0,
                visible: true,
            },
            z: {
                angle: 0,
                visible: true,
            },
        };

        this.radius = this.getAttribute('radius') || 200;
        this.useColors = true;

        const shadow = this.attachShadow({mode: 'open'});

        const container = document.createElement('div');
        container.setAttribute('class', 'sphere')
        
        const canvas = document.createElement('canvas');
        canvas.width = this.getAttribute('width');
        canvas.height = this.getAttribute('height');
        container.appendChild(canvas);

        this.ctx = canvas.getContext('2d');

        const style = document.createElement('style');
        style.textContent = stylesheet;

        shadow.appendChild(style);
        shadow.appendChild(container);

        this.draw();
    }

    get controls() {
        return this.controlStates;
    }

    set controls(newValue) {
        this.controlStates = newValue;
    }

    set shouldUseColors(newValue) {
        this.useColors = newValue;
        this.draw();
    }

    drawPoint(position, hue) {
        if (this.useColors) {
            if (position.z >= 0) {
                this.drawColorPoint(position, `hsl(${hue},100%, 50%)`);
            } else {
                this.drawColorPoint(position, `hsl(${hue},100%, 90%)`);
            }
        } else {
            this.drawGreyscalePoint(position);
        }
    }

    drawColorPoint(position, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(210 + position.x, 210 - position.y, 1, 1);
    }

    drawGreyscalePoint(position) {
        if (position.z >= 0) {
            this.drawColorPoint(position, "rgb(0, 0, 0)");
        } else {
            this.drawColorPoint(position, "rgb(200, 200, 200");
        }
    }

    drawContour() {
        // Draw contour
        for (var i = 0; i < 360; i += INCREASE_BY) {
            // Drawing circle
            this.drawGreyscalePoint({
                x: Math.sin(radians(i)) * this.radius,
                y: Math.cos(radians(i)) * this.radius,
                z: 0 // Anything 0 or above is fine for black point
            });
        }
    }

    rotateForAxis(axis, position, angle) {
        let coor = [position.x, position.y, position.z];

        angle = radians(angle);
        let spliced = coor.splice(axis, 1)[0];
        let c1 = coor[0];
        let c2 = coor[1];

        coor = [
            Math.cos(angle) * c1 - Math.sin(angle) * c2,
            Math.sin(angle) * c1 + Math.cos(angle) * c2
        ];

        coor.splice(axis, 0, spliced);

        return {
            x: coor[0],
            y: coor[1],
            z: coor[2],
        };
    }

    // Turn for all axis rotations
    rotate(coor) {
        return this.rotateForAxis(
            2, this.rotateForAxis(
                1, this.rotateForAxis(
                    0, coor, -this.controlStates.x.angle), -this.controlStates.y.angle), -this.controlStates.z.angle);
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, 420, 420);

        if (this.controlStates.x.visible) {
            for (let i = 0; i < 360; i += INCREASE_BY) {
                this.drawPoint(this.rotate(sphericalToPoint(this.radius, 0, i)), 0);
            }
        }

        if (this.controlStates.y.visible) {
            for (let i = 0; i < 360; i += INCREASE_BY) {
                this.drawPoint(this.rotate(sphericalToPoint(this.radius, i, 90)), 128);
            }
        }

        if (this.controlStates.z.visible) {
            for (let i = 0; i < 360; i += INCREASE_BY) {
                this.drawPoint(this.rotate(sphericalToPoint(this.radius, 90, i)), 256);
            }
        }

        this.drawContour();      
    }
}

const stylesheet = ``;

customElements.define('sphere-canvas', SphereCanvas)
