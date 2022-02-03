import { StarParticle } from "./StarParticle";


export class NightSkyProcessor {
    spacing: number;
    canvasSelector: string;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
    particles: StarParticle[] = []
    frames: number = 10;
    private maxStarRadius = 1.5;
    private renderCount = 0;
    private minStarOpacity = 0.1;
    private maxStarOpacity = 0.7;

    constructor({ spacing, canvasSelector }: {spacing: number, canvasSelector: string}){
        this.spacing = spacing;
        this.canvasSelector = canvasSelector;
        this.canvas = document.getElementById(this.canvasSelector) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;

        this.width = window.innerWidth;
        const containerHeight = document.getElementById('canvas-container')?.clientHeight as number;
        
        if (window.innerHeight/containerHeight > 2){
            this.height = containerHeight * 0.75;

        }
        else {
            this.height = containerHeight/2;

        }

        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this._createStars();
        setInterval(() => this.draw(), 1000/this.frames);
        window.addEventListener('resize',(_event) => this.resize());

    }

    draw = function(this: NightSkyProcessor){
        this.ctx.clearRect(0, 0, this.width, this.height);

        this.particles.forEach((particle: StarParticle, idx: number) => {
            const opacity = this._getOpacity(this.renderCount * idx)
            this._fillCircle(particle, `rgb(255, 255, 255, ${opacity})`);
        })

        this.renderCount += 1;
    }

    _createStars = function(this: NightSkyProcessor){
        for (let x = 0; x < this.width; x += this.spacing) {
            for (let y = 0; y < this.height; y += this.spacing) {
                this.particles.push(
                  new StarParticle({
                    x: x + this._randomInt(this.spacing),
                    y: y + this._randomInt(this.spacing),
                    radius: Math.random() * this.maxStarRadius
                  })
              );
            }
          }
    }

    _randomInt = function(this: NightSkyProcessor, max: number){
        return Math.floor(Math.random() * max);
    } 

    _fillCircle = function(this: NightSkyProcessor, particle: StarParticle, fillStyle: string){
        this.ctx.beginPath();
        this.ctx.fillStyle = fillStyle
        this.ctx.arc(
            particle.x,
            particle.y,
            particle.radius, 
            0, 
            Math.PI * 2
        );
        this.ctx.fill();
    }

    _getOpacity = function(this: NightSkyProcessor, opacityFactor: number){
        const opacityIncrement = (this.maxStarOpacity - this.minStarOpacity) * Math.abs(Math.sin(opacityFactor));
        return this.minStarOpacity + opacityIncrement;
    }

    resize = function(this: NightSkyProcessor) {
        this.width = document.getElementById('canvas-container')?.clientWidth as number;
        this.height = document.getElementById('canvas-container')?.clientHeight as number;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }
}