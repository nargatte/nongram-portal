import { Component, ElementRef, ViewChild, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { Camera, Scene, WebGLRenderer, Color, OrthographicCamera, Mesh, Vector3, Geometry, Face3, MeshBasicMaterial, LineBasicMaterial, Line, LineSegments, CircleGeometry } from 'three';
import { EventEmitter } from '@angular/core';
import { Nonogram2d } from '../../../models/Nonogram2d';
import { RuleDiv } from '../../../models/RuleDiv';

@Component({
	selector: 'app-nonogram2d',
	templateUrl: './nonogram2d.component.html',
	styleUrls: ['./nonogram2d.component.scss']
})
export class Nonogram2dComponent implements OnChanges {
	constructor() {
	}
	@ViewChild('canvas')
	canvasRef: ElementRef;
	@Input()
	xOffset: number;
	@Input()
	yOffset: number;
	@Input()
	model: Nonogram2d;
	@Input()
	fieldSize: number;
	@Input()
	xFieldsLimit: number;
	@Input()
	yFieldsLimit: number;
	@Input()
	xToken: number;
	@Input()
	yToken: number;
	@Output()
	fieldSelected: EventEmitter<[number, number]> = new EventEmitter<[number, number]>();
	@Output()
	leftRuleSelected: EventEmitter<[number, number]> = new EventEmitter<[number, number]>();
	@Output()
	upRuleSelected: EventEmitter<[number, number]> = new EventEmitter<[number, number]>();

	public updateColors() {
		this.removeColorsFields();
		this.addColorsFields();
		this.render();
	}

	public ngOnChanges(changes: SimpleChanges): void {
		this.scene = new Scene();
		this.prepareView();
		this.addBackgrounds();
		this.addThinGrid();
		this.addThickGrid();
		this.prepareRuleDivs();
		this.addXs();
		this.addColorsFields();
		this.addToken();
		this.render();
	}

	renderer: WebGLRenderer;
	camera: Camera;
	scene: Scene;
	upRulesMax: number;
	leftRulesMax: number;
	columns: number;
	rows: number;
	fieldsX: number;
	fieldsY: number;
	mouseRow: number;
	mouseColumn: number;
	ruleDivs: RuleDiv[];
	thickGrid: Mesh[];
	selectedBacklight: Mesh[];
	xs: Line[];
	colorsFields: Mesh[];
	token: Mesh;

	prepareView() {
		this.setFieldsSize();
		this.setRulesMax();
		this.setComunsAndRows();
		this.setCanvasSize(this.columns * this.fieldSize, this.rows * this.fieldSize);
		this.prepareCamera(this.columns, this.rows);
		this.prepareRenderer();
	}
	prepareRuleDivs() {
		this.ruleDivs = [];
		for (let x = 0; x < this.fieldsY; x++) {
			for (let y = 0; y < this.model.leftRules[x + this.yOffset].length; y++) {
				let rule = new RuleDiv();
				rule.value = "" + this.model.leftRules[x + this.yOffset][y].value;
				rule.color = this.model.colors[this.model.leftRules[x + this.yOffset][y].color];
				rule.y = this.upRulesMax + this.fieldsY - x - 1;
				rule.x = this.leftRulesMax - this.model.leftRules[x + this.yOffset].length + y;
				this.ruleDivs.push(rule);
			}
		}
		for (let x = 0; x < this.fieldsX; x++) {
			for (let y = 0; y < this.model.upRules[x + this.xOffset].length; y++) {
				let rule = new RuleDiv();
				rule.value = "" + this.model.upRules[x + this.xOffset][y].value;
				rule.color = this.model.colors[this.model.upRules[x + this.xOffset][y].color];
				rule.y = this.upRulesMax - y - 1;
				rule.x = this.leftRulesMax + x;
				this.ruleDivs.push(rule);
			}
		}
	}

	addToken() {
		if (this.xToken == null || this.yToken == null)
			return;
		let depth = 4;
		let color = new Color(0xdadada);
		let geometry = new CircleGeometry(0.2, 12);
		let material = new MeshBasicMaterial({ color: color });
		this.token = new Mesh(geometry, material);
		this.token.translateX(this.xToken + this.leftRulesMax + 0.5 - this.xOffset);
		this.token.translateY(this.yToken + 0.5 - this.yOffset);
		this.token.translateZ(-depth);
		this.scene.add(this.token);
	}

	removeToken() {
		this.scene.remove(this.token);
	}

	addColorsFields() {
		let depth = 7;
		this.colorsFields = [];
		for (let x = 0; x < this.fieldsX; x++) {
			for (let y = 0; y < this.fieldsY; y++) {
				let colorNumbers = this.model.fields[x + this.xOffset][y + this.yOffset].colorsNumbers(this.model.colors.length);
				if (colorNumbers.length != this.model.colors.length)
					if (colorNumbers.length == 1) {
						this.colorsFields.push(this.createRectangleMesh(this.leftRulesMax + x, this.leftRulesMax + x + 1, y, y + 1, this.model.colors[colorNumbers[0]].getThreeColor(), depth));
					}
					else if (1 < colorNumbers.length && colorNumbers.length <= 7) {
						colorNumbers.forEach(e => {
							let mx = this.leftRulesMax + x + e % 3 / 3;
							let my = y + (2 - Math.floor(e / 3)) / 3;
							this.colorsFields.push(this.createRectangleMesh(mx, mx + 1 / 3, my, my + 1 / 3, this.model.colors[e].getThreeColor(), depth));
						});
					}
			}
		}
		this.colorsFields.forEach(e => {
			this.scene.add(e);
		});
	}
	removeColorsFields() {
		this.colorsFields.forEach(e => {
			this.scene.remove(e);
		});
	}
	addXs() {
		let depth = 6;
		this.xs = [];
		for (let x = 0; x < this.fieldsY; x++) {
			for (let y = 0; y < this.model.leftRules[x + this.yOffset].length; y++) {
				if (this.model.leftRules[x + this.yOffset][y].xed == true)
					this.xs.push(this.createX(this.leftRulesMax - this.model.leftRules[x + this.yOffset].length + y, x, depth));
			}
		}
		for (let x = 0; x < this.fieldsX; x++) {
			for (let y = 0; y < this.model.upRules[x + this.xOffset].length; y++) {
				if (this.model.upRules[x + this.xOffset][y].xed == true)
					this.xs.push(this.createX(this.leftRulesMax + x, this.fieldsY + y, depth));
			}
		}
		for (let x = 0; x < this.fieldsX; x++) {
			for (let y = 0; y < this.fieldsY; y++) {
				if (this.model.fields[x + this.xOffset][y + this.yOffset].isXed())
					this.xs.push(this.createX(this.leftRulesMax + x, y, depth));
			}
		}
		this.xs.forEach(e => {
			this.scene.add(e);
		});
	}
	deleteXs() {
		this.xs.forEach(e => {
			this.scene.remove(e);
		});
	}
	addThinGrid() {
		let depth = 6;
		let color = new Color(0x8f8f8f);
		for (let x = this.leftRulesMax; x < this.columns; x++) {
			this.scene.add(this.createLine(x, 0, x, this.rows, color, depth));
		}
		for (let y = 1; y < this.fieldsY; y++) {
			this.scene.add(this.createLine(0, y, this.columns, y, color, depth));
		}
		for (let x = 1; x < this.leftRulesMax; x++) {
			this.scene.add(this.createLine(x, 0, x, this.fieldsY, color, depth));
		}
		for (let y = this.fieldsY + 1; y < this.rows; y++) {
			this.scene.add(this.createLine(this.leftRulesMax, y, this.columns, y, color, depth));
		}
	}
	addThickGrid() {
		let depth = 5;
		let colors = new Color(0x404040);
		let colord = new Color(0x707070);
		let a = 0.03;
		this.thickGrid = [];
		if (this.upRulesMax != 0)
			this.thickGrid.push(this.createHorizontalThickLine(0, this.columns, this.fieldsY, a, colors, depth));
		if (this.leftRulesMax != 0)
			this.thickGrid.push(this.createVerticalThickLine(this.leftRulesMax, 0, this.rows, a, colors, depth));
		for (let y = 5 - this.yOffset % 5; y < this.fieldsY; y += 5) {
			this.thickGrid.push(this.createHorizontalThickLine(0, this.columns, y, a, colord, depth));
		}
		for (let x = 5 - this.xOffset % 5; x < this.fieldsX; x += 5) {
			this.thickGrid.push(this.createVerticalThickLine(x + this.leftRulesMax, 0, this.rows, a, colord, depth));
		}
		this.thickGrid.forEach(e => {
			this.scene.add(e);
		});
	}
	removeThickGrid() {
		this.thickGrid.forEach(e => {
			this.scene.remove(e);
		});
	}
	addSelectedBacklight(x: number, y: number) {
		let depth = 7;
		let colors = new Color(0xc0c0c0);
		this.selectedBacklight = [];
		this.selectedBacklight.push(this.createRectangleMesh(0, this.leftRulesMax, y, y + 1, colors, depth));
		this.selectedBacklight.push(this.createRectangleMesh(x + this.leftRulesMax, x + this.leftRulesMax + 1, this.fieldsY, this.rows + 1, colors, depth));
		this.selectedBacklight.forEach(e => {
			this.scene.add(e);
		});
	}
	removeSelectedBacklight() {
		if (this.selectedBacklight == undefined)
			return;
		this.selectedBacklight.forEach(e => {
			this.scene.remove(e);
		});
	}
	addBackgrounds() {
		let depth = 9;
		this.scene.add(this.createRectangleMesh(0, this.leftRulesMax, 0, this.fieldsY, new Color(0xdadada), depth));
		this.scene.add(this.createRectangleMesh(this.leftRulesMax, this.columns, this.fieldsY, this.rows, new Color(0xdadada), depth));
		this.scene.add(this.createRectangleMesh(this.leftRulesMax, this.columns, 0, this.fieldsY, new Color(0xffffff), depth));
	}
	createHorizontalThickLine(x1: number, x2: number, y: number, a: number, color: Color, depth: number): Mesh {
		return this.createRectangleMesh(x1, x2, y - a, y + a, color, depth);
	}
	createVerticalThickLine(x: number, y1: number, y2: number, a: number, color: Color, depth: number): Mesh {
		return this.createRectangleMesh(x - a, x + a, y1, y2, color, depth);
	}
	createLine(x1: number, y1: number, x2: number, y2: number, color: Color, depth: number): Line {
		let geometry = new Geometry();
		geometry.vertices.push(new Vector3(x1, y1, -depth), new Vector3(x2, y2, -depth));
		let material = new LineBasicMaterial({ color: color });
		return new Line(geometry, material);
	}
	createX(x: number, y: number, depth: number): LineSegments {
		let geometry = new Geometry();
		geometry.vertices.push(new Vector3(x, y, -depth), new Vector3(x + 1, y + 1, -depth), new Vector3(x + 1, y, -depth), new Vector3(x, y + 1, -depth));
		let material = new LineBasicMaterial({ color: 0xd00000 });
		return new LineSegments(geometry, material);
	}
	createRectangleMesh(left: number, right: number, bottom: number, top: number, color: Color, depth: number): Mesh {
		let geometry = new Geometry();
		geometry.vertices.push(new Vector3(left, bottom, -depth), new Vector3(left, top, -depth), new Vector3(right, top, -depth), new Vector3(right, bottom, -depth));
		geometry.faces.push(new Face3(2, 1, 0), new Face3(2, 0, 3));
		let material = new MeshBasicMaterial({ color: color });
		return new Mesh(geometry, material);
	}
	setRulesMax() {
		this.upRulesMax = this.model.upRules.reduce((a, n) => Math.max(a, n.length), 0);
		this.leftRulesMax = this.model.leftRules.reduce((a, n) => Math.max(a, n.length), 0);
	}
	setFieldsSize() {
		this.fieldsX = Math.min(this.model.upRules.length, this.xFieldsLimit);
		this.fieldsY = Math.min(this.model.leftRules.length, this.yFieldsLimit);
	}
	setComunsAndRows() {
		this.columns = this.fieldsX + this.leftRulesMax;
		this.rows = this.fieldsY + this.upRulesMax;
	}
	prepareCamera(columns: number, rows: number) {
		this.camera = new OrthographicCamera(0, columns, rows, 0, 1, 10);
		this.camera.position.z = 1;
	}
	prepareRenderer() {
		this.renderer = new WebGLRenderer({ canvas: this.canvas });
		this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
		this.renderer.setClearColor(0xffffff);
	}
	setCanvasSize(width: number, height: number) {
		this.canvas.style.width = `${width}px`;
		this.canvas.style.height = `${height}px`;
	}
	render() {
		this.renderer.render(this.scene, this.camera);
	}
	get canvas(): HTMLCanvasElement {
		return this.canvasRef.nativeElement;
	}
	public onMouseMove(event: MouseEvent) {
		const newX = Math.floor(event.offsetX / this.fieldSize);
		const newY = Math.floor((this.rows * this.fieldSize - event.offsetY) / this.fieldSize);
		if (0 > newX || newX >= this.columns)
			return;
		if (0 > newY || newY >= this.rows)
			return;
		if (newY != this.mouseRow || newX != this.mouseColumn) {
			this.mouseRow = newY;
			this.mouseColumn = newX;
			this.mouseFielsChanged();
		}
	}
	public mouseFielsChanged() {
		this.fieldSelected.emit(null);
		this.leftRuleSelected.emit(null);
		this.upRuleSelected.emit(null);
		this.removeSelectedBacklight();
		if (this.leftRulesMax <= this.mouseColumn && this.mouseColumn < this.columns
			&& 0 <= this.mouseRow && this.mouseRow < this.fieldsY) {
			this.addSelectedBacklight(this.mouseColumn - this.leftRulesMax, this.mouseRow);
			this.fieldSelected.emit([this.mouseColumn - this.leftRulesMax + this.xOffset, this.mouseRow + this.yOffset]);
		}
		else if (0 <= this.mouseColumn && this.mouseColumn < this.leftRulesMax && 0 <= this.mouseRow && this.mouseRow < this.fieldsY) {
			let y = this.mouseColumn - this.leftRulesMax + this.model.leftRules[this.mouseRow + this.yOffset].length;
			if (this.model.leftRules[this.mouseRow + this.yOffset].length > y && y >= 0)
				this.leftRuleSelected.emit([this.mouseRow + this.yOffset, y]);
		}
		else if (this.leftRulesMax <= this.mouseColumn && this.mouseColumn < this.columns && 0 <= this.fieldsY && this.mouseRow < this.rows) {
			let y = this.mouseRow - this.fieldsY;
			if (y < this.model.upRules[this.mouseColumn - this.leftRulesMax + this.xOffset].length)
				this.upRuleSelected.emit([this.mouseColumn - this.leftRulesMax + this.xOffset, y]);
		}
		this.render();
	}
	public onMouseLeave(event: MouseEvent) {
		this.fieldSelected.emit(null);
		this.leftRuleSelected.emit(null);
		this.upRuleSelected.emit(null);
		this.mouseColumn = null;
		this.mouseRow = null;
		this.removeSelectedBacklight();
		this.render();
	}
}


