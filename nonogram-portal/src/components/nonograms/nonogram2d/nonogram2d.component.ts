import { Component, OnInit, ElementRef, ViewChild, HostListener, Input, Output } from '@angular/core';
import * as THREE from 'three';
import { Camera } from 'three';

@Component({
	selector: 'app-nonogram2d',
	templateUrl: './nonogram2d.component.html',
	styleUrls: ['./nonogram2d.component.scss']
})
export class Nonogram2dComponent implements OnInit {

	constructor() { }

	@ViewChild('canvas')
	private canvasRef: ElementRef;

	@Input()
	set nonogram2d(n: Nonogram2d) {

	}

	@Output()



	ngOnInit() {
		var scene = new THREE.Scene();

		this.setCanvasSize(1000, 1000);
		this.prepareCamera(2,2);
		var renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
		renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

		var geometry = new THREE.Geometry();
		geometry.vertices.push(new THREE.Vector3(0, 0, 0));
		var material = new THREE.PointsMaterial({ color: new THREE.Color(200, 200, 200), size: 30 });
		var cube = new THREE.Points(geometry, material);
		scene.add(cube);
		var animate = function () {
			requestAnimationFrame(animate);


			renderer.render(scene, this.camera);
		};
		animate();
	}

	private camera: Camera;
	private bottomSliderOn: Boolean;
	private rightSliderOn: Boolean;

	private 

	private prepareCamera(columns: number, rows: number){
		this.camera = new THREE.OrthographicCamera(0, columns, rows, 0, 1, 2);
		this.camera.position.z = 1;
	}

	private setCanvasSize(width: number, height: number) {
		this.canvas.style.width = `${width}px`;
		this.canvas.style.height = `${height}px`;
	}

	private get canvas(): HTMLCanvasElement {
		return this.canvasRef.nativeElement;
	}

	public onMouseDown(event: MouseEvent) {

	}

	public onMouseUp(event: MouseEvent) {

	}

	@HostListener('document:keypress', ['$event'])
	public onKeyPress(event: KeyboardEvent) {

	}

}

export class Nonogram2d {
	public upRules: number[]
	public leftRules: number[]
	public fields: number[][]
}

