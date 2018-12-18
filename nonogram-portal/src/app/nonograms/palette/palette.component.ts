import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { Color } from 'src/models/Color';
import { Field } from 'src/models/Field';

@Component({
  selector: 'app-palette',
  templateUrl: './palette.component.html',
  styleUrls: ['./palette.component.scss']
})
export class PaletteComponent {

  constructor() { }

  @Input()
  colors: Color[];

  @Input()
  isGame: Boolean;

  @Input()
  set selection(s: number) {
    new Field(s).colorsNumbers(this.colors.length).forEach(e => {
      this.selectedSet.add(e);
    });
  }

  @Input()
  numberActive: boolean;

  @Output()
  colorModify: EventEmitter<[number, Color]> = new EventEmitter<[number, Color]>();

  @Output()
  colorRemove: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  selectionChange: EventEmitter<number> = new EventEmitter<number>();

  selectedSet: Set<number> = new Set<number>();
  colorPickerSelect: number = null;
  removeActive: boolean = false;

  updateSelection() {
    let newSelected = 0;
    for (let x = this.colors.length - 1; x >= 0; x--) {
      newSelected *= 2;
      if (this.selectedSet.has(x))
        newSelected += 1;
    }
    if (newSelected != this.selection) { 
      this.selectionChange.emit(newSelected);
    }
  }

  leftClickNthColor(n: number, event: MouseEvent) {    
    if (this.removeActive) {
      if(this.colors.length == 3)
        this.removeActive = false;
      this.colorRemove.emit(n);
      return;
    }
    if (event.shiftKey && this.isGame) {
      if (this.selectedSet.has(n))
        this.selectedSet.delete(n);
      else
        this.selectedSet.add(n);
    }
    else {
      this.selectedSet.clear();
      this.selectedSet.add(n);
    }
    if (this.selectedSet.size == this.colors.length)
      {this.selectedSet.clear();
        this.selectedSet.add(0)}
    this.updateSelection();
  }

  addColor() {
    this.colors.push(new Color(0.784, 0.784, 0.784));
  }

  rightClickNthColor(n: number, event: MouseEvent) {
    if (!this.isGame && !this.removeActive) {
      this.colorPickerSelect = n;
    }
    return false;
  }

  cpToggleChange(t: boolean) {
    if (t == false)
      this.colorPickerSelect = null
  }
}
