import { Component, ElementRef, ViewChild, Input, OnChanges, SimpleChanges, Output, EventEmitter, HostListener } from '@angular/core';
import { Nonogram2d } from 'src/models/Nonogram2d';
import { WebGLRenderer, Camera, Scene, OrthographicCamera, Geometry, Vector3, LineBasicMaterial, Line, Color, Face3, MeshBasicMaterial, Mesh } from 'three';

@Component({
  selector: 'app-nonogram-minimap',
  templateUrl: './nonogram-minimap.component.html',
  styleUrls: ['./nonogram-minimap.component.scss']
})
export class NonogramMinimapComponent implements OnChanges {

  constructor() { }

  @ViewChild('canvas')
  canvasRef: ElementRef;
  
  @Input()
  model: Nonogram2d;
  @Input()
	xAreaSize: number;
	@Input()
  yAreaSize: number;
  @Input()
  fieldSize: number;
  @Input()
  offsetX: number;
  @Input()
  offsetY: number;

  @Output()
  offsetXChange: EventEmitter<number> = new EventEmitter<number>();
  @Output()
  offsetYChange: EventEmitter<number> = new EventEmitter<number>();

  renderer: WebGLRenderer;
	camera: Camera;
  scene: Scene;
  columns: number;
  rows: number;
  thickGrid: Line[];
  colorsFields: Mesh[];
  area: Line[];

  startXMouse: number;
  startYMouse: number;
  startXArea: number;
  startYArea: number;
  isClick: boolean;

  ngOnChanges(changes: SimpleChanges): void{
    this.scene = new Scene();
    this.prepareView();
    this.addThickGrid();
    this.addColorsFields();
    this.addArea();
    this.render();
  }

  onMousedown(event: MouseEvent) {
    this.startXMouse = event.offsetX;
    this.startYMouse = event.offsetY;
    
    this.startXArea = this.offsetX;
    this.startYArea = this.offsetY;

    this.isClick = true;
  }
  @HostListener('document:mouseup', ['$event'])
  onMouseup(event: MouseEvent) {
    this.isClick = false;
  }

  onMousemove(event: MouseEvent) {
    if(this.isClick == true) {
      this.offsetX = this.startXArea + Math.floor((event.offsetX - this.startXMouse)/this.fieldSize);
      this.offsetY = this.startYArea - Math.floor((event.offsetY - this.startYMouse)/this.fieldSize);
      this.offsetX = Math.min(this.columns - this.xAreaSize, this.offsetX);
      this.offsetY = Math.min(this.rows - this.yAreaSize, this.offsetY);
      this.offsetX = Math.max(0, this.offsetX);
      this.offsetY = Math.max(0, this.offsetY);
      this.removeArea();
      this.addArea();
      this.render();
      this.offsetXChange.emit(this.offsetX);
      this.offsetYChange.emit(this.offsetY);
    }
  }

  public updateColors() {
		this.removeColorsFields();
		this.addColorsFields();
		this.render();
	}

  createLine(x1: number, y1: number, x2: number, y2: number, color: Color, depth: number): Line {
		let geometry = new Geometry();
		geometry.vertices.push(new Vector3(x1, y1, -depth), new Vector3(x2, y2, -depth));
		let material = new LineBasicMaterial({ color: color });
		return new Line(geometry, material);
  }

  addArea() {
    let depth = 1;
    this.area = [];
    let color= new Color(0xaa0000);
    let a = 0.1;
    let x1 = this.offsetX + a;
    let x2 = this.offsetX + this.xAreaSize - a;
    let y1 = this.offsetY + a;
    let y2 = this.offsetY + this.yAreaSize - a;
    this.area.push(this.createLine(x1, y1, x2, y1, color, depth));
    this.area.push(this.createLine(x1, y1, x1, y2, color, depth));
    this.area.push(this.createLine(x2, y2, x2, y1, color, depth));
    this.area.push(this.createLine(x2, y2, x1, y2, color, depth));

    this.area.forEach(e => {
			this.scene.add(e);
		});
  }

  removeArea() {
    this.area.forEach(e => {
			this.scene.remove(e);
		});
  }

  createRectangleMesh(left: number, right: number, bottom: number, top: number, color: Color, depth: number): Mesh {
		let geometry = new Geometry();
		geometry.vertices.push(new Vector3(left, bottom, -depth), new Vector3(left, top, -depth), new Vector3(right, top, -depth), new Vector3(right, bottom, -depth));
		geometry.faces.push(new Face3(2, 1, 0), new Face3(2, 0, 3));
		let material = new MeshBasicMaterial({ color: color });
		return new Mesh(geometry, material);
	}
  
  addColorsFields() {
		let depth = 7;
		this.colorsFields = [];
		for (let x = 0; x < this.columns; x++) {
			for (let y = 0; y < this.rows; y++) {
				let colorNumbers = this.model.fields[x][y].colorsNumbers(this.model.colors.length);
				if (colorNumbers.length != this.model.colors.length)
					if (colorNumbers.length == 1) {
						this.colorsFields.push(this.createRectangleMesh(x, x + 1, y, y + 1, this.model.colors[colorNumbers[0]].getThreeColor(), depth));
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

  addThickGrid() {
		let depth = 5;
		let color = new Color(0x707070);
		this.thickGrid = [];
		for (let y = 0; y < this.rows; y += 5) {
			this.thickGrid.push(this.createLine(0, y, this.columns, y, color, depth));
    }
    for (let x = 0; x < this.columns; x += 5) {
			this.thickGrid.push(this.createLine(x, 0, x, this.rows, color, depth));
		}
		this.thickGrid.forEach(e => {
			this.scene.add(e);
		});
	}

	prepareView() {
    
    this.columns = this.model.upRules.length;
    this.rows = this.model.leftRules.length;

		this.setCanvasSize(this.columns * this.fieldSize, this.rows * this.fieldSize);
		this.prepareCamera(this.columns, this.rows);
    this.prepareRenderer();
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
}
