import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DialogsDataService } from '../../../services/dialogs.data.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent  {
 
  basicForm;

  title = "Búsqueda";

  filter = "";
  status = 0;
  resultLst = [];
 
  search = true;
  edit = false;
  viewFilter = false;

  id = '0';
  editQuery = 0;
  email = "";
 
  constructor(private fb: FormBuilder, private dialogsService : DialogsDataService) { 
    this.basicForm = this.fb.group ({
      filter: ["",[] ],
    });
  }

  doSearch() {
    this.resultLst = [];
    var model = {
      filter : this.basicForm.get('filter').value,
      status : this.status
    }
    
    this.dialogsService.runWebservices("api/Users/SearchQuery", model, 1)
    .then( data => {
      if (data.error == undefined) {
        this.resultLst = data;
        console.log(data);
      }
    });
   
  }

  doNuevo() {
    this.id = '0';
    this.editQuery = 0;
    this.search = false;
    this.edit = true;
  }

  onSearch(model) {
    if (model.typeOperation == 0) {
      var tmpmodel = {
        id : model.id,
        email : model.email,
        name : model.name,
        status : 0,
        needreload: 1

      }  
      this.resultLst.splice(0, 0, tmpmodel);
    }   
    else if (model.typeOperation == 1) {
      for (var x = 0; x < this.resultLst.length; x++) {
        var tmp = this.resultLst[x] as any;
        if (tmp.id == model.id) {
            this.resultLst[x].name = model.name;
            this.resultLst[x].email = model.email;
            this.resultLst[x].needReload = model.needReload;
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
