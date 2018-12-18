import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'app-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.scss']
})
export class NavigatorComponent {

  @Input()
  navigatorArray: number[];

  @Input()
  lengths: number[];

  @Input()
  dimensionAsX: number;

  @Input()
  dimensionAsY: number;

  @Output()
  navigatorArrayChange: EventEmitter<number[]> = new EventEmitter<number[]>();

  @Output()
  dimensionAsXChange: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  dimensionAsYChange: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  anyChange: EventEmitter<any> = new EventEmitter<any>();

  @HostListener('document:keydown', ['$event'])
  onkeyup(event: KeyboardEvent) {
    if(event.key == "a" && this.select != 0){
      this.select--;
    }
    if(event.key == "d" && this.select != this.navigatorArray.length - 1){
      this.select++;
    }
    if(event.key == "s" && this.navigatorArray[this.select] != 0){
      this.navigatorArray[this.select]--;
      this.navigatorArrayChange.emit(this.navigatorArray);
      this.anyChange.emit();
    }
    if(event.key == "w" && this.navigatorArray[this.select] != this.lengths[this.select] - 1){
      this.navigatorArray[this.select]++
      this.navigatorArrayChange.emit(this.navigatorArray);
      this.anyChange.emit();
    }
    if(event.key == "q" || event.key == "x"){
      if(this.dimensionAsX == this.select)
        return
      if(this.dimensionAsY == this.select){
        this.dimensionAsY = this.dimensionAsX;
        this.dimensionAsX = this.select;
        this.dimensionAsXChange.emit(this.dimensionAsX);
        this.dimensionAsYChange.emit(this.dimensionAsY);
        this.anyChange.emit();
        return
      }
      this.dimensionAsX = this.select;
      this.dimensionAsXChange.emit(this.dimensionAsX);
      this.anyChange.emit();
    }
    if(event.key == "e" || event.key == "y"){
      if(this.dimensionAsY == this.select)
        return
      if(this.dimensionAsX == this.select){
        this.dimensionAsX = this.dimensionAsY;
        this.dimensionAsY = this.select;
        this.dimensionAsXChange.emit(this.dimensionAsX);
        this.dimensionAsYChange.emit(this.dimensionAsY);
        this.anyChange.emit();
        return
      }
      this.dimensionAsY = this.select;
      this.dimensionAsYChange.emit(this.dimensionAsY);
      this.anyChange.emit();
    }
  }

  select = 0;

  constructor() { }
}
