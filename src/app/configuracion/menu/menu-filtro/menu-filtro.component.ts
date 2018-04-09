import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-menu-filtro',
  templateUrl: './menu-filtro.component.html',
  styleUrls: ['./menu-filtro.component.scss']
})
export class MenuFiltroComponent implements OnInit {
  @Input('status') typeactivoinactivo: number;
  @Output() onToggleFiltro = new EventEmitter<void>();
  @Output() onGoSearch = new EventEmitter<number>();
  
  title = 'Filtro';

  showResults = true;
  loading: boolean = false;
  
  formData = {};
  basicForm: FormGroup;

  typeArray = [
      { id : 0,  typeName : 'Inactivos' },
      { id : 1, typeName : 'Activos' },
      { id : 2, typeName : 'Todos' },
  ];

  constructor(private router: Router, private route : ActivatedRoute) { }

  ngOnInit() {
      this.basicForm = new FormGroup({
          typeactivoinactivo: new FormControl('',  [ ]),
      });
     
      this.basicForm.controls["typeactivoinactivo"].setValue(this.typeactivoinactivo);
  }
 
  doConsulta() {
    this.onToggleFiltro.emit();
  }

  reloadQuery() {
      this.onGoSearch.emit(this.basicForm.controls["typeactivoinactivo"].value);
  }
}
