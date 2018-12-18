import { Component, OnInit, Input, HostListener, ElementRef, ViewChild } from '@angular/core';
import { Nonogram2d } from 'src/models/Nonogram2d';
import { Color } from 'src/models/Color';
import { Field } from 'src/models/Field';
import { NonogramNd } from 'src/models/NonogramNd';
import { RuleItem } from 'src/models/RuleItem';
import { Nonogram2dComponent } from '../nonogram2d/Nonogram2dComponent';
import { RulesListComponent } from '../rules-list/rules-list.component';
import { NonogramMinimapComponent } from '../nonogram-minimap/nonogram-minimap.component';
import { Nonogram3dViewComponent } from '../nonogram3d-view/nonogram3d-view.component';

@Component({
  selector: 'app-nonogram-full',
  templateUrl: './nonogram-full.component.html',
  styleUrls: ['./nonogram-full.component.scss']
})
export class NonogramFullComponent {


  @ViewChild('nonogram2dRef')
  nonogram2dRef: Nonogram2dComponent;

  @ViewChild('rulesListRef')
  rulesListRef: RulesListComponent;

  @ViewChild('nonogrmaMinimapRef')
  nonogrmaMinimapRef: NonogramMinimapComponent;

  @ViewChild('nonogram3dRef')
  nonogram3dRef: Nonogram3dViewComponent;

  @Input()
  isGame: Boolean;

  sizeLimitX = 600;
  sizeLimitY = 400;

  nonogram2d: Nonogram2d
  fieldSize: number = 25;
  xFieldsLimit: number = 100;
  yFieldsLimit: number = 100;
  xOffset: number = 0;
  yOffset: number = 0;

  selectedField: [number, number];
  selectedLeftRule: [number, number];
  selectedUpRule: [number, number];
  nonogramnd: NonogramNd;
  selectedColor: number = 1;
  selectedNdField: number[];
  tokenX: number = null;
  tokenY: number = null;
  tokenNd: number[] = null;
  ruleEditNd: number[] = null;
  mouseX: number;
  mouseY: number;
  showTextDialog: boolean = false;
  valueTextDialog: string;
  startTextDailog: number;
  endTextDailog: number;
  dimensionTextDialog: number;
  balckAndWhite: boolean = false;
  dimensionAsX: number = 0;
  dimensionAsY: number = 1;
  navigatorArray: number[] = [0, 0, 0];


  constructor(private elRef: ElementRef) {
    this.nonogramnd = new NonogramNd([15, 10, 5],
      [new Color(0.3, 0.8, 1), new Color(0.8, 0.3, 1),
      new Color(0, 0.8, 0), new Color(0.3, 0.5, 0.5),
      new Color(1, 0.8)]);


    this.updateNonogram2d();
  }

  onUpdateColor() {
    this.nonogram2dRef.updateColors();
    if (this.nonogrmaMinimapRef != undefined)
      this.nonogrmaMinimapRef.updateColors();
    this.nonogram3dRef.ngOnChanges(null);
  }

  onFiledSizeChange(val: number) {
    this.fieldSize = val;

    let restX = this.sizeLimitX - this.nonogram2d.leftRules.reduce((a, n) => Math.max(a, n.length), 0) * this.fieldSize;
    let restY = this.sizeLimitY - this.nonogram2d.upRules.reduce((a, n) => Math.max(a, n.length), 0) * this.fieldSize;

    let fxl = Math.min(Math.max(Math.floor(restX / this.fieldSize), 5), this.nonogram2d.upRules.length);
    let fyl = Math.min(Math.max(Math.floor(restY / this.fieldSize), 5), this.nonogram2d.leftRules.length);

    if (fxl + this.xOffset > this.nonogram2d.upRules.length) {
      this.xOffset = this.nonogram2d.upRules.length - fxl;
    }

    if (fyl + this.yOffset > this.nonogram2d.leftRules.length) {
      this.yOffset = this.nonogram2d.leftRules.length - fyl;
    }

    this.xFieldsLimit = fxl;
    this.yFieldsLimit = fyl;
  }

  onFieldSelected(pair: [number, number]) {
    this.selectedField = pair;

    if (this.selectedField != null) {
      let [x, y] = this.selectedField;
      this.selectedNdField = this.navigatorArray.slice();
      this.selectedNdField[this.dimensionAsX] = x;
      this.selectedNdField[this.dimensionAsY] = y;
    }
    else {
      this.selectedNdField = null;
    }
  }

  onLeftRuleSelected(pair: [number, number]) {
    this.selectedLeftRule = pair;
  }

  onUpRuleSelected(pair: [number, number]) {
    this.selectedUpRule = pair;
  }

  onClick() {
    if (this.selectedField != null) {
      let color = this.nonogramnd.getField(this.selectedNdField).value;
      if(color == this.selectedColor)
        this.nonogramnd.setField(new Field(), this.selectedNdField);
      else
        this.nonogramnd.setField(new Field(this.selectedColor), this.selectedNdField);
      this.updateNonogram2d();
    }
    if (this.isGame == false) {
      if (this.selectedUpRule != null) {
        let [x, y] = this.selectedUpRule;
        let coords = this.navigatorArray.slice();
        coords[this.dimensionAsX] = x;
        this.editRulesDialog(this.dimensionAsY, y, coords)
      }
      if (this.selectedLeftRule != null) {
        let [x, y] = this.selectedLeftRule;
        let coords = this.navigatorArray.slice();
        coords[this.dimensionAsY] = x;
        this.editRulesDialog(this.dimensionAsX, y, coords)
      }
    }
  }

  rightClick() {
    if (this.isGame == false && this.selectedField != null) {
      let [fx, fy] = this.selectedField;
      if (this.tokenX == fx && this.tokenY == fy) {
        this.tokenX = null;
        this.tokenY = null;
        this.tokenNd = null;
      }
      else {
        this.tokenX = fx;
        this.tokenY = fy;
        this.tokenNd = this.selectedNdField.slice();
      }
    }
    return false;
  }

  onColorRemove(c: number) {
    this.nonogramnd.mapColors(c, 0);
    this.nonogramnd.mapColors(this.nonogramnd.colors.length - 1, c);
    this.nonogramnd.colors[c] = this.nonogramnd.colors[this.nonogramnd.colors.length - 1];
    this.nonogramnd.colors.splice(this.nonogramnd.colors.length - 1, 1);
    this.updateNonogram2d();
  }


  onEditRulesDialog(dimPos: [number, number]) {
    let [d, p] = dimPos;
    this.editRulesDialog(d, p, this.tokenNd);
  }

  editRulesDialog(dimension: number, position: number, coordinates: number[]) {
    this.ruleEditNd = coordinates;
    this.dimensionTextDialog = dimension;
    let rules: RuleItem[] = this.nonogramnd.getRules(dimension, this.ruleEditNd);
    let wholeString;
    if (this.balckAndWhite) {
      let startString = rules.slice(0, position).map(n => n.value).join(" ");
      wholeString = rules.map(n => n.value).join(" ");
      if (position == null) {
        this.startTextDailog = wholeString.length;
        this.endTextDailog = wholeString.length;
      }
      else {
        this.startTextDailog = startString.length + (position == 0 ? 0 : 1);
        this.endTextDailog = this.startTextDailog + (rules[position].value > 9 ? 2 : 1);
      }
    }
    else {
      let startString = rules.slice(0, position).map(n => n.value + ":" + n.color).join(" ");
      wholeString = rules.map(n => n.value + ":" + n.color).join(" ");
      if (position == null) {
        this.startTextDailog = wholeString.length;
        this.endTextDailog = wholeString.length;
      }
      else {
        this.startTextDailog = startString.length + (position == 0 ? 0 : 1);
        this.endTextDailog = this.startTextDailog + (rules[position].value > 9 ? 4 : 3);
      }
    }
    this.valueTextDialog = wholeString;
    this.showTextDialog = true;
  }

  updateRulesFormDialog(show: boolean) {
    this.showTextDialog = show;

    let rules: RuleItem[] = [];
    if (show == false && this.valueTextDialog.length > 0) {
      if (this.balckAndWhite) {
        rules = this.valueTextDialog.split(/ +/).map(e => new RuleItem(+e, 1));
      }
      else {
        rules = this.valueTextDialog.split(/ +/).map(e => {
          let e2 = e.split(":");
          return new RuleItem(+e2[0], +e2[1])
        });
      }
    }
    for (let x = 0; x < rules.length; x++) {
      let r = rules[x];
      if (r.color == null || r.value == null) {
        return;
      }
      if (!(0 <= r.color && r.color < this.nonogramnd.colors.length
        && 0 <= r.value && r.value < 100)) {
        return;
      }
      r.color = Math.floor(r.color);
      r.value = Math.floor(r.value);
    }
    this.nonogramnd.setRules(rules, this.dimensionTextDialog, this.ruleEditNd);
    this.updateNonogram2d();
    this.rulesListRef.update();

  }

  updateNonogram2d() {
    this.nonogram2d = this.nonogramnd.getNonogram2d(this.dimensionAsX, this.dimensionAsY, this.navigatorArray);
    this.onFiledSizeChange(this.fieldSize);
    if (this.nonogram3dRef != undefined)
      this.nonogram3dRef.ngOnChanges(null);
  }

  @HostListener('mousemove', ['$event'])
  onMousemove(event: MouseEvent) {
    this.mouseX = event.pageX - this.elRef.nativeElement.offsetLeft;
    this.mouseY = event.pageY - this.elRef.nativeElement.offsetTop;
  }
}

