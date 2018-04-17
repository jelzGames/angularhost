import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ModalspinnerComponent } from '../../../shared/modalspinner/modalspinner.component';
import { MatDialog } from '@angular/material';
import { WebservicesService } from '../../../services/webservices.service';
import { ReglasEditComponent } from '../reglas-edit/reglas-edit.component';

@Component({
  selector: 'app-reglas',
  templateUrl: './reglas.component.html',
  styleUrls: ['./reglas.component.scss'],
})
export class ReglasComponent implements OnInit {
  @ViewChild(ReglasEditComponent)
     private editQueryChild: ReglasEditComponent;


  basicForm;

  title = "Búsqueda";

  filter = "";
  status = 1;
  resultLst = [];

  search = true;
  edit = false;
  viewFilter = false;

  id = '0';
  editQuery = 0;
  
  constructor(private fb: FormBuilder, public dialog: MatDialog, private webservices: WebservicesService) { 
    this.basicForm = fb.group ({
      filter: ["",[] ],
    });
  }

  ngOnInit() {
    
  }
  
  /*
  onChanges(): void {
    this.basicForm.get('filter').valueChanges.subscribe(val => {
      this.filter = val;
    });
  }
  */
  
  doSearch() {
    this.resultLst = [];

    let dialogRef = this.dialog.open(ModalspinnerComponent,  {
      width: '250px',
      disableClose: true,
      panelClass: 'spinner-dialog'
      //data: { name: this.name, animal: this.animal }
    });
    
    var model = {
      filter : this.basicForm.get('filter').value,
      status : this.status
    }
    
    this.webservices.postMessage("api/Roles/SearchQuery", model)
    .then( data => {
      if (data.error == null) {
        this.resultLst = data;
      }
      
      dialogRef.close();
    }).catch( err => {
      dialogRef.close();
    });
    
  }

  doNuevo() {
    this.id = '0';
    this.search = false;
    this.edit = true;
  }


  onSearch(model) {
    if (model.typeOperation == 0) {
      var tmpmodel = {
        id : model.id,
        role : model.role,
        status : 1
      }  
      this.resultLst.splice(0, 0, tmpmodel);
    }   
    else if (model.typeOperation == 1) {
      for (var x = 0; x < this.resultLst.length; x++) {
        var tmp = this.resultLst[x] as any;
        if (tmp.id == model.id) {
            this.resultLst[x].role = model.role;
        } 
      }  
    }
    this.edit = false;
    this.search = true;
  }

  onEditQuery(model) {
    this.id = model.id;
    this.editQuery = model.editQuery;
    this.search = false;
    this.edit = true;
  }

  onGoSearch(status) {
    this.onToggleFiltro();
    this.status = status;
    this.doSearch();
  }

  toggleFiltro() {
    this.search = false;
    this.viewFilter = true;
  }

  onToggleFiltro() {
    this.search = true;
    this.viewFilter = false;
  }
}
