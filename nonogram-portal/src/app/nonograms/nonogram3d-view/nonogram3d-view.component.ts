import { Component, OnInit, ViewChild, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { WebGLRenderer, Camera, Scene, PerspectiveCamera, BoxGeometry, MeshBasicMaterial, Mesh, DirectionalLight, AmbientLight, MeshPhongMaterial, IcosahedronGeometry, CubeGeometry, LineSegments, WireframeGeometry, LineBasicMaterial, Geometry, Vector3 } from 'three';
import { NonogramNd } from 'src/models/NonogramNd';

@Component({
  selector: 'app-nonogram3d-view',
  templateUrl: './nonogram3d-view.component.html',
  styleUrls: ['./nonogram3d-view.component.scss']
})
export class Nonogram3dViewComponent implements OnChanges, OnInit {

  @Input()
  model: NonogramNd;

  @Input()
  navigatorArray: number[];

  @Input()
  xFieldsLimit: number;

  @Input()
  yFieldsLimit: number;

  @Input()
  xOffset: number;

  @Input()
  yOffset: number;

  @Input()
  dimensionAsX: number;

  @Input()
  dimensionAsY: number;

  //@Input()
  //selectedNdField: number[];

  constructor() {
  }

  renderer: WebGLRenderer;
  camera: Camera;
  scene: Scene = new Scene();
  controls;
  directionalLight: DirectionalLight;
  boundary: LineSegments;

  ngOnInit(): void {
    let width = 500;
    let height = 400;

    this.setCanvasSize(width, height);
    this.prepareRenderer();
    this.camera = new PerspectiveCamera(70, width / height, 1, 1000);
    this.camera.position.z = 15;

    const THREE = require('three');
    const OrbitControls = require('three-orbit-controls')(THREE);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableKeys = false;


    this.animate();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.scene = new Scene();
    this.addLights();
    this.addBoundary();
    this.addColors();
    this.addIntersection();
  }

  addIntersection() {
    for (let x = 0; x < this.model.dimensions[this.dimensionAsX]; x++) {
      for (let y = 0; y < this.model.dimensions[this.dimensionAsY]; y++) {
        let coords = this.navigatorArray.slice();
        coords[this.dimensionAsX] = x;
        coords[this.dimensionAsY] = y;
        let color = 0xdadada;
        if(this.xOffset <= x && x < this.xOffset + this.xFieldsLimit
          && this.yOffset <= y && y < this.yOffset + this.yFieldsLimit){
            color = 0xc0c0c0;
            //if(this.selectedNdField != null && this.selectedNdField[this.dimensionAsX] == x && this.selectedNdField[this.dimensionAsY] == y){
            //  color = 0xdadada;
           // }
          }
        this.addCube(coords[0], coords[1], coords[2], color);
      }
    }
  }

  addColors() {
    for (let x = 0; x < this.model.dimensions[0]; x++) {
      for (let y = 0; y < this.model.dimensions[1]; y++) {
        for (let z = 0; z < this.model.dimensions[2]; z++) {
          let colors = this.model.getField([x, y, z]).colorsNumbers(this.model.colors.length);
          if (colors.length == 1) {
            this.addCube(x, y, z, this.model.colors[colors[0]].getThreeColor(), 1.01);
          }
        }
      }
    }
  }

  addCube(x, y, z, color, a = 1) {
    let geometry = new CubeGeometry(a, a, a);
    let material = new MeshPhongMaterial({ color: color, flatShading: true, shininess: 0 });
    let mesh = new Mesh(geometry, material);

    mesh.position.set(x + 0.5 - this.model.dimensions[0] / 2, y + 0.5 - this.model.dimensions[1] / 2, z + 0.5 - this.model.dimensions[2] / 2);
    this.scene.add(mesh);
  }

  addBoundary() {
    let x = this.model.dimensions[0] / 2;
    let y = this.model.dimensions[1] / 2;
    let z = this.model.dimensions[2] / 2;

    let material = new LineBasicMaterial({ color: 0x000000 });

    let geometry = new Geometry();
    geometry.vertices.push(new Vector3(x, y, z));
    geometry.vertices.push(new Vector3(x, -y, z));

    geometry.vertices.push(new Vector3(x, y, z));
    geometry.vertices.push(new Vector3(-x, y, z));

    geometry.vertices.push(new Vector3(-x, -y, z));
    geometry.vertices.push(new Vector3(x, -y, z));

    geometry.vertices.push(new Vector3(-x, -y, z));
    geometry.vertices.push(new Vector3(-x, y, z));

    geometry.vertices.push(new Vector3(x, y, -z));
    geometry.vertices.push(new Vector3(x, -y, -z));

    geometry.vertices.push(new Vector3(x, y, -z));
    geometry.vertices.push(new Vector3(-x, y, -z));

    geometry.vertices.push(new Vector3(-x, -y, -z));
    geometry.vertices.push(new Vector3(x, -y, -z));

    geometry.vertices.push(new Vector3(-x, -y, -z));
    geometry.vertices.push(new Vector3(-x, y, -z));

    geometry.vertices.push(new Vector3(x, y, z));
    geometry.vertices.push(new Vector3(x, y, -z));

    geometry.vertices.push(new Vector3(-x, y, z));
    geometry.vertices.push(new Vector3(-x, y, -z));

    geometry.vertices.push(new Vector3(x, -y, z));
    geometry.vertices.push(new Vector3(x, -y, -z));

    geometry.vertices.push(new Vector3(-x, -y, z));
    geometry.vertices.push(new Vector3(-x, -y, -z));


    this.boundary = new LineSegments(geometry, material);

    this.scene.add(this.boundary);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.directionalLight.position.copy(this.camera.position);
    this.render();
  }

  addLights() {
    this.directionalLight = new DirectionalLight(0xbbbbbb);
    this.directionalLight.position.set(1, 1, 1);
    this.scene.add(this.directionalLight);

    let ligh2 = new AmbientLight(0x555555);
    this.scene.add(ligh2);
  }

  @ViewChild('canvas')
  canvasRef: ElementRef;

  get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }
  render() {
    this.renderer.render(this.scene, this.camera);
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

}
