import { Coordinate } from "./Coordinate";


export class Cloud {
    location: Coordinate;
    scale: number;
    opacity: number
    rate: Coordinate;
    alive: boolean;

    constructor({ location, scale, opacity, rate }: Omit<Cloud, 'alive' | 'dead'>){
        this.location = location;
        this.scale = scale;
        this.opacity = opacity;
        this.rate = rate;
        this.alive = true;
    }

    dead = function(this: Cloud){
        this.alive = false;
    }
}
