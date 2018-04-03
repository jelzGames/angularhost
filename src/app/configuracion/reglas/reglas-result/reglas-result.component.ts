import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-reglas-result',
  templateUrl: './reglas-result.component.html',
  styleUrls: ['./reglas-result.component.scss']
})
export class ReglasResultComponent implements OnInit {
  @Input('resultLst') resultLst: string;
  @Output() onEditQuery = new EventEmitter<any>();
  
  isDelete = false;

  constructor() { }

  ngOnInit() {
  }

  edicionConsulta(idValue, typeValue) {
    this.onEditQuery.emit({ id : idValue, editQuery : typeValue});
  }

  isGotoDelete(id) {
    this.isDelete = true;
  }

  undo() {
    this.isDelete = false;
  }
}
