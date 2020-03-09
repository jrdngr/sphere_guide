class AxisControls extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({mode: 'open'});

        const container = document.createElement('div');
        container.setAttribute('class', 'axis-controls');

        const isVisibleCheckbox = document.createElement('input');
        isVisibleCheckbox.type = "checkbox";
        isVisibleCheckbox.checked = this.getAttribute('visible') === '';
        isVisibleCheckbox.onchange = this.fireVisibilityChanged.bind(this);
        container.appendChild(isVisibleCheckbox);

        const label = document.createElement('label');
        label.textContent = this.textContent;
        label.style = `color: ${this.getAttribute('color') || "rgb(0, 0, 0)"}; font-size: 20px`;
        container.appendChild(label);

        const slider = document.createElement('input');
        slider.setAttribute('class', 'slider');
        slider.type = "range";
        slider.min = 0;
        slider.max = 360;
        slider.value = 0;
        slider.step = 1;
        slider.oninput = this.onValueChanged.bind(this); 
        container.appendChild(slider);

        const angleInputBox = document.createElement('input');
        angleInputBox.setAttribute('class', 'angle-input');
        angleInputBox.type = "number";
        angleInputBox.min = 0;
        angleInputBox.max = 360;
        angleInputBox.value = 0;
        angleInputBox.oninput = this.onValueChanged.bind(this);
        container.appendChild(angleInputBox);

        const style = document.createElement('style');
        style.textContent = stylesheet;

        shadow.appendChild(style);
        shadow.appendChild(container);

        this.container = container;
        this.isVisibleCheckbox = isVisibleCheckbox;
        this.label = label;
        this.slider = slider;
        this.angleInputBox = angleInputBox;
        this.style = style;
    }

    onValueChanged(event) {
        if (event.target.className === 'slider' && this.angleInputBox.value !== event.target.value) {
            this.angleInputBox.value = event.target.value;
        }

        if (event.target.className === 'angle-input' && this.slider.value !== event.target.value) {
            this.slider.value = event.target.value;
        }

        this.fireValueChanged();
    }

    fireValueChanged() {
        this.dispatchEvent(new CustomEvent('value-changed', this.state));
    }

    fireVisibilityChanged() {
        this.dispatchEvent(new CustomEvent('visibility-changed',  this.state));
    }

    get state() {
        return {
            value: this.value,
            visible: this.visibile,
        }
    }

    get value() {
        return this.angleInputBox.value;
    }

    set value(newValue) {
        this.angleInputBox.value = newValue;
        this.slider.value = newValue;
        this.fireValueChanged();
    }

    get visible() {
        return this.isVisibleCheckbox.checked;
    }

    set visible(newValue) {
        this.isVisibleCheckbox.checked = newValue;
        this.fireVisibilityChanged();
    }
}

const stylesheet =`
    .axis-controls {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .angle-input {
        width: 10%;
    }

    /* The slider itself */
    .slider {
        margin: 10px 5px;
        -webkit-appearance: none;  /* Override default CSS styles */
        appearance: none;
        width: 80%; /* Full-width */
        height: 25px; /* Specified height */
        background: #d3d3d3; /* Grey background */
        outline: none; /* Remove outline */
        opacity: 0.7; /* Set transparency (for mouse-over effects on hover) */
        -webkit-transition: .2s; /* 0.2 seconds transition on hover */
        transition: opacity .2s;
    }

    /* Mouse-over effects */
    .slider:hover {
        opacity: 1; /* Fully shown on mouse-over */
    }

    /* The slider handle (use -webkit- (Chrome, Opera, Safari, Edge) and -moz- (Firefox) to override default look) */
    .slider::-webkit-slider-thumb {
        -webkit-appearance: none; /* Override default look */
        appearance: none;
        width: 25px; /* Set a specific slider handle width */
        height: 25px; /* Slider handle height */
        background: #4CAF50; /* Green background */
        cursor: pointer; /* Cursor on hover */
    }

    .slider::-moz-range-thumb {
        width: 25px; /* Set a specific slider handle width */
        height: 25px; /* Slider handle height */
        background: #4CAF50; /* Green background */
        cursor: pointer; /* Cursor on hover */
    }
`;

customElements.define('axis-controls', AxisControls)
