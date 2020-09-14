import { GraphicsUtilities } from '../utilities/graphics-utilities.js';

export const NumberView = class {
    constructor(position, color) {
        this.position = position.clone();
        this.color = color;
        this.number = 0;
    }
    setNumber(number) {
        this.number = number;
    }
    draw(context) {
        GraphicsUtilities.drawText(context, this.color, this.number, this.position);
    }
};
