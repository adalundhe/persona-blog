import { Cloud } from "./Cloud";
import { Coordinate } from "./Coordinate";


export class CloudProcessor {
    count: number;
    canvasSelector: string;
    minScale: number = 50;
    maxScale: number = 150;
    minXMovementPercent: number = 0;
    maxXMovementPercent: number = 100;
    minYMovementPercent: number = 0;
    maxYMovementPercent: number = 100;
    minOpacity: number = 50;
    maxOpacity: number = 100;
    minXRate: number = 10;
    maxXRate: number = 50;
    minYRate: number = 0;
    maxYRate: number = 0;
    frames: number = 30;
    loaded: boolean;
    running: boolean;
    cloudImage: HTMLImageElement;
    cloudWidth: number;
    cloudHeight: number;
    clouds: Cloud[] = [];
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
    interval: NodeJS.Timer | undefined;

    constructor({ count, canvasSelector }: {count: number, canvasSelector: string}){
    
        this.count = count;
        this.canvasSelector = canvasSelector;
        this.loaded = false;
        this.running = true;
        this.cloudImage = new Image();
        this.cloudImage.onload = () => this._doneLoading();

        const userAgent = window.navigator.userAgent;
        const microsoftInternetExporerAgent = userAgent.indexOf("MSIE");
        const tridentAgent = userAgent.indexOf("trident");

        if (microsoftInternetExporerAgent > 0 || tridentAgent > 0){
            this.cloudImage.src = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/309492/cloud.png"
        }
        else {
            this.cloudImage.src = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/309492/cloud.svg";
        }

        
        this.cloudWidth = this.cloudImage.width;
        this.cloudHeight = this.cloudImage.height;
        this.canvas = document.getElementById(this.canvasSelector) as HTMLCanvasElement;
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
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;

    }

    _doneLoading = function (this: CloudProcessor){

        this.cloudWidth = this.cloudImage.width;
        this.cloudHeight = this.cloudImage.height;

        [...new Array(this.count)].forEach((_: number) => {
            this.spawn()
        })
  
        this.loaded = true;
        this.interval = setInterval(() => this.run(), 1000/this.frames);
        window.addEventListener('resize',(_event) => {
            clearInterval(this.interval as NodeJS.Timer)
            this.resize()
            this.ctx.clearRect(0, 0, this.width, this.height);
            this.interval = setInterval(() => this.run(), 1000/this.frames);
            
        });

        return this;
    }

    resize = function(this: CloudProcessor) {
        this.width = document.getElementById('canvas-container')?.clientWidth as number;
        this.height = document.getElementById('canvas-container')?.clientHeight as number;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    spawn = function(this: CloudProcessor){
        const child = this.makeCloud(false);
        this.clouds.push(child);
        return this;
    }

    makeCloud = function(this: CloudProcessor, offScreen: boolean){
        const width = this.canvas.width;
        const height = this.canvas.height;

        const scaleFactor = this.randNumber(this.minScale, this.maxScale)/100;
        let x = Math.floor(width * (this.randNumber(this.minXMovementPercent, this.maxXMovementPercent) / 100));
        let y = Math.floor(height * (this.randNumber(this.minYMovementPercent, this.maxYMovementPercent) / 100));
        const guessCloudWidth = Math.floor(this.cloudWidth * scaleFactor);
        const guessCloudHeight = Math.floor(this.cloudHeight * scaleFactor);

        y = Math.min(y,height-guessCloudHeight);
        x = Math.min(x,width-guessCloudWidth);

        const xMovementRate = this.randNumber(this.minXRate, this.maxXRate) / this.frames;
        const yMovementRate = this.randNumber(this.minYRate, this.maxYRate) / this.frames;

        if (offScreen === true){
            y = -guessCloudHeight < 0 ? y : -guessCloudHeight;
            x = x > 0 ? (-x - guessCloudWidth) : (x - guessCloudWidth);
        }
        else if (yMovementRate === 0){
            x = -guessCloudWidth;
        }
        else {
            y = -guessCloudHeight;

            if (this.randNumber(0, 1) === 1){
                x = -x /2;
            }
        }

        const opacity = this.randNumber(this.minOpacity, this.maxOpacity) / 100;
        return new Cloud({
            location: new Coordinate({
                x,
                y
            }),
            scale: scaleFactor,
            opacity: opacity,
            rate: new Coordinate({
                x: xMovementRate,
                y: yMovementRate
            })
        })

    }

    update = function(this: CloudProcessor, idx: number) {

        if (this.clouds[idx]?.alive === false){
            return this;
        }

        const width = this.canvas.width;
        const height = this.canvas.height;

        const rate = this.clouds[idx]?.rate as Coordinate;

        this.clouds[idx]?.location.add(rate?.x, rate?.y)
        const cloudLocation = this.clouds[idx]?.location as Coordinate;

        if (rate.y === 0){
            if (cloudLocation.x > (width + this.cloudWidth)){
                this.clouds[idx]?.dead();
            }
        }
        else if (cloudLocation.x === 0){
            if (cloudLocation.y > height + this.cloudHeight) {
                this.clouds[idx]?.dead();
            }
        }
        else {
            if (cloudLocation.x > width + this.cloudWidth && cloudLocation.y > height + this.cloudHeight){
                this.clouds[idx ]?.dead();
            }
        }

        return this;
    }

    respawn = function(this: CloudProcessor, idx: number){
        if (this.clouds[idx]?.alive === true) {
            return this;
        }
        
        this.clouds[idx] = this.makeCloud(true);

        return this;
    }

    draw = function(this: CloudProcessor, idx: number){
        const child = this.clouds[idx] as Cloud;
        const location = child.location;
        const width = Math.floor(this.cloudWidth * child.scale);
        const height = Math.floor(this.cloudHeight * child.scale);

        this.ctx.save();
        // this.ctx.translate(0, -15);
        this.ctx.globalAlpha = child.opacity;
        this.ctx.drawImage(this.cloudImage, location.x, location.y , width, height);
        this.ctx.restore();
        return this;
    }

    run = function(this: CloudProcessor){
        const width = this.canvas.width;
        const height = this.canvas.height;

        this.ctx.clearRect(0, 0, width, height);

        this.clouds.forEach((_: Cloud, idx: number) => {
            this.update(idx);
            this.respawn(idx);
            this.draw(idx);
        });
    }

    randNumber = function(this: CloudProcessor, min: number, max: number){
        return Math.floor(Math.random() * (max - min) + min)
    }

}