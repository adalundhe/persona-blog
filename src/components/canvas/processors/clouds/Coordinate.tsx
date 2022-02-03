export class Coordinate {
    x: number;
    y: number;

    constructor({ x, y }: Omit<Coordinate, 'add'>) {
        this.x = x;
        this.y = y;
    }

    add = function(this: Coordinate, x: number, y?: number) {

        if (y === undefined){
            this.x += x;
            this.y += x;
        }
        else {
            this.x += x;
            this.y += y;
        }
        
    }
}