import { SnowParticle } from "./SnowParticle";


export class SnowProcessor {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
    particles: SnowParticle[] = [];
    canvasSelector: string;
    count: number;
    frames: number = 30;
    interval: NodeJS.Timer;
    private angle = 0;

    constructor({ count, canvasSelector }: {count: number, canvasSelector: string}){
        this.canvasSelector = canvasSelector;
        this.count = count;

        this.canvas = document.getElementById(this.canvasSelector) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
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

        [...new Array(this.count)].forEach((_: number) => 
            this.particles.push(
                new SnowParticle({
                    x: Math.random() * this.width,
                    y: Math.random() * this.height,
                    radius: Math.random() * 4 + 1,
                    density: Math.random() * this.count
                })
            )
        );

        this.interval = setInterval(() => this.run(), 1000/this.frames);
        window.addEventListener('resize',(_event) => {
            
            clearInterval(this.interval)
            this.resize()
            this.ctx.clearRect(0, 0, this.width, this.height);
            this.ctx.strokeStyle = 'rgba(174,194,224,0.5)';
            this.interval = setInterval(() => this.run(), 1000/this.frames);
        });
    }

    draw = function(this: SnowProcessor){
        this.ctx.clearRect(0, 0, this.width, this.height);
		this.ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
		this.ctx.beginPath();

        for (const particle of this.particles){
            this.ctx.moveTo(particle.x, particle.y)
            this.ctx.arc(
                particle.x, 
                particle.y, 
                particle.radius, 
                0, 
                Math.PI * 2, 
                true
            )
        }

        this.ctx.fill();

    }

    update = function(this: SnowProcessor){
        this.angle += 0.01;

        this.particles.forEach((particle: SnowParticle, idx: number) => {
            particle.y += Math.cos(this.angle + particle.density) + 1 + particle.radius/2;
            particle.x += Math.sin(this.angle) * 2;

            if (particle.x > this.width + 5 || particle.x < -5 || particle.y > this.height){
                if (idx % 3 > 0){
                    this.particles[idx] = new SnowParticle({
                        x: Math.random() * this.width, 
                        y: -10, 
                        radius: particle.radius, 
                        density: particle.density
                    });
                }
                else {
                    if (Math.sin(this.angle) > 0){
                        this.particles[idx] = new SnowParticle({
                            x: -5, 
                            y: Math.random() * this.height, 
                            radius: particle.radius, 
                            density: particle.density
                        });
                    }
                    else {
                        this.particles[idx] = new SnowParticle({
                            x: this.width + 5, 
                            y: Math.random() * this.height, 
                            radius: particle.radius, 
                            density: particle.density
                        })
                    }
                }
            }
        })
    }

    resize = function(this: SnowProcessor) {
        this.width = document.getElementById('canvas-container')?.clientWidth as number;
        this.height = document.getElementById('canvas-container')?.clientHeight as number;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    run = function(this: SnowProcessor){
        this.draw();
        this.update();
    }

}