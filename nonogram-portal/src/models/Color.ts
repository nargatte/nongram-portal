import * as THREE from 'three';
export class Color {

    constructor(public red: number = 0, public green: number = 0, public blue: number = 0){

    }

    public getThreeColor(): THREE.Color {
        return new THREE.Color(this.red, this.green, this.blue);
    }

    public get stringFormat(): string{
        return `rgb(${Math.floor(this.red*255)}, ${Math.floor(this.green*255)}, ${Math.floor(this.blue*255)})`;
    }

    public set stringFormat(s: string){
        let numbers = s.split(/rgb\(|,| |\)/).map(ns => +ns);
        this.red = numbers[1]/255;
        this.green = numbers[2]/255;
        this.blue = numbers[3]/255;
    }
}