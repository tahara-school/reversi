import { GraphicsUtilities } from '../utilities/graphics-utilities.js'

export const SelectableView = class {
    constructor(position, isBlack) {
        this.position = position;
        this.radius = 7;
        this.color = isBlack ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)';
    }
    draw(context) {
        GraphicsUtilities.drawCircle(context, this.color, this.position, this.radius);
    }
};
