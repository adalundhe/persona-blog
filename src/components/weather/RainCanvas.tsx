import React from "react";

export const RainCanvas = () => {
    const runAnimations = () => {
        const canvas = document.getElementById("rain-animation") as HTMLCanvasElement;
        const maxRain = 250;
        canvas.width = window.innerWidth;
        canvas.height = (window.innerHeight/10) * 4;
        
        if(canvas.getContext) {
            const ctx = canvas.getContext('2d') as any;
            const width: number = canvas.width;
            const height: number = canvas.height;
            ctx.strokeStyle = 'rgba(174,194,224,0.5)';
            ctx.lineWidth = 1;
            ctx.lineCap = 'round';
            
            
            var init = [];
            var maxParts = 1000;
            for(var a = 0; a < maxParts; a++) {
            init.push({
                x: Math.random() * width,
                y: Math.random() * height,
                l: Math.random() * 1,
                xs: -4 + Math.random() * 4 + 2,
                ys: Math.random() * 10 + 10
            })
            }
            
            type Particle = {
                x: number;
                y: number;
                l: number;
                xs: number;
                ys: number;
            };
            const particles: Array<Particle> = [];
            for(var b = 0; b < maxParts; b++) {
            particles[b] = init[b] as Particle;
            }
            
            const draw =() => {
                ctx.clearRect(0, 0, width, height);
                for(const particle of particles.slice(0, maxRain)) {
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(particle.x + particle.l * particle.xs, particle.y + particle.l * particle.ys);
                    ctx.stroke();
                }
                move();
            }
            
            const move = () => {
                for(const particle of particles) {
                    particle.x += particle.xs;
                    particle.y += particle.ys;
                    if(particle.x > width || particle.y > height) {
                        particle.x = Math.random() * width;
                        particle.y = -20;
                    }
                }
            }
            
            setInterval(draw, 30);
            
        }
      };

      React.useEffect(() => {
          runAnimations()

      }, []);

    return (
        <canvas className="animation bg-black w-screen h-1/2" id="rain-animation">
        </canvas>
    )
}