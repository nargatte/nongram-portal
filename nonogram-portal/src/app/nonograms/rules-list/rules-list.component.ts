import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { NonogramNd } from 'src/models/NonogramNd';
import { RuleItem } from 'src/models/RuleItem';
import { Field } from 'src/models/Field';

@Component({
  selector: 'app-rules-list',
  templateUrl: './rules-list.component.html',
  styleUrls: ['./rules-list.component.scss']
})
export class RulesListComponent {

  constructor() { }

  @Input()
  nonogramNd: NonogramNd;

  @Input()
  fieldCoordinates: number[];

  @Input()
  backlighted: number[];

  @Input()
  canAdd: boolean;

  @Output()
  ruleClick: EventEmitter<[number, number]> = new EventEmitter<[number, number]>();

  rules: RuleItem[][];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.nonogramNd != undefined || changes.fieldCoordinates != undefined) {
      this.update();
    }
  }

  public update(){
    this.rules = [];
      for (let x = 0; x < this.nonogramNd.dimensions.length; x++) {
        if (this.fieldCoordinates != null)
          this.rules.push(this.nonogramNd.getRules(x, this.fieldCoordinates));
        else
          this.rules.push([]);
      }
  }




}
