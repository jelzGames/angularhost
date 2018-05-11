import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { WebservicesService } from '../../../services/webservices.service';
import { ModalspinnerComponent } from '../../../shared/modalspinner/modalspinner.component';
import { UsuariosEditComponent } from '../usuarios-edit/usuarios-edit.component';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
  @ViewChild(UsuariosEditComponent)
  private editQueryChild: UsuariosEditComponent;


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
  email = "";
 
  constructor(private fb: FormBuilder, public dialog: MatDialog, private webservices: WebservicesService) { 
    
  }

  ngOnInit() {
    this.basicForm = this.fb.group ({
      filter: ["",[] ],
    });
  }

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
    
    this.webservices.postMessage("api/Users/SearchQuery", model)
    .then( data => {
      if (data.error == null ) {
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
        email : model.email,
        name : model.name,
        status : 1
      }  
      this.resultLst.splice(0, 0, tmpmodel);
    }   
    else if (model.typeOperation == 1) {
      for (var x = 0; x < this.resultLst.length; x++) {
        var tmp = this.resultLst[x] as any;
        if (tmp.id == model.id) {
            this.resultLst[x].name = model.name;
            this.resultLst[x].email = model.email;
        } 
      }  
    }
    this.edit = false;
    this.search = true;
  }

  onEditQuery(model) {
    this.id = model.id;
    this.editQuery = model.editQuery;
    if (model.editQuery == 2) {
      this.email = model.email;
    } 
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
