export class RainParticle {
    x: number;
    y: number;
    length: number;
    xs: number;
    ys: number;

    constructor({ x, y, length, xs, ys }: RainParticle){
        this.x = x;
        this.y = y;
        this.length = length;
        this.xs = xs;
        this.ys = ys;
    }
}