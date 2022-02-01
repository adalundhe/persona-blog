import { RainParticle } from "./RainParticle";


export class RainProcessor {
    count: number;
    canvasSelector: string;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
    particles: RainParticle[] = []
    frames: number = 30;

    constructor({ count, canvasSelector }: {count: number, canvasSelector: string}){
        this.count = count;
        this.canvasSelector = canvasSelector;
        this.canvas = document.getElementById(this.canvasSelector) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;

        this.width = window.innerWidth;
        const containerHeight = document.getElementById('canvas-container')?.clientHeight as number;
        
        if (window.innerHeight/containerHeight > 2){
            this.height = document.getElementById('canvas-container')?.clientHeight as number * 0.75;

        }
        else {
            this.height = document.getElementById('canvas-container')?.clientHeight as number/2;

        }

        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx.strokeStyle = 'rgba(174,194,224,0.5)';
        this.ctx.lineWidth = 1;
        this.ctx.lineCap = 'round';

        [...new Array(this.count)].forEach((_: number) => {
            this.particles.push(
                new RainParticle({
                    x: Math.random() * this.width,
                    y: Math.random() * this.height,
                    length: Math.random() * 1,
                    xs: -4 + Math.random() * 4 + 2,
                    ys: Math.random() * 10 + 10

                })
            );
        });

        setInterval(() => this.run(), 1000/this.frames);
        window.addEventListener('resize',(_event) => this.resize());
    }


    draw = function(this: RainProcessor){
        this.ctx.clearRect(0, 0, this.width, this.height);

        for (const particle of this.particles){
            this.ctx.beginPath();
            this.ctx.moveTo(particle.x, particle.y);
            this.ctx.lineTo(particle.x + particle.length * particle.xs, particle.y + particle.length * particle.ys);
            this.ctx.stroke();
        }
    }

    update = function(this: RainProcessor){
        for (const particle of this.particles){
            particle.x += particle.xs;
            particle.y += particle.ys;

            if (particle.x > this.width || particle.y > this.height){
                particle.x = Math.random() * this.width;
                particle.y = -20;
            }
        }
    }

    resize = function(this: RainProcessor) {
        this.canvas.width = window.innerWidth;
        const containerHeight = document.getElementById('canvas-container')?.clientHeight as number;
        
        if (window.innerHeight/containerHeight > 2){
            this.height = document.getElementById('canvas-container')?.clientHeight as number * 0.75;

        }
        else {
            this.height = document.getElementById('canvas-container')?.clientHeight as number/2;

        }
    }

    run = function(this: RainProcessor){
        this.draw();
        this.update();
    }
}