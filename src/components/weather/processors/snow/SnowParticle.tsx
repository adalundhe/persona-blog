export class SnowParticle {
    x: number;
    y: number;
    radius: number;
    density: number;

    constructor({ x, y, radius, density }: SnowParticle){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.density = density;
    }
}