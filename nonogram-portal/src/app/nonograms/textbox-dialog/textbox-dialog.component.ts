import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-textbox-dialog',
  templateUrl: './textbox-dialog.component.html',
  styleUrls: ['./textbox-dialog.component.scss']
})
export class TextboxDialogComponent {

  constructor() { }

  @ViewChild('textbox')
  input: ElementRef;

  @Input()
  set show(s: boolean) {
    if (s == true) {
      this.staticX = this.positionX;
      this.staticY = this.positionY;

      this.myShow = true;

      setTimeout(() => {
        this.input.nativeElement.focus();
        this.input.nativeElement.selectionStart = this.selectStart;
        this.input.nativeElement.selectionEnd = this.selectEnd;
      });
    }
  }

  @Input()
  positionX: number;

  @Input()
  positionY: number;

  @Input()
  value: string;

  @Input()
  selectStart: number;

  @Input()
  selectEnd: number;

  @Output()
  showChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  valueChange: EventEmitter<string> = new EventEmitter<string>();

  myShow: boolean;
  staticX: number;
  staticY: number;

  onKeyup(keyevent: KeyboardEvent) {
    if (keyevent.keyCode == 13) {
      this.myShow = false;
      this.showChange.emit(false)
    }
  }

}
