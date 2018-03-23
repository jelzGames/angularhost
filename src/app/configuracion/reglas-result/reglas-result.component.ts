import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-reglas-result',
  templateUrl: './reglas-result.component.html',
  styleUrls: ['./reglas-result.component.scss']
})
export class ReglasResultComponent implements OnInit {
  @Input('resultLst') resultLst: string;
  
  constructor() { }

  ngOnInit() {
  }

}
