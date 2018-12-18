import { Component, ViewChild, AfterContentInit, ContentChild } from '@angular/core';
import { Nonogram2dComponent } from 'src/app/nonograms/nonogram2d/Nonogram2dComponent';
import { Nonogram2d } from 'src/models/Nonogram2d';
import { Color } from 'src/models/Color';
import { Field } from 'src/models/Field';
import { RuleItem } from 'src/models/RuleItem';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'nonogram-portal';

  constructor() {
  }

}
